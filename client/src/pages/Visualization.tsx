import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, ComposedChart } from "recharts";
import { Activity, BarChart3, TrendingUp, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { mockDataService, Session, Recording, Event } from "@/lib/mockDataService";
import { toast } from "sonner";

export default function Visualization() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        await mockDataService.load();
        const allSessions = mockDataService.getSessions();
        setSessions(allSessions);
        if (allSessions.length > 0) {
          const firstSession = allSessions[0];
          setSelectedSessionId(firstSession.id);
          setSelectedSession(firstSession);
          const sessionRecordings = mockDataService.getRecordingsBySession(firstSession.id);
          setRecordings(sessionRecordings);
          const sessionEvents = mockDataService.getEventsBySession(firstSession.id);
          setEvents(sessionEvents);
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

  const handleSessionChange = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    const session = mockDataService.getSessionById(sessionId);
    if (session) {
      setSelectedSession(session);
      const sessionRecordings = mockDataService.getRecordingsBySession(sessionId);
      setRecordings(sessionRecordings);
      const sessionEvents = mockDataService.getEventsBySession(sessionId);
      setEvents(sessionEvents);
      setSelectedChannel(1);
    }
  };

  // Generate timeseries visualization data
  const generateTimeseriesData = () => {
    if (recordings.length === 0) return [];
    const channelRecordings = recordings.filter((r) => r.channelId === selectedChannel);
    if (channelRecordings.length === 0) return [];
    
    const recording = channelRecordings[0];
    return recording.timeseries.slice(0, 200).map((value, index) => ({
      time: (index * 0.001).toFixed(3),
      amplitude: value,
    }));
  };

  // Generate bandpower data
  const generateBandpowerData = () => {
    const bands = ["Delta", "Theta", "Alpha", "Beta", "Gamma"];
    return bands.map((band, index) => ({
      band,
      power: Math.random() * 100,
      frequency: 5 + index * 5,
    }));
  };

  // Generate spike raster data
  const generateSpikeRasterData = () => {
    if (recordings.length === 0) return [];
    return recordings.slice(0, 16).map((recording, index) => ({
      channel: index + 1,
      spikes: recording.spikeTimes.length,
      firingRate: (recording.spikeTimes.length / (selectedSession?.duration || 30)).toFixed(2),
    }));
  };

  // Generate event timeline
  const generateEventTimeline = () => {
    return events.slice(0, 10).map((event, index) => ({
      time: event.timestamp,
      type: event.type,
      index: index,
    }));
  };

  const timeseriesData = generateTimeseriesData();
  const bandpowerData = generateBandpowerData();
  const spikeRasterData = generateSpikeRasterData();
  const eventTimeline = generateEventTimeline();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-400">Loading visualization data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Visualization Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Interactive neural timeseries viewer with event overlays and spectral analysis
          </p>
        </div>

        {/* Session and Channel Selection */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="session-select">Session</Label>
            <Select value={selectedSessionId} onValueChange={handleSessionChange}>
              <SelectTrigger id="session-select">
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.subject} - {session.task} ({session.date})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-select">Channel</Label>
            <Select value={selectedChannel.toString()} onValueChange={(val) => setSelectedChannel(parseInt(val))}>
              <SelectTrigger id="channel-select">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: Math.min(16, selectedSession?.channels || 1) }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Channel {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSession && (
            <div className="space-y-2">
              <Label>Session Info</Label>
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-xs text-gray-400">
                  {selectedSession.channels} channels • {selectedSession.samplingRate / 1000}kHz • {selectedSession.duration}min
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Timeseries Viewer */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Neural Timeseries
            </CardTitle>
            <CardDescription>Raw recording data with event markers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={timeseriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Line
                  type="monotone"
                  dataKey="amplitude"
                  stroke="#2196F3"
                  dot={false}
                  isAnimationActive={false}
                  name="Amplitude (µV)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spectral Analysis and Spike Raster */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bandpower Analysis */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Bandpower Analysis
              </CardTitle>
              <CardDescription>Power spectral density across frequency bands</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bandpowerData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="band" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                  <Bar dataKey="power" fill="#10B981" name="Power (dB)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Spike Raster */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Spike Activity
              </CardTitle>
              <CardDescription>Spike counts and firing rates per channel</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={spikeRasterData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="channel" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                  <Bar dataKey="spikes" fill="#F59E0B" name="Spike Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Event Timeline */}
        {eventTimeline.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Event Timeline
              </CardTitle>
              <CardDescription>{events.length} experimental events detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {eventTimeline.map((event, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 bg-slate-800 rounded">
                    <div className="text-sm font-mono text-gray-400">{event.time.toFixed(2)}s</div>
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-900 text-blue-200">
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        {selectedSession && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Recordings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{recordings.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Events Detected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{events.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Avg Spike Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  {(
                    recordings.reduce((sum, r) => sum + r.spikeTimes.length, 0) /
                    recordings.length /
                    (selectedSession.duration / 60)
                  ).toFixed(1)}
                  Hz
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    selectedSession.metadata.quality === "good"
                      ? "text-green-400"
                      : selectedSession.metadata.quality === "fair"
                      ? "text-orange-400"
                      : "text-red-400"
                  }`}
                >
                  {selectedSession.metadata.quality}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
