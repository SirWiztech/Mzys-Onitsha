import { useSyncExternalStore } from 'react';

const QUERY = '(hover: none), (pointer: coarse)';

const subscribe = (onStoreChange: () => void) => {
  const mq = typeof window !== 'undefined' ? window.matchMedia?.(QUERY) : null;
  if (!mq) return () => {};
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return !!window.matchMedia?.(QUERY).matches;
};

const getServerSnapshot = () => false;

export function useCoarsePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}