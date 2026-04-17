import React from "react";

export function Select({ value, onValueChange, children }) {
  const items = [];
  React.Children.forEach(children, (child) => {
    if (child?.type?.displayName === "SelectContent") {
      React.Children.forEach(child.props.children, (item) => {
        if (item?.props?.value !== undefined) items.push({ value: item.props.value, label: item.props.children });
      });
    }
  });
  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
    >
      {items.map((item) => <option key={item.value} value={item.value}>{typeof item.label === "string" ? item.label : item.value}</option>)}
    </select>
  );
}
export function SelectTrigger({ children }) { return <>{children}</>; }
export function SelectValue() { return null; }
export function SelectContent({ children }) { return <>{children}</>; }
export function SelectItem() { return null; }
SelectContent.displayName = "SelectContent";
