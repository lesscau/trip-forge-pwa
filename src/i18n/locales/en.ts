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
    cancel: "Cancel",
    up: "Up",
    down: "Down"
  },
  nav: {
    home: "Home",
    today: "Today",
    trips: "Trips",
    places: "Places",
    settings: "Settings",
    primaryLabel: "Primary navigation",
    mobileLabel: "Mobile navigation",
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
    emptyExpenses: "No expenses in this trip yet.",
    emptyBookings: "No bookings in this trip yet.",
    emptyDocuments: "No travel documents in this trip yet.",
    emptyChecklist: "No checklist items yet.",
    confirmDeleteDay:
      "Delete this itinerary day? Linked places, bookings, and notes will also be deleted.",
    confirmDeletePlace: "Delete this place?",
    confirmDeleteExpense: "Delete this expense?",
    confirmDeleteBooking: "Delete this booking?",
    confirmDeleteDocument: "Delete this document?",
    confirmDeleteChecklistItem: "Delete this checklist item?",
    collapseDay: "Collapse",
    expandDay: "Expand",
    collapseAllDays: "Collapse all",
    expandAllDays: "Expand all",
    confirmationCode: "Confirmation code",
    startsAt: "Starts",
    endsAt: "Ends",
    sections: {
      itinerary: "Itinerary",
      places: "Places",
      expenses: "Expenses",
      bookings: "Bookings",
      documents: "Documents",
      checklist: "Checklist"
    },
    dayForm: {
      date: "Date",
      city: "City",
      summary: "Summary",
      dateOutOfRange: "The day date must be inside the trip date range.",
      submit: "Add day"
    },
    insertDayForm: {
      city: "New day city",
      summary: "Summary",
      submit: "Add day after this"
    },
    placeForm: {
      dayId: "Itinerary day",
      noDay: "No day",
      name: "Name",
      category: "Place type",
      nameZh: "Chinese name",
      address: "Address",
      addressZh: "Chinese address",
      lat: "Latitude",
      lng: "Longitude",
      notes: "Notes",
      submit: "Add place"
    },
    checklistForm: {
      title: "Checklist item",
      category: "Category",
      noCategory: "No category",
      submit: "Add item"
    },
    expenseForm: {
      title: "Title",
      amount: "Amount",
      currency: "Currency",
      category: "Category",
      paidBy: "Paid by",
      dayId: "Itinerary day",
      noDay: "No day",
      submit: "Add expense"
    },
    expenseTotals: {
      byCurrency: "Total by currency",
      byCategory: "Total by category"
    },
    bookingForm: {
      type: "Type",
      title: "Title",
      confirmationCode: "Confirmation code",
      startsAt: "Starts",
      endsAt: "Ends",
      address: "Address",
      addressZh: "Chinese address",
      notes: "Notes",
      submit: "Add booking"
    },
    bookingActions: {
      copyConfirmationCode: "Copy confirmation code",
      copyChineseAddress: "Copy Chinese address"
    },
    documentForm: {
      type: "Type",
      title: "Title",
      notes: "Notes",
      submit: "Add document"
    },
    quickSearch: {
      label: "Quick search",
      placeholder: "Search places, bookings, documents",
      resultSummary:
        "{{places}} places, {{bookings}} bookings, {{documents}} documents"
    }
  },
  tripPlaces: {
    eyebrow: "Trip places",
    title: "All places",
    navLink: "All places",
    backToTrip: "Back to trip",
    loadError: "Unable to load places",
    saveError: "Unable to save place",
    emptyFiltered: "No places match these filters.",
    unknownCity: "City not set",
    dayLabel: "Day",
    count_one: "{{count}} place",
    count_other: "{{count}} places",
    filters: {
      search: "Search",
      city: "City",
      category: "Place type",
      day: "Day",
      groupBy: "Group by",
      allCities: "All cities",
      allCategories: "All types",
      allDays: "All days",
      reset: "Reset filters"
    },
    groupBy: {
      city: "City",
      category: "Place type",
      none: "No grouping"
    },
    map: {
      label: "Places map",
      noCoordinates: "No places with coordinates yet."
    }
  },
  tripBackup: {
    exportButton: "Export trip JSON",
    exportError: "Unable to export trip JSON",
    importEyebrow: "Offline backup",
    importButton: "Import trip JSON",
    importFile: "Backup JSON file",
    importError: "Unable to import trip JSON",
    invalidJson: "The selected file is not valid JSON.",
    invalidBackup: "The selected file is not a valid TripForge trip backup.",
    unsupportedSchemaVersion: "This TripForge backup schema version is not supported.",
    previewTitle: "Import preview",
    previewDays: "Days",
    previewPlaces: "Places",
    previewExpenses: "Expenses",
    confirmImport: "Import as new trip"
  },
  copy: {
    copy: "Copy",
    copied: "Copied",
    error: "Could not copy"
  },
  placeActions: {
    copyChineseName: "Copy Chinese name",
    copyChineseAddress: "Copy Chinese address",
    openInAmap: "Open in Amap"
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
    selectedDayKinds: {
      exact: "Current day",
      future: "Nearest future day",
      past: "Last planned day"
    },
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
  placeCategories: {
    attraction: "Attraction",
    food: "Food",
    station: "Station",
    airport: "Airport",
    hotel: "Hotel",
    shopping: "Shopping",
    walk: "Walk",
    museum: "Museum",
    park: "Park",
    other: "Other"
  },
  bookingTypes: {
    hotel: "Hotel",
    train: "Train",
    flight: "Flight",
    attraction: "Attraction",
    other: "Other"
  },
  travelDocumentTypes: {
    passport: "Passport",
    visa: "Visa",
    insurance: "Insurance",
    ticket: "Ticket",
    booking: "Booking",
    other: "Other"
  }
} as const;
