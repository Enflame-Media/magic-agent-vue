# @happy-vue/protocol

Shared protocol types for the Happy Vue.js monorepo. This package provides **Zod schemas** and **TypeScript types** for the Happy sync protocol, serving as the single source of truth for Vue.js web and mobile apps.

> **Note**: This is a port of `@happy/protocol` from the main Happy monorepo, adapted for the Vue.js ecosystem.

## Installation

This package is automatically available within the happy-vue monorepo via **yarn workspaces**. No additional installation is required.

```bash
# From monorepo root - already included in workspace
yarn install
```

## Usage

```typescript
import {
  ApiUpdateSchema,
  ApiEphemeralUpdateSchema,
  type ApiUpdate,
  type ApiEphemeralUpdate
} from '@happy-vue/protocol';

// Validate incoming update
const result = ApiUpdateSchema.safeParse(data);
if (result.success) {
  const update: ApiUpdate = result.data;
  switch (update.t) {
    case 'new-message':
    case 'new-session':
    case 'update-session':
    case 'delete-session':
      // All session updates use 'sid' (standardized in HAP-654)
      console.log('Session:', update.sid);
      break;
    // ... handle other types
  }
}
```

## Available Exports

### Update Schemas (Persistent Events)

These are state changes that are stored and synced across devices.

| Schema | Type | Description |
|--------|------|-------------|
| `ApiUpdateSchema` | `ApiUpdate` | Discriminated union of all update types |
| `ApiUpdateNewMessageSchema` | `ApiUpdateNewMessage` | New encrypted message in session |
| `ApiUpdateNewSessionSchema` | `ApiUpdateNewSession` | New session created |
| `ApiDeleteSessionSchema` | `ApiDeleteSession` | Session archived/deleted |
| `ApiUpdateSessionStateSchema` | `ApiUpdateSessionState` | Session state change |
| `ApiUpdateAccountSchema` | `ApiUpdateAccount` | Account metadata update |
| `ApiNewMachineSchema` | `ApiNewMachine` | New machine registered |
| `ApiUpdateMachineStateSchema` | `ApiUpdateMachineState` | Machine state change |
| `ApiNewArtifactSchema` | `ApiNewArtifact` | New artifact created |
| `ApiUpdateArtifactSchema` | `ApiUpdateArtifact` | Artifact updated |
| `ApiDeleteArtifactSchema` | `ApiDeleteArtifact` | Artifact deleted |
| `ApiRelationshipUpdatedSchema` | `ApiRelationshipUpdated` | Friend relationship change |
| `ApiNewFeedPostSchema` | `ApiNewFeedPost` | Activity feed post |
| `ApiKvBatchUpdateSchema` | `ApiKvBatchUpdate` | KV store batch update |

### Ephemeral Schemas (Transient Events)

Real-time status updates that don't require persistence.

| Schema | Type | Description |
|--------|------|-------------|
| `ApiEphemeralUpdateSchema` | `ApiEphemeralUpdate` | Union of all ephemeral types |
| `ApiEphemeralActivityUpdateSchema` | `ApiEphemeralActivityUpdate` | Session activity status |
| `ApiEphemeralUsageUpdateSchema` | `ApiEphemeralUsageUpdate` | Token/cost usage |
| `ApiEphemeralMachineActivityUpdateSchema` | `ApiEphemeralMachineActivityUpdate` | Machine activity |
| `ApiEphemeralMachineStatusUpdateSchema` | `ApiEphemeralMachineStatusUpdate` | Machine online/offline |

### Payload Wrappers

Container schemas for WebSocket message sequencing.

| Schema | Type | Description |
|--------|------|-------------|
| `ApiUpdateContainerSchema` | `ApiUpdateContainer` | Sequenced update wrapper |
| `UpdatePayloadSchema` | `UpdatePayload` | Server-side wire format |
| `EphemeralPayloadSchema` | `EphemeralPayload` | Ephemeral wrapper |

### Common Types

Shared types used across the protocol.

| Schema | Type | Description |
|--------|------|-------------|
| `GitHubProfileSchema` | `GitHubProfile` | GitHub OAuth profile data |
| `ImageRefSchema` | `ImageRef` | Image/avatar reference |
| `RelationshipStatusSchema` | `RelationshipStatus` | User relationship enum |
| `UserProfileSchema` | `UserProfile` | Social user profile |
| `FeedBodySchema` | `FeedBody` | Activity feed content |
| `EncryptedContentSchema` | `EncryptedContent` | Encrypted payload wrapper |
| `VersionedValueSchema` | `VersionedValue` | Optimistic concurrency value |
| `NullableVersionedValueSchema` | `NullableVersionedValue` | Nullable versioned value |

### Type-Safe ID Helpers

Helper functions for extracting IDs from update types.

| Function | Description |
|----------|-------------|
| `hasSessionId(update)` | Type guard for session ID presence |
| `getSessionId(update)` | Extract session ID from update |
| `tryGetSessionId(update)` | Safe session ID extraction |
| `hasMachineId(update)` | Type guard for machine ID presence |
| `getMachineId(update)` | Extract machine ID from update |
| `tryGetMachineId(update)` | Safe machine ID extraction |

## Field Name Reference

### Session ID Field Names

All session-related schemas use `sid` (standardized in HAP-654):

| Schema | Update Type | Field Name | Discriminator |
|--------|-------------|------------|---------------|
| `ApiUpdateNewSessionSchema` | `new-session` | `sid` | `t` |
| `ApiUpdateSessionStateSchema` | `update-session` | `sid` | `t` |
| `ApiUpdateNewMessageSchema` | `new-message` | `sid` | `t` |
| `ApiDeleteSessionSchema` | `delete-session` | `sid` | `t` |
| `ApiEphemeralActivityUpdateSchema` | `activity` | `sid` | `type` |
| `ApiEphemeralUsageUpdateSchema` | `usage` | `sid` | `type` |

### Machine ID Field Names

All machine-related schemas use `machineId` (standardized in HAP-655):

| Schema | Update Type | Field Name | Discriminator |
|--------|-------------|------------|---------------|
| `ApiNewMachineSchema` | `new-machine` | `machineId` | `t` |
| `ApiUpdateMachineStateSchema` | `update-machine` | `machineId` | `t` |
| `ApiEphemeralMachineStatusUpdateSchema` | `machine-status` | `machineId` | `type` |
| `ApiEphemeralMachineActivityUpdateSchema` | `machine-activity` | `machineId` | `type` |

### Discriminator Fields

| Category | Discriminator Field | Example |
|----------|---------------------|---------|
| Persistent Updates | `t` | `update.t === 'new-session'` |
| Ephemeral Events | `type` | `event.type === 'activity'` |

## Building

```bash
# From packages/protocol
yarn build        # Build ESM + CJS + DTS output
yarn typecheck    # Type check without emitting
yarn clean        # Remove dist folder

# From monorepo root
yarn workspace @happy-vue/protocol build
yarn workspace @happy-vue/protocol typecheck
```

## Output Files

After building, the `dist/` folder contains:

| File | Format | Purpose |
|------|--------|---------|
| `index.js` | ESM | Modern ES modules |
| `index.cjs` | CommonJS | Legacy require() support |
| `index.d.ts` | TypeScript | ESM type declarations |
| `index.d.cts` | TypeScript | CJS type declarations |
| `*.map` | Sourcemap | Debugging support |

## Peer Dependencies

This package requires `zod@^3.0.0` as a peer dependency. All consumer apps in the monorepo already have zod installed.

## Related Issues

- **HAP-660**: Epic - Vue.js Migration
- **HAP-661**: Initialize happy-vue monorepo
- **HAP-663**: TypeScript configuration
- **HAP-665**: Port @happy/protocol (this package)

## License

MIT
