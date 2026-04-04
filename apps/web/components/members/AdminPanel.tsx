'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@bayou/supabase';
import type { Database } from '@bayou/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AdminPanelProps {
  adminId: string;
}

type PendingUser = Omit<Profile, 'provider'> & { provider?: string | null };

type FlaggedPin = {
  id: string;
  user_id: string | null;
  caption: string | null;
  photo_url: string | null;
  species: string | null;
  location_name: string | null;
  created_at: string;
  profiles: { display_name: string | null } | null;
};

type PendingTrip = {
  id: string;
  created_by: string | null;
  title: string;
  trip_date: string | null;
  profiles: { display_name: string | null } | null;
};

type PendingGuide = {
  id: string;
  guide_id: string | null;
  title: string;
  rate: string | null;
  profiles: { display_name: string | null } | null;
};

type PendingClassified = {
  id: string;
  seller_id: string | null;
  title: string;
  price: string | null;
  profiles: { display_name: string | null } | null;
};

export function AdminPanel({ adminId }: AdminPanelProps) {
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [flagged, setFlagged] = useState<FlaggedPin[]>([]);
  const [flaggedLoading, setFlaggedLoading] = useState(true);
  const [archiveDays, setArchiveDays] = useState(180);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [pendingTrips, setPendingTrips] = useState<PendingTrip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [pendingGuides, setPendingGuides] = useState<PendingGuide[]>([]);
  const [guidesLoading, setGuidesLoading] = useState(true);
  const [pendingClassifieds, setPendingClassifieds] = useState<PendingClassified[]>([]);
  const [classifiedsLoading, setClassifiedsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Gallery Events state
  type GalleryEvent = Database['public']['Tables']['gallery_events']['Row'];
  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>([]);
  const [galleryEventsLoading, setGalleryEventsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<GalleryEvent | null>(null);
  const [eventForm, setEventForm] = useState({ name: '', event_date: '', sort_order: 10, description: '' });

  const supabase = useMemo(() => createClient(), []);

  const loadPending = useCallback(async () => {
    setLoading(true);
    // Load profiles with role = 'member' and recent signup (pending approval flow)
    // The admin sees all members; "pending" = approved=false logic depends on your RLS
    // Here we show all members newest first so admin can approve/manage
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('joined_at', { ascending: false })
      .limit(50);
    if (data) setPending(data);
    setLoading(false);
  }, []);

  const loadFlagged = useCallback(async () => {
    setFlaggedLoading(true);
    const { data } = await supabase
      .from('pins')
      .select('id, user_id, caption, photo_url, species, location_name, created_at, profiles(display_name)')
      .eq('flagged', true)
      .is('archived_at', null)
      .order('created_at', { ascending: false });
    if (data) setFlagged(data as FlaggedPin[]);
    setFlaggedLoading(false);
  }, []);

  const loadPendingTrips = useCallback(async () => {
    setTripsLoading(true);
    const { data } = await supabase
      .from('trips')
      .select('id, created_by, title, trip_date, profiles(display_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (data) setPendingTrips(data as PendingTrip[]);
    setTripsLoading(false);
  }, []);

  const loadPendingGuides = useCallback(async () => {
    setGuidesLoading(true);
    const { data } = await supabase
      .from('guide_postings')
      .select('id, guide_id, title, rate, profiles(display_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (data) setPendingGuides(data as PendingGuide[]);
    setGuidesLoading(false);
  }, []);

  const loadPendingClassifieds = useCallback(async () => {
    setClassifiedsLoading(true);
    const { data } = await supabase
      .from('classifieds')
      .select('id, seller_id, title, price, profiles(display_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (data) setPendingClassifieds(data as PendingClassified[]);
    setClassifiedsLoading(false);
  }, []);

  const loadGalleryEvents = useCallback(async () => {
    setGalleryEventsLoading(true);
    const { data } = await supabase.from('gallery_events').select('*').order('sort_order');
    setGalleryEvents(data ?? []);
    setGalleryEventsLoading(false);
  }, []);

  async function handleSaveEvent() {
    if (!eventForm.name.trim()) return;
    const payload = {
      name: eventForm.name.trim(),
      event_date: eventForm.event_date || null,
      sort_order: eventForm.sort_order,
      description: eventForm.description.trim() || null,
    };

    if (editingEvent) {
      await supabase.from('gallery_events').update(payload).eq('id', editingEvent.id);
      showToast('Event updated');
    } else {
      await supabase.from('gallery_events').insert(payload);
      showToast('Event created');
    }
    setEditingEvent(null);
    setEventForm({ name: '', event_date: '', sort_order: 10, description: '' });
    await loadGalleryEvents();
  }

  async function handleDeleteEvent(eventId: string) {
    if (!confirm('Delete this event? Photos will be moved to unassigned.')) return;
    // Move orphaned photos to null event_id
    await supabase.from('gallery_submissions').update({ event_id: null }).eq('event_id', eventId);
    await supabase.from('gallery_events').delete().eq('id', eventId);
    showToast('Event deleted');
    await loadGalleryEvents();
  }

  function startEditEvent(event: GalleryEvent) {
    setEditingEvent(event);
    setEventForm({
      name: event.name,
      event_date: event.event_date ?? '',
      sort_order: event.sort_order ?? 10,
      description: event.description ?? '',
    });
  }

  useEffect(() => {
    loadPending();
    loadFlagged();
    void loadPendingTrips();
    void loadPendingGuides();
    void loadPendingClassifieds();
    void loadGalleryEvents();
  }, [loadPending, loadFlagged, loadPendingTrips, loadPendingGuides, loadPendingClassifieds, loadGalleryEvents]);

  async function handleUnflag(pinId: string) {
    await supabase.from('pins').update({ flagged: false }).eq('id', pinId);
    await loadFlagged();
  }

  async function handleArchivePin(pinId: string) {
    await supabase.from('pins').update({ archived_at: new Date().toISOString() }).eq('id', pinId);
    await loadFlagged();
  }

  async function handleApprove(userId: string) {
    await supabase.from('profiles').update({ role: 'member' }).eq('id', userId);
    await loadPending();
  }

  async function handleMakeAdmin(userId: string) {
    await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId);
    await loadPending();
  }

  async function handlePreviewArchive() {
    setPreviewing(true);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - archiveDays);
    const { count } = await supabase
      .from('pins')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', cutoff.toISOString())
      .is('archived_at', null);
    setPreviewCount(count ?? 0);
    setPreviewing(false);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleApproveTrip(id: string) {
    await supabase.from('trips').update({ status: 'approved' }).eq('id', id);
    showToast('Trip approved');
    await loadPendingTrips();
  }

  async function handleRejectTrip(id: string) {
    await supabase.from('trips').update({ status: 'cancelled' }).eq('id', id);
    showToast('Trip rejected');
    await loadPendingTrips();
  }

  async function handleApproveGuide(id: string) {
    await supabase.from('guide_postings').update({ status: 'approved' }).eq('id', id);
    showToast('Guide listing approved');
    await loadPendingGuides();
  }

  async function handleRejectGuide(id: string) {
    await supabase.from('guide_postings').update({ status: 'removed' }).eq('id', id);
    showToast('Guide listing rejected');
    await loadPendingGuides();
  }

  async function handleApproveClassified(id: string) {
    await supabase.from('classifieds').update({ status: 'approved' }).eq('id', id);
    showToast('Listing approved');
    await loadPendingClassifieds();
  }

  async function handleRejectClassified(id: string) {
    await supabase.from('classifieds').update({ status: 'removed' }).eq('id', id);
    showToast('Listing rejected');
    await loadPendingClassifieds();
  }

  async function handleArchiveNow() {
    setArchiving(true);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - archiveDays);
    await supabase
      .from('pins')
      .update({ archived_at: new Date().toISOString() })
      .lt('created_at', cutoff.toISOString())
      .is('archived_at', null);
    setPreviewCount(null);
    setArchiving(false);
  }

  const roleBadge: Record<string, string> = {
    member: 'bg-green-water/20 text-green-water dark:text-cream/80',
    guide: 'bg-gold/20 text-gold',
    admin: 'bg-amber/20 text-amber',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Members queue */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-green-water rounded-2xl p-5 border border-gold/10 shadow-sm"
      >
        <h2 className="font-display text-xl text-green-deep dark:text-cream mb-4">Member Accounts</h2>
        {loading ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">Loading…</p>
        ) : pending.length === 0 ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">No members yet.</p>
        ) : (
          <AnimatePresence>
            <ul className="divide-y divide-gold/10">
              {pending.map((user, i) => (
                <motion.li
                  key={user.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-semibold text-text-dark dark:text-cream text-sm truncate">
                      {user.display_name ?? 'Unknown'}
                    </p>
                    <p className="font-serif text-xs text-text-mid dark:text-cream/50 truncate">{user.email}</p>
                    <p className="font-serif text-xs text-text-mid dark:text-cream/40">
                      Joined {new Date(user.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-serif capitalize ${roleBadge[user.role] ?? ''}`}>
                      {user.role}
                    </span>
                    {user.id !== adminId && user.role !== 'admin' && (
                      <>
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="px-3 py-1 bg-green-water/20 hover:bg-green-water/40 text-green-water dark:text-cream font-serif text-xs rounded-full transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleMakeAdmin(user.id)}
                          className="px-3 py-1 bg-amber/10 hover:bg-amber/20 text-amber font-serif text-xs rounded-full transition-colors"
                        >
                          Make Admin
                        </button>
                      </>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        )}
      </motion.section>

      {/* Flagged pins moderation */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-green-water rounded-2xl p-5 border border-gold/10 shadow-sm"
      >
        <h2 className="font-display text-xl text-green-deep dark:text-cream mb-4">Flagged Posts</h2>
        {flaggedLoading ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">Loading…</p>
        ) : flagged.length === 0 ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">No flagged posts.</p>
        ) : (
          <AnimatePresence>
            <ul className="divide-y divide-gold/10">
              {flagged.map((pin, i) => (
                <motion.li
                  key={pin.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-semibold text-text-dark dark:text-cream text-sm truncate">
                      {pin.profiles?.display_name ?? 'Member'}
                    </p>
                    {pin.caption && (
                      <p className="font-serif text-xs text-text-mid dark:text-cream/60 truncate">{pin.caption}</p>
                    )}
                    <p className="font-serif text-xs text-text-mid dark:text-cream/40">
                      {new Date(pin.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {pin.location_name ? ` · ${pin.location_name}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUnflag(pin.id)}
                      className="px-3 py-1 bg-green-water/20 hover:bg-green-water/40 text-green-water dark:text-cream font-serif text-xs rounded-full transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleArchivePin(pin.id)}
                      className="px-3 py-1 bg-amber/10 hover:bg-amber/20 text-amber font-serif text-xs rounded-full transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        )}
      </motion.section>

      {/* Pending Trips */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-green-water rounded-2xl p-5 border border-gold/10 shadow-sm"
      >
        <h2 className="font-display text-xl text-green-deep dark:text-cream mb-4">
          Pending Trips {pendingTrips.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-amber/20 text-amber text-sm rounded-full font-serif">{pendingTrips.length}</span>
          )}
        </h2>
        {tripsLoading ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">Loading…</p>
        ) : pendingTrips.length === 0 ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">No pending trips.</p>
        ) : (
          <ul className="divide-y divide-gold/10">
            {pendingTrips.map((trip) => (
              <li key={trip.id} className="py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-semibold text-text-dark dark:text-cream text-sm truncate">{trip.title}</p>
                  <p className="font-serif text-xs text-text-mid dark:text-cream/50">
                    {trip.profiles?.display_name ?? 'Member'}
                    {trip.trip_date ? ` · ${new Date(trip.trip_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { void handleApproveTrip(trip.id); }}
                    className="px-3 py-1 bg-green-water/20 hover:bg-green-water/40 text-green-water dark:text-cream font-serif text-xs rounded-full transition-colors"
                  >Approve</button>
                  <button
                    onClick={() => { void handleRejectTrip(trip.id); }}
                    className="px-3 py-1 bg-red-400/10 hover:bg-red-400/20 text-red-400 font-serif text-xs rounded-full transition-colors"
                  >Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.section>

      {/* Pending Guides */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-green-water rounded-2xl p-5 border border-gold/10 shadow-sm"
      >
        <h2 className="font-display text-xl text-green-deep dark:text-cream mb-4">
          Pending Guides {pendingGuides.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-amber/20 text-amber text-sm rounded-full font-serif">{pendingGuides.length}</span>
          )}
        </h2>
        {guidesLoading ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">Loading…</p>
        ) : pendingGuides.length === 0 ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">No pending guide listings.</p>
        ) : (
          <ul className="divide-y divide-gold/10">
            {pendingGuides.map((guide) => (
              <li key={guide.id} className="py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-semibold text-text-dark dark:text-cream text-sm truncate">{guide.title}</p>
                  <p className="font-serif text-xs text-text-mid dark:text-cream/50">
                    {guide.profiles?.display_name ?? 'Member'}
                    {guide.rate ? ` · ${guide.rate}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { void handleApproveGuide(guide.id); }}
                    className="px-3 py-1 bg-green-water/20 hover:bg-green-water/40 text-green-water dark:text-cream font-serif text-xs rounded-full transition-colors"
                  >Approve</button>
                  <button
                    onClick={() => { void handleRejectGuide(guide.id); }}
                    className="px-3 py-1 bg-red-400/10 hover:bg-red-400/20 text-red-400 font-serif text-xs rounded-full transition-colors"
                  >Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.section>

      {/* Pending Classifieds */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-green-water rounded-2xl p-5 border border-gold/10 shadow-sm"
      >
        <h2 className="font-display text-xl text-green-deep dark:text-cream mb-4">
          Pending Classifieds {pendingClassifieds.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-amber/20 text-amber text-sm rounded-full font-serif">{pendingClassifieds.length}</span>
          )}
        </h2>
        {classifiedsLoading ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">Loading…</p>
        ) : pendingClassifieds.length === 0 ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">No pending listings.</p>
        ) : (
          <ul className="divide-y divide-gold/10">
            {pendingClassifieds.map((item) => (
              <li key={item.id} className="py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-semibold text-text-dark dark:text-cream text-sm truncate">{item.title}</p>
                  <p className="font-serif text-xs text-text-mid dark:text-cream/50">
                    {item.profiles?.display_name ?? 'Member'}
                    {item.price ? ` · ${item.price}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { void handleApproveClassified(item.id); }}
                    className="px-3 py-1 bg-green-water/20 hover:bg-green-water/40 text-green-water dark:text-cream font-serif text-xs rounded-full transition-colors"
                  >Approve</button>
                  <button
                    onClick={() => { void handleRejectClassified(item.id); }}
                    className="px-3 py-1 bg-red-400/10 hover:bg-red-400/20 text-red-400 font-serif text-xs rounded-full transition-colors"
                  >Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.section>

      {/* Batch archive tool */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:bg-green-water rounded-2xl p-5 border border-gold/10 shadow-sm"
      >
        <h2 className="font-display text-xl text-green-deep dark:text-cream mb-2">Batch Archive</h2>
        <p className="font-serif text-sm text-text-mid dark:text-cream/60 mb-4">
          Archive posts older than a set period across all content types. Archived posts are hidden from feeds but can be restored.
        </p>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="flex items-center gap-2">
            <label className="font-serif text-sm text-text-dark dark:text-cream">Older than</label>
            <input
              type="number"
              min={7}
              max={3650}
              value={archiveDays}
              onChange={(e) => { setArchiveDays(Number(e.target.value)); setPreviewCount(null); }}
              className="w-20 bg-cream dark:bg-green-deep/60 rounded-xl px-3 py-2 font-serif text-text-dark dark:text-cream text-sm focus:outline-none focus:ring-2 focus:ring-amber/40 text-center"
            />
            <span className="font-serif text-sm text-text-dark dark:text-cream">days</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreviewArchive}
              disabled={previewing}
              className="px-4 py-2 bg-cream dark:bg-green-deep border border-gold/30 text-text-mid dark:text-cream/70 font-serif text-sm rounded-full hover:border-amber hover:text-amber transition-colors disabled:opacity-50"
            >
              {previewing ? 'Checking…' : 'Preview Count'}
            </button>
            {previewCount !== null && (
              <button
                onClick={handleArchiveNow}
                disabled={archiving || previewCount === 0}
                className="px-4 py-2 bg-amber hover:bg-amber/90 text-white font-serif text-sm rounded-full transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {archiving ? 'Archiving…' : `Archive Now (${previewCount})`}
              </button>
            )}
          </div>
        </div>
        {previewCount !== null && (
          <p className="mt-3 font-serif text-sm text-text-mid dark:text-cream/60">
            {previewCount === 0 ? 'No posts to archive in that range.' : `${previewCount} post${previewCount !== 1 ? 's' : ''} will be archived.`}
          </p>
        )}
      </motion.section>
      {/* Gallery Events CRUD */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white dark:bg-green-water rounded-2xl p-5 border border-gold/10 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-green-deep dark:text-cream">Gallery Events</h2>
          {!editingEvent && (
            <button
              onClick={() => {
                setEditingEvent(null);
                setEventForm({ name: '', event_date: '', sort_order: 10, description: '' });
              }}
              className="px-3 py-1 bg-amber/10 hover:bg-amber/20 text-amber font-serif text-xs rounded-full transition-colors"
            >
              + New Event
            </button>
          )}
        </div>

        {/* Event form */}
        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Event name (required)"
            value={eventForm.name}
            onChange={(e) => setEventForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full bg-cream dark:bg-green-deep/60 rounded-xl px-4 py-2 font-serif text-text-dark dark:text-cream text-sm focus:outline-none focus:ring-2 focus:ring-amber/40"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={eventForm.event_date}
              onChange={(e) => setEventForm((f) => ({ ...f, event_date: e.target.value }))}
              className="flex-1 bg-cream dark:bg-green-deep/60 rounded-xl px-4 py-2 font-serif text-text-dark dark:text-cream text-sm focus:outline-none focus:ring-2 focus:ring-amber/40"
            />
            <input
              type="number"
              placeholder="Sort order"
              value={eventForm.sort_order}
              onChange={(e) => setEventForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
              className="w-24 bg-cream dark:bg-green-deep/60 rounded-xl px-3 py-2 font-serif text-text-dark dark:text-cream text-sm focus:outline-none focus:ring-2 focus:ring-amber/40 text-center"
            />
          </div>
          <textarea
            placeholder="Description (optional)"
            value={eventForm.description}
            onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="w-full bg-cream dark:bg-green-deep/60 rounded-xl px-4 py-2 font-serif text-text-dark dark:text-cream text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber/40"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { void handleSaveEvent(); }}
              disabled={!eventForm.name.trim()}
              className="px-4 py-2 bg-amber hover:bg-amber/90 text-white font-serif text-sm rounded-full transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
            {editingEvent && (
              <button
                onClick={() => { setEditingEvent(null); setEventForm({ name: '', event_date: '', sort_order: 10, description: '' }); }}
                className="px-4 py-2 bg-cream dark:bg-green-deep text-text-mid dark:text-cream/70 font-serif text-sm rounded-full transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Events list */}
        {galleryEventsLoading ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">Loading…</p>
        ) : galleryEvents.length === 0 ? (
          <p className="font-serif text-sm text-text-mid dark:text-cream/60">No gallery events yet.</p>
        ) : (
          <ul className="divide-y divide-gold/10">
            {galleryEvents.map((event) => (
              <li key={event.id} className="py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-semibold text-text-dark dark:text-cream text-sm truncate">{event.name}</p>
                  <p className="font-serif text-xs text-text-mid dark:text-cream/50">
                    {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                    {' · Sort: '}{event.sort_order ?? 10}
                  </p>
                  {event.description && (
                    <p className="font-serif text-xs text-text-mid dark:text-cream/40 truncate">{event.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditEvent(event)}
                    className="px-3 py-1 bg-green-water/20 hover:bg-green-water/40 text-green-water dark:text-cream font-serif text-xs rounded-full transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { void handleDeleteEvent(event.id); }}
                    className="px-3 py-1 bg-red-400/10 hover:bg-red-400/20 text-red-400 font-serif text-xs rounded-full transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-green-deep text-cream text-xs px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
