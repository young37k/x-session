import React, { createContext, useContext } from "react";

const TabsContext = createContext({ value: "", onValueChange: () => {} });

export function Tabs({ value, onValueChange, className = "", children }) {
  return <TabsContext.Provider value={{ value, onValueChange }}><div className={className}>{children}</div></TabsContext.Provider>;
}
export function TabsList({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
export function TabsTrigger({ value, className = "", children }) {
  const ctx = useContext(TabsContext);
  const active = ctx.value === value;
  return <button type="button" onClick={() => ctx.onValueChange?.(value)} className={className} data-state={active ? "active" : "inactive"}>{children}</button>;
}
