import * as React from "react";
const MOBILE_BREAKPOINT = 768;
const subscribe = (callback: () => void) => { const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`); media.addEventListener("change", callback); return () => media.removeEventListener("change", callback); };
const getSnapshot = () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
const getServerSnapshot = () => false;
export function useIsMobile() { return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot); }
