import { MoreHorizontal, Trash2, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChannelActionsProps {
  isOwner: boolean
  onDelete: () => void
  onLeave: () => void
}

export function ChannelActions({ isOwner, onDelete, onLeave }: ChannelActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {isOwner ? (
          <DropdownMenuItem
            onClick={onDelete}
            className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Channel</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={onLeave}
            className="text-yellow-600 focus:text-yellow-600 focus:bg-yellow-100 dark:focus:bg-yellow-900"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Leave Channel</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

