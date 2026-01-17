"""Neural data ingestion utilities for Parquet and NWB sources."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, Optional

import numpy as np
import pandas as pd
import pyarrow.parquet as pq
from pynwb import NWBHDF5IO


@dataclass
class NeuralRecording:
    """Container for loaded neural recording data."""

    data: np.ndarray
    sampling_rate: float
    channel_ids: list[str]
    timestamps: Optional[np.ndarray]
    metadata: Dict[str, Any]


@dataclass
class IngestReport:
    """Summary information for an ingestion run."""

    source_path: Path
    format: str
    num_samples: int
    num_channels: int
    sampling_rate: float
    metadata: Dict[str, Any]


def read_parquet(path: str | Path) -> pd.DataFrame:
    """Load a Parquet file (or dataset) into a pandas DataFrame."""

    parquet_path = Path(path)
    if parquet_path.is_dir():
        table = pq.read_table(parquet_path)
    else:
        table = pq.read_table(parquet_path)
    return table.to_pandas()


def _validate_timeseries_frame(frame: pd.DataFrame) -> None:
    if frame.empty:
        raise ValueError("Parquet file is empty")
    if "timestamp" not in frame.columns:
        raise ValueError("Expected a 'timestamp' column in Parquet file")
    if frame.shape[1] < 2:
        raise ValueError("Parquet file must include at least one channel column")


def ingest_parquet(path: str | Path) -> NeuralRecording:
    """Ingest a Parquet file containing neural timeseries data."""

    frame = read_parquet(path)
    _validate_timeseries_frame(frame)

    timestamps = frame["timestamp"].to_numpy()
    channel_columns = [col for col in frame.columns if col != "timestamp"]
    data = frame[channel_columns].to_numpy(dtype=float)

    sampling_rate = _infer_sampling_rate(timestamps)
    metadata = {
        "source": "parquet",
        "channels": channel_columns,
    }

    return NeuralRecording(
        data=data,
        sampling_rate=sampling_rate,
        channel_ids=channel_columns,
        timestamps=timestamps,
        metadata=metadata,
    )


def ingest_nwb(path: str | Path) -> NeuralRecording:
    """Ingest an NWB file using pynwb."""

    nwb_path = Path(path)
    with NWBHDF5IO(str(nwb_path), "r") as io:
        nwbfile = io.read()
        acquisitions = list(nwbfile.acquisition.values())
        if not acquisitions:
            raise ValueError("NWB file has no acquisition data")

        timeseries = acquisitions[0]
        data = np.asarray(timeseries.data)
        timestamps = None
        if timeseries.timestamps is not None:
            timestamps = np.asarray(timeseries.timestamps)
        elif timeseries.starting_time is not None:
            sample_count = data.shape[0]
            timestamps = timeseries.starting_time + np.arange(sample_count) / timeseries.rate

        channel_ids = [str(idx) for idx in range(data.shape[1] if data.ndim > 1 else 1)]
        sampling_rate = float(timeseries.rate or 0.0)

        metadata = {
            "source": "nwb",
            "identifier": nwbfile.identifier,
            "session_description": nwbfile.session_description,
            "lab": nwbfile.lab,
            "institution": nwbfile.institution,
            "experimenter": nwbfile.experimenter,
        }

    if data.ndim == 1:
        data = data[:, None]

    return NeuralRecording(
        data=data,
        sampling_rate=sampling_rate,
        channel_ids=channel_ids,
        timestamps=timestamps,
        metadata=metadata,
    )


def ingest_file(path: str | Path) -> NeuralRecording:
    """Route ingestion based on file extension."""

    file_path = Path(path)
    suffix = file_path.suffix.lower()
    if suffix == ".parquet" or suffix == ".pq":
        return ingest_parquet(file_path)
    if suffix == ".nwb":
        return ingest_nwb(file_path)
    raise ValueError(f"Unsupported file type: {suffix}")


def build_report(recording: NeuralRecording, source_path: str | Path, format_hint: str) -> IngestReport:
    num_samples = recording.data.shape[0]
    num_channels = recording.data.shape[1]
    return IngestReport(
        source_path=Path(source_path),
        format=format_hint,
        num_samples=num_samples,
        num_channels=num_channels,
        sampling_rate=recording.sampling_rate,
        metadata=recording.metadata,
    )


def _infer_sampling_rate(timestamps: Iterable[float]) -> float:
    values = np.asarray(list(timestamps), dtype=float)
    if values.size < 2:
        return 0.0
    deltas = np.diff(values)
    median_delta = float(np.median(deltas))
    if median_delta <= 0:
        return 0.0
    return 1.0 / median_delta


def summarize_recording(recording: NeuralRecording) -> Dict[str, Any]:
    """Return a summary dictionary for a neural recording."""

    return {
        "num_samples": int(recording.data.shape[0]),
        "num_channels": int(recording.data.shape[1]),
        "sampling_rate": float(recording.sampling_rate),
        "channel_ids": recording.channel_ids,
        "metadata": recording.metadata,
    }


def main() -> None:
    import argparse
    import json

    parser = argparse.ArgumentParser(description="Ingest neural data files (Parquet or NWB).")
    parser.add_argument("path", help="Path to Parquet or NWB file")
    args = parser.parse_args()

    recording = ingest_file(args.path)
    report = summarize_recording(recording)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
