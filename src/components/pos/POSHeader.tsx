import { useState } from 'react';
import { Store, User, Clock, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { usePOS } from '@/contexts/POSContext';
import { ShiftModal } from './ShiftModal';

export function POSHeader() {
  const { user, logout } = useAuth();
  const { shift, isShiftOpen } = usePOS();
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [shiftAction, setShiftAction] = useState<'open' | 'close'>('open');

  const handleShiftClick = () => {
    setShiftAction(isShiftOpen ? 'close' : 'open');
    setShiftModalOpen(true);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <header className="h-14 bg-card border-b flex items-center justify-between px-4 shrink-0">
        {/* Left: Branch & Shift */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <span className="font-semibold">{user?.branchName}</span>
          </div>
          
          <div className="h-6 w-px bg-border" />
          
          <Button
            variant={isShiftOpen ? 'outline' : 'default'}
            size="sm"
            onClick={handleShiftClick}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            {isShiftOpen ? (
              <>
                <span>Shift Aktif</span>
                <Badge variant="secondary" className="ml-1 font-mono text-xs">
                  {shift?.openedAt ? formatTime(shift.openedAt) : ''}
                </Badge>
              </>
            ) : (
              <span>Buka Shift</span>
            )}
          </Button>
        </div>

        {/* Right: User menu */}
        <div className="flex items-center gap-3">
          <div className="text-right mr-2">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ShiftModal 
        open={shiftModalOpen} 
        onOpenChange={setShiftModalOpen}
        action={shiftAction}
      />
    </>
  );
}
