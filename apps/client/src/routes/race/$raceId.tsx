import { createFileRoute } from '@tanstack/react-router'

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
  return (
    <div>
      Page {raceId} {name}
    </div>
  )
}

export default Page
