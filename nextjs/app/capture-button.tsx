'use client';

import { useState } from 'react';

export function CaptureButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    // The stub queues this call if the SDK has not loaded yet.
    window.sequential?.capture('demo_clicked', { source: 'example' });
    setCount((c) => c + 1);
  }

  return (
    <div className="capture">
      <button type="button" onClick={handleClick}>
        Send a demo_clicked event
      </button>
      <p className="muted" aria-live="polite">
        {count === 0
          ? 'Nothing sent yet.'
          : `Sent demo_clicked ${count} ${count === 1 ? 'time' : 'times'}.`}
      </p>
    </div>
  );
}
