import numpy as np

from dataset import WindowConfig
from train import build_training_data, generate_synthetic_recording, train_and_evaluate, TrainingConfig


def test_build_training_data_labels_align_with_features():
    rng = np.random.default_rng(2)
    data, stim_mask = generate_synthetic_recording(
        num_samples=2048,
        num_channels=4,
        sampling_rate=512.0,
        rng=rng,
    )
    config = WindowConfig(window_size=128, step_size=64, sampling_rate=512.0)
    features, labels = build_training_data(data, stim_mask, config)
    assert features.shape[0] == labels.shape[0]
    assert labels.min() >= 0
    assert labels.max() <= 1
    assert labels.sum() > 0


def test_train_and_evaluate_returns_metrics():
    rng = np.random.default_rng(3)
    data, stim_mask = generate_synthetic_recording(
        num_samples=4096,
        num_channels=6,
        sampling_rate=512.0,
        rng=rng,
    )
    config = WindowConfig(window_size=128, step_size=64, sampling_rate=512.0)
    features, labels = build_training_data(data, stim_mask, config)
    training_config = TrainingConfig(
        window_size=128,
        step_size=64,
        sampling_rate=512.0,
        test_size=0.25,
        random_seed=3,
    )
    artifacts = train_and_evaluate(features, labels, training_config)
    for metric in artifacts.metrics.values():
        assert 0.0 <= metric["accuracy"] <= 1.0
        assert 0.0 <= metric["f1"] <= 1.0
