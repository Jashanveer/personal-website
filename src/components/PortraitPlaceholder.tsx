/**
 * Temporary silhouette placeholder. Replace by dropping your transparent-PNG
 * cutout at `public/me.png` and switching the Hero to <Image src="/me.png" />.
 */
export default function PortraitPlaceholder() {
  return (
    <svg
      viewBox="0 0 400 500"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      role="img"
      aria-label="Portrait placeholder — replace public/me.png"
    >
      <defs>
        <linearGradient id="silhouette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(10,10,10,0.18)" />
          <stop offset="100%" stopColor="rgba(10,10,10,0.04)" />
        </linearGradient>
      </defs>
      {/* head */}
      <ellipse cx="200" cy="170" rx="78" ry="92" fill="url(#silhouette)" />
      {/* shoulders / torso */}
      <path
        d="M 60 500 C 60 360, 130 290, 200 290 C 270 290, 340 360, 340 500 Z"
        fill="url(#silhouette)"
      />
      <text
        x="200"
        y="475"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui"
        fontSize="11"
        fill="rgba(10,10,10,0.45)"
        letterSpacing="0.08em"
      >
        REPLACE WITH YOUR CUTOUT
      </text>
    </svg>
  );
}
