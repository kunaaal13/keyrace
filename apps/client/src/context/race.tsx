import useCountdownHook from '@/components/use-countdown-hook'
import { createContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { toast } from 'sonner'

type Status = 'waiting' | 'playing' | 'finished'

type PlayerScore = {
  id: string
  score: number
}

type Player = {
  id: string
  name: string
  score: number
}

type RaceContext = {
  socket: Socket
  status: Status
  players: Player[]
  paragraph: string
  hostId: string
  startGame: () => void
  onPlayerType: (text: string) => void
  timeLeft: number
}

// Assuming you have exported the RaceContext type
export const raceContext = createContext<RaceContext | null>(null)
const RaceProvider = raceContext.Provider

export default function RaceContextProvider({
  children,
  raceId,
  name,
}: {
  children: React.ReactNode
  raceId: string
  name: string
}) {
  const [socket, setSocket] = useState<Socket>()
  const [status, setStatus] = useState<Status>('waiting')
  const [players, setPlayers] = useState<Player[]>([])
  const [paragraph, setParagraph] = useState<string>(``)
  const [hostId, setHostId] = useState<string>('')

  const { timeLeft, startCountdown, resetTimer } = useCountdownHook({
    initialTime: 60,
  })

  useEffect(() => {
    const socket = io('ws://localhost:8080', {
      transports: ['websocket'],
    })

    setSocket(socket)

    socket.on('connect', () => {
      toast.success('Connected to server')
    })

    socket.on('players', (players: Player[]) => {
      setPlayers(players)
    })

    socket.on('player-joined', (player: Player) => {
      toast.success(`${player.name} joined the game`)
    })

    socket.on('player-left', (id: string) => {
      setPlayers((prev) => prev.filter((player) => player.id !== id))
    })

    socket.on('error', (error: string) => {
      toast.error(error)
    })

    socket.on('new-host', (id: string) => {
      setHostId(id)
    })

    socket.on('game-started', (paragraph: string) => {
      setParagraph(paragraph)
      setStatus('playing')
      startCountdown()

      toast.success('Game started...')
    })

    socket.on('game-finished', (winner: Player) => {
      setStatus('finished')
      setParagraph('')
      resetTimer()

      toast.success(`${winner.name} won the game!`)
    })

    socket.on('player-score', (playerScore: PlayerScore) => {
      setPlayers((prev) =>
        prev.map((player) => {
          if (player.id === playerScore.id) {
            return {
              ...player,
              score: playerScore.score,
            }
          }
          return player
        })
      )
    })

    socket.emit('join-room', raceId, name)

    return () => {
      socket.disconnect()
    }
  }, [name, raceId])

  window.onbeforeunload = () => {
    if (socket) {
      socket.emit('leave')
    }
  }

  function startGame() {
    if (socket) {
      socket.emit('start-game')
    }
  }

  function onPlayerType(text: string) {
    if (socket && status === 'playing') {
      socket.emit('player-typed', text)
    }
  }

  if (!socket) {
    return null
  }

  return (
    <RaceProvider
      value={{
        socket: socket,
        status,
        players,
        paragraph,
        hostId,
        startGame,
        onPlayerType,
        timeLeft,
      }}
    >
      {children}
    </RaceProvider>
  )
}
