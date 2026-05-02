import { z } from "zod";

import { tripForgeDataSchema } from "../db/validation";

export const backupSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  data: tripForgeDataSchema
});

export type BackupPayload = z.infer<typeof backupSchema>;
