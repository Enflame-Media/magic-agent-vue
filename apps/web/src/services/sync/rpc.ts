import { wsService } from './WebSocketService';
import { secureStorage } from '@/services/storage';
import { decodeBase64 } from '@/services/base64';
import { EncryptionManager } from '@/services/encryption/encryptionManager';
import { useMachinesStore } from '@/stores/machines';

type RpcAck = {
  ok?: boolean;
  result?: string;
  cancelled?: boolean;
  requestId?: string;
};

let encryptionManagerPromise: Promise<EncryptionManager | null> | null = null;

async function getEncryptionManager(): Promise<EncryptionManager | null> {
  if (!encryptionManagerPromise) {
    encryptionManagerPromise = (async () => {
      const credentials = await secureStorage.getCredentials();
      if (!credentials?.secret) {
        return null;
      }
      const secretBytes = decodeBase64(credentials.secret);
      return EncryptionManager.create(secretBytes);
    })();
  }
  return encryptionManagerPromise;
}

export async function machineRPC<R, A>(
  machineId: string,
  method: string,
  params: A,
  options?: { timeout?: number }
): Promise<R> {
  const encryptionManager = await getEncryptionManager();
  if (!encryptionManager) {
    throw new Error('Encryption not initialized');
  }

  const machinesStore = useMachinesStore();
  const machine = machinesStore.getMachine(machineId);
  if (!machine) {
    throw new Error(`Machine not found: ${machineId}`);
  }

  const machineEncryption = await encryptionManager.ensureMachineEncryption(
    machineId,
    machine.dataEncryptionKey
  );

  const encryptedParams = await machineEncryption.encryptRaw(params);

  const result = await wsService.emitWithAck<RpcAck>(
    'rpc-call',
    {
      method: `${machineId}:${method}`,
      params: encryptedParams,
    },
    options?.timeout
  );

  if (result.ok && result.result) {
    const decrypted = await machineEncryption.decryptRaw(result.result);
    if (decrypted === null) {
      throw new Error('Failed to decrypt RPC response');
    }
    return decrypted as R;
  }

  if (result.cancelled) {
    throw new Error('RPC call was cancelled');
  }

  throw new Error('RPC call failed');
}
