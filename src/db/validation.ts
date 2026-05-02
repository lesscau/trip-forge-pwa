import { z } from "zod";

export const bookingTypeSchema = z.enum([
  "hotel",
  "train",
  "flight",
  "attraction",
  "other"
]);

export const travelDocumentTypeSchema = z.enum([
  "passport",
  "visa",
  "insurance",
  "ticket",
  "booking",
  "other"
]);

export const tripSchema = z.object({
  id: z.string(),
  title: z.string(),
  destinationCountry: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const tripDaySchema = z.object({
  id: z.string(),
  tripId: z.string(),
  date: z.string(),
  city: z.string(),
  summary: z.string().optional(),
  orderIndex: z.number().int()
});

export const placeSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  dayId: z.string().optional(),
  name: z.string(),
  nameZh: z.string().optional(),
  address: z.string().optional(),
  addressZh: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  notes: z.string().optional(),
  orderIndex: z.number().int()
});

export const expenseSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  dayId: z.string().optional(),
  title: z.string(),
  amount: z.number(),
  currency: z.string(),
  category: z.string(),
  paidBy: z.string().optional(),
  createdAt: z.string()
});

export const bookingSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  dayId: z.string().optional(),
  type: bookingTypeSchema,
  title: z.string(),
  confirmationCode: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  address: z.string().optional(),
  addressZh: z.string().optional(),
  notes: z.string().optional()
});

export const travelDocumentSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  title: z.string(),
  type: travelDocumentTypeSchema,
  notes: z.string().optional(),
  createdAt: z.string()
});

export const noteSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  dayId: z.string().optional(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const checklistItemSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  title: z.string(),
  completed: z.boolean(),
  category: z.string().optional(),
  orderIndex: z.number().int()
});

export const tripForgeDataSchema = z.object({
  trips: z.array(tripSchema),
  tripDays: z.array(tripDaySchema),
  places: z.array(placeSchema),
  expenses: z.array(expenseSchema),
  bookings: z.array(bookingSchema),
  travelDocuments: z.array(travelDocumentSchema),
  notes: z.array(noteSchema),
  checklistItems: z.array(checklistItemSchema)
});
