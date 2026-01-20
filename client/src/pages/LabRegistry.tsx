import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Edit, Paperclip, Tag, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { mockDataService, Session, RegistryEntry } from "@/lib/mockDataService";

export default function LabRegistry() {
  const [registryEntries, setRegistryEntries] = useState<RegistryEntry[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [newEntry, setNewEntry] = useState({
    sessionId: "",
    device: "",
    notes: "",
    tags: [] as string[],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await mockDataService.load();
        const entries = mockDataService.getRegistryEntries();
        setRegistryEntries(entries);
        const allSessions = mockDataService.getSessions();
        setSessions(allSessions);
      } catch (error) {
        console.error("Failed to load mock data:", error);
        toast.error("Failed to load mock data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get all unique tags
  const allTags = Array.from(
    new Set(registryEntries.flatMap((entry) => entry.tags || []))
  );

  // Filter entries
  const filteredEntries = registryEntries.filter((entry) => {
    const search = (searchTerm || "").toLowerCase();
    const sessionId = (entry.sessionId || "").toLowerCase();
    const notes = (entry.notes || "").toLowerCase();
    const device = (entry.device || "").toLowerCase();
    
    const matchesSearch =
      sessionId.includes(search) ||
      notes.includes(search) ||
      device.includes(search);

    const matchesTag = selectedTag === "all" || (entry.tags && entry.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  const handleAddEntry = () => {
    if (!newEntry.sessionId || !newEntry.device || !newEntry.notes) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Entry added successfully");
    setIsAddDialogOpen(false);
    setNewEntry({
      sessionId: "",
      device: "",
      notes: "",
      tags: [],
    });
  };

  const handleDeleteEntry = (id: string) => {
    toast.success("Entry deleted");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <BookOpen className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-400">Loading registry data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Lab Registry</h1>
          <p className="text-muted-foreground mt-2">
            Centralized experiment registry with session documentation, notes, and device tracking
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{registryEntries.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Unique Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {new Set(registryEntries.map((e) => e.device)).size}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{allTags.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">With Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">
                {registryEntries.filter((e) => e.attachments && e.attachments.length > 0).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Entries</Label>
                <Input
                  id="search"
                  placeholder="Session ID, device, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag-filter">Filter by Tag</Label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger id="tag-filter" className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add Registry Entry</DialogTitle>
                      <DialogDescription>
                        Create a new experiment registry entry with session documentation
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="session-id">Session ID</Label>
                        <Select value={newEntry.sessionId} onValueChange={(val) => setNewEntry({ ...newEntry, sessionId: val })}>
                          <SelectTrigger id="session-id" className="bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Select session" />
                          </SelectTrigger>
                          <SelectContent>
                            {sessions.map((session) => (
                              <SelectItem key={session.id} value={session.id}>
                                {session.id} - {session.subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="device">Device</Label>
                        <Input
                          id="device"
                          placeholder="e.g., Neuropixels 2.0"
                          value={newEntry.device}
                          onChange={(e) => setNewEntry({ ...newEntry, device: e.target.value })}
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Session notes and observations..."
                          value={newEntry.notes}
                          onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                          className="bg-slate-800 border-slate-700"
                          rows={4}
                        />
                      </div>

                      <Button onClick={handleAddEntry} className="w-full">
                        Create Entry
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registry Entries */}
        <div className="space-y-4">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <Card key={entry.id} className="bg-card border-border hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{entry.sessionId}</CardTitle>
                      <CardDescription className="mt-1">
                        Device: {entry.device} • Created: {new Date(entry.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Notes</p>
                    <p className="text-gray-300">{entry.notes}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(entry.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-blue-900 text-blue-200">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {entry.attachments && entry.attachments.length > 0 && (
                    <div className="p-3 bg-slate-800 rounded border border-slate-700">
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        Attachments
                      </p>
                      <div className="space-y-1">
                        {(entry.attachments || []).map((attachment, idx) => (
                          <p key={idx} className="text-sm text-blue-400 hover:underline cursor-pointer">
                            {attachment}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-8">
                <p className="text-center text-gray-400">No entries found matching your filters</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Device Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Device Summary</CardTitle>
            <CardDescription>Recording devices used in registry entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from(new Set(registryEntries.map((e) => e.device))).map((device) => (
                <div key={device} className="p-3 bg-slate-800 rounded border border-slate-700">
                  <p className="font-semibold text-white">{device}</p>
                  <p className="text-sm text-gray-400">
                    {registryEntries.filter((e) => e.device === device).length} sessions
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
