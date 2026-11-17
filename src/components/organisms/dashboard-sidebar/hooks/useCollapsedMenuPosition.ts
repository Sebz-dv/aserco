import { useEffect, useState, type RefObject } from "react";

type Position = { offsetTop: number; openToLeft: boolean };
type Options = { sidebarOpen: boolean; isOpen: boolean; triggerRef: RefObject<HTMLElement | null>; menuRef: RefObject<HTMLElement | null>; fallbackHeight: number; fallbackWidth: number };

export function useCollapsedMenuPosition({ sidebarOpen, isOpen, triggerRef, menuRef, fallbackHeight, fallbackWidth }: Options): Position {
  const [position, setPosition] = useState<Position>({ offsetTop: 0, openToLeft: false });
  useEffect(() => {
    if (sidebarOpen || !isOpen || typeof window === "undefined") return;
    const update = () => {
      const trigger = triggerRef.current; const menu = menuRef.current;
      if (!trigger || !menu) return;
      const margin = 8; const rect = trigger.getBoundingClientRect();
      const height = menu.offsetHeight || fallbackHeight; const width = menu.offsetWidth || fallbackWidth;
      let offsetTop = Math.min(0, window.innerHeight - margin - (rect.top + height));
      offsetTop = Math.max(offsetTop, margin - rect.top);
      const openToLeft = rect.right + 8 + width > window.innerWidth - margin;
      setPosition({ offsetTop, openToLeft });
    };
    const raf = window.requestAnimationFrame(update);
    window.addEventListener("resize", update); window.addEventListener("scroll", update, true);
    return () => { window.cancelAnimationFrame(raf); window.removeEventListener("resize", update); window.removeEventListener("scroll", update, true); };
  }, [sidebarOpen, isOpen, triggerRef, menuRef, fallbackHeight, fallbackWidth]);
  return position;
}
