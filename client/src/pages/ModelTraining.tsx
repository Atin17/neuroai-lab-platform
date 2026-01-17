import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Play, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function ModelTraining() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Model Training</h1>
          <p className="text-muted-foreground mt-2">
            Train and evaluate neural decoders with cross-validation and performance metrics
          </p>
        </div>

        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Model Configuration
                </CardTitle>
                <CardDescription>
                  Configure model architecture and training parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="model-type">Model Type</Label>
                    <Select defaultValue="classifier">
                      <SelectTrigger id="model-type">
                        <SelectValue placeholder="Select model type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classifier">Classifier (sklearn)</SelectItem>
                        <SelectItem value="regressor">Regressor (sklearn)</SelectItem>
                        <SelectItem value="pytorch">PyTorch Neural Network</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="algorithm">Algorithm</Label>
                    <Select defaultValue="rf">
                      <SelectTrigger id="algorithm">
                        <SelectValue placeholder="Select algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rf">Random Forest</SelectItem>
                        <SelectItem value="svm">Support Vector Machine</SelectItem>
                        <SelectItem value="lr">Logistic Regression</SelectItem>
                        <SelectItem value="xgb">XGBoost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cv-folds">Cross-Validation Folds</Label>
                    <Input
                      id="cv-folds"
                      type="number"
                      defaultValue="5"
                      min="2"
                      max="10"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-split">Test Split (%)</Label>
                    <Input
                      id="test-split"
                      type="number"
                      defaultValue="20"
                      min="10"
                      max="50"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataset-select">Training Dataset</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="dataset-select">
                      <SelectValue placeholder="Select dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sessions (Combined)</SelectItem>
                      <SelectItem value="subject_a">Subject A Only</SelectItem>
                      <SelectItem value="subject_b">Subject B Only</SelectItem>
                      <SelectItem value="motor">Motor Tasks Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => toast.info("Training will be implemented with backend")}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Training
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
                <CardDescription>
                  Real-time training metrics and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Epoch 3/10</span>
                    <span className="text-sm text-muted-foreground">30% complete</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Training Loss</p>
                    <p className="text-2xl font-bold">0.342</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Validation Loss</p>
                    <p className="text-2xl font-bold">0.389</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                    <p className="text-2xl font-bold">87.3%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Training Log</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
                    <p className="text-green-400">[15:45:12] Starting training with 5-fold CV...</p>
                    <p className="text-muted-foreground">[15:45:13] Loading dataset: 3 sessions, 1024 samples</p>
                    <p className="text-muted-foreground">[15:45:14] Feature extraction: bandpower, RMS, spike count</p>
                    <p className="text-blue-400">[15:45:15] Fold 1/5: Train accuracy = 0.891, Val accuracy = 0.873</p>
                    <p className="text-blue-400">[15:45:16] Fold 2/5: Train accuracy = 0.885, Val accuracy = 0.869</p>
                    <p className="text-blue-400">[15:45:17] Fold 3/5: Train accuracy = 0.893, Val accuracy = 0.876</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Model Evaluation
                </CardTitle>
                <CardDescription>
                  Performance metrics and confusion matrix
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                    <p className="text-2xl font-bold">87.3%</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Precision</p>
                    <p className="text-2xl font-bold">85.6%</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Recall</p>
                    <p className="text-2xl font-bold">89.1%</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">F1 Score</p>
                    <p className="text-2xl font-bold">87.3%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Confusion Matrix</h4>
                  <div className="grid grid-cols-3 gap-2 max-w-md">
                    <div className="bg-green-900/30 p-4 rounded text-center">
                      <p className="text-2xl font-bold">142</p>
                      <p className="text-xs text-muted-foreground">True Pos</p>
                    </div>
                    <div className="bg-red-900/30 p-4 rounded text-center">
                      <p className="text-2xl font-bold">18</p>
                      <p className="text-xs text-muted-foreground">False Pos</p>
                    </div>
                    <div className="bg-red-900/30 p-4 rounded text-center">
                      <p className="text-2xl font-bold">21</p>
                      <p className="text-xs text-muted-foreground">False Neg</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Saved Models
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-semibold text-sm">model_rf_v1.pkl</p>
                        <p className="text-xs text-muted-foreground">Random Forest • 87.3% accuracy</p>
                      </div>
                      <Badge className="bg-green-600">Best</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-semibold text-sm">model_svm_v1.pkl</p>
                        <p className="text-xs text-muted-foreground">SVM • 84.2% accuracy</p>
                      </div>
                      <Badge variant="secondary">Archived</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
