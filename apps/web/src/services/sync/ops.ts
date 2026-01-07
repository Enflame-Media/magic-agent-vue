import { machineRPC } from './rpc';
import { useSessionsStore, type Session } from '@/stores/sessions';

export type SpawnSessionResult =
  | { type: 'success'; sessionId: string; resumedFrom?: string; message?: string }
  | { type: 'requestToApproveDirectoryCreation'; directory: string }
  | { type: 'error'; errorMessage: string };

export interface SpawnSessionOptions {
  machineId: string;
  directory: string;
  approvedNewDirectoryCreation?: boolean;
  token?: string;
  agent?: 'codex' | 'claude' | 'gemini';
  sessionId?: string;
}

export interface PollForSessionOptions {
  interval?: number;
  maxAttempts?: number;
  onPoll?: (attempt: number, maxAttempts: number) => void;
}

export function isTemporaryPidSessionId(sessionId: string): boolean {
  return sessionId.startsWith('PID-');
}

function getSessionMachineId(session: Session): string | null {
  try {
    const meta = JSON.parse(session.metadata);
    return meta.machineId ?? null;
  } catch {
    return null;
  }
}

export async function pollForRealSession(
  machineId: string,
  spawnStartTime: number,
  options: PollForSessionOptions = {}
): Promise<string | null> {
  const { interval = 5000, maxAttempts = 24, onPoll } = options;
  const sessionsStore = useSessionsStore();

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    onPoll?.(attempt + 1, maxAttempts);

    const newSession = sessionsStore.sessionsList.find((session) => {
      if (session.createdAt <= spawnStartTime) {
        return false;
      }
      const sessionMachineId = getSessionMachineId(session);
      return sessionMachineId ? sessionMachineId === machineId : true;
    });

    if (newSession) {
      return newSession.id;
    }
  }

  return null;
}

const SESSION_SPAWN_TIMEOUT_MS = 90000;

export async function machineSpawnNewSession(
  options: SpawnSessionOptions
): Promise<SpawnSessionResult> {
  const {
    machineId,
    directory,
    approvedNewDirectoryCreation = false,
    token,
    agent,
    sessionId,
  } = options;

  try {
    return await machineRPC<SpawnSessionResult, {
      type: 'spawn-in-directory';
      directory: string;
      approvedNewDirectoryCreation?: boolean;
      token?: string;
      agent?: 'codex' | 'claude' | 'gemini';
      sessionId?: string;
    }>(
      machineId,
      'spawn-happy-session',
      {
        type: 'spawn-in-directory',
        directory,
        approvedNewDirectoryCreation,
        token,
        agent,
        sessionId,
      },
      { timeout: SESSION_SPAWN_TIMEOUT_MS }
    );
  } catch (error) {
    return {
      type: 'error',
      errorMessage: error instanceof Error ? error.message : 'Failed to spawn session',
    };
  }
}
