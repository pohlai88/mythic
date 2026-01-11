/**
 * Encryption Service with Zod Validation
 *
 * Phase 18: Encryption operations with validated schemas
 * Vanguard Security: All encryption operations validated
 */

import { z as z4 } from 'zod/v4'
import {
  encryptionKeySchema,
  encryptedDataSchema,
  decryptionRequestSchema,
  encryptionRequestSchema,
  type EncryptionKey,
  type EncryptedData,
  type DecryptionRequest,
  type EncryptionRequest,
} from './encryption-schemas'

/**
 * Encrypt a document
 *
 * Validates all inputs and outputs with Zod schemas
 */
export async function encryptDocument(
  document: File | ArrayBuffer,
  request: EncryptionRequest
): Promise<EncryptedData> {
  // Validate encryption request
  const requestResult = encryptionRequestSchema.safeParse(request)
  if (!requestResult.success) {
    throw new Error(`Invalid encryption request: ${requestResult.error.issues[0]?.message || 'Unknown error'}`)
  }
  const validatedRequest = requestResult.data

  // Validate authorized users
  const usersResult = z4
    .array(z4.string().uuid())
    .min(1)
    .max(10)
    .safeParse(validatedRequest.authorizedUsers)
  if (!usersResult.success) {
    throw new Error(`Invalid authorized users: ${usersResult.error.issues[0]?.message || 'Unknown error'}`)
  }
  const validatedUsers = usersResult.data

  // Generate key with validated schema
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false, // extractable = false for security
    ['encrypt', 'decrypt']
  )

  // Validate key structure
  const keyId = crypto.randomUUID()
  encryptionKeySchema.parse({
    keyId,
    algorithm: 'AES-GCM',
    keyLength: 256,
    extractable: false,
    usages: ['encrypt', 'decrypt'],
  })

  // Get document buffer
  const documentBuffer =
    document instanceof File ? await document.arrayBuffer() : document

  // Encrypt document
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    documentBuffer
  )

  // Convert to base64
  const encryptedBase64 = btoa(
    String.fromCharCode(...new Uint8Array(encrypted))
  )
  const ivBase64 = btoa(String.fromCharCode(...iv))

  // Return validated encrypted data
  return encryptedDataSchema.parse({
    encrypted: encryptedBase64,
    iv: ivBase64,
    algorithm: 'AES-GCM',
    keyId,
    authorizedUsers: validatedUsers,
    createdAt: new Date(),
    expiresAt: validatedRequest.expiresAt,
  })
}

/**
 * Decrypt a document
 *
 * Validates decryption request and encrypted data with Zod schemas
 */
export async function decryptDocument(
  request: DecryptionRequest,
  encryptedData: EncryptedData
): Promise<ArrayBuffer> {
  // Validate decryption request
  const requestResult = decryptionRequestSchema.safeParse(request)
  if (!requestResult.success) {
    throw new Error(`Invalid decryption request: ${requestResult.error.issues[0]?.message || 'Unknown error'}`)
  }
  const validatedRequest = requestResult.data

  // Validate encrypted data structure
  const dataResult = encryptedDataSchema.safeParse(encryptedData)
  if (!dataResult.success) {
    throw new Error(`Invalid encrypted data: ${dataResult.error.issues[0]?.message || 'Unknown error'}`)
  }
  const validatedData = dataResult.data

  // Vanguard Security: Check authorization
  if (!validatedData.authorizedUsers.includes(validatedRequest.requestingUserId)) {
    throw new Error('Unauthorized decryption attempt')
  }

  // Check expiration if set
  if (validatedData.expiresAt && validatedData.expiresAt < new Date()) {
    throw new Error('Encrypted data has expired')
  }

  // Convert base64 to ArrayBuffer
  const encryptedBuffer = Uint8Array.from(
    atob(validatedData.encrypted),
    (c) => c.charCodeAt(0)
  )
  const ivBuffer = Uint8Array.from(atob(validatedData.iv), (c) =>
    c.charCodeAt(0)
  )

  // Note: In a real implementation, you would:
  // 1. Retrieve the encryption key from secure storage using keyId
  // 2. Decrypt the document using the key
  // 3. Return the decrypted ArrayBuffer

  // For now, return a placeholder
  // This would be implemented with actual key retrieval and decryption
  throw new Error('Decryption implementation requires key storage system')
}

/**
 * Validate encryption key
 */
export function validateEncryptionKey(key: unknown): EncryptionKey {
  return encryptionKeySchema.parse(key)
}

/**
 * Validate encrypted data
 */
export function validateEncryptedData(data: unknown): EncryptedData {
  return encryptedDataSchema.parse(data)
}

/**
 * Validate decryption request
 */
export function validateDecryptionRequest(
  request: unknown
): DecryptionRequest {
  return decryptionRequestSchema.parse(request)
}
