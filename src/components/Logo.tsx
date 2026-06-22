export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="FLUX"
      fill="none"
    >
      <defs>
        <linearGradient id="flux-mark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c6f03c" />
          <stop offset="0.55" stopColor="#9bf06a" />
          <stop offset="1" stopColor="#7cffb2" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="37" height="37" rx="11" stroke="url(#flux-mark)" strokeWidth="2.2" />
      {/* Flux bolt */}
      <path
        d="M23.5 9 L13 22 H19 L16.5 31 L27 18 H21 Z"
        fill="url(#flux-mark)"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`group inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 animate-logo transition-transform duration-300 group-hover:rotate-[8deg] group-hover:scale-110" />
      <span className="font-display text-xl font-bold tracking-tight">
        <span className="text-ink">FL</span>
        <span className="logo-gradient">UX</span>
      </span>
    </span>
  );
}
