import { useMemo, useState } from "react";
import { icons as TOUS_LES_ICONES_MAP, Search } from "lucide-react";

const TOUTES_LES_ICONES = Object.keys(TOUS_LES_ICONES_MAP).sort();

export default function IconPicker({ value, onChange, error }) {
  const [search, setSearch] = useState("");

  const iconesFiltrees = useMemo(() => {
    if (!search.trim()) return TOUTES_LES_ICONES;
    const terme = search.trim().toLowerCase();
    return TOUTES_LES_ICONES.filter((nom) =>
      nom.toLowerCase().includes(terme)
    );
  }, [search]);

  return (
    <div>
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-teal-950/40 dark:text-white/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Rechercher parmi ${TOUTES_LES_ICONES.length} icônes...`}
          className="w-full rounded-sm bg-gray-100 py-2 pl-10 pr-3 text-md text-teal-950 outline-none transition placeholder:text-teal-950/30 focus:ring-2 focus:ring-green-400 dark:bg-teal-900/60 dark:text-white dark:placeholder:text-white/30"
        />
      </div>

           <div className="grid max-h-72 grid-cols-6 gap-2 overflow-y-auto border border-gray-200 p-3 dark:border-white/10 sm:grid-cols-8">
        {iconesFiltrees.length === 0 ? (
          <p className="col-span-full py-6 text-center text-sm text-neutral-400">
            Aucune icône trouvée.
          </p>
        ) : (
          iconesFiltrees.map((nom) => {
            const Icon = TOUS_LES_ICONES_MAP[nom];
            const isSelected = value === nom;

            return (
              <button
                key={nom}
                type="button"
                title={nom}
                onClick={() => onChange(nom)}
                 className={[
                  "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                  isSelected
                    ? "border-green-400 bg-green-400 text-teal-950"
                    : "border-transparent text-teal-950/60 hover:bg-gray-100 hover:text-teal-950 dark:text-white/60 dark:hover:bg-teal-900 dark:hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })
        )}
      </div>

      
      {value && (
        <p className="mt-2 text-xs text-gray-400 dark:text-white/40">
          Icône sélectionnée :{" "}
          <span className="font-medium text-teal-950 dark:text-white">{value}</span>
        </p>
      )}

     {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}