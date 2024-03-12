import { useState } from 'react'

interface CountdownHook {
  initialTime: number
}

function useCountdownHook(
  { initialTime }: CountdownHook = { initialTime: 60 }
) {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  let interval: NodeJS.Timeout

  function startCountdown() {
    interval = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
  }

  function resetTimer() {
    if (interval) {
      clearTimeout(interval)
    }
    setTimeLeft(initialTime)
  }

  return { timeLeft, startCountdown, resetTimer }
}

export default useCountdownHook
