import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from "recharts";
import { Activity, BarChart3, TrendingUp } from "lucide-react";

const mockTimeseriesData = Array.from({ length: 100 }, (_, i) => ({
  time: i * 0.01,
  channel1: Math.sin(i * 0.2) * 50 + Math.random() * 20,
  channel2: Math.cos(i * 0.15) * 40 + Math.random() * 15,
  channel3: Math.sin(i * 0.25) * 60 + Math.random() * 25,
}));

const mockBandpowerData = [
  { band: "Delta", power: 45 },
  { band: "Theta", power: 62 },
  { band: "Alpha", power: 78 },
  { band: "Beta", power: 55 },
  { band: "Gamma", power: 38 },
];

const mockDistributionData = Array.from({ length: 50 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
}));

export default function Visualization() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Visualization Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Interactive neural timeseries viewer with event overlays and distribution analysis
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="session-select">Session</Label>
            <Select defaultValue="sess_001">
              <SelectTrigger id="session-select">
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sess_001">sess_001 - subject_A</SelectItem>
                <SelectItem value="sess_002">sess_002 - subject_B</SelectItem>
                <SelectItem value="sess_003">sess_003 - subject_A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-select">Channel Group</Label>
            <Select defaultValue="group1">
              <SelectTrigger id="channel-select">
                <SelectValue placeholder="Select channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="group1">Channels 1-3</SelectItem>
                <SelectItem value="group2">Channels 4-6</SelectItem>
                <SelectItem value="all">All Channels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="window-select">Time Window</Label>
            <Select defaultValue="1s">
              <SelectTrigger id="window-select">
                <SelectValue placeholder="Select window" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1s">1 second</SelectItem>
                <SelectItem value="5s">5 seconds</SelectItem>
                <SelectItem value="10s">10 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Neural Timeseries
            </CardTitle>
            <CardDescription>
              Multi-channel recording with event markers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTimeseriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 240)" />
                <XAxis
                  dataKey="time"
                  label={{ value: "Time (s)", position: "insideBottom", offset: -5 }}
                  stroke="oklch(0.65 0.01 240)"
                />
                <YAxis
                  label={{ value: "Amplitude (μV)", angle: -90, position: "insideLeft" }}
                  stroke="oklch(0.65 0.01 240)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.16 0.02 240)",
                    border: "1px solid oklch(0.25 0.02 240)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line type="monotone" dataKey="channel1" stroke="oklch(0.65 0.22 240)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="channel2" stroke="oklch(0.7 0.2 200)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="channel3" stroke="oklch(0.6 0.18 180)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-2 mt-4">
              <Badge variant="outline" className="border-[oklch(0.65_0.22_240)] text-[oklch(0.65_0.22_240)]">
                Channel 1
              </Badge>
              <Badge variant="outline" className="border-[oklch(0.7_0.2_200)] text-[oklch(0.7_0.2_200)]">
                Channel 2
              </Badge>
              <Badge variant="outline" className="border-[oklch(0.6_0.18_180)] text-[oklch(0.6_0.18_180)]">
                Channel 3
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Bandpower Analysis
              </CardTitle>
              <CardDescription>
                Power spectral density across frequency bands
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockBandpowerData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 240)" />
                  <XAxis dataKey="band" stroke="oklch(0.65 0.01 240)" />
                  <YAxis stroke="oklch(0.65 0.01 240)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.02 240)",
                      border: "1px solid oklch(0.25 0.02 240)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="power" fill="oklch(0.6 0.2 240)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Signal Distribution
              </CardTitle>
              <CardDescription>
                Amplitude distribution and drift analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 240)" />
                  <XAxis type="number" dataKey="x" stroke="oklch(0.65 0.01 240)" />
                  <YAxis type="number" dataKey="y" stroke="oklch(0.65 0.01 240)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.02 240)",
                      border: "1px solid oklch(0.25 0.02 240)",
                      borderRadius: "0.5rem",
                    }}
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  <Scatter data={mockDistributionData} fill="oklch(0.6 0.2 240)" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Event Markers</CardTitle>
            <CardDescription>
              Experimental events and annotations aligned to timeseries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold text-sm">Stimulus Onset</p>
                  <p className="text-xs text-muted-foreground">t = 0.25s</p>
                </div>
                <Badge className="bg-green-600">Event</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold text-sm">Response Window</p>
                  <p className="text-xs text-muted-foreground">t = 0.45s - 0.65s</p>
                </div>
                <Badge className="bg-blue-600">Interval</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold text-sm">Trial End</p>
                  <p className="text-xs text-muted-foreground">t = 0.95s</p>
                </div>
                <Badge className="bg-yellow-600">Marker</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
