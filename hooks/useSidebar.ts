"use client";

import { useEffect, useMemo, useState } from "react";

const KEY = "bidsutra.sidebar.collapsed";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const v = window.localStorage.getItem(KEY);
    if (v === "1") setCollapsed(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  return useMemo(
    () => ({
      collapsed,
      toggle: () => setCollapsed((v) => !v),
      setCollapsed
    }),
    [collapsed]
  );
}
