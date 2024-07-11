"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

type Props = {
  datetime: string;
};

export default function CountDown({ datetime }: Props) {
  const t = useTranslations("");

  const calculateTimeLeft = () => {
    const difference = +new Date(datetime) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span
            style={
              { "--value": formatTime(timeLeft.days) } as React.CSSProperties
            }
            suppressHydrationWarning></span>
        </span>
        <span className="text-sm">days</span>
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span
            style={{ "--value": timeLeft.hours } as React.CSSProperties}
            suppressHydrationWarning></span>
        </span>
        <span className="text-sm">hours</span>
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span
            style={{ "--value": timeLeft.minutes } as React.CSSProperties}
            suppressHydrationWarning></span>
        </span>
        <span className="text-sm">minutes</span>
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span
            style={{ "--value": timeLeft.seconds } as React.CSSProperties}
            suppressHydrationWarning></span>
        </span>
        <span className="text-sm">seconds</span>
      </div>
    </div>
  );
}
