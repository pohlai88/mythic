/**
 * Broadcast Comments Component
 *
 * Displays threaded comments for broadcast announcements.
 * Supports @mentions and reply functionality.
 */

'use client'

import { Card } from '@mythic/design-system'
import { cn, intelligentButtonStyles, intelligentInputStyles } from '@mythic/shared-utils'
import { useState, useEffect, useCallback, memo } from 'react'
import {
  getBroadcastComments,
  createBroadcastComment,
  updateBroadcastComment,
  deleteBroadcastComment,
  type BroadcastCommentData,
} from '@/app/actions/broadcast-comments'
import { getCurrentUserIdAction } from '@/app/actions/session'

interface BroadcastCommentsProps {
  broadcastId: string
  className?: string
}

interface CommentItemProps {
  comment: BroadcastCommentData
  userId: string | null
  onReply: (parentId: string) => void
  onEdit: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  depth?: number
}

const CommentItem = memo(function CommentItem({
  comment,
  userId,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = useCallback(async () => {
    if (!userId || userId !== comment.userId) return

    try {
      const result = await updateBroadcastComment({
        commentId: comment.id,
        content: editContent,
      })

      if (result.success) {
        setIsEditing(false)
        // Reload comments (parent will handle this)
      }
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }, [comment.id, comment.userId, editContent, userId])

  const handleDelete = useCallback(async () => {
    if (!userId || userId !== comment.userId) return
    if (!confirm('Are you sure you want to delete this comment?')) return

    setIsDeleting(true)
    try {
      const result = await deleteBroadcastComment({ commentId: comment.id })
      if (result.success) {
        onDelete(comment.id)
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      setIsDeleting(false)
    }
  }, [comment.id, comment.userId, userId, onDelete])

  const isOwner = userId === comment.userId
  const maxDepth = 3 // Limit nesting depth

  return (
    <div className={cn('space-y-2', depth > 0 && 'ml-6 border-l-2 border-charcoal pl-4')}>
      <Card elevation="sm" className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-ash font-mono">
                User {comment.userId.slice(0, 8)}
              </span>
              <span className="text-xs text-ash">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
              {comment.mode === 'sovereign_consultation' && (
                <span className="text-xs text-gold font-mono">SOVEREIGN</span>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className={intelligentInputStyles()}
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className={intelligentButtonStyles('primary', 'sm')}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setEditContent(comment.content)
                    }}
                    className={intelligentButtonStyles('secondary', 'sm')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-parchment whitespace-pre-wrap">
                {comment.content}
              </div>
            )}
            {comment.mentionedUserId && (
              <div className="text-xs text-gold mt-1">
                @User {comment.mentionedUserId.slice(0, 8)}
              </div>
            )}
          </div>
          {isOwner && !isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-ash hover:text-gold transition-hover-intelligent"
                aria-label="Edit comment"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs text-ash hover:text-ember transition-hover-intelligent disabled:opacity-50"
                aria-label="Delete comment"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
        {!isEditing && depth < maxDepth && (
          <button
            onClick={() => onReply(comment.id)}
            className="mt-2 text-xs text-ash hover:text-gold transition-hover-intelligent"
          >
            Reply
          </button>
        )}
      </Card>
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              userId={userId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
})

export const BroadcastComments = memo(function BroadcastComments({
  broadcastId,
  className,
}: BroadcastCommentsProps) {
  const [comments, setComments] = useState<BroadcastCommentData[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Load comments
  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true)
        const currentUserId = await getCurrentUserIdAction()
        setUserId(currentUserId)

        const result = await getBroadcastComments({ broadcastId })
        if (result.comments) {
          setComments(result.comments)
        }
      } catch (error) {
        console.error('Error loading comments:', error)
      } finally {
        setLoading(false)
      }
    }

    loadComments()
  }, [broadcastId])

  // Reload comments
  const reloadComments = useCallback(async () => {
    try {
      const result = await getBroadcastComments({ broadcastId })
      if (result.comments) {
        setComments(result.comments)
      }
    } catch (error) {
      console.error('Error reloading comments:', error)
    }
  }, [broadcastId])

  // Handle reply
  const handleReply = useCallback((parentId: string) => {
    setReplyingTo(parentId)
  }, [])

  // Handle edit
  const handleEdit = useCallback(async (commentId: string, content: string) => {
    await reloadComments()
  }, [reloadComments])

  // Handle delete
  const handleDelete = useCallback(
    (commentId: string) => {
      // Remove from local state
      const removeComment = (comments: BroadcastCommentData[]): BroadcastCommentData[] => {
        return comments
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies ? removeComment(c.replies) : undefined,
          }))
      }
      setComments(removeComment(comments))
    },
    [comments]
  )

  // Submit new comment
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newComment.trim() || !userId || submitting) return

      setSubmitting(true)
      try {
        const result = await createBroadcastComment({
          broadcastId,
          userId,
          content: newComment.trim(),
          parentCommentId: replyingTo || undefined,
        })

        if (result.success) {
          setNewComment('')
          setReplyingTo(null)
          await reloadComments()
        }
      } catch (error) {
        console.error('Error creating comment:', error)
      } finally {
        setSubmitting(false)
      }
    },
    [broadcastId, userId, newComment, replyingTo, submitting, reloadComments]
  )

  if (loading) {
    return (
      <Card elevation="sm" className={cn('p-4', className)}>
        <div className="text-ash text-sm">Loading comments...</div>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-parchment">Comments</h3>
        <span className="text-sm text-ash">{comments.length} comment(s)</span>
      </div>

      {/* Comment form */}
      <Card elevation="sm" className="p-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          {replyingTo && (
            <div className="text-xs text-ash mb-2">
              Replying to comment{' '}
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-gold hover:text-ember"
              >
                (cancel)
              </button>
            </div>
          )}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className={intelligentInputStyles()}
            rows={3}
            disabled={submitting || !userId}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || submitting || !userId}
              className={intelligentButtonStyles('primary', 'md', 'disabled:opacity-50 disabled:cursor-not-allowed')}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      </Card>

      {/* Comments list */}
      {comments.length === 0 ? (
        <Card elevation="sm" className="p-4">
          <div className="text-ash text-sm text-center">No comments yet. Be the first to comment!</div>
        </Card>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              userId={userId}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
})
