'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { createClient } from '@bayou/supabase';
import type { Database } from '@bayou/supabase/types';
import { ContentCard } from '../community/ContentCard';
import { PostFormModal } from '../community/PostFormModal';

type GuidePosting = Database['public']['Tables']['guide_postings']['Row'] & {
  profiles: { display_name: string | null } | null;
};

interface GuidesPanelProps {
  userId: string;
  role: 'member' | 'guide' | 'admin';
}

const FORM_FIELDS = [
  {
    name: 'title',
    label: 'Listing Title',
    type: 'text' as const,
    required: true,
    placeholder: 'e.g. Experienced Speckled Trout Guide',
  },
  {
    name: 'rate',
    label: 'Rate',
    type: 'text' as const,
    placeholder: 'e.g. $150/half day',
  },
  {
    name: 'available_dates',
    label: 'Available Dates',
    type: 'text' as const,
    placeholder: 'e.g. Weekends, March–June',
  },
  {
    name: 'contact',
    label: 'Contact (email or phone)',
    type: 'text' as const,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea' as const,
  },
];

export function GuidesPanel({ userId, role }: GuidesPanelProps) {
  const supabase = useMemo(() => createClient(), []);

  const [postings, setPostings] = useState<GuidePosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPosting, setEditingPosting] = useState<GuidePosting | null>(null);

  const loadPostings = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('guide_postings')
      .select('*, profiles(display_name)')
      .eq('status', 'approved')
      .is('archived_at', null)
      .order('created_at', { ascending: false });
    setPostings((data as GuidePosting[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadPostings();
  }, [loadPostings]);

  const handleCreate = async (values: Record<string, string>) => {
    await supabase.from('guide_postings').insert({
      title: values.title,
      rate: values.rate || null,
      available_dates: values.available_dates || null,
      contact: values.contact || null,
      description: values.description || null,
      status: 'pending',
      guide_id: userId,
    });
    await loadPostings();
  };

  const handleEdit = async (values: Record<string, string>) => {
    if (!editingPosting) return;
    await supabase
      .from('guide_postings')
      .update({
        title: values.title,
        rate: values.rate || null,
        available_dates: values.available_dates || null,
        contact: values.contact || null,
        description: values.description || null,
      })
      .eq('id', editingPosting.id);
    await loadPostings();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('guide_postings').delete().eq('id', id);
    await loadPostings();
  };

  const getEditInitialValues = (posting: GuidePosting): Record<string, string> => ({
    title: posting.title ?? '',
    rate: posting.rate ?? '',
    available_dates: posting.available_dates ?? '',
    contact: posting.contact ?? '',
    description: posting.description ?? '',
  });

  return (
    <section className="flex flex-col gap-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-text-dark dark:text-gold">
          🎣 Guide Listings
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-amber text-white text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          List Yourself
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-amber border-t-transparent animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && postings.length === 0 && (
        <div className="glass-card rounded-2xl p-10 text-center">
          <p className="font-display text-lg text-text-mid dark:text-cream/60 mb-2">
            No guide listings yet.
          </p>
          <p className="text-sm text-text-mid dark:text-cream/50 font-serif">
            Know the bayou? List yourself and connect with members looking for a captain.
          </p>
        </div>
      )}

      {/* Guide cards */}
      {!loading && postings.map((posting) => (
        <ContentCard
          key={posting.id}
          title={posting.title ?? ''}
          badges={[
            {
              label: 'Guide',
              color: 'bg-green-water/20 text-green-water border border-green-water/30',
            },
          ]}
          meta={`Posted by ${posting.profiles?.display_name ?? 'Member'} · ${new Date(posting.created_at ?? '').toLocaleDateString()}`}
          body={posting.description ?? ''}
          isOwner={userId === posting.guide_id}
          isAdmin={role === 'admin'}
          onEdit={() => setEditingPosting(posting)}
          onDelete={() => handleDelete(posting.id)}
          footer={
            <div className="flex flex-col gap-1.5 mt-1">
              {posting.rate && (
                <p className="text-sm text-text-mid dark:text-cream/70">
                  💰 Rate: {posting.rate}
                </p>
              )}
              {posting.available_dates && (
                <p className="text-sm text-text-mid dark:text-cream/70">
                  📅 Available: {posting.available_dates}
                </p>
              )}
              {posting.contact && (
                <a
                  href={`mailto:${posting.contact}`}
                  className="text-sm text-amber hover:underline"
                >
                  Contact Guide →
                </a>
              )}
            </div>
          }
        />
      ))}

      {/* Create modal */}
      <PostFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="List Yourself as a Guide"
        fields={FORM_FIELDS}
        onSubmit={handleCreate}
      />

      {/* Edit modal */}
      <PostFormModal
        isOpen={editingPosting !== null}
        onClose={() => setEditingPosting(null)}
        title="Edit Guide Listing"
        fields={FORM_FIELDS}
        initialValues={editingPosting ? getEditInitialValues(editingPosting) : {}}
        onSubmit={handleEdit}
      />
    </section>
  );
}

export default GuidesPanel;
