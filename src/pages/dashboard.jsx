import { Eye, Users } from "lucide-react";
import { useState } from "react";
import StatCard from "../features/analytics/components/StatCard";
import TopPagesList from "../features/analytics/components/TopPagesList";
import VisitsChart from "../features/analytics/components/VisitsChart";
import { useAnalyticsSummary } from "../features/analytics/hooks/useAnalyticsSummary";

const RANGES = [
  { label: "7 jours", days: 7 },
  { label: "14 jours", days: 14 },
  { label: "30 jours", days: 30 },
];

export default function Dashboard() {
  const [days, setDays] = useState(14);
  const { data, isLoading, isError, refetch } = useAnalyticsSummary(days);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-teal-950 dark:text-white">Tableau de bord</h1>
          <p className="mt-1 text-sm text-teal-950/60 dark:text-white/60">
            Statistiques de fréquentation du site.
          </p>
        </div>

        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-teal-900/60">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setDays(r.days)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                days === r.days
                  ? "bg-white text-teal-950 shadow-sm dark:bg-teal-950 dark:text-green-400"
                  : "text-teal-950/60 hover:text-teal-950 dark:text-white/60"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-200 dark:bg-teal-900/60" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-50 p-6 text-center dark:bg-red-500/10">
          <p className="text-sm text-red-700 dark:text-red-300">Impossible de charger les statistiques.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-500/20"
          >
            Réessayer
          </button>
        </div>
      )}

      {!isLoading && !isError && data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Vues de pages" value={data.totalViews} icon={Eye} />
            <StatCard label="Sessions distinctes" value={data.totalSessions} icon={Users} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <VisitsChart data={data.dailyVisits} />
            </div>
            <TopPagesList pages={data.topPages} />
          </div>
        </>
      )}
    </div>
  );
}