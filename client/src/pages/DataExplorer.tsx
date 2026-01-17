import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye } from "lucide-react";
import { toast } from "sonner";

const mockSessions = [
  {
    id: "sess_001",
    subject: "subject_A",
    date: "2026-01-15",
    task: "motor_task",
    channels: 64,
    duration: "45 min",
    status: "validated",
  },
  {
    id: "sess_002",
    subject: "subject_B",
    date: "2026-01-16",
    task: "cognitive_task",
    channels: 128,
    duration: "60 min",
    status: "processing",
  },
  {
    id: "sess_003",
    subject: "subject_A",
    date: "2026-01-17",
    task: "motor_task",
    channels: 64,
    duration: "50 min",
    status: "validated",
  },
];

export default function DataExplorer() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Data Explorer</h1>
          <p className="text-muted-foreground mt-2">
            Query and filter neural recording sessions by subject, date, task, and metadata
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search & Filter
            </CardTitle>
            <CardDescription>
              Find specific sessions using advanced filtering criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="subject-filter">Subject ID</Label>
                <Input
                  id="subject-filter"
                  placeholder="e.g., subject_A"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-filter">Task Type</Label>
                <Input
                  id="task-filter"
                  placeholder="e.g., motor_task"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-filter">Date Range</Label>
                <Input
                  id="date-filter"
                  type="date"
                  className="bg-background"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="bg-primary hover:bg-primary/90">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button variant="outline">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Recording Sessions</CardTitle>
            <CardDescription>
              {mockSessions.length} sessions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Channels</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-mono text-sm">{session.id}</TableCell>
                    <TableCell>{session.subject}</TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{session.task}</TableCell>
                    <TableCell>{session.channels}</TableCell>
                    <TableCell>{session.duration}</TableCell>
                    <TableCell>
                      <Badge
                        variant={session.status === "validated" ? "default" : "secondary"}
                        className={session.status === "validated" ? "bg-green-600" : ""}
                      >
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info("View functionality coming soon")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info("Download functionality coming soon")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Feature Extraction</CardTitle>
            <CardDescription>
              Extract windowed features from selected sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Bandpower Analysis</h4>
                <p className="text-xs text-muted-foreground">
                  Extract power spectral density across frequency bands (delta, theta, alpha, beta, gamma)
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Spike Detection</h4>
                <p className="text-xs text-muted-foreground">
                  Identify and quantify neural spike events using threshold-based detection
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">RMS Envelope</h4>
                <p className="text-xs text-muted-foreground">
                  Calculate root mean square amplitude over sliding time windows
                </p>
              </div>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => toast.info("Feature extraction coming soon")}
            >
              Run Feature Extraction
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
