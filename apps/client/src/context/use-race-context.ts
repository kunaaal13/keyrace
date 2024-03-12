import { useContext } from 'react'
import { raceContext } from './race'

export default function useRaceContext() {
  const context = useContext(raceContext)

  if (!context) {
    throw new Error('context does not exist')
  }

  return context
}
