/**
 * Mock Neural Data Generator
 * Generates realistic neural data for testing and demonstration
 */

import { writeFileSync, mkdirSync } from "fs";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Neural data generation utilities
const SUBJECTS = ["Subject_A", "Subject_B", "Subject_C"];
const TASKS = ["motor_imagery", "speech_decoding", "visual_processing", "rest"];
const DEVICES = ["N1_Array", "N2_Array", "Utah_Array"];
const OPERATORS = ["Dr. Kaur", "Dr. Chen", "Dr. Patel", "Dr. Williams"];

// Generate realistic neural timeseries data
function generateNeuralTimeseries(duration, samplingRate) {
  const samples = Math.floor((duration * samplingRate) / 1000);
  const data = [];

  for (let i = 0; i < samples; i++) {
    const t = i / samplingRate;
    const alpha = 10 * Math.sin(2 * Math.PI * 10 * t);
    const beta = 5 * Math.sin(2 * Math.PI * 20 * t);
    const noise = (Math.random() - 0.5) * 2;
    data.push(alpha + beta + noise);
  }

  return data;
}

// Generate spike times (Poisson process)
function generateSpikeTimes(duration, firingRate) {
  const spikes = [];
  let time = 0;

  while (time < duration) {
    const interval = (-Math.log(Math.random()) / firingRate) * 1000;
    time += interval;
    if (time < duration) {
      spikes.push(time);
    }
  }

  return spikes;
}

// Generate quality metrics
function generateQualityMetrics() {
  return {
    snr: Math.random() * 10 + 2,
    noiseFloor: Math.random() * 50 + 10,
    drift: Math.random() * 100,
    spikeAmplitude: Math.random() * 200 + 50,
  };
}

// Generate extracted features
function generateFeatures() {
  return {
    bandpower_alpha: Math.random() * 0.5,
    bandpower_beta: Math.random() * 0.4,
    bandpower_gamma: Math.random() * 0.3,
    spike_rate: Math.random() * 50,
    rms_amplitude: Math.random() * 100,
    burst_index: Math.random() * 0.8,
  };
}

function generateMockData() {
  const data = {
    sessions: [],
    recordings: [],
    events: [],
    qualityMetrics: [],
    features: [],
    trainingRuns: [],
    registryEntries: [],
  };

  console.log("🧠 Generating mock neural data...\n");

  const sessionsPerSubject = 4;
  const channelsPerSession = 256;
  const eventsPerSession = 15;
  const metricsPerChannel = 4;
  const featuresPerSession = 5;

  // Generate sessions and related data
  for (const subject of SUBJECTS) {
    for (let s = 0; s < sessionsPerSubject; s++) {
      const sessionId = randomUUID();
      const date = new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      );
      const task = TASKS[Math.floor(Math.random() * TASKS.length)];
      const duration = Math.floor(Math.random() * 30 + 20);

      const session = {
        id: sessionId,
        subject,
        date: date.toISOString().split("T")[0],
        task,
        duration,
        channels: channelsPerSession,
        samplingRate: 30000,
        metadata: {
          implant: DEVICES[Math.floor(Math.random() * DEVICES.length)],
          operator: OPERATORS[Math.floor(Math.random() * OPERATORS.length)],
          quality: Math.random() > 0.3 ? "good" : "fair",
        },
        createdAt: new Date().toISOString(),
      };

      data.sessions.push(session);

      // Generate recordings for each channel
      for (let ch = 0; ch < channelsPerSession; ch++) {
        const recordingId = randomUUID();
        const timeseries = generateNeuralTimeseries(
          Math.min(duration * 60 * 1000, 10000),
          30000
        );
        const spikeTimes = generateSpikeTimes(duration * 60, 20);

        const recording = {
          id: recordingId,
          sessionId,
          channelId: ch,
          timeseries: timeseries.slice(0, 100),
          spikeTimes: spikeTimes.slice(0, 50),
          createdAt: new Date().toISOString(),
        };

        data.recordings.push(recording);

        // Generate quality metrics
        const metrics = generateQualityMetrics();
        let metricIndex = 0;
        for (const [metricType, value] of Object.entries(metrics)) {
          if (metricIndex < metricsPerChannel) {
            data.qualityMetrics.push({
              id: randomUUID(),
              recordingId,
              metricType,
              value,
              createdAt: new Date().toISOString(),
            });
            metricIndex++;
          }
        }
      }

      // Generate events
      for (let e = 0; e < eventsPerSession; e++) {
        const eventTime = Math.random() * duration * 60 * 1000;
        const eventTypes = [
          "stimulus_onset",
          "response",
          "artifact",
          "movement",
          "blink",
        ];

        data.events.push({
          id: randomUUID(),
          sessionId,
          eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          timestamp: eventTime,
          duration: Math.random() * 500 + 100,
          metadata: {
            channel: Math.floor(Math.random() * channelsPerSession),
            amplitude: Math.random() * 100,
          },
          createdAt: new Date().toISOString(),
        });
      }

      // Generate features
      for (let f = 0; f < featuresPerSession; f++) {
        const featureData = generateFeatures();
        data.features.push({
          id: randomUUID(),
          sessionId,
          featureType: [
            "bandpower",
            "spike_statistics",
            "oscillations",
            "connectivity",
            "temporal_dynamics",
          ][f],
          windowStart: Math.random() * duration * 60 * 1000,
          windowEnd: Math.random() * duration * 60 * 1000 + 5000,
          values: featureData,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  // Generate training runs
  const modelTypes = ["transformer", "rnn", "svm", "ensemble"];
  for (let tr = 0; tr < 3; tr++) {
    const sessionIds = data.sessions
      .slice(0, Math.floor(Math.random() * 3) + 1)
      .map((s) => s.id);

    data.trainingRuns.push({
      id: randomUUID(),
      name: `Training_Run_${tr + 1}`,
      modelType: modelTypes[Math.floor(Math.random() * modelTypes.length)],
      status: ["completed", "running", "failed"][
        Math.floor(Math.random() * 3)
      ],
      accuracy: Math.random() * 0.3 + 0.7,
      loss: Math.random() * 0.5,
      epochs: Math.floor(Math.random() * 50) + 10,
      sessionIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Generate registry entries
  for (const subject of SUBJECTS) {
    data.registryEntries.push({
      id: randomUUID(),
      subject,
      device: DEVICES[Math.floor(Math.random() * DEVICES.length)],
      implantDate: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      notes: `Neural recording setup for ${subject}. Array positioned in motor cortex.`,
      status: Math.random() > 0.2 ? "active" : "archived",
      createdAt: new Date().toISOString(),
    });
  }

  return data;
}

// Main execution
const mockData = generateMockData();

// Create output directory
const outputDir = path.join(__dirname, "..", "public", "mock-data");
mkdirSync(outputDir, { recursive: true });

// Write data to JSON files
writeFileSync(
  path.join(outputDir, "sessions.json"),
  JSON.stringify(mockData.sessions, null, 2)
);
writeFileSync(
  path.join(outputDir, "recordings.json"),
  JSON.stringify(mockData.recordings, null, 2)
);
writeFileSync(
  path.join(outputDir, "events.json"),
  JSON.stringify(mockData.events, null, 2)
);
writeFileSync(
  path.join(outputDir, "quality-metrics.json"),
  JSON.stringify(mockData.qualityMetrics, null, 2)
);
writeFileSync(
  path.join(outputDir, "features.json"),
  JSON.stringify(mockData.features, null, 2)
);
writeFileSync(
  path.join(outputDir, "training-runs.json"),
  JSON.stringify(mockData.trainingRuns, null, 2)
);
writeFileSync(
  path.join(outputDir, "registry-entries.json"),
  JSON.stringify(mockData.registryEntries, null, 2)
);

console.log("✅ Mock data generated successfully!\n");
console.log(`📊 Generated Statistics:`);
console.log(`   • Sessions: ${mockData.sessions.length}`);
console.log(`   • Recordings: ${mockData.recordings.length}`);
console.log(`   • Events: ${mockData.events.length}`);
console.log(`   • Quality Metrics: ${mockData.qualityMetrics.length}`);
console.log(`   • Features: ${mockData.features.length}`);
console.log(`   • Training Runs: ${mockData.trainingRuns.length}`);
console.log(`   • Registry Entries: ${mockData.registryEntries.length}\n`);
console.log(`📁 Data saved to: ${outputDir}\n`);
