import { useEffect, useState } from 'react';

export function Timer() {
  const [seconds, setSeconds] = useState(180); // 3분을 초로 계산한 값

  useEffect(() => {
    let intervalId: number;
    if (seconds > 0) {
      intervalId = setInterval(() => setSeconds((prevSeconds) => prevSeconds - 1), 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [seconds]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return <p className={'items-center'}>{formatTime(seconds)}</p>;
}
