import heroImage from "../../../assets/headerImg.jpg";

const RADIUS = 28;

/** Encoche aux coins arrondis, façon « onglet » du design. */
function Notch({ corner, width, height }) {
  const r = RADIUS;
  const fillet = (center) =>
    `radial-gradient(circle at ${center}, transparent ${r - 1}px, currentColor ${r}px)`;

  const isTopLeft = corner === "top-left";

  const block = isTopLeft
    ? { top: 0, left: 0, width, height, borderBottomRightRadius: r }
    : { bottom: 0, right: 0, width, height, borderTopLeftRadius: r };

  const filletAlongEdge = isTopLeft
    ? { top: 0, left: width, width: r, height: r, background: fillet("100% 100%") }
    : { bottom: 0, right: width, width: r, height: r, background: fillet("0 0") };

  const filletAlongSide = isTopLeft
    ? { top: height, left: 0, width: r, height: r, background: fillet("100% 100%") }
    : { bottom: height, right: 0, width: r, height: r, background: fillet("0 0") };

  return (
    <>
      <span className="absolute bg-current" style={block} />
      <span className="absolute" style={filletAlongEdge} />
      <span className="absolute" style={filletAlongSide} />
    </>
  );
}

export default function LoginHero() {
  return (
    // La couleur du texte = couleur de la carte, pour que les encoches se fondent dedans
    <div className="relative h-full min-h-140 overflow-hidden rounded-tr-4xl rounded-bl-4xl text-white dark:text-black">
      <img
        src={heroImage}
        alt="Élèves travaillant sur des ordinateurs autour de l'intelligence artificielle"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-b from-teal-950/70 via-transparent to-teal-950/50" />

      <p className="absolute right-8 top-8 max-w-60 text-right text-lg font-semibold leading-snug text-white!">
        Gérez vos services, projets, équipe et avis en temps réel.
      </p>

      <Notch corner="top-left" width={112} height={64} />
      <Notch corner="bottom-right" width={104} height={56} />
    </div>
  );
}