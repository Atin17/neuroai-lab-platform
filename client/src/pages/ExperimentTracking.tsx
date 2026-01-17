import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen, FileText, TrendingUp, Download } from "lucide-react";
import { toast } from "sonner";

const mockRuns = [
  {
    id: "run_001",
    timestamp: "2026-01-18 14:23:15",
    config: "config_rf_default.yaml",
    accuracy: 87.3,
    loss: 0.342,
    status: "completed",
  },
  {
    id: "run_002",
    timestamp: "2026-01-18 13:45:32",
    config: "config_svm_tuned.yaml",
    accuracy: 84.2,
    loss: 0.389,
    status: "completed",
  },
  {
    id: "run_003",
    timestamp: "2026-01-18 12:10:08",
    config: "config_xgb_baseline.yaml",
    accuracy: 82.1,
    loss: 0.421,
    status: "completed",
  },
];

export default function ExperimentTracking() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Experiment Tracking</h1>
          <p className="text-muted-foreground mt-2">
            Manage experiment configurations, track runs, and compare model performance
          </p>
        </div>

        <Tabs defaultValue="runs" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="runs">Run History</TabsTrigger>
            <TabsTrigger value="configs">Configurations</TabsTrigger>
          </TabsList>

          <TabsContent value="runs" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  Experiment Runs
                </CardTitle>
                <CardDescription>
                  Complete history of training runs with metrics and artifacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Run ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Configuration</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Loss</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRuns.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell className="font-mono text-sm">{run.id}</TableCell>
                        <TableCell className="text-sm">{run.timestamp}</TableCell>
                        <TableCell className="text-sm">{run.config}</TableCell>
                        <TableCell>
                          <span className="font-semibold">{run.accuracy}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{run.loss}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-600">{run.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info("View details coming soon")}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance Comparison
                </CardTitle>
                <CardDescription>
                  Compare metrics across different runs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Best Accuracy</p>
                      <p className="text-2xl font-bold">87.3%</p>
                      <p className="text-xs text-muted-foreground mt-1">run_001</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Lowest Loss</p>
                      <p className="text-2xl font-bold">0.342</p>
                      <p className="text-xs text-muted-foreground mt-1">run_001</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Total Runs</p>
                      <p className="text-2xl font-bold">{mockRuns.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Run Artifacts</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-semibold text-sm">metrics.json</p>
                          <p className="text-xs text-muted-foreground">Training metrics and validation scores</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info("Download coming soon")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-semibold text-sm">model_weights.pkl</p>
                          <p className="text-xs text-muted-foreground">Trained model checkpoint</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info("Download coming soon")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-semibold text-sm">confusion_matrix.png</p>
                          <p className="text-xs text-muted-foreground">Evaluation visualization</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info("Download coming soon")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configs" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Configuration Files
                </CardTitle>
                <CardDescription>
                  YAML configuration templates for reproducible experiments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">config_rf_default.yaml</h4>
                  <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`model:
  type: "classifier"
  algorithm: "random_forest"
  n_estimators: 100
  max_depth: 10

training:
  cv_folds: 5
  test_split: 0.2
  random_seed: 42

features:
  - bandpower
  - spike_count
  - rms_amplitude

dataset:
  sessions: ["sess_001", "sess_002", "sess_003"]
  channels: [1, 2, 3, 4, 5, 6]`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">config_svm_tuned.yaml</h4>
                  <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`model:
  type: "classifier"
  algorithm: "svm"
  kernel: "rbf"
  C: 1.0
  gamma: "scale"

training:
  cv_folds: 5
  test_split: 0.2
  random_seed: 42

features:
  - bandpower
  - spike_count

dataset:
  sessions: ["sess_001", "sess_002"]
  channels: [1, 2, 3, 4]`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
