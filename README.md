# NeuroAI Lab Platform Demo

> A Neuralink-style centralized data aggregation and analysis platform for neural timeseries data

![Platform Screenshot](https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=400&fit=crop)

## 🧠 Overview

This platform demonstrates production-ready infrastructure for neuroscience research teams, showcasing end-to-end workflows from raw neural data ingestion through machine learning model training with comprehensive experiment tracking. Built to mirror the internal tooling used by companies like Neuralink for managing large-scale neural recording datasets.

## ✨ Key Features

### 📊 Data Management
- **Multi-Format Ingestion**: Support for NWB, Parquet, JSON, and image formats
- **Schema Validation**: Automated validation for neural timeseries, metadata, and annotations
- **Efficient Storage**: Parquet-based storage with metadata indexing
- **Quality Control**: Real-time validation and quality metrics

### 🔍 Data Explorer
- **Advanced Filtering**: Search by subject, date, task, and custom metadata
- **Feature Extraction**: Bandpower analysis, spike detection, RMS amplitude
- **Event Alignment**: Trial-averaged responses aligned to experimental events
- **Export Capabilities**: Download processed data for external analysis

### 📈 Visualization Dashboard
- **Timeseries Viewer**: Interactive multi-channel neural recording display
- **Event Overlays**: Experimental markers synchronized with neural data
- **Spectral Analysis**: Power spectral density across frequency bands
- **Distribution Plots**: Signal quality metrics and drift detection

### 🤖 Model Training
- **Multiple Algorithms**: Random Forest, SVM, XGBoost, PyTorch neural networks
- **Cross-Validation**: Robust k-fold CV with stratification
- **Performance Metrics**: Accuracy, precision, recall, F1, confusion matrices
- **Model Versioning**: Automated checkpoint saving and comparison

### 📁 Experiment Tracking
- **YAML Configurations**: Reproducible experiment definitions
- **Run History**: Complete tracking of all training runs
- **Metrics Storage**: Structured metrics.json for each experiment
- **Artifact Management**: Organized storage of models, plots, and reports

### 📝 Lab Registry
- **Session Documentation**: Rich notes with experimental observations
- **Device Tracking**: Recording device metadata and configurations
- **Tagging System**: Flexible categorization of sessions
- **File Attachments**: Protocols, analysis notes, supporting documents

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- pnpm 10+
- MySQL/TiDB database (provided by Manus platform)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd neuroai-lab-platform-demo

# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The platform will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🏗️ Architecture

### Frontend Stack
- **React 19** with TypeScript for type-safe UI development
- **Tailwind CSS 4** with custom neural-themed design system
- **shadcn/ui** component library for consistent UI patterns
- **Recharts** for interactive data visualization
- **Wouter** for lightweight client-side routing

### Backend Stack
- **Node.js + Express** for server runtime
- **tRPC** for type-safe API layer with automatic client generation
- **Drizzle ORM** for database operations with MySQL/TiDB
- **Manus OAuth** for authentication and user management
- **S3-compatible storage** for large dataset files

### Design System
- **Color Palette**: Deep navy blue with electric blue accents
- **Typography**: IBM Plex Sans (UI) + IBM Plex Mono (code/data)
- **Theme**: Dark mode optimized for extended viewing
- **Layout**: Dashboard with persistent sidebar navigation

## 📂 Project Structure

```
neuroai-lab-platform-demo/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── DataIngestion.tsx
│   │   │   ├── DataExplorer.tsx
│   │   │   ├── Visualization.tsx
│   │   │   ├── ModelTraining.tsx
│   │   │   ├── ExperimentTracking.tsx
│   │   │   └── LabRegistry.tsx
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/          # Utilities and tRPC client
│   │   └── index.css     # Global styles and theme
│   └── public/           # Static assets
├── server/               # Backend API
│   ├── routers.ts       # tRPC procedure definitions
│   ├── db.ts            # Database query helpers
│   └── _core/           # Framework infrastructure
├── drizzle/             # Database schema and migrations
│   └── schema.ts        # Table definitions
├── shared/              # Shared types and constants
├── PROJECT_BRIEF.md     # Detailed feature documentation
└── README.md           # This file
```

## 🎯 Use Cases

### For Hiring Teams
Demonstrates full-stack capabilities with domain expertise in neuroscience data infrastructure. Shows ability to build production-ready scientific software that research teams can actually use.

### For Research Labs
Provides a template for building centralized data management systems for neural recording experiments. Showcases best practices for reproducibility and experiment tracking.

### For Neurotechnology Companies
Proves ability to translate complex scientific requirements into scalable, maintainable software infrastructure with professional UI/UX.

## 🔧 Development Workflow

### Adding New Features

1. **Update Database Schema** (if needed)
   ```bash
   # Edit drizzle/schema.ts
   pnpm db:push
   ```

2. **Create Backend Procedures**
   ```typescript
   // server/routers.ts
   export const appRouter = router({
     feature: router({
       list: protectedProcedure.query(async ({ ctx }) => {
         // Implementation
       }),
     }),
   });
   ```

3. **Build Frontend UI**
   ```typescript
   // client/src/pages/Feature.tsx
   const { data } = trpc.feature.list.useQuery();
   ```

4. **Write Tests**
   ```bash
   pnpm test
   ```

### Running Tests

```bash
# Run all tests
pnpm test

# Type checking
pnpm check
```

## 📊 Demo Data

The platform includes mock data for demonstration:
- **3 recording sessions** with multi-channel neural timeseries
- **2 trained models** (Random Forest, SVM)
- **3 experiment runs** with full metrics
- **Sample configurations** in YAML format

## 🎨 Design Philosophy

The platform follows a **scientific/technical aesthetic** inspired by internal neuroscience tooling:

- **Professional, not academic**: Looks like production software, not research prototypes
- **Data-first**: Emphasis on clarity and readability of neural data
- **Minimal distractions**: Clean interface that keeps focus on the data
- **Dark theme**: Optimized for extended viewing sessions with neural timeseries

## 🚧 Roadmap

### Current Status (MVP)
- ✅ Complete UI for all core modules
- ✅ Data schemas and validation rules defined
- ✅ Visualization dashboards functional
- ✅ Experiment tracking interface
- ✅ Lab registry system

### Next Steps
- [ ] Backend API implementation with tRPC
- [ ] Python data processing scripts (ingest.py, dataset.py)
- [ ] ML training pipeline (train.py, eval.py)
- [ ] Docker containerization
- [ ] CI/CD with GitHub Actions
- [ ] Demo video and screenshots

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding authentication middleware for multi-user support
- Implementing real data ingestion pipelines
- Integrating with actual neural recording hardware
- Adding more sophisticated ML models
- Implementing real-time data streaming

## 📞 Contact

Built by [Your Name] to demonstrate full-stack capabilities in neuroscience data infrastructure.

---

**Note**: This is a demonstration platform showcasing technical capabilities. For production deployment with real neural data, additional security, validation, and compliance measures would be required.
