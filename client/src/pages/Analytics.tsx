import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { Brain, Activity, TrendingUp, Zap } from "lucide-react";

interface Session {
  id: string;
  subject: string;
  date: string;
  task: string;
  duration: number;
  channels: number;
  samplingRate: number;
  metadata: Record<string, string>;
}

interface TrainingRun {
  id: string;
  name: string;
  modelType: string;
  status: string;
  accuracy: number;
  loss: number;
  epochs: number;
}

interface QualityMetric {
  id: string;
  recordingId: string;
  metricType: string;
  value: number;
}

interface Feature {
  id: string;
  sessionId: string;
  featureType: string;
  values: Record<string, number>;
}

export default function Analytics() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [trainingRuns, setTrainingRuns] = useState<TrainingRun[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMockData = async () => {
      try {
        const [sessionsRes, trainingRes, metricsRes, featuresRes] =
          await Promise.all([
            fetch("/mock-data/sessions.json"),
            fetch("/mock-data/training-runs.json"),
            fetch("/mock-data/quality-metrics.json"),
            fetch("/mock-data/features.json"),
          ]);

        const [sessionsData, trainingData, metricsData, featuresData] =
          await Promise.all([
            sessionsRes.json(),
            trainingRes.json(),
            metricsRes.json(),
            featuresRes.json(),
          ]);

        setSessions(sessionsData);
        setTrainingRuns(trainingData);
        setQualityMetrics(metricsData);
        setFeatures(featuresData);
      } catch (error) {
        console.error("Failed to load mock data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMockData();
  }, []);

  // Calculate statistics
  const totalSessions = sessions.length;
  const totalChannels = sessions.reduce((sum, s) => sum + s.channels, 0);
  const avgAccuracy =
    trainingRuns.length > 0
      ? (
          trainingRuns.reduce((sum, r) => sum + r.accuracy, 0) /
          trainingRuns.length
        ).toFixed(3)
      : "0";
  const completedRuns = trainingRuns.filter((r) => r.status === "completed")
    .length;

  // Task distribution
  const taskDistribution = sessions.reduce(
    (acc, session) => {
      const existing = acc.find((t) => t.task === session.task);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ task: session.task, count: 1 });
      }
      return acc;
    },
    [] as { task: string; count: number }[]
  );

  // Subject activity
  const subjectActivity = sessions.reduce(
    (acc, session) => {
      const existing = acc.find((s) => s.subject === session.subject);
      if (existing) {
        existing.sessions += 1;
        existing.totalChannels += session.channels;
      } else {
        acc.push({
          subject: session.subject,
          sessions: 1,
          totalChannels: session.channels,
        });
      }
      return acc;
    },
    [] as { subject: string; sessions: number; totalChannels: number }[]
  );

  // Quality metrics summary
  const snrMetrics = qualityMetrics.filter((m) => m.metricType === "snr");
  const avgSNR =
    snrMetrics.length > 0
      ? (
          snrMetrics.reduce((sum, m) => sum + m.value, 0) / snrMetrics.length
        ).toFixed(2)
      : "0";

  const driftMetrics = qualityMetrics.filter((m) => m.metricType === "drift");
  const avgDrift =
    driftMetrics.length > 0
      ? (
          driftMetrics.reduce((sum, m) => sum + m.value, 0) /
          driftMetrics.length
        ).toFixed(2)
      : "0";

  // Training performance
  const trainingPerformance = trainingRuns.map((run) => ({
    name: run.name,
    accuracy: (run.accuracy * 100).toFixed(1),
    loss: run.loss.toFixed(3),
    epochs: run.epochs,
  }));

  // Model type distribution
  const modelDistribution = trainingRuns.reduce(
    (acc, run) => {
      const existing = acc.find((m) => m.modelType === run.modelType);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ modelType: run.modelType, count: 1 });
      }
      return acc;
    },
    [] as { modelType: string; count: number }[]
  );

  // Feature statistics
  const featureTypes = features.reduce(
    (acc, feature) => {
      const existing = acc.find((f) => f.type === feature.featureType);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ type: feature.featureType, count: 1 });
      }
      return acc;
    },
    [] as { type: string; count: number }[]
  );

  // SNR vs Drift scatter plot
  const snrDriftData = snrMetrics.slice(0, 100).map((snr, idx) => {
    const drift = driftMetrics[idx];
    return {
      snr: parseFloat(snr.value.toFixed(2)),
      drift: drift ? parseFloat(drift.value.toFixed(2)) : 0,
    };
  });

  const COLORS = [
    "#2196F3",
    "#4CAF50",
    "#FF9800",
    "#F44336",
    "#9C27B0",
    "#00BCD4",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Brain className="w-10 h-10 text-blue-400" />
            Neural Data Analytics
          </h1>
          <p className="text-gray-400">
            Comprehensive analysis of neural recordings and model performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalSessions}</div>
              <p className="text-xs text-gray-500 mt-1">Recording sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                Total Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalChannels}</div>
              <p className="text-xs text-gray-500 mt-1">Neural channels</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Avg Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{avgAccuracy}</div>
              <p className="text-xs text-gray-500 mt-1">Model performance</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Brain className="w-4 h-4 text-orange-400" />
                Completed Runs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{completedRuns}</div>
              <p className="text-xs text-gray-500 mt-1">Training runs</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Task Distribution */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Task Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    dataKey="count"
                    nameKey="task"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subject Activity */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Subject Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="subject" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                  />
                  <Bar dataKey="sessions" fill="#2196F3" name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Training Performance */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Training Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trainingPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#4CAF50"
                    name="Accuracy (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="loss"
                    stroke="#FF9800"
                    name="Loss"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* SNR vs Drift */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">SNR vs Drift Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="snr" stroke="#94a3b8" name="SNR (dB)" />
                  <YAxis dataKey="drift" stroke="#94a3b8" name="Drift (µm)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  <Scatter name="Channels" data={snrDriftData} fill="#2196F3" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Distribution */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Model Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="modelType" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                  />
                  <Bar dataKey="count" fill="#9C27B0" name="Runs" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quality Metrics Summary */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Quality Metrics Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                  <span className="text-gray-300">Avg SNR</span>
                  <span className="text-xl font-bold text-blue-400">
                    {avgSNR} dB
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                  <span className="text-gray-300">Avg Drift</span>
                  <span className="text-xl font-bold text-green-400">
                    {avgDrift} µm
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                  <span className="text-gray-300">Total Metrics</span>
                  <span className="text-xl font-bold text-purple-400">
                    {qualityMetrics.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                  <span className="text-gray-300">Feature Types</span>
                  <span className="text-xl font-bold text-orange-400">
                    {featureTypes.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
