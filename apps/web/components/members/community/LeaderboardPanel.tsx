'use client'

import { useMemo, useEffect, useState } from 'react'
import { createClient } from '@bayou/supabase'

interface LeaderboardEntry {
  userId: string
  displayName: string
  count: number
}

interface Props {
  userId: string
  role: 'member' | 'guide' | 'admin'
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPanel({ userId: _userId, role: _role }: Props) {
  const supabase = useMemo(() => createClient(), [])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthName = now.toLocaleString('en-US', { month: 'long' })
  const year = now.getFullYear()

  useEffect(() => {
    async function load() {
      setLoading(true)

      const { data: pinsData, error: pinsError } = await supabase
        .from('pins')
        .select('user_id')
        .eq('flagged', false)
        .gte('catch_date', firstOfMonth)

      if (pinsError || !pinsData) {
        setLoading(false)
        return
      }

      // Build count map
      const countMap: Record<string, number> = {}
      for (const row of pinsData) {
        const uid = row.user_id as string
        countMap[uid] = (countMap[uid] ?? 0) + 1
      }

      // Sort descending, take top 10
      const topUserIds = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([id]) => id)

      if (topUserIds.length === 0) {
        setLeaderboard([])
        setLoading(false)
        return
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', topUserIds)

      if (profilesError || !profilesData) {
        setLoading(false)
        return
      }

      const nameMap: Record<string, string> = {}
      for (const p of profilesData) {
        nameMap[p.id as string] = (p.display_name as string) ?? 'Angler'
      }

      const entries: LeaderboardEntry[] = topUserIds.map((uid) => ({
        userId: uid,
        displayName: nameMap[uid] ?? 'Angler',
        count: countMap[uid] ?? 0,
      }))

      setLeaderboard(entries)
      setLoading(false)
    }

    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="glass-card--dark rounded-2xl p-6 bg-gradient-to-br from-green-deep to-green-water">
      <h3 className="font-display text-xl text-gold mb-4">
        🏆 {monthName} {year} Leaderboard
      </h3>

      {loading ? (
        <p className="text-cream/60 text-center py-6 font-serif">Loading…</p>
      ) : leaderboard.length === 0 ? (
        <p className="text-cream/60 text-center py-6 font-serif">
          No catches logged this month yet. Be the first!
        </p>
      ) : (
        <>
          {/* Top 3 */}
          <div>
            {leaderboard.slice(0, 3).map((entry, i) => (
              <div key={entry.userId} className="flex items-center gap-3 py-2">
                <span className="text-2xl">{MEDALS[i]}</span>
                <span className="font-serif text-cream font-semibold flex-1">
                  {entry.displayName}
                </span>
                <span className="text-sm text-gold font-bold">
                  {entry.count} pin{entry.count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          {leaderboard.length > 3 && (
            <>
              <div className="border-t border-cream/10 my-2" />
              <div>
                {leaderboard.slice(3).map((entry, i) => (
                  <div key={entry.userId} className="flex items-center gap-3 py-1.5">
                    <span className="text-sm text-cream/60 w-6 text-right">{i + 4}</span>
                    <span className="font-serif text-cream/80 flex-1">{entry.displayName}</span>
                    <span className="text-sm text-cream/60">
                      {entry.count} pin{entry.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <div className="mt-4 pt-3 border-t border-cream/10 text-xs text-cream/50 text-center font-serif">
        Counts pins logged in the Map tab this month. Resets on the 1st.
      </div>
    </div>
  )
}
