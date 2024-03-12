import { useNavigate } from '@tanstack/react-router'
import { v4 as uuidv4 } from 'uuid'
import Modal from './modal'
import { Button } from './ui/button'
import { useState } from 'react'
import { Input } from './ui/input'
import { toast } from 'sonner'

interface FormModalProps {
  variant: 'create' | 'join'
  open: boolean
  onOpenChange: (open: boolean) => void
}

function FormModal({ variant, open, onOpenChange }: FormModalProps) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  function createRace() {
    const inviteCode = uuidv4()

    if (!name) {
      toast.error('Name is required')
      return
    }

    // Push the new route to the router
    navigate({
      to: '/race/$raceId',
      params: {
        raceId: inviteCode,
      },
      search: {
        name,
      },
    })
  }

  function joinRace() {
    if (!inviteCode) {
      toast.error('Invite code is required')
      return
    }

    if (!name) {
      toast.error('Name is required')
      return
    }

    navigate({
      to: '/race/$raceId',
      params: {
        raceId: inviteCode,
      },
      search: {
        name,
      },
    })
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`${variant === 'create' ? 'Create' : 'Join'} a Race`}
      width={50}
    >
      <div className='p-5'>
        <div className='space-y-2 mb-4'>
          <h3>Name</h3>

          <Input
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className=''
          />
        </div>

        {variant === 'join' && (
          <div className='space-y-2 mb-4'>
            <h3>Invite Code</h3>

            <Input
              placeholder='Invite Code'
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className=''
            />
          </div>
        )}

        <Button
          className='w-full rounded-md bg-black text-white'
          onClick={() => {
            if (variant === 'create') {
              createRace()
            } else {
              joinRace()
            }
          }}
        >
          {variant === 'create' ? 'Create' : 'Join'}
        </Button>
      </div>
    </Modal>
  )
}

export default FormModal
