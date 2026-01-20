import { describe, it, expect, beforeAll } from "vitest";
import { mockDataService } from "./mockDataService";

describe("Mock Data Service", () => {
  beforeAll(async () => {
    await mockDataService.load();
  });

  describe("Sessions", () => {
    it("should load sessions", () => {
      const sessions = mockDataService.getSessions();
      expect(sessions).toBeDefined();
      expect(Array.isArray(sessions)).toBe(true);
      expect(sessions.length).toBeGreaterThan(0);
    });

    it("should have valid session structure", () => {
      const sessions = mockDataService.getSessions();
      const session = sessions[0];

      expect(session).toHaveProperty("id");
      expect(session).toHaveProperty("subject");
      expect(session).toHaveProperty("date");
      expect(session).toHaveProperty("task");
      expect(session).toHaveProperty("duration");
      expect(session).toHaveProperty("channels");
      expect(session).toHaveProperty("samplingRate");
      expect(session).toHaveProperty("metadata");
    });

    it("should retrieve session by ID", () => {
      const sessions = mockDataService.getSessions();
      const firstSession = sessions[0];
      const retrieved = mockDataService.getSessionById(firstSession.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(firstSession.id);
    });

    it("should return undefined for non-existent session", () => {
      const retrieved = mockDataService.getSessionById("non_existent_id");
      expect(retrieved).toBeUndefined();
    });
  });

  describe("Recordings", () => {
    it("should load recordings", () => {
      const recordings = mockDataService.getRecordings();
      expect(recordings).toBeDefined();
      expect(Array.isArray(recordings)).toBe(true);
      expect(recordings.length).toBeGreaterThan(0);
    });

    it("should retrieve recordings by session", () => {
      const sessions = mockDataService.getSessions();
      const firstSession = sessions[0];
      const recordings = mockDataService.getRecordingsBySession(firstSession.id);

      expect(Array.isArray(recordings)).toBe(true);
      expect(recordings.every((r) => r.sessionId === firstSession.id)).toBe(true);
    });

    it("should have valid recording structure", () => {
      const recordings = mockDataService.getRecordings();
      const recording = recordings[0];

      expect(recording).toHaveProperty("id");
      expect(recording).toHaveProperty("sessionId");
      expect(recording).toHaveProperty("channelId");
      expect(recording).toHaveProperty("timeseries");
      expect(recording).toHaveProperty("spikeTimes");
      expect(Array.isArray(recording.timeseries)).toBe(true);
      expect(Array.isArray(recording.spikeTimes)).toBe(true);
    });
  });

  describe("Events", () => {
    it("should load events", () => {
      const events = mockDataService.getEvents();
      expect(events).toBeDefined();
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    it("should retrieve events by session", () => {
      const sessions = mockDataService.getSessions();
      const firstSession = sessions[0];
      const events = mockDataService.getEventsBySession(firstSession.id);

      expect(Array.isArray(events)).toBe(true);
      expect(events.every((e) => e.sessionId === firstSession.id)).toBe(true);
    });

    it("should have valid event structure", () => {
      const events = mockDataService.getEvents();
      const event = events[0];

      expect(event).toHaveProperty("id");
      expect(event).toHaveProperty("sessionId");
      expect(event).toHaveProperty("timestamp");
      expect(event).toHaveProperty("type");
      expect(event).toHaveProperty("duration");
      expect(typeof event.timestamp).toBe("number");
    });
  });

  describe("Quality Metrics", () => {
    it("should load quality metrics", () => {
      const metrics = mockDataService.getQualityMetrics();
      expect(metrics).toBeDefined();
      expect(Array.isArray(metrics)).toBe(true);
      expect(metrics.length).toBeGreaterThan(0);
    });

    it("should have valid metric structure", () => {
      const metrics = mockDataService.getQualityMetrics();
      const metric = metrics[0];

      expect(metric).toHaveProperty("id");
      expect(metric).toHaveProperty("recordingId");
      expect(metric).toHaveProperty("metricType");
      expect(metric).toHaveProperty("value");
      expect(typeof metric.value).toBe("number");
    });
  });

  describe("Features", () => {
    it("should load features", () => {
      const features = mockDataService.getFeatures();
      expect(features).toBeDefined();
      expect(Array.isArray(features)).toBe(true);
      expect(features.length).toBeGreaterThan(0);
    });

    it("should have valid feature structure", () => {
      const features = mockDataService.getFeatures();
      const feature = features[0];

      expect(feature).toHaveProperty("id");
      expect(feature).toHaveProperty("recordingId");
      expect(feature).toHaveProperty("featureType");
      expect(feature).toHaveProperty("values");
      expect(Array.isArray(feature.values)).toBe(true);
    });
  });

  describe("Training Runs", () => {
    it("should load training runs", () => {
      const runs = mockDataService.getTrainingRuns();
      expect(runs).toBeDefined();
      expect(Array.isArray(runs)).toBe(true);
      expect(runs.length).toBeGreaterThan(0);
    });

    it("should have valid training run structure", () => {
      const runs = mockDataService.getTrainingRuns();
      const run = runs[0];

      expect(run).toHaveProperty("id");
      expect(run).toHaveProperty("name");
      expect(run).toHaveProperty("model");
      expect(run).toHaveProperty("accuracy");
      expect(run).toHaveProperty("loss");
      expect(run).toHaveProperty("epochs");
      expect(typeof run.accuracy).toBe("number");
      expect(typeof run.loss).toBe("number");
      expect(run.accuracy).toBeGreaterThan(0);
      expect(run.accuracy).toBeLessThanOrEqual(1);
    });
  });

  describe("Registry Entries", () => {
    it("should load registry entries", () => {
      const entries = mockDataService.getRegistryEntries();
      expect(entries).toBeDefined();
      expect(Array.isArray(entries)).toBe(true);
      expect(entries.length).toBeGreaterThan(0);
    });

    it("should have valid registry entry structure", () => {
      const entries = mockDataService.getRegistryEntries();
      const entry = entries[0];

      expect(entry).toHaveProperty("id");
      expect(entry).toHaveProperty("sessionId");
      expect(entry).toHaveProperty("device");
      expect(entry).toHaveProperty("notes");
      expect(entry).toHaveProperty("tags");
      expect(entry).toHaveProperty("attachments");
      expect(Array.isArray(entry.tags)).toBe(true);
      expect(Array.isArray(entry.attachments)).toBe(true);
    });
  });

  describe("Statistics", () => {
    it("should generate valid statistics", () => {
      const stats = mockDataService.getStatistics();

      expect(stats).toHaveProperty("subjects");
      expect(stats).toHaveProperty("tasks");
      expect(Array.isArray(stats.subjects)).toBe(true);
      expect(Array.isArray(stats.tasks)).toBe(true);
      expect(stats.subjects.length).toBeGreaterThan(0);
      expect(stats.tasks.length).toBeGreaterThan(0);
    });
  });

  describe("Data Consistency", () => {
    it("should have consistent session and recording counts", () => {
      const sessions = mockDataService.getSessions();
      const recordings = mockDataService.getRecordings();

      // Each session should have at least one recording
      const sessionIds = new Set(sessions.map((s) => s.id));
      const recordingSessionIds = new Set(recordings.map((r) => r.sessionId));

      expect(recordingSessionIds.size).toBeGreaterThan(0);
      recordingSessionIds.forEach((id) => {
        expect(sessionIds.has(id)).toBe(true);
      });
    });

    it("should have consistent session and event counts", () => {
      const sessions = mockDataService.getSessions();
      const events = mockDataService.getEvents();

      const sessionIds = new Set(sessions.map((s) => s.id));
      const eventSessionIds = new Set(events.map((e) => e.sessionId));

      eventSessionIds.forEach((id) => {
        expect(sessionIds.has(id)).toBe(true);
      });
    });
  });
});
