import FormModal from '@/components/form-modal'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/')({
  component: Page,
})

function Page() {
  const [formModal, setFormModal] = useState<'create' | 'join' | null>(null)

  return (
    <div className='w-full min-h-dvh flex flex-col items-center py-20 bg-[#0a0911] text-white'>
      <div className='w-3/4 h-full space-y-10 flex flex-col items-center'>
        <h1 className='text-[5rem] font-mono font-bold text-center tracking-wider'>
          KeyRace
        </h1>

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
            onClick={() => setFormModal('join')}
          >
            Join a Race
          </Button>

          <Button
            size={'lg'}
            variant={'secondary'}
            onClick={() => setFormModal('create')}
          >
            Create a Race
          </Button>
        </div>

        {formModal && (
          <FormModal
            variant={formModal}
            open
            onOpenChange={(open) => {
              if (!open) {
                setFormModal(null)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Page
