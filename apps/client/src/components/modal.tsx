import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { X } from 'lucide-react'

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  width: number
  children: React.ReactNode
}

function Modal({ open, onOpenChange, title, children, width }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='pt-3 px-0 pb-0'
        style={{
          width: `${width}%`,
        }}
      >
        <div className='flex items-center justify-between px-5'>
          <div className='h-1 w-1' />
          <h2 className='text-lg uppercase font-semibold'>{title}</h2>
          <DialogClose>
            <X size={20} className='text-destructive' />
          </DialogClose>
        </div>

        {children}
      </DialogContent>
    </Dialog>
  )
}

export default Modal
