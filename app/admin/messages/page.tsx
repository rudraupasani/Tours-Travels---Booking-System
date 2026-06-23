"use client";

import { useEffect, useState } from "react";
import { ContactMessage, getContactMessages, markMessageRead, deleteContactMessage } from "@/lib/data";
import { Mail, MailOpen, Trash2, Clock, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    async function load() {
      const data = await getContactMessages();
      setMessages(data);
      setLoading(false);
    }
    load();
  }, []);

  async function toggleRead(id: string, currentlyRead: boolean) {
    const success = await markMessageRead(id, !currentlyRead);
    if (success) {
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentlyRead } : m));
    }
  }

  async function handleDelete(id: string) {
    const success = await deleteContactMessage(id);
    if (success) {
      setMessages(messages.filter(m => m.id !== id));
    }
    setDeleteConfirm(null);
  }

  const filtered = filter === "all" ? messages
    : filter === "unread" ? messages.filter(m => !m.is_read)
    : messages.filter(m => m.is_read);

  const unreadCount = messages.filter(m => !m.is_read).length;

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-black text-brand-navy mb-2">
            Contact Messages
            {unreadCount > 0 && (
              <span className="ml-3 inline-flex items-center justify-center bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full align-middle">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-500 font-medium">Messages received from the contact form.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { key: "all" as const, label: "All", count: messages.length },
          { key: "unread" as const, label: "Unread", count: unreadCount },
          { key: "read" as const, label: "Read", count: messages.length - unreadCount },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              filter === tab.key
                ? "bg-brand-navy text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">
            {filter === "all" ? "No messages yet. Messages will appear here when customers use the contact form." : `No ${filter} messages.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(msg => {
            const isExpanded = expandedId === msg.id;
            return (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  !msg.is_read ? "border-brand-orange/30 shadow-sm shadow-orange-100" : "border-gray-100"
                }`}
              >
                {/* Header Row */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : msg.id);
                    if (!msg.is_read) toggleRead(msg.id, false);
                  }}
                >
                  {/* Unread Indicator */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.is_read ? "bg-gray-100 text-gray-400" : "bg-brand-orange/10 text-brand-orange"
                  }`}>
                    {msg.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`font-bold text-sm truncate ${msg.is_read ? "text-gray-600" : "text-brand-navy"}`}>
                        {msg.name}
                      </p>
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-brand-orange flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-sm truncate ${msg.is_read ? "text-gray-400" : "text-gray-600 font-medium"}`}>
                      {msg.subject}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(msg.created_at)}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="pt-4 pl-14">
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-4">
                        <span>From: <span className="text-gray-600">{msg.email}</span></span>
                        <span>Subject: <span className="text-gray-600">{msg.subject}</span></span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRead(msg.id, msg.is_read)}
                          className="text-xs font-bold text-gray-500 hover:text-brand-navy px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                        >
                          {msg.is_read ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                          {msg.is_read ? "Mark Unread" : "Mark Read"}
                        </button>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                          className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
                        >
                          Reply via Email
                        </a>
                        <button
                          onClick={() => setDeleteConfirm(msg.id)}
                          className="text-xs font-bold text-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-serif font-black text-xl text-brand-navy mb-2">Delete Message?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-brand-navy font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
