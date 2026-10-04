export default function TopPagesList({ pages }) {
  const max = Math.max(...pages.map((p) => p.views), 1);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-white/10 dark:bg-teal-950">
      <h2 className="text-lg font-bold text-teal-950 dark:text-white">Pages les plus visitées</h2>

      {pages.length === 0 ? (
        <p className="mt-6 text-sm text-gray-400">Pas encore de données sur cette période.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {pages.map((page) => (
            <li key={page.path}>
              <div className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-teal-950 dark:text-white">{page.path}</span>
                <span className="ml-2 shrink-0 text-teal-950/60 dark:text-white/60">{page.views}</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/10">
                <div
                  className="h-1.5 rounded-full bg-green-400"
                  style={{ width: `${(page.views / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}