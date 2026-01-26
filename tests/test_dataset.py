import numpy as np
import pytest

from dataset import WindowConfig, extract_features, window_timeseries


def test_window_timeseries_shape():
    data = np.random.default_rng(0).normal(size=(100, 4))
    windows = window_timeseries(data, window_size=20, step_size=10)
    assert windows.shape == (9, 20, 4)


def test_window_timeseries_requires_valid_shape():
    with pytest.raises(ValueError):
        window_timeseries(np.random.default_rng(0).normal(size=(10,)), window_size=5, step_size=2)


def test_extract_features_output():
    rng = np.random.default_rng(1)
    data = rng.normal(size=(256, 2))
    config = WindowConfig(window_size=64, step_size=32, sampling_rate=500.0)
    features = extract_features(data, config)
    assert features.features.shape[0] == 7
    assert features.window_starts.shape[0] == 7
    assert features.window_ends.shape[0] == 7
    assert features.features.shape[1] > 0
