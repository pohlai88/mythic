/**
 * Encryption Operation Schemas
 *
 * Phase 18: Encryption operations validation with Zod
 * Vanguard Security: Validate all encryption/decryption operations
 */

import { z as z4 } from 'zod/v4'

/**
 * Encryption Key Schema
 *
 * Vanguard Security: Validate encryption key structure
 */
export const encryptionKeySchema = z4.object({
  keyId: z4.string().uuid(),
  algorithm: z4.literal('AES-GCM'),
  keyLength: z4.literal(256),
  extractable: z4.boolean().default(false), // Security: keys should not be extractable
  usages: z4.array(z4.enum(['encrypt', 'decrypt'])).length(2),
}).describe('Encryption key validation schema')

/**
 * Encrypted Data Schema
 *
 * Vanguard Security: Validate encrypted data structure
 */
export const encryptedDataSchema = z4.object({
  encrypted: z4.string().base64(),
  iv: z4.string().base64().length(16), // 12 bytes = 16 base64 chars
  algorithm: z4.literal('AES-GCM'),
  keyId: z4.string().uuid(),
  authorizedUsers: z4.array(z4.string().uuid()).min(1).max(10), // Limit authorized users
  createdAt: z4.date(),
  expiresAt: z4.date().optional(), // Optional expiration
}).describe('Encrypted data structure validation')

/**
 * Decryption Request Schema
 *
 * Vanguard Security: Validate decryption request
 */
export const decryptionRequestSchema = z4.object({
  encryptedDataId: z4.string().uuid(),
  requestingUserId: z4.string().uuid(),
  reason: z4.string().min(10).max(500), // Require reason for audit
}).describe('Decryption request validation')

/**
 * Vault Key Storage Schema
 *
 * Vanguard Security: Validate vault key storage
 */
export const vaultKeyStorageSchema = z4.object({
  keyId: z4.string().uuid(),
  encryptedKey: z4.string().base64(), // Key encrypted with user's public key
  authorizedUserIds: z4.array(z4.string().uuid()).min(1).max(10),
  createdAt: z4.date(),
  lastAccessedAt: z4.date().optional(),
  accessCount: z4.number().int().nonnegative().default(0),
}).describe('Vault key storage validation')

/**
 * Encryption Request Schema
 */
export const encryptionRequestSchema = z4.object({
  documentId: z4.string().uuid().optional(),
  documentName: z4.string().min(1).max(255),
  documentType: z4.string().min(1).max(100),
  authorizedUsers: z4.array(z4.string().uuid()).min(1).max(10),
  expiresAt: z4.date().optional(),
  reason: z4.string().min(10).max(500).optional(), // Optional reason for audit
}).describe('Encryption request validation')

/**
 * Type exports
 */
export type EncryptionKey = z4.infer<typeof encryptionKeySchema>
export type EncryptedData = z4.infer<typeof encryptedDataSchema>
export type DecryptionRequest = z4.infer<typeof decryptionRequestSchema>
export type VaultKeyStorage = z4.infer<typeof vaultKeyStorageSchema>
export type EncryptionRequest = z4.infer<typeof encryptionRequestSchema>
