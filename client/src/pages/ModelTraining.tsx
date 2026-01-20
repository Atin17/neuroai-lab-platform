import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Play, CheckCircle2, TrendingUp, BarChart3, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from "recharts";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { mockDataService, TrainingRun } from "@/lib/mockDataService";

export default function ModelTraining() {
  const [trainingRuns, setTrainingRuns] = useState<TrainingRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState<TrainingRun | null>(null);
  const [isTraining, setIsTraining] = useState(false);

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

  // Generate training history
  const generateTrainingHistory = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      epoch: i + 1,
      loss: 0.8 - (i * 0.03) + Math.random() * 0.05,
      accuracy: 0.6 + (i * 0.015) + Math.random() * 0.02,
      valLoss: 0.75 - (i * 0.025) + Math.random() * 0.08,
      valAccuracy: 0.62 + (i * 0.012) + Math.random() * 0.03,
    }));
  };

  // Generate confusion matrix data
  const generateConfusionMatrix = () => {
    return [
      { actual: "Class 0", predicted0: 85, predicted1: 12, predicted2: 3 },
      { actual: "Class 1", predicted0: 8, predicted1: 88, predicted2: 4 },
      { actual: "Class 2", predicted0: 5, predicted1: 6, predicted2: 89 },
    ];
  };

  // Generate cross-validation scores
  const generateCrossValScores = () => {
    return Array.from({ length: 5 }, (_, i) => ({
      fold: `Fold ${i + 1}`,
      accuracy: 0.82 + Math.random() * 0.08,
      precision: 0.81 + Math.random() * 0.08,
      recall: 0.80 + Math.random() * 0.09,
      f1: 0.81 + Math.random() * 0.08,
    }));
  };

  const trainingHistory = generateTrainingHistory();
  const confusionMatrix = generateConfusionMatrix();
  const crossValScores = generateCrossValScores();

  const handleStartTraining = () => {
    setIsTraining(true);
    toast.success("Training started...");
    setTimeout(() => {
      setIsTraining(false);
      toast.success("Training completed!");
    }, 3000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Brain className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-400">Loading training data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Model Training</h1>
          <p className="text-muted-foreground mt-2">
            Train and evaluate neural decoders with cross-validation and performance metrics
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
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
                    {selectedRun ? (selectedRun.accuracy * 100).toFixed(1) : "0"}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Avg Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400">
                    {selectedRun ? selectedRun.loss.toFixed(3) : "0"}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Epochs Trained</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">
                    {selectedRun ? selectedRun.epochs : "0"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Training Runs Table */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Training Runs</CardTitle>
                <CardDescription>All completed training experiments</CardDescription>
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
                          <td className="text-right py-3 px-4 text-gray-300">
                            <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-900 text-green-200">
                              {(run.accuracy * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-right py-3 px-4 text-gray-300">{run.loss.toFixed(3)}</td>
                          <td className="text-right py-3 px-4 text-gray-300">{run.epochs}</td>
                          <td className="py-3 px-4 text-gray-300">{new Date(run.timestamp).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Model Configuration
                </CardTitle>
                <CardDescription>Configure model architecture and training parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="model-type">Model Type</Label>
                    <Select defaultValue="neural_network">
                      <SelectTrigger id="model-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neural_network">Neural Network</SelectItem>
                        <SelectItem value="svm">Support Vector Machine</SelectItem>
                        <SelectItem value="random_forest">Random Forest</SelectItem>
                        <SelectItem value="lstm">LSTM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batch-size">Batch Size</Label>
                    <Input id="batch-size" type="number" defaultValue="32" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learning-rate">Learning Rate</Label>
                    <Input id="learning-rate" type="number" defaultValue="0.001" step="0.0001" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="epochs">Epochs</Label>
                    <Input id="epochs" type="number" defaultValue="50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validation-split">Validation Split</Label>
                    <Input id="validation-split" type="number" defaultValue="0.2" step="0.1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="random-seed">Random Seed</Label>
                    <Input id="random-seed" type="number" defaultValue="42" />
                  </div>
                </div>

                <Button onClick={handleStartTraining} disabled={isTraining} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  {isTraining ? "Training..." : "Start Training"}
                </Button>
              </CardContent>
            </Card>

            {/* Training Progress */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Epoch Progress</span>
                    <span className="text-gray-300">15 / 50</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Batch Progress</span>
                    <span className="text-gray-300">128 / 256</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>

                <div className="p-3 bg-blue-900/20 border border-blue-700 rounded">
                  <p className="text-sm text-blue-200">
                    Current Loss: 0.245 • Accuracy: 92.3% • ETA: 2m 15s
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evaluation Tab */}
          <TabsContent value="evaluation" className="space-y-6">
            {/* Training Curves */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Training Curves
                </CardTitle>
                <CardDescription>Loss and accuracy over epochs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trainingHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="epoch" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                    <Line type="monotone" dataKey="accuracy" stroke="#10B981" name="Train Accuracy" />
                    <Line type="monotone" dataKey="valAccuracy" stroke="#3B82F6" name="Val Accuracy" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cross-Validation Scores */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Cross-Validation Scores
                </CardTitle>
                <CardDescription>5-fold cross-validation results</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={crossValScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="fold" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                    <Bar dataKey="accuracy" fill="#10B981" name="Accuracy" />
                    <Bar dataKey="f1" fill="#F59E0B" name="F1 Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Confusion Matrix */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Confusion Matrix</CardTitle>
                <CardDescription>Classification performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2 px-4 text-gray-400">Actual</th>
                        <th className="text-right py-2 px-4 text-gray-400">Pred Class 0</th>
                        <th className="text-right py-2 px-4 text-gray-400">Pred Class 1</th>
                        <th className="text-right py-2 px-4 text-gray-400">Pred Class 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {confusionMatrix.map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-700">
                          <td className="py-2 px-4 text-gray-300 font-medium">{row.actual}</td>
                          <td className="text-right py-2 px-4 text-gray-300 bg-green-900/20">{row.predicted0}</td>
                          <td className="text-right py-2 px-4 text-gray-300">{row.predicted1}</td>
                          <td className="text-right py-2 px-4 text-gray-300">{row.predicted2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Training History</CardTitle>
                <CardDescription>Detailed metrics from selected run</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedRun && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Run ID</p>
                        <p className="text-sm font-mono text-gray-300">{selectedRun.id.slice(0, 8)}...</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Model</p>
                        <p className="text-sm font-semibold text-gray-300">{selectedRun.model}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Final Accuracy</p>
                        <p className="text-sm font-semibold text-green-400">{(selectedRun.accuracy * 100).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Final Loss</p>
                        <p className="text-sm font-semibold text-orange-400">{selectedRun.loss.toFixed(4)}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-green-900/20 border border-green-700 rounded flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-200">Training Complete</p>
                        <p className="text-sm text-green-300">
                          Trained on {selectedRun.epochs} epochs with excellent convergence
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
