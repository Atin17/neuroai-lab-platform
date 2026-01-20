# NeuroAI Lab Platform Demo - TODO

## Day 1 - Data Model + Ingestion
- [x] Define schemas for neural timeseries (NWB-like simplified format)
- [x] Define schemas for session metadata (JSON)
- [x] Define schemas for events/annotations
- [x] Define schemas for optional images (histology-like placeholders)
- [ ] Write ingest.py that loads files → validates schema → writes Parquet
- [ ] Add unit tests for schema validation

## Day 2 - Query + Aggregation
- [x] Implement dataset.py with session filtering (by subject/date/task)
- [x] Implement windowed feature extraction (bandpower, spike proxy, RMS)
- [x] Implement event-aligned averages
- [ ] Create reproducible notebooks + CLI

## Day 3 - Visualization Dashboard (MVP)
- [x] Build session browser + metadata table
- [x] Build timeseries viewer with event overlays
- [x] Build distribution plots + drift checks
- [ ] Create demo video GIF in README

## Day 4 - Model Training + Evaluation Harness
- [x] Train baseline classifier/regressor (sklearn + PyTorch option)
- [x] Add cross-validation
- [x] Add calibration + confusion matrix report
- [ ] Create train.py, eval.py, saved artifacts

## Day 5 - Experiment Tracking
- [x] Add config system (YAML)
- [x] Add run folders + metrics.json
- [x] Optional: W&B hooks (keep it optional)
- [x] Create runs/ example + summary table

## Day 6 - Lab Systems Flavor
- [x] Add SQLite table: sessions, devices, notes, attachments
- [x] Build simple UI to add notes / tag sessions
- [x] Make it look like internal tooling

## Day 7 - Polish + Ship
- [ ] Dockerize (docker compose up)
- [ ] Add CI (GitHub Actions): lint + tests
- [x] Write PROJECT_BRIEF.md mapping features → Neuralink-style needs
- [x] Update README with "1-minute run" + screenshots

## Docker & Deployment
- [x] Create Dockerfile for Node.js application
- [x] Create docker-compose.yml with app, MySQL, and MinIO
- [x] Create .dockerignore and build scripts
- [x] Update README with Docker Compose instructions
- [x] Test Docker Compose setup


## Mock Database & Analytics (Complete)
- [x] Create seed script with realistic neural data
- [x] Populate sessions, recordings, events, quality metrics
- [x] Create Analytics Dashboard page
- [x] Build Signal Quality Dashboard
- [x] Add vitest tests for seed data validation
- [x] Integrate mock data across all dashboards
- [x] Implement Data Ingestion with mock data
- [x] Implement Data Explorer with filtering
- [x] Implement Visualization with timeseries and spectral analysis
- [x] Implement Model Training with training curves and evaluation
- [x] Implement Experiment Tracking with run history and comparison
- [x] Implement Lab Registry with session documentation
