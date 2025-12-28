'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api';
import type { Fire, Comment } from '@/lib/types';

export default function FireDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const fireId = parseInt(params.id as string);

  const [fire, setFire] = useState<Fire | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && fireId) {
      fetchData();
    }
  }, [user, fireId]);

  const fetchData = async () => {
    try {
      const [fireData, commentsData] = await Promise.all([
        apiClient.getFire(fireId),
        apiClient.getComments(fireId),
      ]);
      setFire(fireData.fire);
      setComments(commentsData.comments);
    } catch (error) {
      console.error('Failed to fetch fire details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: 'seen' | 'closed') => {
    try {
      const { fire: updatedFire } = await apiClient.updateFireStatus(fireId, status);
      setFire(updatedFire);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      await apiClient.createComment(fireId, commentText);
      setCommentText('');
      const { comments: updatedComments } = await apiClient.getComments(fireId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-red-500 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 font-medium">Loading fire details...</p>
        </div>
      </div>
    );
  }

  if (!user || !fire) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
        >
          ← Back to List
        </button>

        <div className="bg-white shadow-card rounded-2xl p-8 mb-6 border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg ${
                fire.status === 'reported'
                  ? 'bg-gradient-to-br from-red-500 to-red-600'
                  : fire.status === 'seen'
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                  : 'bg-gradient-to-br from-green-500 to-green-600'
              }`}>
                🔥
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fire Report #{fire.id}</h1>
                <p className="text-sm text-gray-500 mt-1">{new Date(fire.created_at).toLocaleString()}</p>
              </div>
            </div>
            <span
              className={`px-4 py-2 text-sm font-semibold rounded-full ${
                fire.status === 'reported'
                  ? 'bg-red-100 text-red-700 border-2 border-red-200'
                  : fire.status === 'seen'
                  ? 'bg-orange-100 text-orange-700 border-2 border-orange-200'
                  : 'bg-green-100 text-green-700 border-2 border-green-200'
              }`}
            >
              {fire.status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📝</span>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Description</span>
                  <p className="text-gray-900 mt-2 leading-relaxed">{fire.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Location</span>
                    <p className="text-gray-900 mt-2 font-mono text-sm">
                      {fire.latitude.toFixed(6)}, {fire.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👤</span>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-purple-900 uppercase tracking-wide">Reported By</span>
                    <p className="text-gray-900 mt-2 font-medium">{fire.reporter?.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {user.role === 'firefighter' && fire.status !== 'closed' && (
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
              {fire.status === 'reported' && (
                <button
                  onClick={() => handleStatusUpdate('seen')}
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  👁️ Mark as Seen
                </button>
              )}
              <button
                onClick={() => handleStatusUpdate('closed')}
                className="flex-1 sm:flex-initial bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                ✅ Mark as Closed
              </button>
            </div>
          )}
        </div>

        <div className="bg-white shadow-card rounded-2xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-xl">💬</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
              {comments.length}
            </span>
          </div>

          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 resize-none"
              placeholder="Share updates, ask questions, or add information..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Posting...
                  </span>
                ) : (
                  '💬 Post Comment'
                )}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {comment.user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{comment.user?.name}</span>
                      {comment.user?.role === 'firefighter' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded border border-red-200">
                          🚒 Firefighter
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-4xl mb-3 block opacity-50">💬</span>
                <p className="text-gray-500 font-medium">No comments yet</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to share an update</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
