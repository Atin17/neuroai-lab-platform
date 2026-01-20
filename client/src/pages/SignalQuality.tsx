import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { AlertCircle, CheckCircle2, TrendingDown, Zap } from "lucide-react";

interface QualityMetric {
  id: string;
  recordingId: string;
  metricType: string;
  value: number;
}

interface Recording {
  id: string;
  sessionId: string;
  channelId: number;
  timeseries: number[];
  spikeTimes: number[];
  createdAt: string;
}

export default function SignalQuality() {
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMockData = async () => {
      try {
        const [metricsRes, recordingsRes] = await Promise.all([
          fetch("/mock-data/quality-metrics.json"),
          fetch("/mock-data/recordings.json"),
        ]);

        const [metricsData, recordingsData] = await Promise.all([
          metricsRes.json(),
          recordingsRes.json(),
        ]);

        setQualityMetrics(metricsData);
        setRecordings(recordingsData);
      } catch (error) {
        console.error("Failed to load mock data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMockData();
  }, []);

  // Calculate quality metrics by type
  const snrMetrics = qualityMetrics.filter((m) => m.metricType === "snr");
  const noiseMetrics = qualityMetrics.filter(
    (m) => m.metricType === "noiseFloor"
  );
  const driftMetrics = qualityMetrics.filter((m) => m.metricType === "drift");
  const spikeMetrics = qualityMetrics.filter(
    (m) => m.metricType === "spikeAmplitude"
  );

  // Calculate statistics
  const avgSNR =
    snrMetrics.length > 0
      ? (snrMetrics.reduce((sum, m) => sum + m.value, 0) / snrMetrics.length).toFixed(2)
      : "0";
  const maxSNR =
    snrMetrics.length > 0
      ? Math.max(...snrMetrics.map((m) => m.value)).toFixed(2)
      : "0";
  const minSNR =
    snrMetrics.length > 0
      ? Math.min(...snrMetrics.map((m) => m.value)).toFixed(2)
      : "0";

  const avgNoise =
    noiseMetrics.length > 0
      ? (noiseMetrics.reduce((sum, m) => sum + m.value, 0) / noiseMetrics.length).toFixed(2)
      : "0";

  const avgDrift =
    driftMetrics.length > 0
      ? (driftMetrics.reduce((sum, m) => sum + m.value, 0) / driftMetrics.length).toFixed(2)
      : "0";

  const avgSpike =
    spikeMetrics.length > 0
      ? (spikeMetrics.reduce((sum, m) => sum + m.value, 0) / spikeMetrics.length).toFixed(2)
      : "0";

  // Channel quality distribution
  const channelQualityData = Array.from({ length: 20 }, (_, i) => ({
    channel: `Ch_${i * 13}`,
    snr: parseFloat((Math.random() * 10 + 2).toFixed(2)),
    noise: parseFloat((Math.random() * 50 + 10).toFixed(2)),
    drift: parseFloat((Math.random() * 100).toFixed(2)),
  }));

  // SNR distribution histogram
  const snrDistribution = Array.from({ length: 10 }, (_, i) => {
    const min = i;
    const max = i + 1;
    const count = snrMetrics.filter(
      (m) => m.value >= min && m.value < max
    ).length;
    return { range: `${min}-${max}dB`, count };
  });

  // Noise floor trend
  const noiseTrend = Array.from({ length: 15 }, (_, i) => ({
    time: `${i}h`,
    noise: parseFloat((Math.random() * 40 + 15).toFixed(2)),
    threshold: 30,
  }));

  // Drift analysis
  const driftAnalysis = Array.from({ length: 12 }, (_, i) => ({
    session: `S${i + 1}`,
    drift: parseFloat((Math.random() * 120).toFixed(2)),
    threshold: 80,
  }));

  // Quality heatmap data (channels x metrics) - for future use
  // const heatmapData = Array.from({ length: 16 }, (_, ch) => {
  //   const row: Record<string, string | number> = { channel: `Ch${ch}` };
  //   for (let m = 0; m < 16; m++) {
  //     row[`M${m}`] = Math.random() * 100;
  //   }
  //   return row;
  // });

  // Quality status
  const goodChannels = snrMetrics.filter((m) => m.value > 5).length;
  const fairChannels = snrMetrics.filter((m) => m.value > 2 && m.value <= 5).length;
  const poorChannels = snrMetrics.filter((m) => m.value <= 2).length;

  // const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Zap className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading signal quality data...</p>
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
            <Zap className="w-10 h-10 text-green-400" />
            Signal Quality Monitoring
          </h1>
          <p className="text-gray-400">
            Real-time neural recording quality assessment and drift detection
          </p>
        </div>

        {/* Quality Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Good Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{goodChannels}</div>
              <p className="text-xs text-gray-500 mt-1">SNR &gt; 5 dB</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                Fair Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{fairChannels}</div>
              <p className="text-xs text-gray-500 mt-1">2-5 dB SNR</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                Poor Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{poorChannels}</div>
              <p className="text-xs text-gray-500 mt-1">SNR &lt; 2 dB</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-purple-400" />
                Avg SNR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{avgSNR} dB</div>
              <p className="text-xs text-gray-500 mt-1">
                Range: {minSNR}-{maxSNR} dB
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-400">
                Noise Floor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{avgNoise} µV</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-400">
                Avg Drift
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{avgDrift} µm</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-400">
                Spike Amplitude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{avgSpike} µV</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-400">
                Total Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {snrMetrics.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* SNR Distribution */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">SNR Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={snrDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="range" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                  />
                  <Bar dataKey="count" fill="#2196F3" name="Channel Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Noise Floor Trend */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Noise Floor Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={noiseTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
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
                    dataKey="noise"
                    stroke="#FF9800"
                    name="Noise (µV)"
                  />
                  <Line
                    type="monotone"
                    dataKey="threshold"
                    stroke="#F44336"
                    strokeDasharray="5 5"
                    name="Threshold"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Drift Analysis */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Electrode Drift</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={driftAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="session" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="drift" fill="#4CAF50" name="Drift (µm)" />
                  <Bar dataKey="threshold" fill="#F44336" name="Threshold" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Channel Quality */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Channel Quality Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="snr" stroke="#94a3b8" name="SNR (dB)" />
                  <YAxis dataKey="noise" stroke="#94a3b8" name="Noise (µV)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  <Scatter
                    name="Channels"
                    data={channelQualityData}
                    fill="#2196F3"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quality Summary Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Quality Metrics Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 px-4 text-gray-400">Metric</th>
                    <th className="text-right py-2 px-4 text-gray-400">Average</th>
                    <th className="text-right py-2 px-4 text-gray-400">Min</th>
                    <th className="text-right py-2 px-4 text-gray-400">Max</th>
                    <th className="text-right py-2 px-4 text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700 hover:bg-slate-800">
                    <td className="py-2 px-4 text-gray-300">SNR</td>
                    <td className="text-right py-2 px-4 text-blue-400 font-semibold">
                      {avgSNR} dB
                    </td>
                    <td className="text-right py-2 px-4 text-gray-400">
                      {minSNR} dB
                    </td>
                    <td className="text-right py-2 px-4 text-gray-400">
                      {maxSNR} dB
                    </td>
                    <td className="text-right py-2 px-4">
                      <span className="inline-block px-2 py-1 bg-green-900 text-green-200 rounded text-xs">
                        Good
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700 hover:bg-slate-800">
                    <td className="py-2 px-4 text-gray-300">Noise Floor</td>
                    <td className="text-right py-2 px-4 text-blue-400 font-semibold">
                      {avgNoise} µV
                    </td>
                    <td className="text-right py-2 px-4 text-gray-400">10 µV</td>
                    <td className="text-right py-2 px-4 text-gray-400">60 µV</td>
                    <td className="text-right py-2 px-4">
                      <span className="inline-block px-2 py-1 bg-green-900 text-green-200 rounded text-xs">
                        Acceptable
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700 hover:bg-slate-800">
                    <td className="py-2 px-4 text-gray-300">Drift</td>
                    <td className="text-right py-2 px-4 text-green-400 font-semibold">
                      {avgDrift} µm
                    </td>
                    <td className="text-right py-2 px-4 text-gray-400">0 µm</td>
                    <td className="text-right py-2 px-4 text-gray-400">100 µm</td>
                    <td className="text-right py-2 px-4">
                      <span className="inline-block px-2 py-1 bg-green-900 text-green-200 rounded text-xs">
                        Stable
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800">
                    <td className="py-2 px-4 text-gray-300">Spike Amplitude</td>
                    <td className="text-right py-2 px-4 text-orange-400 font-semibold">
                      {avgSpike} µV
                    </td>
                    <td className="text-right py-2 px-4 text-gray-400">50 µV</td>
                    <td className="text-right py-2 px-4 text-gray-400">250 µV</td>
                    <td className="text-right py-2 px-4">
                      <span className="inline-block px-2 py-1 bg-green-900 text-green-200 rounded text-xs">
                        Healthy
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
