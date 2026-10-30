import React from 'react';
import { Star, CheckCircle2, Trash2 } from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';

export const AdminReviewsPage: React.FC = () => {
  const { reviews, approveReview, deleteReview } = useStoreData();
  const { showToast } = useToast();

  const handleApprove = (id: string) => {
    approveReview(id);
    showToast('Review approved and visible to public.', 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this patron review?')) {
      deleteReview(id);
      showToast('Review deleted.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-stone-800">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Client Feedback &amp; Verification
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
          Patron Reviews ({reviews.length})
        </h1>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                <th className="p-4 font-semibold">Jewellery Piece</th>
                <th className="p-4 font-semibold">Patron Name</th>
                <th className="p-4 font-semibold">Rating</th>
                <th className="p-4 font-semibold">Review Impressions</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-stone-800/30 transition-colors">
                  <td className="p-4 font-semibold text-amber-400 max-w-[180px] truncate">
                    {rev.productName}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-stone-200 block">{rev.customerName}</span>
                    <span className="text-[10px] text-stone-500 font-mono">{rev.customerEmail}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-stone-300 max-w-sm">
                    <p className="line-clamp-2 italic">&ldquo;{rev.reviewText}&rdquo;</p>
                  </td>
                  <td className="p-4 text-stone-400 font-mono">{rev.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      rev.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    }`}>
                      {rev.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {rev.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(rev.id)}
                          className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 text-[11px] font-semibold hover:bg-emerald-900"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 rounded bg-stone-800 text-stone-400 hover:text-rose-400"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
