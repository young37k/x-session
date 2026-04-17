import React from "react";

export function Dialog({ open, children }) {
  if (!open) return null;
  return <>{children}</>;
}
export function DialogContent({ className = "", children }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className={`w-full max-w-lg bg-white shadow-2xl ${className}`}>{children}</div></div>;
}
export function DialogHeader({ className = "", ...props }) {
  return <div className={`p-6 pb-0 ${className}`} {...props} />;
}
export function DialogTitle({ className = "", ...props }) {
  return <h2 className={`text-lg font-semibold ${className}`} {...props} />;
}
export function DialogDescription({ className = "", ...props }) {
  return <p className={`mt-2 text-sm text-slate-500 ${className}`} {...props} />;
}
export function DialogFooter({ className = "", ...props }) {
  return <div className={`flex justify-end gap-2 p-6 pt-0 ${className}`} {...props} />;
}
