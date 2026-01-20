import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Upload, 
  Search, 
  LineChart, 
  Brain, 
  FolderOpen, 
  BookOpen,
  Activity,
  Database,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Zap
} from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Activity className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                NeuroAI Lab Platform
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Centralized neural data aggregation, analysis, and model training
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-6">
            <p className="text-foreground/90 leading-relaxed">
              A Neuralink-style demonstration platform showcasing end-to-end neural data workflows: 
              from raw timeseries ingestion and validation, through advanced feature extraction and 
              visualization, to machine learning model training with comprehensive experiment tracking. 
              Built to demonstrate production-ready data infrastructure for neuroscience research teams.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/data-ingestion">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Data Ingestion
                </CardTitle>
                <CardDescription>
                  Upload and validate neural timeseries, session metadata, and experimental annotations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>NWB-compatible format support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Schema validation & quality checks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Parquet storage for efficiency</span>
                  </div>
                </div>
                <Button variant="ghost" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
                  Open module <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/data-explorer">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Data Explorer
                </CardTitle>
                <CardDescription>
                  Query and filter recording sessions with advanced search capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Session filtering by subject/date/task</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Windowed feature extraction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Event-aligned averaging</span>
                  </div>
                </div>
                <Button variant="ghost" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
                  Open module <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/visualization">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Visualization
                </CardTitle>
                <CardDescription>
                  Interactive timeseries viewer with event overlays and distribution plots
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Multi-channel timeseries display</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Bandpower & spectral analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Signal quality drift detection</span>
                  </div>
                </div>
                <Button variant="ghost" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
                  Open module <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/model-training">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Model Training
                </CardTitle>
                <CardDescription>
                  Train neural decoders with cross-validation and performance evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>sklearn & PyTorch support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Cross-validation & calibration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Confusion matrix & metrics</span>
                  </div>
                </div>
                <Button variant="ghost" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
                  Open module <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/experiments">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  Experiment Tracking
                </CardTitle>
                <CardDescription>
                  Manage configurations, track runs, and compare model performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>YAML configuration system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Run history with metrics.json</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Artifact management & versioning</span>
                  </div>
                </div>
                <Button variant="ghost" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
                  Open module <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/lab-registry">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Lab Registry
                </CardTitle>
                <CardDescription>
                  Centralized experiment registry with notes, tags, and attachments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Session documentation & notes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Device metadata tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>File attachments & tagging</span>
                  </div>
                </div>
                <Button variant="ghost" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
                  Open module <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analytics">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>
                  Comprehensive neural data analytics and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Session statistics & summaries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Task distribution analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Training performance metrics</span>
                  </div>
                </div>
                <Button variant="ghost" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
                  Open module <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/signal-quality">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Signal Quality
                </CardTitle>
                <CardDescription>
                  Real-time neural recording quality monitoring and drift detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>SNR distribution analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Noise floor trending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Electrode drift monitoring</span>
                  </div>
                </div>
                <Button variant="ghost" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
                  Open module <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Platform Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-3xl font-bold">3</p>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <TrendingUp className="h-3 w-3" />
                  <span>Demo data loaded</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Trained Models</p>
                <p className="text-3xl font-bold">2</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Ready for deployment</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Experiment Runs</p>
                <p className="text-3xl font-bold">3</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Last 7 days</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Best Accuracy</p>
                <p className="text-3xl font-bold">87.3%</p>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <TrendingUp className="h-3 w-3" />
                  <span>Random Forest model</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
