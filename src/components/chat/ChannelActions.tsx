import { MoreHorizontal, Trash2, LogOut, Hash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChannelActionsProps {
  isOwner: boolean;
  onDelete: () => void;
  onLeave: () => void;
}

export function ChannelActions({ isOwner, onDelete, onLeave }: ChannelActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700">
          <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="sr-only">Channel actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center px-2 py-2">
          <Hash className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-sm">Actions</span>
        </div>
        <DropdownMenuSeparator />
        {isOwner ? (
          <DropdownMenuItem
            onClick={onDelete}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Channel</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={onLeave}
            className="text-yellow-600 focus:text-yellow-600 focus:bg-yellow-50 dark:focus:bg-yellow-950 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Leave Channel</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

