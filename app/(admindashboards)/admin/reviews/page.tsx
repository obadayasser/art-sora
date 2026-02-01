'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getReviews, approveReview, respondToReview } from '@/lib/client/api-admin';
import {
  Search,
  Filter,
  Star,
  MessageSquare,
  ThumbsUp,
  Reply,
  CheckCircle,
  Clock,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Review } from '@/types';

export default function ReviewsManagementPage() {
  const { token } = useAdminAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      loadReviews();
    }
  }, [token, currentPage]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const response = await getReviews(token!, currentPage, 20);
      setReviews(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to load reviews');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'pending' && !review.isApproved) ||
      (selectedFilter === 'approved' && review.isApproved);

    const matchesRating = selectedRating === 0 || review.rating === selectedRating;

    return matchesSearch && matchesFilter && matchesRating;
  });

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setShowViewModal(true);
  };

  const handleApproveReview = async (review: Review) => {
    try {
      setIsSubmitting(true);
      const updated = await approveReview(token!, review.id);
      setReviews(prev => prev.map(r => r.id === review.id ? updated : r));
      toast.success('Review approved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRespondToReview = () => {
    setShowResponseModal(true);
    setResponseText('');
  };

  const submitResponse = async () => {
    if (!selectedReview || !responseText.trim()) return;

    try {
      setIsSubmitting(true);
      const updated = await respondToReview(token!, selectedReview.id, responseText);
      setSelectedReview(updated);
      setReviews(prev => prev.map(r => r.id === selectedReview.id ? updated : r));
      toast.success('Response submitted successfully');
      setShowResponseModal(false);
      setShowViewModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit response');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer reviews and ratings
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Star size={32} />
            <TrendingUp size={24} />
          </div>
          <div className="text-3xl font-bold mb-1">{getAverageRating()}</div>
          <p className="text-yellow-100">Average Rating</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare size={32} />
            <CheckCircle size={24} />
          </div>
          <div className="text-3xl font-bold mb-1">{reviews.filter(r => r.isApproved).length}</div>
          <p className="text-green-100">Approved Reviews</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock size={32} />
            <Eye size={24} />
          </div>
          <div className="text-3xl font-bold mb-1">{reviews.filter(r => !r.isApproved).length}</div>
          <p className="text-purple-100">Pending Reviews</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating as keyof typeof ratingDistribution];
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'pending' | 'approved')}
            className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none bg-white dark:bg-gray-700"
          >
            <option value="all">All Reviews</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        <div className="relative">
          <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(parseInt(e.target.value))}
            className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none bg-white dark:bg-gray-700"
          >
            <option value="0">All Ratings</option>
            {[5, 4, 3, 2, 1].map(rating => (
              <option key={rating} value={rating}>{rating} Stars</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{review.customerName}</h3>
                    {review.productName && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{review.productName}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        • {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    review.isApproved
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {review.isApproved ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                    {review.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{review.reviewTitle}</h4>
                <p className="text-gray-600 dark:text-gray-400">{review.reviewText}</p>
              </div>

              {review.adminResponse && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Reply size={16} className="text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Admin Response</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">{review.adminResponse}</p>
                      {review.respondedAt && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Responded: {new Date(review.respondedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleViewReview(review)}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Eye size={16} className="mr-2" />
                  View Details
                </button>
                {!review.isApproved && (
                  <button
                    onClick={() => handleApproveReview(review)}
                    disabled={isSubmitting}
                    className="flex items-center px-3 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <ThumbsUp size={16} className="mr-2" />
                    Approve
                  </button>
                )}
                {!review.adminResponse && (
                  <button
                    onClick={() => {
                      setSelectedReview(review);
                      handleRespondToReview();
                    }}
                    className="flex items-center px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Reply size={16} className="mr-2" />
                    Respond
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No reviews found
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* View Review Modal */}
      {showViewModal && selectedReview && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {selectedReview.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedReview.customerName}
                  </h3>
                  {selectedReview.productName && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Product: {selectedReview.productName}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {renderStars(selectedReview.rating, 20)}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      • {new Date(selectedReview.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {selectedReview.reviewTitle}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedReview.reviewText}
                </p>
              </div>

              {/* Admin Response */}
              {selectedReview.adminResponse && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Reply size={20} className="text-blue-600 dark:text-blue-400 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Admin Response</p>
                      <p className="text-blue-800 dark:text-blue-200">{selectedReview.adminResponse}</p>
                      {selectedReview.respondedAt && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                          Responded: {new Date(selectedReview.respondedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  selectedReview.isApproved
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {selectedReview.isApproved ? <CheckCircle size={18} className="mr-2" /> : <Clock size={18} className="mr-2" />}
                  {selectedReview.isApproved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {!selectedReview.isApproved && (
                  <button
                    onClick={() => handleApproveReview(selectedReview)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <ThumbsUp size={20} className="mr-2" />
                    Approve Review
                  </button>
                )}
                {!selectedReview.adminResponse && (
                  <button
                    onClick={() => {
                      handleRespondToReview();
                      setShowViewModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Reply size={20} className="mr-2" />
                    Respond
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Respond to Review</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Review by {selectedReview.customerName}</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedReview.reviewTitle}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={5}
                  placeholder="Write your response to this review..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseText('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitResponse}
                  disabled={isSubmitting || !responseText.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Submit Response'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
