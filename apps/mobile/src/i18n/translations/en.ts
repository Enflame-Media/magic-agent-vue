/**
 * English translations for Happy Mobile
 *
 * Mobile-focused subset of translations from happy-app.
 * Values can be:
 * - String constants for static text
 * - Functions with typed object parameters for dynamic text
 */

/**
 * English plural helper function
 */
function plural({
  count,
  singular,
  plural,
}: {
  count: number;
  singular: string;
  plural: string;
}): string {
  return count === 1 ? singular : plural;
}

export const en = {
  // ─────────────────────────────────────────────────────────────────────────────
  // Common UI Elements
  // ─────────────────────────────────────────────────────────────────────────────
  common: {
    cancel: 'Cancel',
    save: 'Save',
    ok: 'OK',
    error: 'Error',
    success: 'Success',
    loading: 'Loading...',
    retry: 'Retry',
    back: 'Back',
    done: 'Done',
    continue: 'Continue',
    yes: 'Yes',
    no: 'No',
    copy: 'Copy',
    copied: 'Copied',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    close: 'Close',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Tab Navigation
  // ─────────────────────────────────────────────────────────────────────────────
  tabs: {
    home: 'Home',
    sessions: 'Sessions',
    friends: 'Friends',
    settings: 'Settings',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Home Screen
  // ─────────────────────────────────────────────────────────────────────────────
  home: {
    title: 'Happy Coder',
    welcome: 'Welcome back!',
    noSessions: 'No active sessions',
    startSession: 'Start a new session',
    recentSessions: 'Recent Sessions',
    activeSessions: 'Active Sessions',
    sessionsCount: ({ count }: { count: number }) =>
      `${count} ${plural({ count, singular: 'session', plural: 'sessions' })}`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Sessions
  // ─────────────────────────────────────────────────────────────────────────────
  sessions: {
    title: 'Sessions',
    active: 'Active',
    archived: 'Archived',
    noSessions: 'No sessions found',
    killSession: 'End Session',
    archiveSession: 'Archive Session',
    deleteSession: 'Delete Session',
    viewDetails: 'View Details',
    sessionEnded: 'Session Ended',
    sessionArchived: 'Session Archived',
    sessionDeleted: 'Session Deleted',
    confirmEnd: 'Are you sure you want to end this session?',
    confirmArchive: 'Are you sure you want to archive this session?',
    confirmDelete: 'This action cannot be undone. Delete this session?',
    createdAt: ({ time }: { time: string }) => `Created ${time}`,
    lastActive: ({ time }: { time: string }) => `Last active ${time}`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Friends
  // ─────────────────────────────────────────────────────────────────────────────
  friends: {
    title: 'Friends',
    noFriends: 'No friends yet',
    addFriend: 'Add Friend',
    removeFriend: 'Remove Friend',
    pending: 'Pending',
    accepted: 'Friends',
    requests: 'Friend Requests',
    searchPlaceholder: 'Search by username...',
    confirmRemove: ({ name }: { name: string }) =>
      `Remove ${name} from friends?`,
    requestSent: 'Friend request sent',
    requestAccepted: 'Friend request accepted',
    online: 'Online',
    offline: 'Offline',
    lastSeen: ({ time }: { time: string }) => `Last seen ${time}`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Settings
  // ─────────────────────────────────────────────────────────────────────────────
  settings: {
    title: 'Settings',
    account: 'Account',
    accountSubtitle: 'Manage your profile and security',
    appearance: 'Appearance',
    appearanceSubtitle: 'Theme and display options',
    language: 'Language',
    languageSubtitle: 'Choose your preferred language',
    notifications: 'Notifications',
    notificationsSubtitle: 'Push notification preferences',
    about: 'About',
    aboutSubtitle: 'App version and legal',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to logout?',
    version: ({ version }: { version: string }) => `Version ${version}`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Language Settings
  // ─────────────────────────────────────────────────────────────────────────────
  settingsLanguage: {
    title: 'Language',
    description:
      'Choose your preferred language. Changes apply immediately.',
    currentLanguage: 'Current Language',
    automatic: 'Automatic',
    automaticSubtitle: 'Use device language',
    changed: 'Language Changed',
    changedMessage: 'The app language has been updated.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Appearance Settings
  // ─────────────────────────────────────────────────────────────────────────────
  settingsAppearance: {
    title: 'Appearance',
    theme: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeDescription: 'Choose your preferred color scheme',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Account Settings
  // ─────────────────────────────────────────────────────────────────────────────
  settingsAccount: {
    title: 'Account',
    profile: 'Profile',
    email: 'Email',
    username: 'Username',
    connectedAccounts: 'Connected Accounts',
    github: 'GitHub',
    githubConnected: ({ login }: { login: string }) => `Connected as @${login}`,
    githubNotConnected: 'Not connected',
    connectGithub: 'Connect GitHub',
    disconnectGithub: 'Disconnect GitHub',
    dangerZone: 'Danger Zone',
    deleteAccount: 'Delete Account',
    deleteAccountWarning: 'This action is irreversible.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Authentication
  // ─────────────────────────────────────────────────────────────────────────────
  auth: {
    scanQR: 'Scan QR Code',
    scanQRDescription: 'Scan the QR code from your terminal',
    scanning: 'Scanning...',
    connecting: 'Connecting...',
    connected: 'Connected!',
    connectionFailed: 'Connection failed',
    tryAgain: 'Please try again',
    cameraPermission: 'Camera permission required',
    cameraPermissionDescription:
      'Allow camera access to scan QR codes',
    openSettings: 'Open Settings',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Errors
  // ─────────────────────────────────────────────────────────────────────────────
  errors: {
    network: 'Network error. Check your connection.',
    server: 'Server error. Please try again later.',
    unknown: 'An unexpected error occurred.',
    timeout: 'Request timed out.',
    notFound: 'Not found.',
    unauthorized: 'Please log in again.',
    forbidden: 'You do not have permission.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Time Formatting
  // ─────────────────────────────────────────────────────────────────────────────
  time: {
    justNow: 'just now',
    minutesAgo: ({ count }: { count: number }) =>
      `${count} ${plural({ count, singular: 'minute', plural: 'minutes' })} ago`,
    hoursAgo: ({ count }: { count: number }) =>
      `${count} ${plural({ count, singular: 'hour', plural: 'hours' })} ago`,
    daysAgo: ({ count }: { count: number }) =>
      `${count} ${plural({ count, singular: 'day', plural: 'days' })} ago`,
    today: 'Today',
    yesterday: 'Yesterday',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Voice Assistant
  // ─────────────────────────────────────────────────────────────────────────────
  voice: {
    title: 'Voice Assistant',
    listening: 'Listening...',
    processing: 'Processing...',
    tapToSpeak: 'Tap to speak',
    speakNow: 'Speak now',
    noMicrophone: 'Microphone not available',
    permissionRequired: 'Microphone permission required',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Purchases / Pro
  // ─────────────────────────────────────────────────────────────────────────────
  purchases: {
    pro: 'Pro',
    upgrade: 'Upgrade to Pro',
    restore: 'Restore Purchases',
    alreadyPro: 'You are a Pro member!',
    features: 'Pro Features',
    monthly: 'Monthly',
    yearly: 'Yearly',
    lifetime: 'Lifetime',
    subscribe: 'Subscribe',
    purchase: 'Purchase',
    thankYou: 'Thank you for your support!',
  },
} as const;

export type Translations = typeof en;

/**
 * Generic translation type that matches the structure of Translations
 * but allows different string values (for other languages)
 */
export type TranslationStructure = {
  readonly [K in keyof Translations]: {
    readonly [P in keyof Translations[K]]: Translations[K][P] extends string
      ? string
      : Translations[K][P] extends (...args: infer A) => string
        ? (...args: A) => string
        : Translations[K][P];
  };
};
