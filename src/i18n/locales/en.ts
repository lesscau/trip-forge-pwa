export const en = {
  common: {
    appName: "TripForge",
    unknown: "Unknown",
    supported: "Supported",
    unsupported: "Unsupported",
    enabled: "Enabled",
    notEnabled: "Not enabled",
    loading: "Loading...",
    delete: "Delete",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel"
  },
  nav: {
    home: "Home",
    today: "Today",
    trips: "Trips",
    settings: "Settings",
    primaryLabel: "Primary navigation",
    homeAria: "TripForge home"
  },
  home: {
    eyebrow: "Local-first China travel planner",
    title: "TripForge",
    description:
      "Plan days, places, bookings, documents, and travel notes in a static PWA designed to keep working offline on your phone.",
    openToday: "Open Today",
    viewTrips: "View Trips",
    statusAria: "Offline planning status",
    offlineReady: "Offline ready",
    indexedDbFirst: "IndexedDB first",
    backupNote:
      "Backup data as JSON and keep the app usable without a backend."
  },
  trips: {
    eyebrow: "Itinerary",
    title: "Trips",
    sampleName: "China 2026",
    sampleDates: "Beijing, Xi'an, Shanghai",
    createDemo: "Create demo trip",
    createTrip: "Create trip",
    createTripEyebrow: "New trip",
    loading: "Loading trips...",
    empty: "No trips yet. Create a demo trip to inspect the structure.",
    loadError: "Unable to load trips",
    createDemoError: "Unable to create demo trip",
    createTripError: "Unable to create trip",
    invalidDateRange: "End date cannot be earlier than start date.",
    cardDescription:
      "Open day-by-day planning, places, bookings, and notes.",
    form: {
      title: "Title",
      destinationCountry: "Country",
      startDate: "Start date",
      endDate: "End date"
    }
  },
  tripDetail: {
    eyebrow: "Trip detail",
    fallbackTitle: "Trip",
    dayOne: "Day 1",
    arrivalTitle: "Arrival and hotel check-in",
    arrivalDescription:
      "Use this route for itinerary, places, documents, and expenses.",
    places: "Places",
    place: "Place",
    placesTitle: "Chinese addresses and map links",
    placesDescription:
      "Place records will support copy buttons and Amap/Baidu/Apple Maps.",
    missingTripId: "Trip id is missing",
    loadError: "Unable to load trip",
    notFoundTitle: "Trip not found",
    notFoundDescription: "It may have been deleted or not created yet.",
    emptyDays: "No itinerary days yet.",
    emptyDayPlaces: "No places for this day yet.",
    emptyPlaces: "No places in this trip yet.",
    emptyBookings: "No bookings in this trip yet.",
    emptyChecklist: "No checklist items yet.",
    confirmationCode: "Confirmation code",
    startsAt: "Starts",
    endsAt: "Ends",
    sections: {
      itinerary: "Itinerary",
      places: "Places",
      bookings: "Bookings",
      checklist: "Checklist"
    },
    dayForm: {
      date: "Date",
      city: "City",
      summary: "Summary",
      submit: "Add day"
    },
    placeForm: {
      dayId: "Itinerary day",
      noDay: "No day",
      name: "Name",
      nameZh: "Chinese name",
      address: "Address",
      addressZh: "Chinese address",
      notes: "Notes",
      submit: "Add place"
    },
    checklistForm: {
      title: "Checklist item",
      category: "Category",
      submit: "Add item"
    }
  },
  today: {
    eyebrow: "Travel day",
    title: "Today",
    nextStop: "Next stop",
    checkInTitle: "Hotel check-in",
    checkInDescription:
      "Keep key addresses, bookings, and checklist items within reach.",
    backup: "Backup",
    exportJson: "Export JSON",
    backupDescription:
      "Offline backup and restore flows belong in the app settings.",
    loadError: "Unable to load today screen",
    emptyEyebrow: "No active trip",
    emptyTitle: "No trip today",
    emptyDescription:
      "Create a trip or open the trip list to inspect your itinerary.",
    openTrips: "Open trips",
    currentDay: "Current day",
    nearestFutureDay: "Nearest future day",
    emptyPlaces: "No places for the selected day yet.",
    emptyBookings: "No bookings for the selected day yet.",
    emptyChecklist: "No checklist items for this trip yet."
  },
  settings: {
    eyebrow: "Local data",
    title: "Settings",
    exportBackup: "Export backup JSON",
    importBackup: "Import backup JSON",
    languageEyebrow: "Interface language",
    languageTitle: "Language",
    languageDescription:
      "The interface language is stored locally and does not change trip data.",
    russian: "Русский",
    english: "English"
  },
  storage: {
    eyebrow: "Browser storage",
    title: "Storage status",
    checking: "Checking storage support...",
    api: "Storage API",
    persistent: "Persistent storage",
    used: "Used",
    quota: "Quota",
    usage: "Usage",
    requestButton: "Request persistent storage",
    unsupportedPersistent:
      "Persistent storage is not supported by this browser.",
    enabledMessage: "Persistent storage is enabled.",
    notGrantedMessage: "Persistent storage was not granted by the browser.",
    readError: "Unable to read storage status",
    requestError: "Storage API request failed",
    note:
      "Persistent storage can reduce browser cleanup risk, but JSON backup export remains required for safe offline travel data."
  },
  dates: {
    notSet: "Dates not set"
  },
  bookingTypes: {
    hotel: "Hotel",
    train: "Train",
    flight: "Flight",
    attraction: "Attraction",
    other: "Other"
  }
} as const;
