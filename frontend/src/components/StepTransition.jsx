import { useEffect, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

// Wraps whichever wizard step is active so it fades/slides in on mount
// instead of teleporting in, matching the direction the user is moving.
// Mount the caller with key={currentStep} so this remounts (and re-animates)
// on every step change.
export default function StepTransition({ direction = 'forward', children }) {
  const [entered, setEntered] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const offset = reducedMotion ? '0' : direction === 'back' ? '-0.75rem' : '0.75rem';

  return (
    <div
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateX(0)' : `translateX(${offset})`,
        transition: 'opacity 220ms var(--ease-out), transform 220ms var(--ease-out)',
      }}
    >
      {children}
    </div>
  );
}
