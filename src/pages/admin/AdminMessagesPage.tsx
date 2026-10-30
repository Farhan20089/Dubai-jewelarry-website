import React from 'react';
import { Mail, Check, Trash2, Phone, Calendar } from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useToast } from '../../context/ToastContext';

export const AdminMessagesPage: React.FC = () => {
  const { contactMessages, markMessageRead, deleteMessage } = useStoreData();
  const { showToast } = useToast();

  const handleMarkRead = (id: string) => {
    markMessageRead(id);
    showToast('Inquiry marked as read.', 'info');
  };

  const handleDelete = (id: string) => {
    deleteMessage(id);
    showToast('Message removed.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-stone-800">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Client Inquiries
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-100">
          Showroom Contact Messages ({contactMessages.length})
        </h1>
        <p className="text-xs text-stone-400 mt-0.5">
          Inquiries received through the online contact form and bespoke commission portal.
        </p>
      </div>

      <div className="space-y-4">
        {contactMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-6 rounded-xl border transition-all ${
              msg.isRead
                ? 'bg-stone-900/50 border-stone-800'
                : 'bg-stone-900 border-amber-600/40 shadow-lg'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-800/80 gap-2 mb-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-stone-100 text-sm">{msg.name}</span>
                {!msg.isRead && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    New Inquiry
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1 font-mono">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> {msg.email}
                </span>
                {msg.phone && (
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-amber-400" /> {msg.phone}
                  </span>
                )}
                <span className="text-stone-500">
                  {new Date(msg.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed mb-4 whitespace-pre-line">
              {msg.message}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-800/60">
              {!msg.isRead && (
                <button
                  onClick={() => handleMarkRead(msg.id)}
                  className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Mark as Read
                </button>
              )}
              <button
                onClick={() => handleDelete(msg.id)}
                className="px-3 py-1.5 rounded bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}

        {contactMessages.length === 0 && (
          <div className="p-12 text-center bg-stone-900 rounded-xl border border-stone-800 text-stone-400 text-xs">
            No inquiries received yet.
          </div>
        )}
      </div>
    </div>
  );
};
