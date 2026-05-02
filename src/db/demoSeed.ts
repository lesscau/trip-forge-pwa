import { db } from "./database";
import type { Booking, ChecklistItem, Place, Trip, TripDay } from "./database";

export type DemoChinaTrip = {
  trip: Trip;
  days: TripDay[];
  places: Place[];
  checklistItems: ChecklistItem[];
  bookings: Booking[];
};

const demoTripId = "demo-china-2026";

function nowIso(): string {
  return new Date().toISOString();
}

export async function createDemoChinaTrip(): Promise<DemoChinaTrip> {
  const existingTrip = await db.trips.get(demoTripId);

  if (existingTrip) {
    const [days, places, checklistItems, bookings] = await Promise.all([
      db.tripDays.where("tripId").equals(demoTripId).toArray(),
      db.places.where("tripId").equals(demoTripId).toArray(),
      db.checklistItems.where("tripId").equals(demoTripId).toArray(),
      db.bookings.where("tripId").equals(demoTripId).toArray()
    ]);

    return {
      trip: existingTrip,
      days: days.sort((left, right) => left.orderIndex - right.orderIndex),
      places: places.sort((left, right) => left.orderIndex - right.orderIndex),
      checklistItems: checklistItems.sort(
        (left, right) => left.orderIndex - right.orderIndex
      ),
      bookings
    };
  }

  const timestamp = nowIso();
  const trip: Trip = {
    id: demoTripId,
    title: "Китай 2026",
    destinationCountry: "China",
    startDate: "2026-05-02",
    endDate: "2026-05-10",
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const days: TripDay[] = [
    {
      id: "demo-day-beijing",
      tripId: trip.id,
      date: "2026-05-02",
      city: "Beijing / Пекин",
      summary: "Arrival and first walk",
      orderIndex: 0
    },
    {
      id: "demo-day-xian",
      tripId: trip.id,
      date: "2026-05-05",
      city: "Xi'an / Сиань",
      summary: "Train and old city",
      orderIndex: 1
    },
    {
      id: "demo-day-shanghai",
      tripId: trip.id,
      date: "2026-05-08",
      city: "Shanghai / Шанхай",
      summary: "Bund and departure prep",
      orderIndex: 2
    }
  ];

  const places: Place[] = [
    {
      id: "demo-place-forbidden-city",
      tripId: trip.id,
      dayId: days[0].id,
      city: "Beijing",
      category: "museum",
      name: "Forbidden City",
      nameZh: "故宫博物院",
      address: "4 Jingshan Front St, Dongcheng, Beijing",
      addressZh: "北京市东城区景山前街4号",
      lat: 39.9163,
      lng: 116.3972,
      orderIndex: 0
    },
    {
      id: "demo-place-temple-heaven",
      tripId: trip.id,
      dayId: days[0].id,
      city: "Beijing",
      category: "park",
      name: "Temple of Heaven",
      nameZh: "天坛公园",
      addressZh: "北京市东城区天坛东路甲1号",
      lat: 39.8822,
      lng: 116.4066,
      orderIndex: 1
    },
    {
      id: "demo-place-xian-wall",
      tripId: trip.id,
      dayId: days[1].id,
      city: "Xi'an",
      category: "attraction",
      name: "Xi'an City Wall",
      nameZh: "西安城墙",
      addressZh: "陕西省西安市碑林区南大街",
      lat: 34.2583,
      lng: 108.9466,
      orderIndex: 2
    },
    {
      id: "demo-place-bund",
      tripId: trip.id,
      dayId: days[2].id,
      city: "Shanghai",
      category: "walk",
      name: "The Bund",
      nameZh: "外滩",
      addressZh: "上海市黄浦区中山东一路",
      lat: 31.2403,
      lng: 121.4906,
      orderIndex: 3
    }
  ];

  const checklistItems: ChecklistItem[] = [
    {
      id: "demo-check-passport",
      tripId: trip.id,
      title: "Passport and visa copies",
      completed: false,
      category: "documents",
      orderIndex: 0
    },
    {
      id: "demo-check-offline-maps",
      tripId: trip.id,
      title: "Download offline maps",
      completed: false,
      category: "offline",
      orderIndex: 1
    },
    {
      id: "demo-check-export",
      tripId: trip.id,
      title: "Export JSON backup before departure",
      completed: false,
      category: "backup",
      orderIndex: 2
    }
  ];

  const bookings: Booking[] = [
    {
      id: "demo-booking-beijing-hotel",
      tripId: trip.id,
      dayId: days[0].id,
      type: "hotel",
      title: "Beijing hotel",
      confirmationCode: "BJ-2026-DEMO",
      startsAt: "2026-05-02T15:00:00+08:00",
      endsAt: "2026-05-05T11:00:00+08:00",
      addressZh: "北京市东城区王府井"
    },
    {
      id: "demo-booking-xian-train",
      tripId: trip.id,
      dayId: days[1].id,
      type: "train",
      title: "Beijing West to Xi'an North",
      confirmationCode: "G-DEMO-2026",
      startsAt: "2026-05-05T09:00:00+08:00",
      endsAt: "2026-05-05T13:30:00+08:00"
    }
  ];

  await db.transaction(
    "rw",
    [db.trips, db.tripDays, db.places, db.checklistItems, db.bookings],
    async () => {
      await db.trips.put(trip);
      await db.tripDays.bulkPut(days);
      await db.places.bulkPut(places);
      await db.checklistItems.bulkPut(checklistItems);
      await db.bookings.bulkPut(bookings);
    }
  );

  return {
    trip,
    days,
    places,
    checklistItems,
    bookings
  };
}
