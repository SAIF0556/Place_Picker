import { useEffect, useState } from 'react'
export default function Progress({ Timer }) {
  const [remainingTime, setRemainingTime] = useState(Timer)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 10)
    }, 10)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return <progress value={remainingTime} max={Timer} />
}
