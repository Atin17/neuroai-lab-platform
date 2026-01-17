import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, CheckCircle2, AlertCircle, Database } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DataIngestion() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<string>("timeseries");

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Data Ingestion</h1>
          <p className="text-muted-foreground mt-2">
            Upload and validate neural timeseries data, session metadata, and experimental annotations
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="schema">Schema Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Neural Data
                </CardTitle>
                <CardDescription>
                  Select data type and upload files in supported formats (NWB, Parquet, JSON)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="data-type">Data Type</Label>
                  <Select value={dataType} onValueChange={setDataType}>
                    <SelectTrigger id="data-type">
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timeseries">Neural Timeseries</SelectItem>
                      <SelectItem value="metadata">Session Metadata</SelectItem>
                      <SelectItem value="events">Events & Annotations</SelectItem>
                      <SelectItem value="images">Histology Images</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">File Upload</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileSelect}
                      accept=".nwb,.parquet,.json,.png,.jpg,.jpeg"
                      className="flex-1"
                    />
                    <Button onClick={handleUpload} className="bg-primary hover:bg-primary/90">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Validated Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Ready for processing</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    Pending Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Awaiting validation</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    Total Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0 GB</div>
                  <p className="text-xs text-muted-foreground">Across all datasets</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schema" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Schema Definitions</CardTitle>
                <CardDescription>
                  Validation rules for neural data formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Neural Timeseries Schema</h4>
                  <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "session_id": "string (required)",
  "subject_id": "string (required)",
  "timestamp": "datetime (required)",
  "channels": "array<float> (required)",
  "sampling_rate": "number (required)",
  "units": "string (optional)"
}`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Session Metadata Schema</h4>
                  <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "session_id": "string (required)",
  "date": "datetime (required)",
  "task": "string (required)",
  "subject": "string (required)",
  "experimenter": "string (optional)",
  "notes": "string (optional)"
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
