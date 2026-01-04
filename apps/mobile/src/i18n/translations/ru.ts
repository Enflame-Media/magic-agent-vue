/**
 * Russian translations for Happy Mobile
 */

import type { TranslationStructure } from './en';

function plural({
  count,
  one,
  few,
  many,
}: {
  count: number;
  one: string;
  few: string;
  many: string;
}): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export const ru: TranslationStructure = {
  common: {
    cancel: 'Отмена',
    save: 'Сохранить',
    ok: 'OK',
    error: 'Ошибка',
    success: 'Успешно',
    loading: 'Загрузка...',
    retry: 'Повторить',
    back: 'Назад',
    done: 'Готово',
    continue: 'Продолжить',
    yes: 'Да',
    no: 'Нет',
    copy: 'Копировать',
    copied: 'Скопировано',
    delete: 'Удалить',
    edit: 'Редактировать',
    search: 'Поиск',
    close: 'Закрыть',
  },

  tabs: {
    home: 'Главная',
    sessions: 'Сессии',
    friends: 'Друзья',
    settings: 'Настройки',
  },

  home: {
    title: 'Happy Coder',
    welcome: 'С возвращением!',
    noSessions: 'Нет активных сессий',
    startSession: 'Начать новую сессию',
    recentSessions: 'Недавние Сессии',
    activeSessions: 'Активные Сессии',
    sessionsCount: ({ count }) =>
      `${count} ${plural({ count, one: 'сессия', few: 'сессии', many: 'сессий' })}`,
  },

  sessions: {
    title: 'Сессии',
    active: 'Активные',
    archived: 'В архиве',
    noSessions: 'Сессии не найдены',
    killSession: 'Завершить Сессию',
    archiveSession: 'Архивировать Сессию',
    deleteSession: 'Удалить Сессию',
    viewDetails: 'Подробности',
    sessionEnded: 'Сессия Завершена',
    sessionArchived: 'Сессия Архивирована',
    sessionDeleted: 'Сессия Удалена',
    confirmEnd: 'Вы уверены, что хотите завершить эту сессию?',
    confirmArchive: 'Вы уверены, что хотите архивировать эту сессию?',
    confirmDelete: 'Это действие нельзя отменить. Удалить эту сессию?',
    createdAt: ({ time }) => `Создана ${time}`,
    lastActive: ({ time }) => `Последняя активность ${time}`,
  },

  friends: {
    title: 'Друзья',
    noFriends: 'Пока нет друзей',
    addFriend: 'Добавить Друга',
    removeFriend: 'Удалить из Друзей',
    pending: 'Ожидание',
    accepted: 'Друзья',
    requests: 'Заявки в Друзья',
    searchPlaceholder: 'Поиск по имени пользователя...',
    confirmRemove: ({ name }) => `Удалить ${name} из друзей?`,
    requestSent: 'Заявка в друзья отправлена',
    requestAccepted: 'Заявка в друзья принята',
    online: 'В сети',
    offline: 'Не в сети',
    lastSeen: ({ time }) => `Был(а) в сети ${time}`,
  },

  settings: {
    title: 'Настройки',
    account: 'Аккаунт',
    accountSubtitle: 'Управление профилем и безопасностью',
    appearance: 'Внешний Вид',
    appearanceSubtitle: 'Тема и параметры отображения',
    language: 'Язык',
    languageSubtitle: 'Выберите предпочитаемый язык',
    notifications: 'Уведомления',
    notificationsSubtitle: 'Настройки push-уведомлений',
    about: 'О Приложении',
    aboutSubtitle: 'Версия приложения и правовая информация',
    logout: 'Выйти',
    logoutConfirm: 'Вы уверены, что хотите выйти?',
    version: ({ version }) => `Версия ${version}`,
  },

  settingsLanguage: {
    title: 'Язык',
    description: 'Выберите предпочитаемый язык. Изменения применяются немедленно.',
    currentLanguage: 'Текущий Язык',
    automatic: 'Автоматически',
    automaticSubtitle: 'Использовать язык устройства',
    changed: 'Язык Изменён',
    changedMessage: 'Язык приложения был обновлён.',
  },

  settingsAppearance: {
    title: 'Внешний Вид',
    theme: 'Тема',
    themeSystem: 'Системная',
    themeLight: 'Светлая',
    themeDark: 'Тёмная',
    themeDescription: 'Выберите предпочитаемую цветовую схему',
  },

  settingsAccount: {
    title: 'Аккаунт',
    profile: 'Профиль',
    email: 'Электронная почта',
    username: 'Имя пользователя',
    connectedAccounts: 'Подключённые Аккаунты',
    github: 'GitHub',
    githubConnected: ({ login }) => `Подключён как @${login}`,
    githubNotConnected: 'Не подключён',
    connectGithub: 'Подключить GitHub',
    disconnectGithub: 'Отключить GitHub',
    dangerZone: 'Опасная Зона',
    deleteAccount: 'Удалить Аккаунт',
    deleteAccountWarning: 'Это действие необратимо.',
  },

  auth: {
    scanQR: 'Сканировать QR-код',
    scanQRDescription: 'Отсканируйте QR-код с вашего терминала',
    scanning: 'Сканирование...',
    connecting: 'Подключение...',
    connected: 'Подключено!',
    connectionFailed: 'Ошибка подключения',
    tryAgain: 'Пожалуйста, попробуйте снова',
    cameraPermission: 'Требуется разрешение камеры',
    cameraPermissionDescription: 'Разрешите доступ к камере для сканирования QR-кодов',
    openSettings: 'Открыть Настройки',
  },

  errors: {
    network: 'Ошибка сети. Проверьте подключение.',
    server: 'Ошибка сервера. Попробуйте позже.',
    unknown: 'Произошла непредвиденная ошибка.',
    timeout: 'Время ожидания истекло.',
    notFound: 'Не найдено.',
    unauthorized: 'Пожалуйста, войдите снова.',
    forbidden: 'У вас нет разрешения.',
  },

  time: {
    justNow: 'только что',
    minutesAgo: ({ count }) =>
      `${count} ${plural({ count, one: 'минуту', few: 'минуты', many: 'минут' })} назад`,
    hoursAgo: ({ count }) =>
      `${count} ${plural({ count, one: 'час', few: 'часа', many: 'часов' })} назад`,
    daysAgo: ({ count }) =>
      `${count} ${plural({ count, one: 'день', few: 'дня', many: 'дней' })} назад`,
    today: 'Сегодня',
    yesterday: 'Вчера',
  },

  voice: {
    title: 'Голосовой Ассистент',
    listening: 'Слушаю...',
    processing: 'Обработка...',
    tapToSpeak: 'Нажмите, чтобы говорить',
    speakNow: 'Говорите',
    noMicrophone: 'Микрофон недоступен',
    permissionRequired: 'Требуется разрешение микрофона',
  },

  purchases: {
    pro: 'Pro',
    upgrade: 'Перейти на Pro',
    restore: 'Восстановить Покупки',
    alreadyPro: 'Вы уже Pro-пользователь!',
    features: 'Функции Pro',
    monthly: 'Ежемесячно',
    yearly: 'Ежегодно',
    lifetime: 'Навсегда',
    subscribe: 'Подписаться',
    purchase: 'Купить',
    thankYou: 'Спасибо за поддержку!',
  },
} as const;
