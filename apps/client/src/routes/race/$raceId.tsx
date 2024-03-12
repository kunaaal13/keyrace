import LeaderBoard from '@/components/leaderboard'
import RaceBoard from '@/components/race-board'
import RaceContextProvider from '@/context/race'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

type SearchParams = {
  name: string
}

export const Route = createFileRoute('/race/$raceId')({
  component: Page,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    // validate and parse the search params into a typed state
    return {
      name: (search.name as string) || 'Anonymous',
    }
  },
})

function Page() {
  const { raceId } = Route.useParams()
  const { name } = Route.useSearch()

  function copyRaceId() {
    navigator.clipboard.writeText(raceId)
    toast('Copied to clipboard')
  }

  return (
    <RaceContextProvider name={name} raceId={raceId}>
      <div className='w-full h-dvh flex bg-[#0a0911] text-white justify-between p-10'>
        <div className='w-[30%] h-full overflow-y-scroll'>
          <LeaderBoard />
        </div>

        <div className='w-[65%] h-full overflow-y-scroll'>
          <RaceBoard copyRaceId={copyRaceId} />
        </div>
      </div>
    </RaceContextProvider>
  )
}

export default Page
