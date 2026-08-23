let _cachedFine: boolean | null = null;

/** Non-reactive check for use inside event handlers. */
export function hasFinePointer(): boolean {
  if (typeof window === 'undefined') return false;
  if (_cachedFine !== null) return _cachedFine;
  const fine =
    window.matchMedia('(hover: hover)').matches &&
    window.matchMedia('(pointer: fine)').matches;
  return (_cachedFine = fine);
}

if (typeof window !== 'undefined') {
  try {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    mq.addEventListener('change', () => {
      _cachedFine = null;
    });
  } catch {}
}
