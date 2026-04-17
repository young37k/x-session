import React from "react";

export const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
  return <input ref={ref} className={`flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />;
});
