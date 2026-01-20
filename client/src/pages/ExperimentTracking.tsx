import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen, FileText, TrendingUp, Download, Plus, Copy } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { mockDataService, TrainingRun } from "@/lib/mockDataService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function ExperimentTracking() {
  const [trainingRuns, setTrainingRuns] = useState<TrainingRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState<TrainingRun | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await mockDataService.load();
        const runs = mockDataService.getTrainingRuns();
        setTrainingRuns(runs);
        if (runs.length > 0) {
          setSelectedRun(runs[0]);
        }
      } catch (error) {
        console.error("Failed to load mock data:", error);
        toast.error("Failed to load mock data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate performance comparison data
  const generateComparisonData = () => {
    return trainingRuns.map((run) => ({
      name: run.name.slice(0, 10),
      accuracy: run.accuracy * 100,
      loss: run.loss * 100,
    }));
  };

  // Generate run metrics timeline
  const generateMetricsTimeline = () => {
    return trainingRuns.map((run, index) => ({
      run: `Run ${index + 1}`,
      accuracy: run.accuracy * 100,
      loss: run.loss * 100,
      timestamp: new Date(run.timestamp).getTime(),
    }));
  };

  const comparisonData = generateComparisonData();
  const metricsTimeline = generateMetricsTimeline();

  const handleDownloadConfig = (run: TrainingRun) => {
    toast.success(`Downloading config for ${run.name}`);
  };

  const handleDownloadMetrics = (run: TrainingRun) => {
    toast.success(`Downloading metrics for ${run.name}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FolderOpen className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-400">Loading experiment data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Experiment Tracking</h1>
          <p className="text-muted-foreground mt-2">
            Manage experiment configurations, track runs, and compare model performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{trainingRuns.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Best Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {Math.max(...trainingRuns.map((r) => r.accuracy * 100)).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {(trainingRuns.reduce((sum, r) => sum + r.accuracy, 0) / trainingRuns.length * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{trainingRuns.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="runs" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="runs">Run History</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="configs">Configurations</TabsTrigger>
          </TabsList>

          {/* Run History Tab */}
          <TabsContent value="runs" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Training Runs</CardTitle>
                <CardDescription>All experiment runs with metrics and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Run Name</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Model</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">Accuracy</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">Loss</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">Epochs</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                        <th className="text-center py-3 px-4 text-gray-400 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingRuns.map((run) => (
                        <tr
                          key={run.id}
                          className={`border-b border-slate-700 hover:bg-slate-800/50 cursor-pointer ${
                            selectedRun?.id === run.id ? "bg-slate-800" : ""
                          }`}
                          onClick={() => setSelectedRun(run)}
                        >
                          <td className="py-3 px-4 text-gray-300 font-medium">{run.name}</td>
                          <td className="py-3 px-4 text-gray-300">{run.model}</td>
                          <td className="text-right py-3 px-4">
                            <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-900 text-green-200">
                              {(run.accuracy * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-right py-3 px-4 text-gray-300">{run.loss.toFixed(3)}</td>
                          <td className="text-right py-3 px-4 text-gray-300">{run.epochs}</td>
                          <td className="py-3 px-4 text-gray-300">{new Date(run.timestamp).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadConfig(run);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadMetrics(run);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Selected Run Details */}
            {selectedRun && (
              <Card className="bg-card border-border border-blue-500">
                <CardHeader>
                  <CardTitle className="text-white">Run Details</CardTitle>
                  <CardDescription>{selectedRun.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Run Name</p>
                      <p className="text-lg font-semibold text-white">{selectedRun.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Model Type</p>
                      <p className="text-lg font-semibold text-white">{selectedRun.model}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Accuracy</p>
                      <p className="text-lg font-semibold text-green-400">{(selectedRun.accuracy * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Loss</p>
                      <p className="text-lg font-semibold text-orange-400">{selectedRun.loss.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Epochs</p>
                      <p className="text-lg font-semibold text-purple-400">{selectedRun.epochs}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Timestamp</p>
                      <p className="text-lg font-semibold text-gray-300">{new Date(selectedRun.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance Comparison
                </CardTitle>
                <CardDescription>Accuracy and loss across all runs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                    <Bar dataKey="accuracy" fill="#10B981" name="Accuracy (%)" />
                    <Bar dataKey="loss" fill="#F59E0B" name="Loss (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Metrics Timeline</CardTitle>
                <CardDescription>Performance trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metricsTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="run" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                    <Line type="monotone" dataKey="accuracy" stroke="#10B981" name="Accuracy (%)" />
                    <Line type="monotone" dataKey="loss" stroke="#EF4444" name="Loss (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurations Tab */}
          <TabsContent value="configs" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Experiment Configurations
                </CardTitle>
                <CardDescription>YAML configuration files used for training runs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainingRuns.map((run, index) => (
                  <div key={run.id} className="p-4 bg-slate-800 rounded border border-slate-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white">config_{run.model.toLowerCase()}_run{index + 1}.yaml</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Model: {run.model} • Epochs: {run.epochs} • Created: {new Date(run.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.success("Config copied to clipboard");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadConfig(run)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Configuration Template</CardTitle>
                <CardDescription>YAML format for experiment configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 p-4 rounded text-xs text-gray-300 overflow-x-auto">
{`model:
  type: neural_network
  layers: 3
  units: [128, 64, 32]
  activation: relu
  dropout: 0.2

training:
  epochs: 50
  batch_size: 32
  learning_rate: 0.001
  optimizer: adam
  loss: categorical_crossentropy

validation:
  split: 0.2
  patience: 10
  
data:
  preprocessing: standardize
  augmentation: false
  
random_seed: 42`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
