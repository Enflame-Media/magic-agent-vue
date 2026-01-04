/**
 * Catalan translations for Happy Mobile
 */

import type { TranslationStructure } from './en';

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

export const ca: TranslationStructure = {
  common: {
    cancel: 'Cancel·lar',
    save: 'Desar',
    ok: "D'acord",
    error: 'Error',
    success: 'Èxit',
    loading: 'Carregant...',
    retry: 'Reintentar',
    back: 'Enrere',
    done: 'Fet',
    continue: 'Continuar',
    yes: 'Sí',
    no: 'No',
    copy: 'Copiar',
    copied: 'Copiat',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Cercar',
    close: 'Tancar',
  },

  tabs: {
    home: 'Inici',
    sessions: 'Sessions',
    friends: 'Amics',
    settings: 'Configuració',
  },

  home: {
    title: 'Happy Coder',
    welcome: 'Benvingut de nou!',
    noSessions: 'No hi ha sessions actives',
    startSession: 'Iniciar nova sessió',
    recentSessions: 'Sessions Recents',
    activeSessions: 'Sessions Actives',
    sessionsCount: ({ count }) =>
      `${count} ${plural({ count, singular: 'sessió', plural: 'sessions' })}`,
  },

  sessions: {
    title: 'Sessions',
    active: 'Actives',
    archived: 'Arxivades',
    noSessions: "No s'han trobat sessions",
    killSession: 'Finalitzar Sessió',
    archiveSession: 'Arxivar Sessió',
    deleteSession: 'Eliminar Sessió',
    viewDetails: 'Veure Detalls',
    sessionEnded: 'Sessió Finalitzada',
    sessionArchived: 'Sessió Arxivada',
    sessionDeleted: 'Sessió Eliminada',
    confirmEnd: 'Segur que vols finalitzar aquesta sessió?',
    confirmArchive: 'Segur que vols arxivar aquesta sessió?',
    confirmDelete: "Aquesta acció no es pot desfer. Eliminar aquesta sessió?",
    createdAt: ({ time }) => `Creada ${time}`,
    lastActive: ({ time }) => `Última activitat ${time}`,
  },

  friends: {
    title: 'Amics',
    noFriends: 'Encara no tens amics',
    addFriend: 'Afegir Amic',
    removeFriend: 'Eliminar Amic',
    pending: 'Pendent',
    accepted: 'Amics',
    requests: "Sol·licituds d'Amistat",
    searchPlaceholder: "Cercar per nom d'usuari...",
    confirmRemove: ({ name }) => `Eliminar ${name} dels amics?`,
    requestSent: "Sol·licitud d'amistat enviada",
    requestAccepted: "Sol·licitud d'amistat acceptada",
    online: 'En línia',
    offline: 'Desconnectat',
    lastSeen: ({ time }) => `Vist per última vegada ${time}`,
  },

  settings: {
    title: 'Configuració',
    account: 'Compte',
    accountSubtitle: 'Gestiona el teu perfil i seguretat',
    appearance: 'Aparença',
    appearanceSubtitle: 'Tema i opcions de visualització',
    language: 'Idioma',
    languageSubtitle: 'Tria el teu idioma preferit',
    notifications: 'Notificacions',
    notificationsSubtitle: 'Preferències de notificacions push',
    about: 'Sobre',
    aboutSubtitle: "Versió de l'app i legal",
    logout: 'Tancar Sessió',
    logoutConfirm: 'Segur que vols tancar la sessió?',
    version: ({ version }) => `Versió ${version}`,
  },

  settingsLanguage: {
    title: 'Idioma',
    description: "Tria el teu idioma preferit. Els canvis s'apliquen immediatament.",
    currentLanguage: 'Idioma Actual',
    automatic: 'Automàtic',
    automaticSubtitle: 'Utilitzar idioma del dispositiu',
    changed: 'Idioma Canviat',
    changedMessage: "L'idioma de l'app s'ha actualitzat.",
  },

  settingsAppearance: {
    title: 'Aparença',
    theme: 'Tema',
    themeSystem: 'Sistema',
    themeLight: 'Clar',
    themeDark: 'Fosc',
    themeDescription: "Tria el teu esquema de colors preferit",
  },

  settingsAccount: {
    title: 'Compte',
    profile: 'Perfil',
    email: 'Correu Electrònic',
    username: "Nom d'Usuari",
    connectedAccounts: 'Comptes Connectats',
    github: 'GitHub',
    githubConnected: ({ login }) => `Connectat com @${login}`,
    githubNotConnected: 'No connectat',
    connectGithub: 'Connectar GitHub',
    disconnectGithub: 'Desconnectar GitHub',
    dangerZone: 'Zona de Perill',
    deleteAccount: 'Eliminar Compte',
    deleteAccountWarning: 'Aquesta acció és irreversible.',
  },

  auth: {
    scanQR: 'Escanejar Codi QR',
    scanQRDescription: 'Escaneja el codi QR del teu terminal',
    scanning: 'Escanejant...',
    connecting: 'Connectant...',
    connected: 'Connectat!',
    connectionFailed: 'Connexió fallida',
    tryAgain: 'Si us plau, torna-ho a provar',
    cameraPermission: 'Es requereix permís de càmera',
    cameraPermissionDescription: "Permet l'accés a la càmera per escanejar codis QR",
    openSettings: 'Obrir Configuració',
  },

  errors: {
    network: 'Error de xarxa. Comprova la teva connexió.',
    server: 'Error del servidor. Si us plau, torna-ho a provar més tard.',
    unknown: "S'ha produït un error inesperat.",
    timeout: "Temps d'espera esgotat.",
    notFound: 'No trobat.',
    unauthorized: 'Si us plau, inicia sessió de nou.',
    forbidden: 'No tens permís.',
  },

  time: {
    justNow: 'ara mateix',
    minutesAgo: ({ count }) =>
      `fa ${count} ${plural({ count, singular: 'minut', plural: 'minuts' })}`,
    hoursAgo: ({ count }) =>
      `fa ${count} ${plural({ count, singular: 'hora', plural: 'hores' })}`,
    daysAgo: ({ count }) =>
      `fa ${count} ${plural({ count, singular: 'dia', plural: 'dies' })}`,
    today: 'Avui',
    yesterday: 'Ahir',
  },

  voice: {
    title: 'Assistent de Veu',
    listening: 'Escoltant...',
    processing: 'Processant...',
    tapToSpeak: 'Toca per parlar',
    speakNow: 'Parla ara',
    noMicrophone: 'Micròfon no disponible',
    permissionRequired: 'Es requereix permís de micròfon',
  },

  purchases: {
    pro: 'Pro',
    upgrade: 'Actualitzar a Pro',
    restore: 'Restaurar Compres',
    alreadyPro: 'Ja ets membre Pro!',
    features: 'Funcions Pro',
    monthly: 'Mensual',
    yearly: 'Anual',
    lifetime: 'De per vida',
    subscribe: 'Subscriure',
    purchase: 'Comprar',
    thankYou: 'Gràcies pel teu suport!',
  },
} as const;
