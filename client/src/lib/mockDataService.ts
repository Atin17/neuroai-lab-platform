/**
 * Centralized Mock Data Service
 * Provides access to all mock neural data across the platform
 */

export interface Session {
  id: string;
  subject: string;
  date: string;
  task: string;
  duration: number;
  channels: number;
  samplingRate: number;
  metadata: {
    implant: string;
    operator: string;
    quality: string;
  };
  createdAt: string;
}

export interface Recording {
  id: string;
  sessionId: string;
  channelId: number;
  timeseries: number[];
  spikeTimes: number[];
  createdAt: string;
}

export interface Event {
  id: string;
  sessionId: string;
  timestamp: number;
  type: string;
  duration: number;
  metadata: Record<string, unknown>;
}

export interface QualityMetric {
  id: string;
  recordingId: string;
  metricType: string;
  value: number;
  timestamp: number;
}

export interface Feature {
  id: string;
  recordingId: string;
  featureType: string;
  values: number[];
  window: { start: number; end: number };
}

export interface TrainingRun {
  id: string;
  name: string;
  model: string;
  accuracy: number;
  loss: number;
  epochs: number;
  timestamp: string;
}

export interface RegistryEntry {
  id: string;
  sessionId: string;
  device: string;
  notes: string;
  tags: string[];
  attachments: string[];
  createdAt: string;
}

class MockDataService {
  private sessions: Session[] = [];
  private recordings: Recording[] = [];
  private events: Event[] = [];
  private qualityMetrics: QualityMetric[] = [];
  private features: Feature[] = [];
  private trainingRuns: TrainingRun[] = [];
  private registryEntries: RegistryEntry[] = [];
  private isLoaded = false;

  async load(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const [
        sessionsRes,
        recordingsRes,
        eventsRes,
        metricsRes,
        featuresRes,
        runsRes,
        registryRes,
      ] = await Promise.all([
        fetch("/mock-data/sessions.json"),
        fetch("/mock-data/recordings.json"),
        fetch("/mock-data/events.json"),
        fetch("/mock-data/quality-metrics.json"),
        fetch("/mock-data/features.json"),
        fetch("/mock-data/training-runs.json"),
        fetch("/mock-data/registry-entries.json"),
      ]);

      this.sessions = await sessionsRes.json();
      this.recordings = await recordingsRes.json();
      this.events = await eventsRes.json();
      this.qualityMetrics = await metricsRes.json();
      this.features = await featuresRes.json();
      this.trainingRuns = await runsRes.json();
      this.registryEntries = await registryRes.json();
      this.isLoaded = true;
    } catch (error) {
      console.error("Failed to load mock data:", error);
      throw error;
    }
  }

  // Session queries
  getSessions(): Session[] {
    return this.sessions;
  }

  getSessionById(id: string): Session | undefined {
    return this.sessions.find((s) => s.id === id);
  }

  getSessionsBySubject(subject: string): Session[] {
    return this.sessions.filter((s) => s.subject === subject);
  }

  getSessionsByTask(task: string): Session[] {
    return this.sessions.filter((s) => s.task === task);
  }

  getSessionsByDateRange(startDate: string, endDate: string): Session[] {
    return this.sessions.filter(
      (s) => s.date >= startDate && s.date <= endDate
    );
  }

  // Recording queries
  getRecordings(): Recording[] {
    return this.recordings;
  }

  getRecordingsBySession(sessionId: string): Recording[] {
    return this.recordings.filter((r) => r.sessionId === sessionId);
  }

  getRecordingsByChannel(channelId: number): Recording[] {
    return this.recordings.filter((r) => r.channelId === channelId);
  }

  // Event queries
  getEvents(): Event[] {
    return this.events;
  }

  getEventsBySession(sessionId: string): Event[] {
    return this.events.filter((e) => e.sessionId === sessionId);
  }

  getEventsByType(type: string): Event[] {
    return this.events.filter((e) => e.type === type);
  }

  // Quality metrics queries
  getQualityMetrics(): QualityMetric[] {
    return this.qualityMetrics;
  }

  getQualityMetricsByRecording(recordingId: string): QualityMetric[] {
    return this.qualityMetrics.filter((m) => m.recordingId === recordingId);
  }

  getQualityMetricsByType(metricType: string): QualityMetric[] {
    return this.qualityMetrics.filter((m) => m.metricType === metricType);
  }

  getAverageQualityMetric(metricType: string): number {
    const metrics = this.getQualityMetricsByType(metricType);
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  // Feature queries
  getFeatures(): Feature[] {
    return this.features;
  }

  getFeaturesByRecording(recordingId: string): Feature[] {
    return this.features.filter((f) => f.recordingId === recordingId);
  }

  getFeaturesByType(featureType: string): Feature[] {
    return this.features.filter((f) => f.featureType === featureType);
  }

  // Training run queries
  getTrainingRuns(): TrainingRun[] {
    return this.trainingRuns;
  }

  getBestTrainingRun(): TrainingRun | undefined {
    return this.trainingRuns.reduce((best, current) =>
      current.accuracy > (best?.accuracy || 0) ? current : best
    );
  }

  // Registry queries
  getRegistryEntries(): RegistryEntry[] {
    return this.registryEntries;
  }

  getRegistryEntriesBySession(sessionId: string): RegistryEntry[] {
    return this.registryEntries.filter((r) => r.sessionId === sessionId);
  }

  // Statistics
  getStatistics() {
    return {
      totalSessions: this.sessions.length,
      totalRecordings: this.recordings.length,
      totalEvents: this.events.length,
      totalQualityMetrics: this.qualityMetrics.length,
      totalFeatures: this.features.length,
      totalTrainingRuns: this.trainingRuns.length,
      totalRegistryEntries: this.registryEntries.length,
      subjects: Array.from(new Set(this.sessions.map((s) => s.subject))),
      tasks: Array.from(new Set(this.sessions.map((s) => s.task))),
      devices: Array.from(new Set(this.sessions.map((s) => s.metadata.implant))),
      avgSessionDuration:
        this.sessions.reduce((sum, s) => sum + s.duration, 0) /
        this.sessions.length,
      avgChannels:
        this.sessions.reduce((sum, s) => sum + s.channels, 0) /
        this.sessions.length,
    };
  }

  // Data aggregation
  getSessionMetrics(sessionId: string) {
    const session = this.getSessionById(sessionId);
    if (!session) return null;

    const recordings = this.getRecordingsBySession(sessionId);
    const events = this.getEventsBySession(sessionId);
    const metrics = recordings.flatMap((r) =>
      this.getQualityMetricsByRecording(r.id)
    );

    return {
      session,
      recordingCount: recordings.length,
      eventCount: events.length,
      avgSNR: this.getAverageQualityMetric("snr"),
      avgNoise: this.getAverageQualityMetric("noiseFloor"),
      avgDrift: this.getAverageQualityMetric("drift"),
      avgSpikeAmplitude: this.getAverageQualityMetric("spikeAmplitude"),
      metrics,
    };
  }

  // Task analysis
  getTaskAnalysis() {
    const tasks = Array.from(new Set(this.sessions.map((s) => s.task)));
    return tasks.map((task) => ({
      task,
      count: this.getSessionsByTask(task).length,
      avgDuration:
        this.getSessionsByTask(task).reduce((sum, s) => sum + s.duration, 0) /
        this.getSessionsByTask(task).length,
    }));
  }

  // Subject analysis
  getSubjectAnalysis() {
    const subjects = Array.from(new Set(this.sessions.map((s) => s.subject)));
    return subjects.map((subject) => ({
      subject,
      count: this.getSessionsBySubject(subject).length,
      tasks: Array.from(
        new Set(this.getSessionsBySubject(subject).map((s) => s.task))
      ),
    }));
  }
}

// Singleton instance
export const mockDataService = new MockDataService();
