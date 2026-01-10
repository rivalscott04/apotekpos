import { useState } from 'react';
import { Pause } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePOS } from '@/contexts/POSContext';

interface HoldModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HoldModal({ open, onOpenChange }: HoldModalProps) {
  const { holdTransaction, selectedMember } = usePOS();
  const [label, setLabel] = useState('');

  const handleHold = () => {
    const holdLabel = label.trim() || (selectedMember?.name ? `${selectedMember.name}` : `Hold ${new Date().toLocaleTimeString('id-ID')}`);
    holdTransaction(holdLabel);
    setLabel('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pause className="h-5 w-5 text-primary" />
            Hold Transaksi
          </DialogTitle>
          <DialogDescription>
            Simpan sementara transaksi ini untuk dilanjutkan nanti.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="hold-label">Label (opsional)</Label>
            <Input
              id="hold-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Contoh: Pak Joko - Meja 2"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Beri label untuk memudahkan pencarian saat recall
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleHold}>
            <Pause className="h-4 w-4 mr-2" />
            Hold
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
