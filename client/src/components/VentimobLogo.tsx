import React from "react";
import originalLogo from "../assets/ventimob-logo.png";

interface VentimobLogoProps {
  className?: string;
  variant?: "full" | "icon" | "white";
  size?: "sm" | "md" | "lg";
}

const heights = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
} as const;

/**
 * Logo institucional original da Ventimob.
 *
 * `variant` é mantida por compatibilidade com os pontos existentes do portal;
 * a identidade oficial é sempre renderizada a partir do mesmo arquivo original.
 */
export const VentimobLogo: React.FC<VentimobLogoProps> = ({
  className = "",
  variant = "full",
  size = "md",
}) => {
  const onDarkSurface = variant === "white";

  return (
    <span
      className={`inline-flex shrink-0 items-center select-none ${
        onDarkSurface ? "rounded-lg bg-white px-2 py-1" : ""
      } ${className}`}
    >
      <img
        src={originalLogo}
        alt="Ventimob — Imóveis em movimento"
        className={`${heights[size]} w-auto max-w-[min(48vw,260px)] object-contain`}
        draggable={false}
      />
    </span>
  );
};
