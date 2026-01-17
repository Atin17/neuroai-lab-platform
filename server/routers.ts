import { randomUUID } from "crypto";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const sessionStatusSchema = z.enum(["validated", "processing", "pending"]);

type SessionRecord = {
  id: string;
  subject: string;
  date: string;
  task: string;
  channels: number;
  duration: string;
  status: z.infer<typeof sessionStatusSchema>;
  metadata: Record<string, string>;
  createdAt: string;
};

type FeatureRecord = {
  id: string;
  sessionId: string;
  featureSet: "spike_rate" | "band_power" | "lfp_spectrum" | "custom";
  windowMs: number;
  metrics: Record<string, number>;
  createdAt: string;
};

type TrainingJob = {
  id: string;
  name: string;
  modelType: "transformer" | "rnn" | "svm" | "custom";
  status: "queued" | "running" | "completed" | "failed";
  epochs: number;
  sessionIds: string[];
  featureSet: FeatureRecord["featureSet"];
  createdAt: string;
  updatedAt: string;
};

type ExperimentRecord = {
  id: string;
  name: string;
  owner: string;
  sessions: string[];
  metrics: Record<string, number>;
  notes: string;
  createdAt: string;
};

type RegistryEntry = {
  id: string;
  sessionId: string;
  subject: string;
  device: string;
  notes: string;
  createdAt: string;
};

const sessions = new Map<string, SessionRecord>();
const features: FeatureRecord[] = [];
const trainingJobs = new Map<string, TrainingJob>();
const experiments: ExperimentRecord[] = [];
const registryEntries: RegistryEntry[] = [];

const seedData = () => {
  if (sessions.size > 0) {
    return;
  }

  const seedSessions: SessionRecord[] = [
    {
      id: "sess_001",
      subject: "Subject A",
      date: "2024-06-14",
      task: "Motor imagery",
      channels: 1024,
      duration: "45 min",
      status: "validated",
      metadata: { implant: "N1", operator: "Dr. Kaur" },
      createdAt: "2024-06-14T09:15:00Z",
    },
    {
      id: "sess_002",
      subject: "Subject B",
      date: "2024-06-15",
      task: "Speech decoding",
      channels: 768,
      duration: "38 min",
      status: "processing",
      metadata: { implant: "N1", operator: "Dr. Chen" },
      createdAt: "2024-06-15T11:02:00Z",
    },
    {
      id: "sess_003",
      subject: "Subject C",
      date: "2024-06-16",
      task: "Visual stimulus",
      channels: 512,
      duration: "52 min",
      status: "pending",
      metadata: { implant: "N2", operator: "Dr. Alvarez" },
      createdAt: "2024-06-16T13:45:00Z",
    },
  ];

  seedSessions.forEach(session => sessions.set(session.id, session));

  features.push(
    {
      id: "feat_001",
      sessionId: "sess_001",
      featureSet: "band_power",
      windowMs: 250,
      metrics: { beta: 0.74, gamma: 0.62, theta: 0.55 },
      createdAt: "2024-06-14T09:30:00Z",
    },
    {
      id: "feat_002",
      sessionId: "sess_002",
      featureSet: "spike_rate",
      windowMs: 200,
      metrics: { mean: 18.4, variance: 4.9, peak: 34.1 },
      createdAt: "2024-06-15T11:20:00Z",
    },
  );

  trainingJobs.set("train_001", {
    id: "train_001",
    name: "Motor imagery baseline",
    modelType: "transformer",
    status: "running",
    epochs: 12,
    sessionIds: ["sess_001", "sess_002"],
    featureSet: "band_power",
    createdAt: "2024-06-17T08:12:00Z",
    updatedAt: "2024-06-17T08:45:00Z",
  });

  experiments.push(
    {
      id: "exp_001",
      name: "Closed-loop stimulation pilot",
      owner: "Dr. Kaur",
      sessions: ["sess_001", "sess_003"],
      metrics: { accuracy: 0.82, latencyMs: 120 },
      notes: "Evaluating motor cortex response under adaptive stimulation.",
      createdAt: "2024-06-18T10:05:00Z",
    },
    {
      id: "exp_002",
      name: "Speech intent decoding",
      owner: "Dr. Chen",
      sessions: ["sess_002"],
      metrics: { wer: 0.21, r2: 0.78 },
      notes: "Decoder retrain with updated feature pipeline.",
      createdAt: "2024-06-19T15:30:00Z",
    },
  );

  registryEntries.push(
    {
      id: "reg_001",
      sessionId: "sess_001",
      subject: "Subject A",
      device: "Neuralink N1",
      notes: "Post-op day 12. Stable impedance readings.",
      createdAt: "2024-06-14T09:10:00Z",
    },
    {
      id: "reg_002",
      sessionId: "sess_002",
      subject: "Subject B",
      device: "Neuralink N1",
      notes: "Speech decoding session with adaptive filter.",
      createdAt: "2024-06-15T10:55:00Z",
    },
  );
};

const ensureSeeded = () => {
  if (sessions.size === 0) {
    seedData();
  }
};

const buildFeatureMetrics = (featureSet: FeatureRecord["featureSet"]) => {
  switch (featureSet) {
    case "spike_rate":
      return { mean: 19.1, variance: 5.4, peak: 32.6 };
    case "band_power":
      return { beta: 0.68, gamma: 0.71, theta: 0.52 };
    case "lfp_spectrum":
      return { alpha: 0.41, beta: 0.63, gamma: 0.59 };
    case "custom":
    default:
      return { customA: 0.58, customB: 0.44, customC: 0.77 };
  }
};

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  sessions: router({
    list: publicProcedure
      .input(
        z
          .object({
            subject: z.string().optional(),
            status: sessionStatusSchema.optional(),
            task: z.string().optional(),
            search: z.string().optional(),
          })
          .optional(),
      )
      .query(({ input }) => {
        ensureSeeded();
        const query = input ?? {};
        const normalizedSearch = query.search?.toLowerCase();
        return Array.from(sessions.values()).filter(session => {
          if (query.subject && session.subject !== query.subject) {
            return false;
          }
          if (query.status && session.status !== query.status) {
            return false;
          }
          if (query.task && session.task !== query.task) {
            return false;
          }
          if (normalizedSearch) {
            const haystack = `${session.id} ${session.subject} ${session.task}`.toLowerCase();
            return haystack.includes(normalizedSearch);
          }
          return true;
        });
      }),
    get: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
      ensureSeeded();
      return sessions.get(input.id) ?? null;
    }),
    create: publicProcedure
      .input(
        z.object({
          subject: z.string(),
          date: z.string(),
          task: z.string(),
          channels: z.number().int().positive(),
          duration: z.string(),
          status: sessionStatusSchema.default("pending"),
          metadata: z.record(z.string()).default({}),
        }),
      )
      .mutation(({ input }) => {
        ensureSeeded();
        const id = `sess_${randomUUID().slice(0, 6)}`;
        const createdAt = new Date().toISOString();
        const session: SessionRecord = {
          id,
          subject: input.subject,
          date: input.date,
          task: input.task,
          channels: input.channels,
          duration: input.duration,
          status: input.status,
          metadata: input.metadata,
          createdAt,
        };
        sessions.set(id, session);
        return session;
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          subject: z.string().optional(),
          date: z.string().optional(),
          task: z.string().optional(),
          channels: z.number().int().positive().optional(),
          duration: z.string().optional(),
          status: sessionStatusSchema.optional(),
          metadata: z.record(z.string()).optional(),
        }),
      )
      .mutation(({ input }) => {
        ensureSeeded();
        const session = sessions.get(input.id);
        if (!session) {
          return null;
        }
        const updated: SessionRecord = {
          ...session,
          subject: input.subject ?? session.subject,
          date: input.date ?? session.date,
          task: input.task ?? session.task,
          channels: input.channels ?? session.channels,
          duration: input.duration ?? session.duration,
          status: input.status ?? session.status,
          metadata: input.metadata ?? session.metadata,
        };
        sessions.set(input.id, updated);
        return updated;
      }),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
      ensureSeeded();
      const deleted = sessions.get(input.id) ?? null;
      sessions.delete(input.id);
      return deleted;
    }),
  }),
  features: router({
    list: publicProcedure
      .input(z.object({ sessionId: z.string().optional() }).optional())
      .query(({ input }) => {
        ensureSeeded();
        if (input?.sessionId) {
          return features.filter(feature => feature.sessionId === input.sessionId);
        }
        return features;
      }),
    extract: publicProcedure
      .input(
        z.object({
          sessionIds: z.array(z.string()).min(1),
          featureSet: z.enum(["spike_rate", "band_power", "lfp_spectrum", "custom"]).default("band_power"),
          windowMs: z.number().int().positive().default(250),
        }),
      )
      .mutation(({ input }) => {
        ensureSeeded();
        const createdAt = new Date().toISOString();
        const extracted = input.sessionIds
          .map(sessionId => {
            if (!sessions.has(sessionId)) {
              return null;
            }
            const feature: FeatureRecord = {
              id: `feat_${randomUUID().slice(0, 6)}`,
              sessionId,
              featureSet: input.featureSet,
              windowMs: input.windowMs,
              metrics: buildFeatureMetrics(input.featureSet),
              createdAt,
            };
            return feature;
          })
          .filter((feature): feature is FeatureRecord => feature !== null);
        features.push(...extracted);
        return extracted;
      }),
  }),
  training: router({
    list: publicProcedure.query(() => {
      ensureSeeded();
      return Array.from(trainingJobs.values());
    }),
    start: publicProcedure
      .input(
        z.object({
          name: z.string(),
          modelType: z.enum(["transformer", "rnn", "svm", "custom"]),
          sessionIds: z.array(z.string()).min(1),
          epochs: z.number().int().positive(),
          featureSet: z.enum(["spike_rate", "band_power", "lfp_spectrum", "custom"]).default("band_power"),
        }),
      )
      .mutation(({ input }) => {
        ensureSeeded();
        const id = `train_${randomUUID().slice(0, 6)}`;
        const now = new Date().toISOString();
        const job: TrainingJob = {
          id,
          name: input.name,
          modelType: input.modelType,
          status: "queued",
          epochs: input.epochs,
          sessionIds: input.sessionIds,
          featureSet: input.featureSet,
          createdAt: now,
          updatedAt: now,
        };
        trainingJobs.set(id, job);
        return job;
      }),
    status: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
      ensureSeeded();
      return trainingJobs.get(input.id) ?? null;
    }),
    updateStatus: publicProcedure
      .input(
        z.object({
          id: z.string(),
          status: z.enum(["queued", "running", "completed", "failed"]),
        }),
      )
      .mutation(({ input }) => {
        ensureSeeded();
        const job = trainingJobs.get(input.id);
        if (!job) {
          return null;
        }
        const updated: TrainingJob = {
          ...job,
          status: input.status,
          updatedAt: new Date().toISOString(),
        };
        trainingJobs.set(input.id, updated);
        return updated;
      }),
  }),
  experiments: router({
    list: publicProcedure.query(() => {
      ensureSeeded();
      return experiments;
    }),
    create: publicProcedure
      .input(
        z.object({
          name: z.string(),
          owner: z.string(),
          sessions: z.array(z.string()).min(1),
          metrics: z.record(z.number()).default({}),
          notes: z.string().default(""),
        }),
      )
      .mutation(({ input }) => {
        ensureSeeded();
        const record: ExperimentRecord = {
          id: `exp_${randomUUID().slice(0, 6)}`,
          name: input.name,
          owner: input.owner,
          sessions: input.sessions,
          metrics: input.metrics,
          notes: input.notes,
          createdAt: new Date().toISOString(),
        };
        experiments.push(record);
        return record;
      }),
  }),
  registry: router({
    list: publicProcedure.query(() => {
      ensureSeeded();
      return registryEntries;
    }),
    create: publicProcedure
      .input(
        z.object({
          sessionId: z.string(),
          subject: z.string(),
          device: z.string(),
          notes: z.string().default(""),
        }),
      )
      .mutation(({ input }) => {
        ensureSeeded();
        const entry: RegistryEntry = {
          id: `reg_${randomUUID().slice(0, 6)}`,
          sessionId: input.sessionId,
          subject: input.subject,
          device: input.device,
          notes: input.notes,
          createdAt: new Date().toISOString(),
        };
        registryEntries.push(entry);
        return entry;
      }),
  }),
});

export type AppRouter = typeof appRouter;
