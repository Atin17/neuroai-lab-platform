"""Train ML models on synthetic neural timeseries data."""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

from dataset import WindowConfig, extract_features


@dataclass
class TrainingConfig:
    window_size: int
    step_size: int
    sampling_rate: float
    test_size: float
    random_seed: int


@dataclass
class TrainingArtifacts:
    metrics: Dict[str, Dict[str, float]]
    confusion_matrices: Dict[str, np.ndarray]
    models: Dict[str, Pipeline]


def generate_synthetic_recording(
    num_samples: int,
    num_channels: int,
    sampling_rate: float,
    rng: np.random.Generator,
) -> tuple[np.ndarray, np.ndarray]:
    """Generate a simple synthetic neural recording with stimulation periods."""

    time = np.arange(num_samples) / sampling_rate
    data = rng.normal(0.0, 0.5, size=(num_samples, num_channels))
    stim_mask = np.zeros(num_samples, dtype=bool)

    stim_duration = int(sampling_rate * 0.75)
    stim_gap = int(sampling_rate * 1.25)
    start = stim_gap
    while start + stim_duration <= num_samples:
        stim_mask[start : start + stim_duration] = True
        data[start : start + stim_duration, 0] += 2.0 * np.sin(2 * np.pi * 20 * time[start : start + stim_duration])
        if num_channels > 1:
            data[start : start + stim_duration, 1] += 1.0 * np.sin(2 * np.pi * 10 * time[start : start + stim_duration])
        start += stim_duration + stim_gap

    return data, stim_mask


def build_training_data(
    data: np.ndarray,
    stim_mask: np.ndarray,
    config: WindowConfig,
) -> tuple[np.ndarray, np.ndarray]:
    """Extract windowed features and labels for training."""

    features = extract_features(data, config)
    labels = []
    for start, end in zip(features.window_starts, features.window_ends):
        window_mask = stim_mask[int(start) : int(end)]
        labels.append(1 if window_mask.mean() >= 0.5 else 0)

    return features.features.values, np.array(labels)


def _train_model(model_name: str, random_seed: int) -> Pipeline:
    if model_name == "random_forest":
        estimator = RandomForestClassifier(n_estimators=200, random_state=random_seed)
        return Pipeline([("scaler", StandardScaler()), ("model", estimator)])
    if model_name == "svm":
        estimator = SVC(kernel="rbf", probability=True, random_state=random_seed)
        return Pipeline([("scaler", StandardScaler()), ("model", estimator)])
    raise ValueError(f"Unknown model: {model_name}")


def train_and_evaluate(
    features: np.ndarray,
    labels: np.ndarray,
    config: TrainingConfig,
) -> TrainingArtifacts:
    """Train multiple models and compute metrics."""

    X_train, X_test, y_train, y_test = train_test_split(
        features,
        labels,
        test_size=config.test_size,
        random_state=config.random_seed,
        stratify=labels,
    )

    models = {}
    metrics = {}
    confusion_matrices = {}

    for name in ("random_forest", "svm"):
        pipeline = _train_model(name, config.random_seed)
        pipeline.fit(X_train, y_train)
        predictions = pipeline.predict(X_test)

        metrics[name] = {
            "accuracy": float(accuracy_score(y_test, predictions)),
            "precision": float(precision_score(y_test, predictions, zero_division=0)),
            "recall": float(recall_score(y_test, predictions, zero_division=0)),
            "f1": float(f1_score(y_test, predictions, zero_division=0)),
        }
        confusion_matrices[name] = confusion_matrix(y_test, predictions)
        models[name] = pipeline

    return TrainingArtifacts(metrics=metrics, confusion_matrices=confusion_matrices, models=models)


def save_artifacts(artifacts: TrainingArtifacts, output_dir: Path, config: TrainingConfig) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    for name, model in artifacts.models.items():
        joblib.dump(model, output_dir / f"{name}.joblib")

    metrics_payload = {
        "config": {
            "window_size": config.window_size,
            "step_size": config.step_size,
            "sampling_rate": config.sampling_rate,
            "test_size": config.test_size,
            "random_seed": config.random_seed,
        },
        "metrics": artifacts.metrics,
        "confusion_matrices": {
            name: matrix.tolist() for name, matrix in artifacts.confusion_matrices.items()
        },
    }

    (output_dir / "metrics.json").write_text(json.dumps(metrics_payload, indent=2), encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train ML models on synthetic neural data")
    parser.add_argument("--output-dir", default="artifacts/training", help="Directory for model artifacts")
    parser.add_argument("--num-samples", type=int, default=12000)
    parser.add_argument("--num-channels", type=int, default=8)
    parser.add_argument("--window-size", type=int, default=256)
    parser.add_argument("--step-size", type=int, default=128)
    parser.add_argument("--sampling-rate", type=float, default=1000.0)
    parser.add_argument("--test-size", type=float, default=0.2)
    parser.add_argument("--random-seed", type=int, default=7)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    rng = np.random.default_rng(args.random_seed)
    data, stim_mask = generate_synthetic_recording(
        num_samples=args.num_samples,
        num_channels=args.num_channels,
        sampling_rate=args.sampling_rate,
        rng=rng,
    )

    window_config = WindowConfig(
        window_size=args.window_size,
        step_size=args.step_size,
        sampling_rate=args.sampling_rate,
    )
    features, labels = build_training_data(data, stim_mask, window_config)

    training_config = TrainingConfig(
        window_size=args.window_size,
        step_size=args.step_size,
        sampling_rate=args.sampling_rate,
        test_size=args.test_size,
        random_seed=args.random_seed,
    )

    artifacts = train_and_evaluate(features, labels, training_config)
    save_artifacts(artifacts, Path(args.output_dir), training_config)

    for name, metric in artifacts.metrics.items():
        print(f"{name} accuracy: {metric['accuracy']:.3f} (f1={metric['f1']:.3f})")


if __name__ == "__main__":
    main()
