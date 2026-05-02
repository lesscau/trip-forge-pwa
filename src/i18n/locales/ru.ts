export const ru = {
  common: {
    appName: "TripForge",
    unknown: "Неизвестно",
    supported: "Поддерживается",
    unsupported: "Не поддерживается",
    enabled: "Включено",
    notEnabled: "Не включено",
    loading: "Загрузка...",
    delete: "Удалить",
    edit: "Редактировать",
    save: "Сохранить",
    cancel: "Отмена",
    up: "Вверх",
    down: "Вниз"
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
    createDemo: "Создать демо-поездку",
    createTrip: "Создать поездку",
    createTripEyebrow: "Новая поездка",
    loading: "Загружаем поездки...",
    empty: "Пока нет поездок. Создайте демо-поездку, чтобы посмотреть структуру.",
    loadError: "Не удалось загрузить поездки",
    createDemoError: "Не удалось создать демо-поездку",
    createTripError: "Не удалось создать поездку",
    invalidDateRange: "Дата окончания не может быть раньше даты начала.",
    cardDescription:
      "Откройте план по дням, места, бронирования и заметки.",
    form: {
      title: "Название",
      destinationCountry: "Страна",
      startDate: "Дата начала",
      endDate: "Дата окончания"
    }
  },
  tripDetail: {
    eyebrow: "Детали поездки",
    fallbackTitle: "Поездка",
    dayOne: "День 1",
    arrivalTitle: "Прилет и заселение в отель",
    arrivalDescription:
      "Этот маршрут будет использоваться для плана по дням, мест, документов и расходов.",
    places: "Места",
    place: "Место",
    placesTitle: "Китайские адреса и ссылки на карты",
    placesDescription:
      "Записи мест будут поддерживать копирование адресов и ссылки на Amap/Baidu/Apple Maps.",
    missingTripId: "Не указан идентификатор поездки",
    loadError: "Не удалось загрузить поездку",
    notFoundTitle: "Поездка не найдена",
    notFoundDescription: "Возможно, она была удалена или ещё не создана.",
    emptyDays: "В маршруте пока нет дней.",
    emptyDayPlaces: "На этот день пока нет мест.",
    emptyPlaces: "В поездке пока нет мест.",
    emptyBookings: "В поездке пока нет бронирований.",
    emptyChecklist: "В чеклисте пока нет пунктов.",
    confirmDeleteDay:
      "Удалить день маршрута? Связанные места, бронирования и заметки тоже будут удалены.",
    confirmDeletePlace: "Удалить место?",
    confirmDeleteChecklistItem: "Удалить пункт чеклиста?",
    collapseDay: "Свернуть",
    collapseAllDays: "Свернуть все",
    expandAllDays: "Развернуть все",
    confirmationCode: "Код подтверждения",
    startsAt: "Начало",
    endsAt: "Окончание",
    sections: {
      itinerary: "Маршрут",
      places: "Места",
      bookings: "Бронирования",
      checklist: "Чеклист"
    },
    dayForm: {
      date: "Дата",
      city: "Город",
      summary: "Краткое описание",
      dateOutOfRange: "Дата дня должна быть внутри диапазона поездки.",
      submit: "Добавить день"
    },
    insertDayForm: {
      city: "Город нового дня",
      summary: "Краткое описание",
      submit: "Добавить день после этого"
    },
    placeForm: {
      dayId: "День маршрута",
      noDay: "Без привязки к дню",
      name: "Название",
      category: "Тип места",
      nameZh: "Название на китайском",
      address: "Адрес",
      addressZh: "Адрес на китайском",
      notes: "Заметки",
      submit: "Добавить место"
    },
    checklistForm: {
      title: "Пункт чеклиста",
      category: "Категория",
      submit: "Добавить пункт"
    }
  },
  tripPlaces: {
    eyebrow: "Места поездки",
    title: "Все места",
    navLink: "Все места",
    backToTrip: "Назад к поездке",
    loadError: "Не удалось загрузить места",
    saveError: "Не удалось сохранить место",
    emptyFiltered: "Нет мест под выбранные фильтры.",
    unknownCity: "Город не указан",
    dayLabel: "День",
    count_one: "{{count}} место",
    count_few: "{{count}} места",
    count_many: "{{count}} мест",
    count_other: "{{count}} места",
    filters: {
      search: "Поиск",
      city: "Город",
      category: "Тип места",
      day: "День",
      groupBy: "Группировка",
      allCities: "Все города",
      allCategories: "Все типы",
      allDays: "Все дни",
      reset: "Сбросить фильтры"
    },
    groupBy: {
      city: "Город",
      category: "Тип места",
      none: "Без группировки"
    }
  },
  copy: {
    copied: "Скопировано",
    error: "Не удалось скопировать"
  },
  placeActions: {
    copyChineseName: "Копировать название на китайском",
    copyChineseAddress: "Копировать адрес на китайском",
    openInAmap: "Открыть в Amap"
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
      "Offline экспорт и восстановление резервной копии находятся в настройках.",
    loadError: "Не удалось загрузить экран сегодня",
    emptyEyebrow: "Нет активной поездки",
    emptyTitle: "Сегодня нет поездки",
    emptyDescription:
      "Создайте поездку или откройте список поездок, чтобы посмотреть маршрут.",
    openTrips: "Открыть поездки",
    currentDay: "Текущий день",
    nearestFutureDay: "Ближайший будущий день",
    selectedDayKinds: {
      exact: "Текущий день",
      future: "Ближайший будущий день",
      past: "Последний запланированный день"
    },
    emptyPlaces: "На выбранный день пока нет мест.",
    emptyBookings: "На выбранный день пока нет бронирований.",
    emptyChecklist: "В поездке пока нет чеклиста."
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
  },
  placeCategories: {
    attraction: "Достопримечательность",
    food: "Еда",
    station: "Вокзал",
    airport: "Аэропорт",
    hotel: "Отель",
    shopping: "Покупки",
    walk: "Прогулка",
    museum: "Музей",
    park: "Парк",
    other: "Другое"
  },
  bookingTypes: {
    hotel: "Отель",
    train: "Поезд",
    flight: "Самолёт",
    attraction: "Достопримечательность",
    other: "Другое"
  }
} as const;
