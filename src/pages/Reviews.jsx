import React, { useState } from 'react';
import Header from '../components/Header';
import { useAppStore } from '../store/appStore';
import {
    Star,
    Reply,
    Check,
    MessageSquare,
    Filter,
    Search,
    Plus,
    X,
} from 'lucide-react';
import '../styles/reviews.css';

function Reviews() {
    const { reviews, ratings, addReview, markReviewReplied } = useAppStore();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newReview, setNewReview] = useState({
        author: '',
        rating: 5,
        content: '',
        date: new Date().toISOString().split('T')[0],
    });

    const filteredReviews = reviews.filter((review) => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'replied' && review.replied) ||
            (filter === 'pending' && !review.replied);
        const matchesSearch =
            review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.author.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleAddReview = () => {
        if (newReview.author.trim() && newReview.content.trim()) {
            addReview({
                author: newReview.author.trim(),
                rating: newReview.rating,
                content: newReview.content.trim(),
                date: newReview.date,
                replied: false,
            });
            setNewReview({
                author: '',
                rating: 5,
                content: '',
                date: new Date().toISOString().split('T')[0],
            });
            setShowAddModal(false);
        }
    };

    const renderStars = (rating, interactive = false, onChange = null) => {
        return (
            <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={interactive ? 24 : 14}
                        fill={star <= rating ? '#FFD93D' : 'none'}
                        color={star <= rating ? '#FFD93D' : '#B2BEC3'}
                        className={interactive ? 'star-interactive' : ''}
                        onClick={interactive ? () => onChange(star) : undefined}
                    />
                ))}
            </div>
        );
    };

    return (
        <>
            <Header title="Reviews" />
            <main className="main-content">
                <div className="page-container">
                    {/* Stats Row */}
                    <div className="reviews-stats">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <div className="stat-value">{reviews.length}</div>
                                <div className="stat-label">Total Reviews</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Star size={24} />
                            </div>
                            <div>
                                <div className="stat-value">{ratings.average.toFixed(1)}</div>
                                <div className="stat-label">Average Rating</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon success">
                                <Check size={24} />
                            </div>
                            <div>
                                <div className="stat-value">{reviews.filter((r) => r.replied).length}</div>
                                <div className="stat-label">Replied</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon warning">
                                <Reply size={24} />
                            </div>
                            <div>
                                <div className="stat-value">{reviews.filter((r) => !r.replied).length}</div>
                                <div className="stat-label">Pending Reply</div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="reviews-header">
                        <div className="tabs">
                            <button
                                className={`tab ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All Reviews
                            </button>
                            <button
                                className={`tab ${filter === 'pending' ? 'active' : ''}`}
                                onClick={() => setFilter('pending')}
                            >
                                Pending Reply
                            </button>
                            <button
                                className={`tab ${filter === 'replied' ? 'active' : ''}`}
                                onClick={() => setFilter('replied')}
                            >
                                Replied
                            </button>
                        </div>

                        <div className="reviews-actions">
                            <div className="search-input-wrapper">
                                <Search size={16} />
                                <input
                                    type="text"
                                    placeholder="Search reviews..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                                <Plus size={16} />
                                Add Review
                            </button>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="reviews-grid">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className={`review-card ${review.replied ? 'replied' : ''}`}>
                                <div className="review-card-header">
                                    {renderStars(review.rating)}
                                    <span className="review-author">{review.author}</span>
                                    {review.replied && (
                                        <span className="replied-badge">
                                            <Check size={12} />
                                            Replied
                                        </span>
                                    )}
                                </div>
                                <p className="review-content">{review.content}</p>
                                <div className="review-card-footer">
                                    <span className="review-date">{review.date}</span>
                                    {!review.replied && (
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => markReviewReplied(review.id)}
                                        >
                                            <Reply size={14} />
                                            Mark as Replied
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {filteredReviews.length === 0 && (
                            <div className="no-reviews">
                                <MessageSquare size={48} />
                                <h3>No reviews found</h3>
                                <p>Try adjusting your filters or add a new review.</p>
                            </div>
                        )}
                    </div>

                    {/* Add Review Modal */}
                    {showAddModal && (
                        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                            <div className="modal" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>Add New Review</h3>
                                    <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Author Name *</label>
                                        <input
                                            type="text"
                                            value={newReview.author}
                                            onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                                            placeholder="Reviewer name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Rating</label>
                                        <div className="rating-selector">
                                            {renderStars(newReview.rating, true, (star) =>
                                                setNewReview({ ...newReview, rating: star })
                                            )}
                                            <span className="rating-text">{newReview.rating} / 5</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Review Content *</label>
                                        <textarea
                                            value={newReview.content}
                                            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                                            placeholder="Write the review content..."
                                            rows={4}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            value={newReview.date}
                                            onChange={(e) => setNewReview({ ...newReview, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-primary" onClick={handleAddReview}>
                                        Add Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default Reviews;
