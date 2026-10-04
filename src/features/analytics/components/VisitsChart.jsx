import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function VisitsChart({ data }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-white/10 dark:bg-teal-950">
      <h2 className="text-lg font-bold text-teal-950 dark:text-white">Trafic du site</h2>
      <p className="mt-1 text-sm text-teal-950/60 dark:text-white/60">
        Nombre de vues de pages par jour.
      </p>

      <div className="mt-6 h-72 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Pas encore de données sur cette période.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#0f172a99" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#0f172a99" }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
                labelStyle={{ color: "#042f2e", fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="visits"
                name="Vues"
                stroke="#4ade80"
                strokeWidth={3}
                dot={{ r: 3, fill: "#042f2e" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}