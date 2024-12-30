import { useState } from 'react';
import { User } from '../../types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface StatusTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onStatusChange: (status: string) => void;
  onTeamChange: (team: string) => void;
}

export default function StatusTeamDialog({ isOpen, onClose, currentUser, onStatusChange, onTeamChange }: StatusTeamDialogProps) {
  const [status, setStatus] = useState(currentUser.status || 'online');
  const [customStatus, setCustomStatus] = useState('');
  const [team, setTeam] = useState(currentUser.team || '');

  const handleSave = () => {
    onStatusChange(status === 'custom' ? customStatus : status);
    onTeamChange(team);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Set Status & Team</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Update your status and team settings here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <Label className="text-base font-medium">Status</Label>
            <RadioGroup value={status} onValueChange={setStatus} className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="font-normal">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Online
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="away" id="away" />
                <Label htmlFor="away" className="font-normal">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                    Away
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="do-not-disturb" id="do-not-disturb" />
                <Label htmlFor="do-not-disturb" className="font-normal">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                    Do Not Disturb
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-normal">Custom</Label>
              </div>
            </RadioGroup>
            {status === 'custom' && (
              <Input
                value={customStatus}
                onChange={(e) => setCustomStatus(e.target.value)}
                placeholder="Set a custom status..."
                className="mt-2 bg-gray-100 dark:bg-gray-700"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="team" className="text-base font-medium">Team</Label>
            <Input
              id="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="Enter your team name..."
              className="bg-gray-100 dark:bg-gray-700"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

