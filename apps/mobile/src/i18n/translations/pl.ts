/**
 * Polish translations for Happy Mobile
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
  if (count === 1) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export const pl: TranslationStructure = {
  common: {
    cancel: 'Anuluj',
    save: 'Zapisz',
    ok: 'OK',
    error: 'Błąd',
    success: 'Sukces',
    loading: 'Ładowanie...',
    retry: 'Ponów',
    back: 'Wstecz',
    done: 'Gotowe',
    continue: 'Kontynuuj',
    yes: 'Tak',
    no: 'Nie',
    copy: 'Kopiuj',
    copied: 'Skopiowano',
    delete: 'Usuń',
    edit: 'Edytuj',
    search: 'Szukaj',
    close: 'Zamknij',
  },

  tabs: {
    home: 'Główna',
    sessions: 'Sesje',
    friends: 'Znajomi',
    settings: 'Ustawienia',
  },

  home: {
    title: 'Happy Coder',
    welcome: 'Witaj ponownie!',
    noSessions: 'Brak aktywnych sesji',
    startSession: 'Rozpocznij nową sesję',
    recentSessions: 'Ostatnie Sesje',
    activeSessions: 'Aktywne Sesje',
    sessionsCount: ({ count }) =>
      `${count} ${plural({ count, one: 'sesja', few: 'sesje', many: 'sesji' })}`,
  },

  sessions: {
    title: 'Sesje',
    active: 'Aktywne',
    archived: 'Zarchiwizowane',
    noSessions: 'Nie znaleziono sesji',
    killSession: 'Zakończ Sesję',
    archiveSession: 'Archiwizuj Sesję',
    deleteSession: 'Usuń Sesję',
    viewDetails: 'Zobacz Szczegóły',
    sessionEnded: 'Sesja Zakończona',
    sessionArchived: 'Sesja Zarchiwizowana',
    sessionDeleted: 'Sesja Usunięta',
    confirmEnd: 'Czy na pewno chcesz zakończyć tę sesję?',
    confirmArchive: 'Czy na pewno chcesz zarchiwizować tę sesję?',
    confirmDelete: 'Tej operacji nie można cofnąć. Usunąć tę sesję?',
    createdAt: ({ time }) => `Utworzono ${time}`,
    lastActive: ({ time }) => `Ostatnia aktywność ${time}`,
  },

  friends: {
    title: 'Znajomi',
    noFriends: 'Nie masz jeszcze znajomych',
    addFriend: 'Dodaj Znajomego',
    removeFriend: 'Usuń Znajomego',
    pending: 'Oczekujące',
    accepted: 'Znajomi',
    requests: 'Zaproszenia do Znajomych',
    searchPlaceholder: 'Szukaj po nazwie użytkownika...',
    confirmRemove: ({ name }) => `Usunąć ${name} ze znajomych?`,
    requestSent: 'Zaproszenie do znajomych wysłane',
    requestAccepted: 'Zaproszenie do znajomych zaakceptowane',
    online: 'Online',
    offline: 'Offline',
    lastSeen: ({ time }) => `Ostatnio widziany ${time}`,
  },

  settings: {
    title: 'Ustawienia',
    account: 'Konto',
    accountSubtitle: 'Zarządzaj profilem i bezpieczeństwem',
    appearance: 'Wygląd',
    appearanceSubtitle: 'Motyw i opcje wyświetlania',
    language: 'Język',
    languageSubtitle: 'Wybierz preferowany język',
    notifications: 'Powiadomienia',
    notificationsSubtitle: 'Ustawienia powiadomień push',
    about: 'O Aplikacji',
    aboutSubtitle: 'Wersja aplikacji i informacje prawne',
    logout: 'Wyloguj',
    logoutConfirm: 'Czy na pewno chcesz się wylogować?',
    version: ({ version }) => `Wersja ${version}`,
  },

  settingsLanguage: {
    title: 'Język',
    description: 'Wybierz preferowany język. Zmiany są stosowane natychmiast.',
    currentLanguage: 'Obecny Język',
    automatic: 'Automatyczny',
    automaticSubtitle: 'Użyj języka urządzenia',
    changed: 'Język Zmieniony',
    changedMessage: 'Język aplikacji został zaktualizowany.',
  },

  settingsAppearance: {
    title: 'Wygląd',
    theme: 'Motyw',
    themeSystem: 'Systemowy',
    themeLight: 'Jasny',
    themeDark: 'Ciemny',
    themeDescription: 'Wybierz preferowany schemat kolorów',
  },

  settingsAccount: {
    title: 'Konto',
    profile: 'Profil',
    email: 'Email',
    username: 'Nazwa Użytkownika',
    connectedAccounts: 'Połączone Konta',
    github: 'GitHub',
    githubConnected: ({ login }) => `Połączono jako @${login}`,
    githubNotConnected: 'Niepołączono',
    connectGithub: 'Połącz GitHub',
    disconnectGithub: 'Odłącz GitHub',
    dangerZone: 'Strefa Niebezpieczna',
    deleteAccount: 'Usuń Konto',
    deleteAccountWarning: 'Ta operacja jest nieodwracalna.',
  },

  auth: {
    scanQR: 'Skanuj Kod QR',
    scanQRDescription: 'Zeskanuj kod QR ze swojego terminala',
    scanning: 'Skanowanie...',
    connecting: 'Łączenie...',
    connected: 'Połączono!',
    connectionFailed: 'Połączenie nie powiodło się',
    tryAgain: 'Proszę spróbować ponownie',
    cameraPermission: 'Wymagane uprawnienie kamery',
    cameraPermissionDescription: 'Zezwól na dostęp do kamery, aby skanować kody QR',
    openSettings: 'Otwórz Ustawienia',
  },

  errors: {
    network: 'Błąd sieci. Sprawdź połączenie.',
    server: 'Błąd serwera. Spróbuj ponownie później.',
    unknown: 'Wystąpił nieoczekiwany błąd.',
    timeout: 'Przekroczono limit czasu.',
    notFound: 'Nie znaleziono.',
    unauthorized: 'Proszę zalogować się ponownie.',
    forbidden: 'Brak uprawnień.',
  },

  time: {
    justNow: 'przed chwilą',
    minutesAgo: ({ count }) =>
      `${count} ${plural({ count, one: 'minutę', few: 'minuty', many: 'minut' })} temu`,
    hoursAgo: ({ count }) =>
      `${count} ${plural({ count, one: 'godzinę', few: 'godziny', many: 'godzin' })} temu`,
    daysAgo: ({ count }) =>
      `${count} ${plural({ count, one: 'dzień', few: 'dni', many: 'dni' })} temu`,
    today: 'Dzisiaj',
    yesterday: 'Wczoraj',
  },

  voice: {
    title: 'Asystent Głosowy',
    listening: 'Słucham...',
    processing: 'Przetwarzanie...',
    tapToSpeak: 'Dotknij, aby mówić',
    speakNow: 'Mów teraz',
    noMicrophone: 'Mikrofon niedostępny',
    permissionRequired: 'Wymagane uprawnienie mikrofonu',
  },

  purchases: {
    pro: 'Pro',
    upgrade: 'Ulepsz do Pro',
    restore: 'Przywróć Zakupy',
    alreadyPro: 'Jesteś już użytkownikiem Pro!',
    features: 'Funkcje Pro',
    monthly: 'Miesięcznie',
    yearly: 'Rocznie',
    lifetime: 'Dożywotnio',
    subscribe: 'Subskrybuj',
    purchase: 'Kup',
    thankYou: 'Dziękujemy za wsparcie!',
  },
} as const;
