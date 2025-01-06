import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react'

interface AddChannelDialogProps {
  onAddChannel: (channelName: string) => void
}

export function AddChannelDialog({ onAddChannel }: AddChannelDialogProps) {
  const [newChannelName, setNewChannelName] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newChannelName.trim()) {
      onAddChannel(newChannelName.trim())
      setNewChannelName('')
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create a new channel</DialogTitle>
          <DialogDescription>
            Channels are where your team communicates. They're best when organized around a topic — #marketing, for example.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="col-span-3"
                placeholder="e.g. marketing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!newChannelName.trim()}>Create Channel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

