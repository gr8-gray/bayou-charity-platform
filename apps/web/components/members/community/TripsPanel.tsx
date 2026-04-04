'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@bayou/supabase';
import type { Database } from '@bayou/supabase/types';
import { ContentCard } from './ContentCard';
import { PostFormModal } from './PostFormModal';

type Trip = Database['public']['Tables']['trips']['Row'] & {
  profiles: { display_name: string | null } | null;
};
type TripRsvp = Database['public']['Tables']['trip_rsvps']['Row'];

interface TripsPanelProps {
  userId: string;
  role: 'member' | 'guide' | 'admin';
}

const TRIP_FIELDS = [
  { name: 'title', label: 'Trip Title', type: 'text' as const, required: true },
  { name: 'trip_date', label: 'Trip Date', type: 'date' as const, required: true },
  { name: 'location', label: 'Location', type: 'text' as const, placeholder: 'e.g. Deer Range Canal' },
  { name: 'max_spots', label: 'Max Spots', type: 'number' as const, placeholder: 'Leave blank for unlimited' },
  { name: 'description', label: 'Description', type: 'textarea' as const },
];

function formatTripDate(dateStr: string | null): string {
  if (!dateStr) return 'TBD';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function TripsPanel({ userId, role }: TripsPanelProps) {
  const supabase = useMemo(() => createClient(), []);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpMap, setRsvpMap] = useState<Record<string, string[]>>({});
  const [userRsvps, setUserRsvps] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const loadTrips = useCallback(async () => {
    setLoading(true);

    const { data: tripData, error } = await supabase
      .from('trips')
      .select('*, profiles(display_name)')
      .eq('status', 'approved')
      .is('archived_at', null)
      .order('trip_date', { ascending: true });

    if (error || !tripData) {
      setLoading(false);
      return;
    }

    const typedTrips = tripData as Trip[];
    setTrips(typedTrips);

    if (typedTrips.length > 0) {
      const { data: rsvpData } = await supabase
        .from('trip_rsvps')
        .select('trip_id, member_id')
        .in('trip_id', typedTrips.map((t) => t.id));

      const rsvps = (rsvpData ?? []) as TripRsvp[];
      const map: Record<string, string[]> = {};
      const userSet = new Set<string>();

      for (const rsvp of rsvps) {
        if (!rsvp.trip_id || !rsvp.member_id) continue;
        if (!map[rsvp.trip_id]) map[rsvp.trip_id] = [];
        map[rsvp.trip_id].push(rsvp.member_id);
        if (rsvp.member_id === userId) userSet.add(rsvp.trip_id);
      }

      setRsvpMap(map);
      setUserRsvps(userSet);
    }

    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  const handleRsvp = async (tripId: string) => {
    await supabase
      .from('trip_rsvps')
      .insert({ trip_id: tripId, member_id: userId });
    void loadTrips();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('trips').delete().eq('id', id);
    void loadTrips();
  };

  const handleCreate = async (values: Record<string, string>) => {
    await supabase.from('trips').insert({
      title: values.title,
      trip_date: values.trip_date || null,
      location: values.location || null,
      max_spots: values.max_spots ? parseInt(values.max_spots, 10) : null,
      description: values.description || null,
      status: 'pending',
      type: 'member',
      created_by: userId,
    } as Database['public']['Tables']['trips']['Insert']);
    void loadTrips();
  };

  const handleEdit = async (values: Record<string, string>) => {
    if (!editingTrip) return;
    await supabase
      .from('trips')
      .update({
        title: values.title,
        trip_date: values.trip_date || null,
        location: values.location || null,
        max_spots: values.max_spots ? parseInt(values.max_spots, 10) : null,
        description: values.description || null,
      } as Database['public']['Tables']['trips']['Update'])
      .eq('id', editingTrip.id);
    setEditingTrip(null);
    void loadTrips();
  };

  const tripToInitialValues = (trip: Trip): Record<string, string> => ({
    title: trip.title ?? '',
    trip_date: trip.trip_date ?? '',
    location: trip.location ?? '',
    max_spots: trip.max_spots != null ? String(trip.max_spots) : '',
    description: trip.description ?? '',
  });

  return (
    <section className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-text-dark dark:text-gold">
          🚤 Member Trips
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-amber text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Post a Trip
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-text-mid dark:text-cream/60 py-8">
          Loading trips…
        </p>
      )}

      {/* Empty state */}
      {!loading && trips.length === 0 && (
        <p className="text-center text-text-mid dark:text-cream/60 py-8">
          No trips posted yet. Plan one!
        </p>
      )}

      {/* Trip cards */}
      {!loading &&
        trips.map((trip) => {
          const attendees = rsvpMap[trip.id] ?? [];
          const hasRsvpd = userRsvps.has(trip.id);
          const isCancelled = trip.status === 'cancelled';

          const maxSpots = trip.max_spots;
          const remaining =
            maxSpots != null ? maxSpots - attendees.length : null;

          const rsvpLabel = (() => {
            let label = `👥 ${attendees.length} going`;
            if (remaining != null) {
              label += ` · ${remaining} spot${remaining === 1 ? '' : 's'} left`;
            }
            return label;
          })();

          const footer = (
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-sm text-text-mid dark:text-cream/60">
                {rsvpLabel}
              </span>

              {isCancelled ? (
                <span className="text-sm font-semibold text-red-400">
                  ❌ Cancelled
                </span>
              ) : (
                <button
                  disabled={hasRsvpd}
                  onClick={() => void handleRsvp(trip.id)}
                  className="bg-amber text-white rounded-lg px-4 py-1.5 text-sm transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {hasRsvpd ? '✓ Going' : 'RSVP'}
                </button>
              )}
            </div>
          );

          const badges = [
            {
              label: trip.type === 'club' ? 'Club Event' : 'Member Trip',
              color:
                trip.type === 'club'
                  ? 'bg-amber/20 text-amber border border-amber/30'
                  : 'bg-green-water/20 text-green-water border border-green-water/30',
            },
          ];

          const meta = `${formatTripDate(trip.trip_date)} · ${trip.location ?? 'Location TBD'} · Posted by ${trip.profiles?.display_name ?? 'Member'}`;

          return (
            <ContentCard
              key={trip.id}
              title={trip.title ?? 'Untitled Trip'}
              badges={badges}
              meta={meta}
              body={trip.description ?? ''}
              isOwner={userId === trip.created_by}
              isAdmin={role === 'admin'}
              footer={footer}
              onEdit={() => setEditingTrip(trip)}
              onDelete={() => void handleDelete(trip.id)}
            />
          );
        })}

      {/* Create modal */}
      <PostFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Post a Trip"
        fields={TRIP_FIELDS}
        onSubmit={handleCreate}
      />

      {/* Edit modal */}
      <PostFormModal
        isOpen={editingTrip !== null}
        onClose={() => setEditingTrip(null)}
        title="Edit Trip"
        fields={TRIP_FIELDS}
        initialValues={editingTrip ? tripToInitialValues(editingTrip) : {}}
        onSubmit={handleEdit}
      />
    </section>
  );
}

export default TripsPanel;
