'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@bayou/supabase'
import GalleryClient from './GalleryClient'
import type { Database } from '@bayou/supabase/types'

type GalleryEvent = Database['public']['Tables']['gallery_events']['Row']
type GallerySubmission = Database['public']['Tables']['gallery_submissions']['Row']

export default function Gallery() {
  const [events, setEvents] = useState<GalleryEvent[]>([])
  const [submissions, setSubmissions] = useState<GallerySubmission[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function load() {
      const [{ data: evts }, { data: subs }] = await Promise.all([
        supabase
          .from('gallery_events')
          .select('*')
          .order('event_date', { ascending: false }),
        supabase
          .from('gallery_submissions')
          .select('*')
          .eq('status', 'approved'),
      ])
      setEvents(evts ?? [])
      setSubmissions(subs ?? [])
      setLoading(false)
    }
    load()
  }, [supabase])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-green-water/20 rounded-xl w-48" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-green-water/10 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return <GalleryClient events={events} submissions={submissions} />
}
