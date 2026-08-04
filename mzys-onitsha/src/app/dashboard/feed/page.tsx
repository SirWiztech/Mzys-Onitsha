'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import TiltedCard from '@/components/tilted-card';
import { Package, Heart, Share2, Rows, MessageCircle, Trash2, Send, Search } from 'lucide-react';
import type { Product, Member } from '@/lib/types';

interface EnrichedComment {
  id: string;
  productId: string;
  memberId: string;
  body: string;
  createdAt: string;
  memberName: string;
  memberImage: string | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en', { day: 'numeric', month: 'short' });
}

export default function FeedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [comments, setComments] = useState<EnrichedComment[]>([]);
  const [likesMap, setLikesMap] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<{ memberId: string | null; role: string } | null>(null);
  const [posting, setPosting] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/members').then((r) => r.json()),
      fetch('/api/comments').then((r) => r.json()),
      fetch('/api/auth').then((r) => r.json()),
    ]).then(([p, m, c, a]) => {
      setProducts(p);
      setMembers(m);
      setComments(c);
      setCurrentUser(a.user);
      // Load likes for all products
      Promise.all(
        p.map((prod: Product) =>
          fetch(`/api/likes?productId=${prod.id}`)
            .then((r) => r.json())
            .then((data) => ({
              productId: prod.id,
              liked: data.likes.some((l: { memberId: string }) => l.memberId === a.user?.memberId),
              count: data.count,
            }))
        )
      ).then((results) => {
        const map: Record<string, { liked: boolean; count: number }> = {};
        for (const r of results) map[r.productId] = r;
        setLikesMap(map);
      });
      setLoading(false);
    });
  }, []);

  const getMember = (memberId: string) => members.find((m) => m.id === memberId);

  const getComments = (productId: string) =>
    comments.filter((c) => c.productId === productId);

  const sorted = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const toggleComments = (productId: string) => {
    setOpenComments((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const handlePostComment = async (productId: string) => {
    const body = commentInputs[productId]?.trim();
    if (!body || !currentUser?.memberId) return;
    setPosting((prev) => new Set(prev).add(productId));
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, body }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        setCommentInputs((prev) => ({ ...prev, [productId]: '' }));
      }
    } finally {
      setPosting((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const res = await fetch(`/api/comments?id=${commentId}`, { method: 'DELETE' });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  const handleLike = async (productId: string) => {
    if (!currentUser?.memberId) return;
    const prev = likesMap[productId];
    setLikesMap((map) => ({
      ...map,
      [productId]: { liked: !prev?.liked, count: prev?.count ?? 0 + (prev?.liked ? -1 : 1) },
    }));
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) {
      const data = await res.json();
      setLikesMap((map) => ({
        ...map,
        [productId]: { liked: data.liked, count: data.count },
      }));
    }
  };

  const handleShare = async (product: Product, member: Member | undefined) => {
    const text = `Check out ${product.name}${member ? ` by ${member.firstName} ${member.lastName}` : ''} on MZYS!\n\n${product.description || ''}\n\nPrice: \u20A6${product.price.toLocaleString()}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      alert('Product info copied to clipboard!');
    }
  };

  const filtered = searchQuery
    ? sorted.filter((product) => {
        const member = getMember(product.memberId);
        const name = member
          ? `${member.firstName} ${member.lastName}`.toLowerCase()
          : '';
        const q = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(q) ||
          name.includes(q)
        );
      })
    : sorted;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <img src="/images/main-mzys-logo.png" alt="MZYS" className="w-10 h-10 object-contain" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Feed</h1>
          <p className="text-sm text-gray-500 mt-0.5">Browse products and services from members</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by product or member name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
              <div className="h-48 bg-gray-100 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            {searchQuery ? 'No products match your search' : 'No products listed yet'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery ? 'Try a different search term.' : 'Members haven\'t uploaded any products.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filtered.map((product) => {
            const member = getMember(product.memberId);
            const productComments = getComments(product.id);
            const isOpen = openComments.has(product.id);
            const inputVal = commentInputs[product.id] || '';
            const isPosting = posting.has(product.id);
            const likeInfo = likesMap[product.id] || { liked: false, count: 0 };

            return (
              <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Member header */}
                <Link href={`/dashboard/members/${product.memberId}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden shrink-0">
                    {member?.profileImage ? (
                      <img src={member.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : member ? (
                      `${member.firstName[0]}${member.lastName[0]}`
                    ) : (
                      <Package className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {member ? `${member.firstName} ${member.lastName}` : 'Unknown Member'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString('en', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                </Link>

                {/* Product images */}
                {product.images && product.images.length > 0 && (
                  <div className={`grid ${product.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-1 p-1`}>
                    {product.images.slice(0, 4).map((img, i) => (
                      <div key={i} className={`${i === 0 && product.images.length === 1 ? 'aspect-[2/1]' : 'aspect-square'}`}>
                        <TiltedCard
                          imageSrc={img}
                          altText={product.name}
                          containerHeight="100%"
                          containerWidth="100%"
                          imageHeight="100%"
                          imageWidth="100%"
                          rotateAmplitude={12}
                          scaleOnHover={1.05}
                          showMobileWarning={false}
                          showTooltip={false}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Product details */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{product.description}</p>
                      )}
                    </div>
                    <p className="text-lg font-bold text-blue-600 shrink-0">{'\u20A6'}{product.price.toLocaleString()}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => toggleComments(product.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        isOpen ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {productComments.length > 0 ? productComments.length : 'Comment'}
                    </button>
                    <button
                      onClick={() => handleLike(product.id)}
                      disabled={!currentUser?.memberId}
                      className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-40 ${
                        likeInfo.liked
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likeInfo.liked ? 'fill-current' : ''}`} />
                      {likeInfo.count > 0 ? likeInfo.count : 'Like'}
                    </button>
                    <button
                      onClick={() => handleShare(product, member)}
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>

                {/* Comments section */}
                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    {productComments.length > 0 ? (
                      <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                        {productComments.map((comment) => {
                          const isOwner =
                            currentUser?.memberId && currentUser.memberId === comment.memberId;
                          const isAdmin =
                            currentUser?.role === 'exco' || currentUser?.role === 'superadmin';
                          return (
                            <div key={comment.id} className="flex gap-3 p-4">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                                {comment.memberImage ? (
                                  <img src={comment.memberImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  comment.memberName[0]?.toUpperCase() || '?'
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {comment.memberName}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {timeAgo(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{comment.body}</p>
                              </div>
                              {(isOwner || isAdmin) && (
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-sm text-gray-400">No comments yet. Be the first to comment!</p>
                      </div>
                    )}

                    {currentUser?.memberId ? (
                      <div className="flex items-center gap-2 p-3 border-t border-gray-100 bg-white">
                        <input
                          type="text"
                          value={inputVal}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [product.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handlePostComment(product.id);
                            }
                          }}
                          placeholder="Write a comment..."
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                        />
                        <button
                          onClick={() => handlePostComment(product.id)}
                          disabled={!inputVal.trim() || isPosting}
                          className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 text-center border-t border-gray-100 bg-white">
                        <p className="text-xs text-gray-400">
                          <Link href="/" className="text-blue-600 hover:underline">Sign in</Link> to leave a comment
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
