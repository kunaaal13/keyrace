// Use countdown hook to create a countdown timer it takes an initial time and returns the time left and functions to start and reset the timer.

import { useEffect, useState } from 'react'

interface CountdownHookProps {
  initialTime: number
}

export default function useCountdownHook({ initialTime }: CountdownHookProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [timerActive, setTimerActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timerActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [timerActive])

  function startCountdown() {
    setTimerActive(true)
  }

  function resetTimer() {
    setTimeLeft(initialTime)
    setTimerActive(false)
  }

  return { timeLeft, startCountdown, resetTimer }
}
