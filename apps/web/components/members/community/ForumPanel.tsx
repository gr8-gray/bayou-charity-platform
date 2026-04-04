'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@bayou/supabase';
import type { Database } from '@bayou/supabase/types';
import { ContentCard } from './ContentCard';
import { PostFormModal } from './PostFormModal';

type ForumThread = Database['public']['Tables']['forum_threads']['Row'] & {
  profiles: { display_name: string | null } | null;
};

type ForumReply = Database['public']['Tables']['forum_replies']['Row'] & {
  profiles: { display_name: string | null } | null;
};

interface ForumPanelProps {
  userId: string;
  role: 'member' | 'guide' | 'admin';
}

const CATEGORIES = ['general', 'gear', 'spots', 'recipes'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_LABELS: Record<Category, string> = {
  general: 'General',
  gear: 'Gear Talk',
  spots: 'Fishing Spots',
  recipes: 'Recipes & Cooking',
};

const CATEGORY_COLORS: Record<Category, string> = {
  general: 'bg-blue-500/20 text-blue-400 border border-blue-400/30',
  gear: 'bg-purple-500/20 text-purple-400 border border-purple-400/30',
  spots: 'bg-green-water/20 text-green-water border border-green-water/30',
  recipes: 'bg-amber/20 text-amber border border-amber/30',
};

const DISPLAY_TO_SLUG: Record<string, Category> = {
  'General': 'general',
  'Gear Talk': 'gear',
  'Fishing Spots': 'spots',
  'Recipes & Cooking': 'recipes',
};

const FORUM_FIELDS = [
  { name: 'title', label: 'Thread Title', type: 'text' as const, required: true },
  {
    name: 'category',
    label: 'Category',
    type: 'select' as const,
    options: ['General', 'Gear Talk', 'Fishing Spots', 'Recipes & Cooking'],
    required: true,
  },
  { name: 'body', label: 'Post', type: 'textarea' as const, required: true },
];

export function ForumPanel({ userId, role }: ForumPanelProps) {
  const supabase = useMemo(() => createClient(), []);

  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingThread, setEditingThread] = useState<ForumThread | null>(null);

  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const [repliesMap, setRepliesMap] = useState<Record<string, ForumReply[]>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [postingReply, setPostingReply] = useState<Record<string, boolean>>({});

  const loadThreads = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('forum_threads')
      .select('*, profiles(display_name)')
      .eq('status', 'approved')
      .is('archived_at', null)
      .order('created_at', { ascending: false });
    setThreads((data ?? []) as ForumThread[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  const handleToggleReplies = async (threadId: string) => {
    if (expandedThreadId === threadId) {
      setExpandedThreadId(null);
      return;
    }

    setExpandedThreadId(threadId);

    if (!repliesMap[threadId]) {
      const { data } = await supabase
        .from('forum_replies')
        .select('*, profiles(display_name)')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });
      setRepliesMap((prev) => ({ ...prev, [threadId]: (data ?? []) as ForumReply[] }));
    }
  };

  const handlePostReply = async (threadId: string) => {
    const body = replyInputs[threadId]?.trim();
    if (!body) return;

    setPostingReply((prev) => ({ ...prev, [threadId]: true }));

    await supabase
      .from('forum_replies')
      .insert({ thread_id: threadId, author_id: userId, body });

    const { data } = await supabase
      .from('forum_replies')
      .select('*, profiles(display_name)')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    setRepliesMap((prev) => ({ ...prev, [threadId]: (data ?? []) as ForumReply[] }));
    setReplyInputs((prev) => ({ ...prev, [threadId]: '' }));
    setPostingReply((prev) => ({ ...prev, [threadId]: false }));
  };

  const handleDelete = async (id: string) => {
    await supabase.from('forum_threads').delete().eq('id', id);
    void loadThreads();
  };

  const handleCreate = async (values: Record<string, string>) => {
    const categorySlug = DISPLAY_TO_SLUG[values.category] ?? 'general';
    await supabase.from('forum_threads').insert({
      title: values.title,
      category: categorySlug,
      body: values.body,
      status: 'approved',
      author_id: userId,
    });
    void loadThreads();
  };

  const handleEdit = async (values: Record<string, string>) => {
    if (!editingThread) return;
    const categorySlug = DISPLAY_TO_SLUG[values.category] ?? 'general';
    await supabase
      .from('forum_threads')
      .update({ title: values.title, category: categorySlug, body: values.body })
      .eq('id', editingThread.id);
    setEditingThread(null);
    void loadThreads();
  };

  const threadToInitialValues = (thread: ForumThread): Record<string, string> => ({
    title: thread.title ?? '',
    category: CATEGORY_LABELS[(thread.category as Category)] ?? '',
    body: thread.body ?? '',
  });

  return (
    <section className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-text-dark dark:text-gold">
          💬 Forum
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-amber text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          New Thread
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-text-mid dark:text-cream/60 py-8 font-serif">
          Loading threads…
        </p>
      )}

      {/* Empty state */}
      {!loading && threads.length === 0 && (
        <p className="text-center text-text-mid dark:text-cream/60 py-8 font-serif">
          No threads yet. Start the conversation!
        </p>
      )}

      {/* Thread cards */}
      {!loading &&
        threads.map((thread) => {
          const categoryKey = thread.category as Category;
          const badgeLabel = CATEGORY_LABELS[categoryKey] ?? thread.category;
          const badgeColor = CATEGORY_COLORS[categoryKey] ?? 'bg-text-mid/20 text-text-mid';

          const bodyText = thread.body ?? '';
          const previewBody = bodyText.length > 200 ? bodyText.slice(0, 200) + '…' : bodyText;

          const footer = (
            <div className="mt-3 pt-3 border-t border-green-water/10">
              <button
                onClick={() => void handleToggleReplies(thread.id)}
                className="text-sm text-text-mid dark:text-cream/60 hover:text-amber dark:hover:text-amber flex items-center gap-1.5"
              >
                💬 {repliesMap[thread.id]?.length ?? '?'} Replies
                <span>{expandedThreadId === thread.id ? '▲' : '▼'}</span>
              </button>

              {expandedThreadId === thread.id && (
                <div className="mt-3 space-y-3">
                  {(repliesMap[thread.id] ?? []).map((reply) => (
                    <div key={reply.id} className="pl-3 border-l-2 border-gold/30">
                      <p className="text-xs text-text-mid dark:text-cream/60 mb-0.5">
                        {reply.profiles?.display_name ?? 'Member'} ·{' '}
                        {new Date(reply.created_at ?? '').toLocaleDateString()}
                      </p>
                      <p className="text-sm text-text-dark dark:text-cream/85">
                        {reply.body}
                      </p>
                    </div>
                  ))}

                  <div className="flex gap-2 mt-3">
                    <input
                      className="flex-1 rounded-lg border border-green-water/30 p-2 text-sm bg-transparent text-text-dark dark:text-cream placeholder:text-text-mid/60"
                      placeholder="Write a reply…"
                      value={replyInputs[thread.id] ?? ''}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({
                          ...prev,
                          [thread.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      onClick={() => void handlePostReply(thread.id)}
                      disabled={
                        postingReply[thread.id] || !replyInputs[thread.id]?.trim()
                      }
                      className="px-4 py-2 bg-amber text-white text-sm rounded-lg disabled:opacity-50"
                    >
                      {postingReply[thread.id] ? '…' : 'Post'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );

          return (
            <ContentCard
              key={thread.id}
              title={thread.title ?? 'Untitled'}
              badges={[{ label: badgeLabel, color: badgeColor }]}
              meta={`Posted by ${thread.profiles?.display_name ?? 'Member'} · ${new Date(thread.created_at ?? '').toLocaleDateString()}`}
              body={previewBody}
              isOwner={userId === thread.author_id}
              isAdmin={role === 'admin'}
              footer={footer}
              onEdit={() => setEditingThread(thread)}
              onDelete={() => void handleDelete(thread.id)}
            />
          );
        })}

      {/* Create modal */}
      <PostFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Thread"
        fields={FORUM_FIELDS}
        onSubmit={handleCreate}
      />

      {/* Edit modal */}
      <PostFormModal
        isOpen={editingThread !== null}
        onClose={() => setEditingThread(null)}
        title="Edit Thread"
        fields={FORUM_FIELDS}
        initialValues={editingThread ? threadToInitialValues(editingThread) : {}}
        onSubmit={handleEdit}
      />
    </section>
  );
}

export default ForumPanel;
