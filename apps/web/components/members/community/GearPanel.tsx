'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { createClient } from '@bayou/supabase';
import type { Database } from '@bayou/supabase/types';
import { ContentCard } from './ContentCard';
import { PostFormModal } from './PostFormModal';

type Classified = Database['public']['Tables']['classifieds']['Row'] & {
  profiles: { display_name: string | null } | null;
};

interface GearPanelProps {
  userId: string;
  role: 'member' | 'guide' | 'admin';
}

const FIELDS = [
  {
    name: 'title',
    label: 'Item Title',
    type: 'text' as const,
    required: true,
    placeholder: 'e.g. Shimano Spinning Rod — Barely Used',
  },
  {
    name: 'price',
    label: 'Price',
    type: 'text' as const,
    placeholder: 'e.g. $75 OBO',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea' as const,
  },
  {
    name: 'contact',
    label: 'Contact (email)',
    type: 'text' as const,
  },
];

export function GearPanel({ userId, role }: GearPanelProps) {
  const supabase = useMemo(() => createClient(), []);

  const [items, setItems] = useState<Classified[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Classified | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('classifieds')
      .select('*, profiles(display_name)')
      .eq('status', 'approved')
      .is('archived_at', null)
      .order('created_at', { ascending: false });
    setItems((data as Classified[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (values: Record<string, string>) => {
    await supabase.from('classifieds').insert({
      title: values.title,
      price: values.price || null,
      description: values.description || null,
      contact: values.contact || null,
      status: 'pending',
      sold: false,
      seller_id: userId,
    });
    await load();
  };

  const handleEdit = async (values: Record<string, string>) => {
    if (!editingItem) return;
    await supabase
      .from('classifieds')
      .update({
        title: values.title,
        price: values.price || null,
        description: values.description || null,
        contact: values.contact || null,
      })
      .eq('id', editingItem.id);
    await load();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('classifieds').delete().eq('id', id);
    await load();
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-text-dark dark:text-gold">
          🛒 Gear &amp; Classifieds
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-amber text-white text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          List Item
        </button>
      </div>

      {/* States */}
      {loading && (
        <p className="text-sm text-text-mid dark:text-cream/60 font-serif">
          Loading listings…
        </p>
      )}

      {!loading && items.length === 0 && (
        <p className="text-sm text-text-mid dark:text-cream/60 font-serif">
          No gear listed yet. Be the first to post something for sale!
        </p>
      )}

      {/* Cards */}
      {!loading && items.length > 0 && (
        <div className="flex flex-col gap-4">
          {items.map((item) => {
            const badges = [
              {
                label: 'Gear',
                color:
                  'bg-purple-500/20 text-purple-400 border border-purple-400/30',
              },
              ...(item.sold
                ? [
                    {
                      label: 'SOLD',
                      color:
                        'bg-text-mid/20 text-text-mid border border-text-mid/30',
                    },
                  ]
                : []),
            ];

            const footer = (
              <div className="flex items-center justify-between flex-wrap gap-2 mt-1">
                {item.price && (
                  <span className="font-bold text-lg text-gold">
                    {item.price}
                  </span>
                )}
                {item.contact && !item.sold && (
                  <a
                    href={`mailto:${item.contact}`}
                    className="text-sm text-amber hover:underline"
                  >
                    Contact Seller →
                  </a>
                )}
              </div>
            );

            return (
              <ContentCard
                key={item.id}
                title={item.title}
                badges={badges}
                meta={`Posted by ${item.profiles?.display_name ?? 'Member'} · ${new Date(item.created_at ?? '').toLocaleDateString()}`}
                body={item.description ?? ''}
                imageUrl={item.photo_url ?? undefined}
                footer={footer}
                isOwner={userId === item.seller_id}
                isAdmin={role === 'admin'}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDelete(item.id)}
              />
            );
          })}
        </div>
      )}

      {/* Create modal */}
      <PostFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="List a Gear Item"
        fields={FIELDS}
        onSubmit={handleCreate}
      />

      {/* Edit modal */}
      <PostFormModal
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        title="Edit Listing"
        fields={FIELDS}
        initialValues={
          editingItem
            ? {
                title: editingItem.title,
                price: editingItem.price ?? '',
                description: editingItem.description ?? '',
                contact: editingItem.contact ?? '',
              }
            : {}
        }
        onSubmit={handleEdit}
      />
    </section>
  );
}

export default GearPanel;
