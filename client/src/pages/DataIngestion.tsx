import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, CheckCircle2, AlertCircle, Database, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { mockDataService, Session } from "@/lib/mockDataService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function DataIngestion() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<string>("timeseries");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await mockDataService.load();
        setSessions(mockDataService.getSessions());
        setStats(mockDataService.getStatistics());
      } catch (error) {
        console.error("Failed to load mock data:", error);
        toast.error("Failed to load mock data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`Selected: ${file.name}`);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    toast.info("Upload functionality coming soon");
  };

  // Task distribution data
  const taskDistribution = stats?.tasks?.map((task: string) => ({
    name: task,
    count: sessions.filter((s) => s.task === task).length,
  })) || [];

  // Quality distribution
  const qualityDistribution = [
    { name: "Good", value: sessions.filter((s) => s.metadata.quality === "good").length },
    { name: "Fair", value: sessions.filter((s) => s.metadata.quality === "fair").length },
    { name: "Poor", value: sessions.filter((s) => s.metadata.quality === "poor").length },
  ];

  const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Database className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-400">Loading ingestion data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Data Ingestion</h1>
          <p className="text-muted-foreground mt-2">
            Upload and validate neural timeseries data, session metadata, and experimental annotations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{stats?.totalSessions}</div>
              <p className="text-xs text-gray-500 mt-1">Loaded in system</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{Math.round(stats?.avgChannels * stats?.totalSessions)}</div>
              <p className="text-xs text-gray-500 mt-1">Across all sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Recordings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{stats?.totalRecordings}</div>
              <p className="text-xs text-gray-500 mt-1">Multi-channel data</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{stats?.totalEvents}</div>
              <p className="text-xs text-gray-500 mt-1">Experimental markers</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="schema">Schema Validation</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Distribution */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white">Task Distribution</CardTitle>
                  <CardDescription>Sessions by experimental task</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={taskDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                      <Bar dataKey="count" fill="#2196F3" name="Session Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Quality Distribution */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-white">Recording Quality</CardTitle>
                  <CardDescription>Distribution of session quality ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={qualityDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {qualityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Sessions Table */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Loaded Sessions</CardTitle>
                <CardDescription>All available sessions in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2 px-4 text-gray-400">Subject</th>
                        <th className="text-left py-2 px-4 text-gray-400">Date</th>
                        <th className="text-left py-2 px-4 text-gray-400">Task</th>
                        <th className="text-right py-2 px-4 text-gray-400">Duration (min)</th>
                        <th className="text-right py-2 px-4 text-gray-400">Channels</th>
                        <th className="text-left py-2 px-4 text-gray-400">Device</th>
                        <th className="text-left py-2 px-4 text-gray-400">Quality</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session) => (
                        <tr key={session.id} className="border-b border-slate-700 hover:bg-slate-800">
                          <td className="py-2 px-4 text-gray-300">{session.subject}</td>
                          <td className="py-2 px-4 text-gray-300">{session.date}</td>
                          <td className="py-2 px-4 text-gray-300">{session.task}</td>
                          <td className="text-right py-2 px-4 text-gray-300">{session.duration}</td>
                          <td className="text-right py-2 px-4 text-gray-300">{session.channels}</td>
                          <td className="py-2 px-4 text-gray-300">{session.metadata.implant}</td>
                          <td className="py-2 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                session.metadata.quality === "good"
                                  ? "bg-green-900 text-green-200"
                                  : session.metadata.quality === "fair"
                                  ? "bg-orange-900 text-orange-200"
                                  : "bg-red-900 text-red-200"
                              }`}
                            >
                              {session.metadata.quality}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Neural Data
                </CardTitle>
                <CardDescription>
                  Upload NWB-compatible files or Parquet datasets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file-input">Select File</Label>
                  <Input
                    id="file-input"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".nwb,.parquet,.h5"
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: NWB (.nwb), Parquet (.parquet), HDF5 (.h5)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-type">Data Type</Label>
                  <Select value={dataType} onValueChange={setDataType}>
                    <SelectTrigger id="data-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timeseries">Neural Timeseries</SelectItem>
                      <SelectItem value="events">Experimental Events</SelectItem>
                      <SelectItem value="metadata">Session Metadata</SelectItem>
                      <SelectItem value="spikes">Spike Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleUpload} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload & Validate
                </Button>

                {selectedFile && (
                  <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-green-200">{selectedFile.name} ready for upload</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schema Validation Tab */}
          <TabsContent value="schema" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Schema Validation
                </CardTitle>
                <CardDescription>
                  Validate data against NeuroAI schema specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-900/20 border border-green-700 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-200">Neural Timeseries Schema</p>
                      <p className="text-sm text-green-300">✓ Validated: {stats?.totalRecordings} recordings</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-900/20 border border-green-700 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-200">Event Annotations</p>
                      <p className="text-sm text-green-300">✓ Validated: {stats?.totalEvents} events</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-900/20 border border-green-700 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-200">Session Metadata</p>
                      <p className="text-sm text-green-300">✓ Validated: {stats?.totalSessions} sessions</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-900/20 border border-green-700 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-200">Quality Metrics</p>
                      <p className="text-sm text-green-300">✓ Validated: {stats?.totalQualityMetrics} metrics</p>
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
