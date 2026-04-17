import React from "react";

export function Button({ className = "", variant = "default", type = "button", disabled = false, ...props }) {
  const base = "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-900",
  };
  return <button type={type} disabled={disabled} className={`${base} ${variants[variant] || variants.default} ${className}`} {...props} />;
}
