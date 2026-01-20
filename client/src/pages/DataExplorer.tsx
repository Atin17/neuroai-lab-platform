import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { mockDataService, Session } from "@/lib/mockDataService";
import { toast } from "sonner";

export default function DataExplorer() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterTask, setFilterTask] = useState("all");
  const [filterQuality, setFilterQuality] = useState("all");
  const [stats, setStats] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await mockDataService.load();
        const allSessions = mockDataService.getSessions();
        setSessions(allSessions);
        setFilteredSessions(allSessions);
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

  // Apply filters
  useEffect(() => {
    let filtered = sessions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.date.includes(searchTerm)
      );
    }

    // Subject filter
    if (filterSubject !== "all") {
      filtered = filtered.filter((s) => s.subject === filterSubject);
    }

    // Task filter
    if (filterTask !== "all") {
      filtered = filtered.filter((s) => s.task === filterTask);
    }

    // Quality filter
    if (filterQuality !== "all") {
      filtered = filtered.filter((s) => s.metadata.quality === filterQuality);
    }

    setFilteredSessions(filtered);
  }, [searchTerm, filterSubject, filterTask, filterQuality, sessions]);

  const handleDownload = (session: Session) => {
    toast.success(`Downloading session ${session.id}`);
  };

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    toast.success(`Viewing details for ${session.subject}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Search className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-400">Loading data explorer...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Data Explorer</h1>
          <p className="text-muted-foreground mt-2">
            Query and filter recording sessions with advanced search capabilities
          </p>
        </div>

        {/* Filter Panel */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Sessions</Label>
                <Input
                  id="search"
                  placeholder="Subject, ID, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger id="subject" className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {stats?.subjects?.map((subject: string) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task">Task</Label>
                <Select value={filterTask} onValueChange={setFilterTask}>
                  <SelectTrigger id="task" className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    {stats?.tasks?.map((task: string) => (
                      <SelectItem key={task} value={task}>
                        {task}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality">Quality</Label>
                <Select value={filterQuality} onValueChange={setFilterQuality}>
                  <SelectTrigger id="quality" className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Quality</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterSubject("all");
                    setFilterTask("all");
                    setFilterQuality("all");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredSessions.length}</span> of{" "}
            <span className="font-semibold text-foreground">{sessions.length}</span> sessions
          </p>
        </div>

        {/* Sessions Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white">Recording Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Subject</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Task</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Duration (min)</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Channels</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Device</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Quality</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Operator</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                      <tr key={session.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                        <td className="py-3 px-4 text-gray-300 font-medium">{session.subject}</td>
                        <td className="py-3 px-4 text-gray-300">{session.date}</td>
                        <td className="py-3 px-4 text-gray-300">{session.task}</td>
                        <td className="text-right py-3 px-4 text-gray-300">{session.duration}</td>
                        <td className="text-right py-3 px-4 text-gray-300">{session.channels}</td>
                        <td className="py-3 px-4 text-gray-300">{session.metadata.implant}</td>
                        <td className="py-3 px-4">
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
                        <td className="py-3 px-4 text-gray-300">{session.metadata.operator}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(session)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownload(session)}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 px-4 text-center text-gray-400">
                        No sessions found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Session Details Panel */}
        {selectedSession && (
          <Card className="bg-card border-border border-blue-500">
            <CardHeader>
              <CardTitle className="text-white">Session Details</CardTitle>
              <CardDescription>{selectedSession.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Subject</p>
                  <p className="text-lg font-semibold text-white">{selectedSession.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-lg font-semibold text-white">{selectedSession.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Task</p>
                  <p className="text-lg font-semibold text-white">{selectedSession.task}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-lg font-semibold text-white">{selectedSession.duration} min</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Channels</p>
                  <p className="text-lg font-semibold text-white">{selectedSession.channels}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Sampling Rate</p>
                  <p className="text-lg font-semibold text-white">{selectedSession.samplingRate} Hz</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Device</p>
                  <p className="text-lg font-semibold text-white">{selectedSession.metadata.implant}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Operator</p>
                  <p className="text-lg font-semibold text-white">{selectedSession.metadata.operator}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
