import useRaceContext from '@/context/use-race-context'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from './ui/button'

interface RaceBoardProps {
  copyRaceId: () => void
}

function RaceBoard({ copyRaceId }: RaceBoardProps) {
  const {
    paragraph,
    status,
    startGame,
    hostId,
    socket,
    onPlayerType,
    timeLeft,
  } = useRaceContext()
  const [input, setInput] = useState('')

  function renderParagraph() {
    const splitParagraph: string[] = paragraph.split('')
    const splitInput: string[] = input.split('')

    const nextLetter = splitInput.length

    return splitParagraph.map((char, index) => {
      const letterTyped = splitInput[index] ? true : false

      return (
        <span
          key={`${char}-${index}`}
          className={cn(
            'text-lg font-mono',
            letterTyped
              ? splitInput[index] === char
                ? 'text-white'
                : 'text-red-500'
              : nextLetter === index
                ? 'text-yellow-500'
                : 'text-gray-500'
          )}
        >
          {char}
        </span>
      )
    })
  }

  const isHost = hostId === socket.id
  return (
    <div className='w-full rounded-md h-full'>
      {status === 'waiting' ? (
        <div className='flex flex-col items-center justify-center h-full'>
          {isHost ? (
            <div>
              <div className='space-y-5 flex flex-col'>
                <p className='text-xl'>Invite your friends to join</p>

                <Button onClick={copyRaceId} variant={'secondary'} size={'lg'}>
                  Copy Invite Code
                </Button>

                <Button onClick={startGame} variant={'secondary'} size={'lg'}>
                  Start Game
                </Button>
              </div>
            </div>
          ) : (
            <div className='space-y-5 flex flex-col text-center'>
              <p className='text-xl'>Waiting for host to start the game....</p>

              <p className='text-xl'>
                Invite your friends to join using the invite code below
              </p>

              <Button onClick={copyRaceId} variant={'secondary'} size={'lg'}>
                Copy Invite Code
              </Button>
            </div>
          )}
        </div>
      ) : status === 'playing' ? (
        <div className='space-y-5'>
          {status === 'playing' && (
            <div>
              <p className='text-xl'>Time Left: {timeLeft}</p>
            </div>
          )}
          <div className='w-full h-full border rounded-md'>
            <div className='p-5 h-full relative'>
              <p>{renderParagraph()}</p>

              <input
                type='text'
                onChange={(e) => {
                  setInput(e.target.value)

                  // if player typed space, which means a word is completed then send the word to server
                  if (e.target.value.endsWith(' ')) {
                    onPlayerType(e.target.value)
                  }
                }}
                spellCheck={false}
                className='h-full w-full bg-transparent border-none absolute top-0 left-0 z-10 focus:outline-none text-transparent select-none opacity-0'
              />
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-full'>
          {isHost ? (
            <div>
              <div className='space-y-5 flex flex-col'>
                <p className='text-xl'>Invite your friends to join</p>

                <Button onClick={copyRaceId} variant={'secondary'} size={'lg'}>
                  Copy Invite Code
                </Button>

                <Button
                  onClick={() => {
                    startGame()
                    setInput('')
                  }}
                  variant={'secondary'}
                  size={'lg'}
                >
                  Restart Game
                </Button>
              </div>
            </div>
          ) : (
            <div className='space-y-5 flex flex-col text-center'>
              <p className='text-xl'>Waiting for host to start the game....</p>

              <p className='text-xl'>
                Invite your friends to join using the invite code below
              </p>

              <Button onClick={copyRaceId} variant={'secondary'} size={'lg'}>
                Copy Invite Code
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RaceBoard
