/**
 * Email Notification System for Broadcasts
 *
 * Sends email notifications when broadcasts are created.
 * Supports HTML emails with intelligence-driven styling.
 */

"use server"

import { z as z4 } from "zod/v4"
import { validateActionInput } from "@/src/lib/actions/validate-action"
import type { BroadcastData } from "./broadcasts"

/**
 * Input schema for sending broadcast email
 */
const sendBroadcastEmailInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
  recipientEmails: z4.array(z4.string().email()),
})

/**
 * Email template for broadcast
 */
function generateBroadcastEmailHTML(broadcast: BroadcastData, unsubscribeUrl?: string): string {
  const typeColors = {
    approval: "#10b981", // emerald
    veto: "#ef4444", // red
    announcement: "#f59e0b", // amber
    poll: "#3b82f6", // blue
    emergency: "#dc2626", // dark red
  }

  const typeIcons = {
    approval: "✅",
    veto: "❌",
    announcement: "📢",
    poll: "🗳️",
    emergency: "🚨",
  }

  const color = typeColors[broadcast.type] || "#6b7280"
  const icon = typeIcons[broadcast.type] || "📢"

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${broadcast.title}</title>
</head>
<body style="font-family: 'Inter', sans-serif; background-color: #0a0a0b; color: #f8f5f0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #141416; border: 1px solid ${color}; border-radius: 8px; padding: 24px;">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
      <span style="font-size: 24px;">${icon}</span>
      <span style="text-transform: uppercase; font-size: 12px; font-weight: 600; color: ${color}; letter-spacing: 0.05em;">
        ${broadcast.type}
      </span>
    </div>

    <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 700; color: #f8f5f0; margin: 0 0 16px 0;">
      ${broadcast.title}
    </h1>

    ${
      broadcast.message
        ? `
    <div style="color: #d4cfc4; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
      ${broadcast.message.replace(/\n/g, "<br />")}
    </div>
    `
        : ""
    }

    ${
      broadcast.proposalId
        ? `
    <div style="margin: 16px 0; padding: 12px; background-color: #0a0a0b; border-left: 3px solid ${color};">
      <div style="font-size: 12px; color: #9ca3af; margin-bottom: 4px;">Related Proposal</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #f8f5f0;">
        ${broadcast.caseNumber || broadcast.proposalId.slice(0, 8)}
      </div>
    </div>
    `
        : ""
    }

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937; font-size: 12px; color: #9ca3af;">
      <div>Sent: ${new Date(broadcast.createdAt).toLocaleString()}</div>
      ${
        unsubscribeUrl
          ? `
      <div style="margin-top: 8px;">
        <a href="${unsubscribeUrl}" style="color: ${color}; text-decoration: none;">Unsubscribe from broadcast emails</a>
      </div>
      `
          : ""
      }
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Send broadcast email notification
 *
 * Sends email to specified recipients when a broadcast is created.
 * In production, this would integrate with an email service (SendGrid, AWS SES, etc.)
 */
export async function sendBroadcastEmail(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, sendBroadcastEmailInputSchema)
  if (!inputResult.success) {
    return { success: false, error: "Invalid input" }
  }

  const { broadcastId, recipientEmails } = inputResult.data

  try {
    // TODO: In production, integrate with email service
    // For now, this is a placeholder that logs the email
    console.log("📧 Broadcast Email Notification:", {
      broadcastId,
      recipients: recipientEmails,
      timestamp: new Date().toISOString(),
    })

    // In production, you would:
    // 1. Fetch broadcast data
    // 2. Generate HTML email
    // 3. Send via email service (SendGrid, AWS SES, etc.)
    // 4. Log email delivery status

    return { success: true }
  } catch (error) {
    console.error("Error sending broadcast email:", error)
    return { success: false, error: "Failed to send email" }
  }
}

/**
 * Generate email HTML from broadcast data
 */
export function generateEmailHTML(broadcast: BroadcastData, unsubscribeUrl?: string): string {
  return generateBroadcastEmailHTML(broadcast, unsubscribeUrl)
}

/**
 * Get email recipients for broadcast
 *
 * Determines who should receive email notifications based on audience.
 */
export async function getEmailRecipients(
  audience: string,
  userCircles?: string[],
  userRole?: "sovereign" | "council" | "observer"
): Promise<string[]> {
  // TODO: In production, fetch actual user emails from database
  // For now, return empty array as placeholder

  if (audience === "all") {
    // Return all user emails
    return []
  }

  if (audience.startsWith("circle:")) {
    const circleId = audience.replace("circle:", "")
    // Return emails of users in this circle
    return []
  }

  if (audience.startsWith("role:")) {
    const role = audience.replace("role:", "")
    // Return emails of users with this role
    return []
  }

  return []
}
