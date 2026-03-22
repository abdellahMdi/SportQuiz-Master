import { useEffect, useMemo, useRef, useState } from "react";

export default function Timer({ duration = 25, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timeoutRaised = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!timeoutRaised.current) {
        timeoutRaised.current = true;
        onTimeout();
      }
      return undefined;
    }

    const timerId = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [onTimeout, timeLeft]);

  const progress = useMemo(() => {
    return Math.max((timeLeft / duration) * 100, 0);
  }, [duration, timeLeft]);

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative h-20 w-20 rounded-full"
        style={{
          background: `conic-gradient(#3101B9 ${progress * 3.6}deg, #E9D5FF 0deg)`,
        }}
      >
        <div className="absolute inset-2 grid place-content-center rounded-full bg-white text-center">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Timer</p>
          <p className="font-semibold text-[#3101B9]">00:{String(timeLeft).padStart(2, "0")}</p>
        </div>
      </div>
    </div>
  );
}
