/**
 * Spanish translations for Happy Mobile
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

export const es: TranslationStructure = {
  common: {
    cancel: 'Cancelar',
    save: 'Guardar',
    ok: 'OK',
    error: 'Error',
    success: 'Éxito',
    loading: 'Cargando...',
    retry: 'Reintentar',
    back: 'Atrás',
    done: 'Hecho',
    continue: 'Continuar',
    yes: 'Sí',
    no: 'No',
    copy: 'Copiar',
    copied: 'Copiado',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Buscar',
    close: 'Cerrar',
  },

  tabs: {
    home: 'Inicio',
    sessions: 'Sesiones',
    friends: 'Amigos',
    settings: 'Ajustes',
  },

  home: {
    title: 'Happy Coder',
    welcome: '¡Bienvenido!',
    noSessions: 'No hay sesiones activas',
    startSession: 'Iniciar nueva sesión',
    recentSessions: 'Sesiones Recientes',
    activeSessions: 'Sesiones Activas',
    sessionsCount: ({ count }) =>
      `${count} ${plural({ count, singular: 'sesión', plural: 'sesiones' })}`,
  },

  sessions: {
    title: 'Sesiones',
    active: 'Activas',
    archived: 'Archivadas',
    noSessions: 'No se encontraron sesiones',
    killSession: 'Terminar Sesión',
    archiveSession: 'Archivar Sesión',
    deleteSession: 'Eliminar Sesión',
    viewDetails: 'Ver Detalles',
    sessionEnded: 'Sesión Terminada',
    sessionArchived: 'Sesión Archivada',
    sessionDeleted: 'Sesión Eliminada',
    confirmEnd: '¿Seguro que quieres terminar esta sesión?',
    confirmArchive: '¿Seguro que quieres archivar esta sesión?',
    confirmDelete: 'Esta acción no se puede deshacer. ¿Eliminar esta sesión?',
    createdAt: ({ time }) => `Creada ${time}`,
    lastActive: ({ time }) => `Última actividad ${time}`,
  },

  friends: {
    title: 'Amigos',
    noFriends: 'Aún no tienes amigos',
    addFriend: 'Añadir Amigo',
    removeFriend: 'Eliminar Amigo',
    pending: 'Pendiente',
    accepted: 'Amigos',
    requests: 'Solicitudes de Amistad',
    searchPlaceholder: 'Buscar por nombre de usuario...',
    confirmRemove: ({ name }) => `¿Eliminar a ${name} de amigos?`,
    requestSent: 'Solicitud de amistad enviada',
    requestAccepted: 'Solicitud de amistad aceptada',
    online: 'En línea',
    offline: 'Desconectado',
    lastSeen: ({ time }) => `Visto por última vez ${time}`,
  },

  settings: {
    title: 'Ajustes',
    account: 'Cuenta',
    accountSubtitle: 'Gestiona tu perfil y seguridad',
    appearance: 'Apariencia',
    appearanceSubtitle: 'Tema y opciones de visualización',
    language: 'Idioma',
    languageSubtitle: 'Elige tu idioma preferido',
    notifications: 'Notificaciones',
    notificationsSubtitle: 'Preferencias de notificaciones push',
    about: 'Acerca de',
    aboutSubtitle: 'Versión de la app y legal',
    logout: 'Cerrar Sesión',
    logoutConfirm: '¿Seguro que quieres cerrar sesión?',
    version: ({ version }) => `Versión ${version}`,
  },

  settingsLanguage: {
    title: 'Idioma',
    description: 'Elige tu idioma preferido. Los cambios se aplican inmediatamente.',
    currentLanguage: 'Idioma Actual',
    automatic: 'Automático',
    automaticSubtitle: 'Usar idioma del dispositivo',
    changed: 'Idioma Cambiado',
    changedMessage: 'El idioma de la app ha sido actualizado.',
  },

  settingsAppearance: {
    title: 'Apariencia',
    theme: 'Tema',
    themeSystem: 'Sistema',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    themeDescription: 'Elige tu esquema de colores preferido',
  },

  settingsAccount: {
    title: 'Cuenta',
    profile: 'Perfil',
    email: 'Correo Electrónico',
    username: 'Nombre de Usuario',
    connectedAccounts: 'Cuentas Conectadas',
    github: 'GitHub',
    githubConnected: ({ login }) => `Conectado como @${login}`,
    githubNotConnected: 'No conectado',
    connectGithub: 'Conectar GitHub',
    disconnectGithub: 'Desconectar GitHub',
    dangerZone: 'Zona de Peligro',
    deleteAccount: 'Eliminar Cuenta',
    deleteAccountWarning: 'Esta acción es irreversible.',
  },

  auth: {
    scanQR: 'Escanear Código QR',
    scanQRDescription: 'Escanea el código QR de tu terminal',
    scanning: 'Escaneando...',
    connecting: 'Conectando...',
    connected: '¡Conectado!',
    connectionFailed: 'Conexión fallida',
    tryAgain: 'Por favor, inténtalo de nuevo',
    cameraPermission: 'Se requiere permiso de cámara',
    cameraPermissionDescription: 'Permite el acceso a la cámara para escanear códigos QR',
    openSettings: 'Abrir Ajustes',
  },

  errors: {
    network: 'Error de red. Comprueba tu conexión.',
    server: 'Error del servidor. Por favor, inténtalo más tarde.',
    unknown: 'Ha ocurrido un error inesperado.',
    timeout: 'Tiempo de espera agotado.',
    notFound: 'No encontrado.',
    unauthorized: 'Por favor, inicia sesión de nuevo.',
    forbidden: 'No tienes permiso.',
  },

  time: {
    justNow: 'ahora mismo',
    minutesAgo: ({ count }) =>
      `hace ${count} ${plural({ count, singular: 'minuto', plural: 'minutos' })}`,
    hoursAgo: ({ count }) =>
      `hace ${count} ${plural({ count, singular: 'hora', plural: 'horas' })}`,
    daysAgo: ({ count }) =>
      `hace ${count} ${plural({ count, singular: 'día', plural: 'días' })}`,
    today: 'Hoy',
    yesterday: 'Ayer',
  },

  voice: {
    title: 'Asistente de Voz',
    listening: 'Escuchando...',
    processing: 'Procesando...',
    tapToSpeak: 'Toca para hablar',
    speakNow: 'Habla ahora',
    noMicrophone: 'Micrófono no disponible',
    permissionRequired: 'Se requiere permiso de micrófono',
  },

  purchases: {
    pro: 'Pro',
    upgrade: 'Actualizar a Pro',
    restore: 'Restaurar Compras',
    alreadyPro: '¡Ya eres miembro Pro!',
    features: 'Funciones Pro',
    monthly: 'Mensual',
    yearly: 'Anual',
    lifetime: 'De por vida',
    subscribe: 'Suscribirse',
    purchase: 'Comprar',
    thankYou: '¡Gracias por tu apoyo!',
  },
} as const;
