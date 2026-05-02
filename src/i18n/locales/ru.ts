export const ru = {
  common: {
    appName: "TripForge",
    unknown: "Неизвестно",
    supported: "Поддерживается",
    unsupported: "Не поддерживается",
    enabled: "Включено",
    notEnabled: "Не включено"
  },
  nav: {
    home: "Главная",
    today: "Сегодня",
    trips: "Поездки",
    settings: "Настройки",
    primaryLabel: "Основная навигация",
    homeAria: "На главную TripForge"
  },
  home: {
    eyebrow: "Local-first планировщик поездки в Китай",
    title: "TripForge",
    description:
      "Планируйте дни, места, бронирования, документы и заметки в статическом PWA, который продолжает работать offline на телефоне.",
    openToday: "Открыть сегодня",
    viewTrips: "Смотреть поездки",
    statusAria: "Статус offline-планирования",
    offlineReady: "Готово к offline",
    indexedDbFirst: "Сначала IndexedDB",
    backupNote:
      "Сохраняйте резервную копию в JSON и пользуйтесь приложением без backend."
  },
  trips: {
    eyebrow: "Маршрут",
    title: "Поездки",
    sampleName: "Китай 2026",
    sampleDates: "Пекин, Сиань, Шанхай",
    cardDescription:
      "Откройте план по дням, места, бронирования и заметки."
  },
  tripDetail: {
    eyebrow: "Детали поездки",
    fallbackTitle: "Поездка",
    dayOne: "День 1",
    arrivalTitle: "Прилет и заселение в отель",
    arrivalDescription:
      "Этот маршрут будет использоваться для плана по дням, мест, документов и расходов.",
    places: "Места",
    placesTitle: "Китайские адреса и ссылки на карты",
    placesDescription:
      "Записи мест будут поддерживать копирование адресов и ссылки на Amap/Baidu/Apple Maps."
  },
  today: {
    eyebrow: "День поездки",
    title: "Сегодня",
    nextStop: "Следующая точка",
    checkInTitle: "Заселение в отель",
    checkInDescription:
      "Держите важные адреса, бронирования и чеклисты под рукой.",
    backup: "Резервная копия",
    exportJson: "Экспорт JSON",
    backupDescription:
      "Offline экспорт и восстановление резервной копии находятся в настройках."
  },
  settings: {
    eyebrow: "Локальные данные",
    title: "Настройки",
    exportBackup: "Экспортировать JSON",
    importBackup: "Импортировать JSON",
    languageEyebrow: "Язык интерфейса",
    languageTitle: "Язык",
    languageDescription:
      "Язык интерфейса хранится локально и не меняет данные поездки.",
    russian: "Русский",
    english: "English"
  },
  storage: {
    eyebrow: "Хранилище браузера",
    title: "Статус хранилища",
    checking: "Проверяем поддержку хранилища...",
    api: "Storage API",
    persistent: "Persistent storage",
    used: "Использовано",
    quota: "Лимит",
    usage: "Заполнение",
    requestButton: "Запросить persistent storage",
    unsupportedPersistent:
      "Persistent storage не поддерживается этим браузером.",
    enabledMessage: "Persistent storage включено.",
    notGrantedMessage: "Браузер не выдал persistent storage.",
    readError: "Не удалось прочитать статус хранилища",
    requestError: "Запрос Storage API не выполнен",
    note:
      "Persistent storage снижает риск очистки данных браузером, но экспорт JSON всё равно нужен для безопасного хранения данных поездки."
  },
  dates: {
    notSet: "Даты не указаны"
  }
} as const;
