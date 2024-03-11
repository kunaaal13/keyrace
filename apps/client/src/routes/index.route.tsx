import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import { v4 as uuidv4 } from 'uuid'

export const Route = createFileRoute('/')({
  component: Page,
})

function Page() {
  function createRace() {
    const inviteCode = uuidv4()

    console.log('inviteCode:', inviteCode)
  }

  return (
    <div className='w-full min-h-dvh flex flex-col items-center py-20 bg-[#0a0911] text-white'>
      <div className='w-3/4 h-full space-y-10 flex flex-col items-center'>
        <h1 className='text-[5rem] font-mono font-bold text-center'>KeyRace</h1>

        <div className='flex items-center justify-center w-4/5'>
          <p className='text-lg text-center'>
            Experience the thrill of typing battles like never before with Key
            Race! Gather your friends and compete in real-time challenges to see
            who reigns supreme in speed and accuracy. Type faster, race
            together, and discover the ultimate typing showdown at Key Race –
            where friends compete!
          </p>
        </div>

        <img
          src='/keyrace2.webp'
          alt='KeyRace'
          className='rounded-lg w-full h-auto'
        />

        <div className='flex items-center justify-center space-x-10'>
          <Button
            className='bg-white text-black'
            variant={'secondary'}
            size={'lg'}
          >
            Join a Race
          </Button>

          <Button size={'lg'} variant={'secondary'} onClick={createRace}>
            Create a Race
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page
