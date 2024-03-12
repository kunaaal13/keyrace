import useRaceContext from '@/context/use-race-context'

function LeaderBoard() {
  const { players } = useRaceContext()

  function sortPlayers() {
    // Sort players by score in descending order if the score is the same, sort by alphabet of the name
    return players.sort((a, b) => {
      if (a.score === b.score) {
        return a.name.localeCompare(b.name)
      }

      return b.score - a.score
    })
  }

  return (
    <div className='space-y-5 w-full'>
      <h1 className='text-3xl font-mono font-semibold'>Leaderboard</h1>
      <ul className='space-y-4'>
        {sortPlayers().map((player, index) => (
          <li
            key={player.id}
            className='flex justify-between p-4 border rounded-lg text-lg'
          >
            <span className=''>
              # {index + 1} <span className='ml-3'>{player.name}</span>
            </span>
            <span className='font-semibold'>{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LeaderBoard
