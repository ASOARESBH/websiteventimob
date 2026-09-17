import React from "react";

interface VentimobLogoProps {
  className?: string;
  variant?: "full" | "icon" | "white";
  size?: "sm" | "md" | "lg";
}

export const VentimobLogo: React.FC<VentimobLogoProps> = ({
  className = "",
  variant = "full",
  size = "md",
}) => {
  const heights = {
    sm: "h-7",
    md: "h-9",
    lg: "h-12",
  };

  const isWhite = variant === "white";

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Símbolo com teto/casa e seta de movimento ascendente PropTech */}
      <svg
        className={`${heights[size]} aspect-square shrink-0`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vtmGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#062B5C" />
            <stop offset="100%" stopColor="#087FF5" />
          </linearGradient>
          <linearGradient id="vtmGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#087FF5" />
            <stop offset="100%" stopColor="#12B8F2" />
          </linearGradient>
          <linearGradient id="vtmGradWhite" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#80E5FF" />
          </linearGradient>
        </defs>

        {/* Formas em movimento: Telhado dinâmico + Seta de crescimento */}
        <path
          d="M8 34L32 10L56 34L48 42L32 26L16 42L8 34Z"
          fill={isWhite ? "url(#vtmGradWhite)" : "url(#vtmGrad2)"}
        />
        <path
          d="M16 45L32 29L48 45L40 53L32 45L24 53L16 45Z"
          fill={isWhite ? "#FFFFFF" : "url(#vtmGrad1)"}
          opacity={isWhite ? 0.9 : 0.85}
        />
        <circle
          cx="32"
          cy="18"
          r="4.5"
          fill={isWhite ? "#12B8F2" : "#12B8F2"}
        />
      </svg>

      {variant !== "icon" && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-black tracking-tight text-xl ${
              isWhite ? "text-white" : "text-[#062B5C]"
            }`}
          >
            VENTI<span className="text-[#087FF5]">MOB</span>
          </span>
          <span
            className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${
              isWhite ? "text-cyan-200/90" : "text-slate-500"
            }`}
          >
            Imóveis em movimento
          </span>
        </div>
      )}
    </div>
  );
};
