'use client';

import { useEffect, useState } from 'react';

const TARGET = new Date('2026-04-25T06:15:00-05:00').getTime();

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft | null {
  const diff = TARGET - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (timeLeft === null) {
    return (
      <p className="font-handwritten text-gold text-2xl text-center my-4">
        Rodeo Day! See you at sunrise!
      </p>
    );
  }

  const blocks: { label: string; value: number }[] = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center my-5">
      {blocks.map(({ label, value }) => (
        <div
          key={label}
          className="min-w-[68px] text-center rounded-[10px] px-3 py-2.5 border border-gold/25 bg-green-deep/60 backdrop-blur"
        >
          <span className="block font-display text-gold text-[1.6rem] font-black leading-none tabular-nums">
            {pad(value)}
          </span>
          <span className="block text-[0.62rem] uppercase tracking-widest text-cream/80 mt-1">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
