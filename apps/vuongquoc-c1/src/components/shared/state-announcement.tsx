'use client';

import { useEffect, useRef, useState } from 'react';

export function StateAnnouncement({ message, announceOnMount }: {
  message: string;
  announceOnMount: boolean;
}) {
  const lastMessage = useRef(announceOnMount ? null : message);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (lastMessage.current === message) return;
    // Give the browser time to expose the empty live region before populating it.
    const timeout = window.setTimeout(() => {
      lastMessage.current = message;
      setAnnouncement(message);
    }, 100);
    return () => window.clearTimeout(timeout);
  }, [message]);

  return <span className="sr-only" role="status" aria-atomic="true">{announcement}</span>;
}
