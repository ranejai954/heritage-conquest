import { useCallback, useEffect, useState } from "react";

import { api, type ProgressRow } from "@/lib/api";
import { MONUMENTS } from "@/lib/monuments";

export type { ProgressRow };

export function useProgress(userId: string | undefined) {
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      const { rows: next } = await api.progress();
      setRows(next);
    } catch {
      setRows([]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    void refresh();
  }, [userId, refresh]);

  const completed = new Set(rows.filter((r) => r.minigame_completed).map((r) => r.monument_slug));

  const isUnlocked = (slug: string) => {
    const index = MONUMENTS.findIndex((m) => m.slug === slug);
    if (index <= 0) return true;
    const previous = MONUMENTS[index - 1];
    return previous ? completed.has(previous.slug) : true;
  };

  const totals = rows.reduce(
    (acc, r) => ({
      points: acc.points + r.points_earned,
      crystals: acc.crystals + r.crystals_earned,
      badges: acc.badges + (r.badge_earned ? 1 : 0),
    }),
    { points: 0, crystals: 0, badges: 0 },
  );

  return { rows, loading, refresh, completed, isUnlocked, totals };
}
