/**
 * Portuguese translations for Happy Mobile
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

export const pt: TranslationStructure = {
  common: {
    cancel: 'Cancelar',
    save: 'Guardar',
    ok: 'OK',
    error: 'Erro',
    success: 'Sucesso',
    loading: 'A carregar...',
    retry: 'Tentar Novamente',
    back: 'Voltar',
    done: 'Concluído',
    continue: 'Continuar',
    yes: 'Sim',
    no: 'Não',
    copy: 'Copiar',
    copied: 'Copiado',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Pesquisar',
    close: 'Fechar',
  },

  tabs: {
    home: 'Início',
    sessions: 'Sessões',
    friends: 'Amigos',
    settings: 'Definições',
  },

  home: {
    title: 'Happy Coder',
    welcome: 'Bem-vindo de volta!',
    noSessions: 'Sem sessões ativas',
    startSession: 'Iniciar nova sessão',
    recentSessions: 'Sessões Recentes',
    activeSessions: 'Sessões Ativas',
    sessionsCount: ({ count }) =>
      `${count} ${plural({ count, singular: 'sessão', plural: 'sessões' })}`,
  },

  sessions: {
    title: 'Sessões',
    active: 'Ativas',
    archived: 'Arquivadas',
    noSessions: 'Nenhuma sessão encontrada',
    killSession: 'Terminar Sessão',
    archiveSession: 'Arquivar Sessão',
    deleteSession: 'Eliminar Sessão',
    viewDetails: 'Ver Detalhes',
    sessionEnded: 'Sessão Terminada',
    sessionArchived: 'Sessão Arquivada',
    sessionDeleted: 'Sessão Eliminada',
    confirmEnd: 'Tem a certeza que quer terminar esta sessão?',
    confirmArchive: 'Tem a certeza que quer arquivar esta sessão?',
    confirmDelete: 'Esta ação não pode ser desfeita. Eliminar esta sessão?',
    createdAt: ({ time }) => `Criada ${time}`,
    lastActive: ({ time }) => `Última atividade ${time}`,
  },

  friends: {
    title: 'Amigos',
    noFriends: 'Ainda não tem amigos',
    addFriend: 'Adicionar Amigo',
    removeFriend: 'Remover Amigo',
    pending: 'Pendente',
    accepted: 'Amigos',
    requests: 'Pedidos de Amizade',
    searchPlaceholder: 'Pesquisar por nome de utilizador...',
    confirmRemove: ({ name }) => `Remover ${name} dos amigos?`,
    requestSent: 'Pedido de amizade enviado',
    requestAccepted: 'Pedido de amizade aceite',
    online: 'Online',
    offline: 'Offline',
    lastSeen: ({ time }) => `Visto pela última vez ${time}`,
  },

  settings: {
    title: 'Definições',
    account: 'Conta',
    accountSubtitle: 'Gerir o seu perfil e segurança',
    appearance: 'Aparência',
    appearanceSubtitle: 'Tema e opções de visualização',
    language: 'Idioma',
    languageSubtitle: 'Escolha o seu idioma preferido',
    notifications: 'Notificações',
    notificationsSubtitle: 'Preferências de notificações push',
    about: 'Sobre',
    aboutSubtitle: 'Versão da app e informação legal',
    logout: 'Terminar Sessão',
    logoutConfirm: 'Tem a certeza que quer terminar sessão?',
    version: ({ version }) => `Versão ${version}`,
  },

  settingsLanguage: {
    title: 'Idioma',
    description: 'Escolha o seu idioma preferido. As alterações são aplicadas imediatamente.',
    currentLanguage: 'Idioma Atual',
    automatic: 'Automático',
    automaticSubtitle: 'Usar idioma do dispositivo',
    changed: 'Idioma Alterado',
    changedMessage: 'O idioma da app foi atualizado.',
  },

  settingsAppearance: {
    title: 'Aparência',
    theme: 'Tema',
    themeSystem: 'Sistema',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    themeDescription: 'Escolha o seu esquema de cores preferido',
  },

  settingsAccount: {
    title: 'Conta',
    profile: 'Perfil',
    email: 'Email',
    username: 'Nome de Utilizador',
    connectedAccounts: 'Contas Ligadas',
    github: 'GitHub',
    githubConnected: ({ login }) => `Ligado como @${login}`,
    githubNotConnected: 'Não ligado',
    connectGithub: 'Ligar GitHub',
    disconnectGithub: 'Desligar GitHub',
    dangerZone: 'Zona de Perigo',
    deleteAccount: 'Eliminar Conta',
    deleteAccountWarning: 'Esta ação é irreversível.',
  },

  auth: {
    scanQR: 'Ler Código QR',
    scanQRDescription: 'Leia o código QR do seu terminal',
    scanning: 'A ler...',
    connecting: 'A ligar...',
    connected: 'Ligado!',
    connectionFailed: 'Falha na ligação',
    tryAgain: 'Por favor, tente novamente',
    cameraPermission: 'Permissão de câmara necessária',
    cameraPermissionDescription: 'Permita o acesso à câmara para ler códigos QR',
    openSettings: 'Abrir Definições',
  },

  errors: {
    network: 'Erro de rede. Verifique a sua ligação.',
    server: 'Erro do servidor. Por favor, tente mais tarde.',
    unknown: 'Ocorreu um erro inesperado.',
    timeout: 'O pedido expirou.',
    notFound: 'Não encontrado.',
    unauthorized: 'Por favor, inicie sessão novamente.',
    forbidden: 'Não tem permissão.',
  },

  time: {
    justNow: 'agora mesmo',
    minutesAgo: ({ count }) =>
      `há ${count} ${plural({ count, singular: 'minuto', plural: 'minutos' })}`,
    hoursAgo: ({ count }) =>
      `há ${count} ${plural({ count, singular: 'hora', plural: 'horas' })}`,
    daysAgo: ({ count }) =>
      `há ${count} ${plural({ count, singular: 'dia', plural: 'dias' })}`,
    today: 'Hoje',
    yesterday: 'Ontem',
  },

  voice: {
    title: 'Assistente de Voz',
    listening: 'A ouvir...',
    processing: 'A processar...',
    tapToSpeak: 'Toque para falar',
    speakNow: 'Fale agora',
    noMicrophone: 'Microfone não disponível',
    permissionRequired: 'Permissão de microfone necessária',
  },

  purchases: {
    pro: 'Pro',
    upgrade: 'Atualizar para Pro',
    restore: 'Restaurar Compras',
    alreadyPro: 'Já é membro Pro!',
    features: 'Funcionalidades Pro',
    monthly: 'Mensal',
    yearly: 'Anual',
    lifetime: 'Vitalício',
    subscribe: 'Subscrever',
    purchase: 'Comprar',
    thankYou: 'Obrigado pelo seu apoio!',
  },
} as const;
