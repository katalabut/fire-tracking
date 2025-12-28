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
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user || !fire) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:text-blue-800 text-sm"
      >
        ← Back
      </button>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Fire Report #{fire.id}</h1>
          <span
            className={`px-3 py-1 text-sm rounded ${
              fire.status === 'reported'
                ? 'bg-red-100 text-red-800'
                : fire.status === 'seen'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {fire.status.toUpperCase()}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div>
            <span className="text-sm font-medium text-gray-700">Description:</span>
            <p className="text-gray-900 mt-1">{fire.description}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Location:</span>
            <p className="text-gray-900">
              Latitude: {fire.latitude.toFixed(6)}, Longitude: {fire.longitude.toFixed(6)}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Reported by:</span>
            <p className="text-gray-900">{fire.reporter?.name}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Reported at:</span>
            <p className="text-gray-900">{new Date(fire.created_at).toLocaleString()}</p>
          </div>
        </div>

        {user.role === 'firefighter' && fire.status !== 'closed' && (
          <div className="flex space-x-2">
            {fire.status === 'reported' && (
              <button
                onClick={() => handleStatusUpdate('seen')}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm font-medium"
              >
                Mark as Seen
              </button>
            )}
            <button
              onClick={() => handleStatusUpdate('closed')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
            >
              Mark as Closed
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>

        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium disabled:bg-gray-300"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-gray-200 pl-4 py-2">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">{comment.user?.name}</span>
                {comment.user?.role === 'firefighter' && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                    Firefighter
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
