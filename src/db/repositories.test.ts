import "fake-indexeddb/auto";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { db } from "./database";
import { createDemoChinaTrip } from "./demoSeed";
import {
  createTrip,
  getTrip,
  listDaysByTrip,
  listPlacesByDay,
  listTrips,
  upsertDay,
  upsertPlace
} from "./repositories";
import { bookingSchema, tripSchema } from "./validation";

async function resetDatabase() {
  db.close();
  await db.delete();
  await db.open();
}

describe("trip repositories", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterEach(() => {
    db.close();
  });

  it("creates, lists, and gets a trip", async () => {
    const trip = await createTrip({
      title: "Test China Trip",
      destinationCountry: "China",
      startDate: "2026-05-02",
      endDate: "2026-05-10"
    });

    await expect(getTrip(trip.id)).resolves.toMatchObject({
      id: trip.id,
      title: "Test China Trip"
    });
    await expect(listTrips()).resolves.toHaveLength(1);
  });

  it("sorts days by orderIndex and then date", async () => {
    const trip = await createTrip({
      title: "Sort Test",
      destinationCountry: "China",
      startDate: "2026-05-02",
      endDate: "2026-05-10"
    });

    await upsertDay({
      id: "third",
      tripId: trip.id,
      date: "2026-05-04",
      city: "Shanghai",
      orderIndex: 2
    });
    await upsertDay({
      id: "first",
      tripId: trip.id,
      date: "2026-05-02",
      city: "Beijing",
      orderIndex: 0
    });
    await upsertDay({
      id: "second",
      tripId: trip.id,
      date: "2026-05-03",
      city: "Xi'an",
      orderIndex: 1
    });

    await expect(listDaysByTrip(trip.id)).resolves.toMatchObject([
      { id: "first" },
      { id: "second" },
      { id: "third" }
    ]);
  });

  it("sorts places by orderIndex", async () => {
    const trip = await createTrip({
      title: "Places Test",
      destinationCountry: "China",
      startDate: "2026-05-02",
      endDate: "2026-05-10"
    });
    const dayId = "day";

    await upsertDay({
      id: dayId,
      tripId: trip.id,
      date: "2026-05-02",
      city: "Beijing",
      orderIndex: 0
    });
    await upsertPlace({
      id: "second-place",
      tripId: trip.id,
      dayId,
      name: "Second",
      orderIndex: 1
    });
    await upsertPlace({
      id: "first-place",
      tripId: trip.id,
      dayId,
      name: "First",
      orderIndex: 0
    });

    await expect(listPlacesByDay(dayId)).resolves.toMatchObject([
      { id: "first-place" },
      { id: "second-place" }
    ]);
  });

  it("creates a linked demo China trip dataset", async () => {
    const demo = await createDemoChinaTrip();

    expect(demo.trip.title).toBe("Китай 2026");
    expect(demo.days).toHaveLength(3);
    expect(demo.places.length).toBeGreaterThanOrEqual(4);
    expect(demo.checklistItems.length).toBeGreaterThanOrEqual(3);
    expect(demo.bookings.length).toBeGreaterThanOrEqual(2);
    expect(demo.days.every((day) => day.tripId === demo.trip.id)).toBe(true);
    expect(demo.places.every((place) => place.tripId === demo.trip.id)).toBe(true);
  });

  it("validates domain entities with Zod", async () => {
    const trip = await createTrip({
      title: "Validation Test",
      destinationCountry: "China",
      startDate: "2026-05-02",
      endDate: "2026-05-10"
    });

    expect(tripSchema.safeParse(trip).success).toBe(true);
    expect(
      bookingSchema.safeParse({
        id: "booking",
        tripId: trip.id,
        type: "hotel",
        title: "Hotel"
      }).success
    ).toBe(true);
    expect(
      bookingSchema.safeParse({
        id: "booking",
        tripId: trip.id,
        type: "invalid",
        title: "Hotel"
      }).success
    ).toBe(false);
  });
});
