export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-teal-950">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-400/20 text-teal-950 dark:text-green-400">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-bold text-teal-950 dark:text-white">{value}</p>
        <p className="text-xs text-teal-950/60 dark:text-white/60">{label}</p>
      </div>
    </div>
  );
}