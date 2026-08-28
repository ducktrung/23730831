import {
  useEffect,
  useMemo,
  useState,
} from 'react';

export default function useCountdown(
  initialSeconds: number,
) {
  const [
    secondsLeft,
    setSecondsLeft,
  ] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft(current =>
        Math.max(0, current - 1),
      );
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [secondsLeft]);

  const formattedTime =
    useMemo(() => {
      const minutes = Math.floor(
        secondsLeft / 60,
      );

      const seconds =
        secondsLeft % 60;

      return `${String(minutes).padStart(
        2,
        '0',
      )}:${String(seconds).padStart(
        2,
        '0',
      )}`;
    }, [secondsLeft]);

  return {
    secondsLeft,
    formattedTime,
    isFinished: secondsLeft <= 0,
  };
}