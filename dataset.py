"""Dataset utilities for windowed feature extraction."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable

import numpy as np
import pandas as pd


@dataclass
class WindowConfig:
    window_size: int
    step_size: int
    sampling_rate: float


@dataclass
class WindowedFeatures:
    features: pd.DataFrame
    window_starts: np.ndarray
    window_ends: np.ndarray


def window_timeseries(data: np.ndarray, window_size: int, step_size: int) -> np.ndarray:
    """Slice a (samples, channels) array into overlapping windows."""

    if data.ndim != 2:
        raise ValueError("Expected data with shape (samples, channels)")
    if window_size <= 0 or step_size <= 0:
        raise ValueError("window_size and step_size must be positive")

    num_samples, num_channels = data.shape
    if num_samples < window_size:
        raise ValueError("Not enough samples for a single window")

    starts = range(0, num_samples - window_size + 1, step_size)
    windows = [data[start : start + window_size] for start in starts]
    return np.stack(windows, axis=0).reshape(len(windows), window_size, num_channels)


def _rms(values: np.ndarray) -> np.ndarray:
    return np.sqrt(np.mean(values**2, axis=0))


def _bandpower(window: np.ndarray, sampling_rate: float, bands: Dict[str, tuple[float, float]]) -> Dict[str, np.ndarray]:
    freqs = np.fft.rfftfreq(window.shape[0], d=1.0 / sampling_rate)
    spectrum = np.abs(np.fft.rfft(window, axis=0)) ** 2

    band_powers = {}
    for name, (low, high) in bands.items():
        mask = (freqs >= low) & (freqs <= high)
        if not mask.any():
            band_powers[name] = np.zeros(window.shape[1])
        else:
            band_powers[name] = spectrum[mask].mean(axis=0)
    return band_powers


def extract_window_features(window: np.ndarray, sampling_rate: float) -> Dict[str, np.ndarray]:
    """Compute features for a single window."""

    features: Dict[str, np.ndarray] = {
        "mean": window.mean(axis=0),
        "std": window.std(axis=0),
        "rms": _rms(window),
        "peak_to_peak": window.max(axis=0) - window.min(axis=0),
    }

    band_definitions = {
        "theta": (4.0, 8.0),
        "alpha": (8.0, 12.0),
        "beta": (12.0, 30.0),
        "gamma": (30.0, 80.0),
    }
    band_powers = _bandpower(window, sampling_rate, band_definitions)
    for name, values in band_powers.items():
        features[f"bandpower_{name}"] = values

    return features


def extract_features(data: np.ndarray, config: WindowConfig) -> WindowedFeatures:
    """Extract windowed features from continuous neural data."""

    windows = window_timeseries(data, config.window_size, config.step_size)
    num_windows = windows.shape[0]

    feature_rows = []
    for idx in range(num_windows):
        window_features = extract_window_features(windows[idx], config.sampling_rate)
        flattened = {
            f"{feature}_{channel}": value
            for feature, values in window_features.items()
            for channel, value in enumerate(values)
        }
        feature_rows.append(flattened)

    feature_frame = pd.DataFrame(feature_rows)
    window_starts = np.arange(0, num_windows) * config.step_size
    window_ends = window_starts + config.window_size

    return WindowedFeatures(
        features=feature_frame,
        window_starts=window_starts,
        window_ends=window_ends,
    )


def extract_features_from_recording(
    data: np.ndarray,
    sampling_rate: float,
    window_size: int,
    step_size: int,
) -> WindowedFeatures:
    """Convenience wrapper for extracting features."""

    config = WindowConfig(window_size=window_size, step_size=step_size, sampling_rate=sampling_rate)
    return extract_features(data, config)


def summarize_features(features: WindowedFeatures) -> Dict[str, float]:
    """Summarize feature extraction output."""

    return {
        "num_windows": float(features.features.shape[0]),
        "num_features": float(features.features.shape[1]),
        "window_start_min": float(features.window_starts.min()),
        "window_end_max": float(features.window_ends.max()),
    }


def main() -> None:
    import argparse
    import json

    parser = argparse.ArgumentParser(description="Extract windowed features from a NumPy array saved as .npy")
    parser.add_argument("path", help="Path to a .npy file containing (samples, channels) data")
    parser.add_argument("--window-size", type=int, default=256)
    parser.add_argument("--step-size", type=int, default=128)
    parser.add_argument("--sampling-rate", type=float, default=1000.0)
    args = parser.parse_args()

    data = np.load(args.path)
    features = extract_features_from_recording(
        data,
        sampling_rate=args.sampling_rate,
        window_size=args.window_size,
        step_size=args.step_size,
    )
    summary = summarize_features(features)
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
