import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Edit, Paperclip, Tag } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const mockRegistryEntries = [
  {
    id: 1,
    sessionId: "sess_001",
    device: "Neuropixels 2.0",
    notes: "Baseline motor task recording. Subject performed well, minimal artifacts.",
    tags: ["baseline", "motor", "clean"],
    attachments: ["protocol_v1.pdf"],
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    sessionId: "sess_002",
    device: "Neuropixels 2.0",
    notes: "Cognitive task with increased difficulty. Some movement artifacts in channels 45-50.",
    tags: ["cognitive", "artifacts"],
    attachments: [],
    createdAt: "2026-01-16",
  },
  {
    id: 3,
    sessionId: "sess_003",
    device: "Neuropixels 2.0",
    notes: "Follow-up motor task. Excellent signal quality across all channels.",
    tags: ["motor", "clean", "follow-up"],
    attachments: ["analysis_notes.txt"],
    createdAt: "2026-01-17",
  },
];

export default function LabRegistry() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddEntry = () => {
    toast.success("Entry added successfully");
    setIsAddDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Lab Registry</h1>
            <p className="text-muted-foreground mt-2">
              Centralized experiment registry with session notes, device metadata, and attachments
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Registry Entry</DialogTitle>
                <DialogDescription>
                  Document a new experimental session with notes and metadata
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-session-id">Session ID</Label>
                    <Input
                      id="new-session-id"
                      placeholder="e.g., sess_004"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-device">Device</Label>
                    <Select defaultValue="neuropixels">
                      <SelectTrigger id="new-device">
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neuropixels">Neuropixels 2.0</SelectItem>
                        <SelectItem value="utah">Utah Array</SelectItem>
                        <SelectItem value="ecog">ECoG Grid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-notes">Notes</Label>
                  <Textarea
                    id="new-notes"
                    placeholder="Experimental observations, signal quality, behavioral notes..."
                    className="bg-background min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-tags">Tags (comma-separated)</Label>
                  <Input
                    id="new-tags"
                    placeholder="e.g., baseline, motor, clean"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-attachments">Attachments</Label>
                  <Input
                    id="new-attachments"
                    type="file"
                    multiple
                    className="bg-background"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleAddEntry}
                  >
                    Add Entry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Total Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockRegistryEntries.length}</div>
              <p className="text-xs text-muted-foreground">Documented sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                Unique Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Classification labels</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-primary" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Supporting files</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Recording systems</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Registry Entries
            </CardTitle>
            <CardDescription>
              Complete experimental log with searchable notes and metadata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Attachments</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRegistryEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm">{entry.sessionId}</TableCell>
                    <TableCell className="text-sm">{entry.device}</TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate">{entry.notes}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.attachments.length > 0 ? (
                        <Badge variant="outline" className="text-xs">
                          {entry.attachments.length} file(s)
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{entry.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info("Edit functionality coming soon")}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
