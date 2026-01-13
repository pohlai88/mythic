/**
 * Invoice Schema - Zod Validation
 *
 * Example ERP schema demonstrating Zod v4 patterns.
 */

import { z as z4 } from "zod/v4"

/**
 * Line Item Schema
 */
export const lineItemSchema = z4.object({
  id: z4.string().uuid().optional(),
  description: z4.string().min(1, "Description is required"),
  quantity: z4.number().positive("Quantity must be positive"),
  unitPrice: z4.number().nonnegative("Unit price must be non-negative"),
  taxRate: z4.number().min(0).max(1).default(0),
  total: z4.number().nonnegative(),
})

/**
 * Invoice Schema
 */
export const invoiceSchema = z4.object({
  id: z4.string().uuid().optional(),
  invoiceNumber: z4.string().min(1, "Invoice number is required"),
  customerId: z4.string().uuid("Invalid customer ID"),
  issueDate: z4.date(),
  dueDate: z4.date(),
  status: z4.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
  subtotal: z4.number().nonnegative(),
  tax: z4.number().nonnegative(),
  total: z4.number().nonnegative(),
  lineItems: z4.array(lineItemSchema).min(1, "At least one line item required"),
  notes: z4.string().optional(),
  createdAt: z4.date().optional(),
  updatedAt: z4.date().optional(),
})

/**
 * Create Invoice Schema (for new invoices)
 */
export const createInvoiceSchema = invoiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

/**
 * Update Invoice Schema (partial updates)
 */
export const updateInvoiceSchema = invoiceSchema.partial().required({
  id: true,
})

/**
 * Invoice Query Schema (for filtering)
 */
export const invoiceQuerySchema = z4.object({
  status: z4.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
  customerId: z4.string().uuid().optional(),
  startDate: z4.date().optional(),
  endDate: z4.date().optional(),
  page: z4.coerce.number().int().positive().default(1),
  limit: z4.coerce.number().int().positive().max(100).default(20),
})

// Type exports
export type Invoice = z4.infer<typeof invoiceSchema>
export type CreateInvoice = z4.infer<typeof createInvoiceSchema>
export type UpdateInvoice = z4.infer<typeof updateInvoiceSchema>
export type InvoiceQuery = z4.infer<typeof invoiceQuerySchema>
export type LineItem = z4.infer<typeof lineItemSchema>
