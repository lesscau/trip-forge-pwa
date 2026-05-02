import { z } from "zod";

const tripSchema = z.object({
  id: z.string(),
  name: z.string(),
  startsOn: z.string().optional(),
  endsOn: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const backupSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  trips: z.array(tripSchema)
});

export type BackupPayload = z.infer<typeof backupSchema>;
