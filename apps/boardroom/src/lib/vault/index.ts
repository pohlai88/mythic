/**
 * Vault/Encryption Module Exports
 *
 * Phase 18: Centralized encryption exports
 */

export {
  encryptionKeySchema,
  encryptedDataSchema,
  decryptionRequestSchema,
  vaultKeyStorageSchema,
  encryptionRequestSchema,
  type EncryptionKey,
  type EncryptedData,
  type DecryptionRequest,
  type VaultKeyStorage,
  type EncryptionRequest,
} from './encryption-schemas'

export {
  encryptDocument,
  decryptDocument,
  validateEncryptionKey,
  validateEncryptedData,
  validateDecryptionRequest,
} from './encryption-service'
