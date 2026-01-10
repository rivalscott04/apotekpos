import { useState } from 'react';
import { Clock, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { usePOS } from '@/contexts/POSContext';

interface ShiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'open' | 'close';
}

export function ShiftModal({ open, onOpenChange, action }: ShiftModalProps) {
  const { shift, openShift, closeShift } = usePOS();
  const [openingCash, setOpeningCash] = useState('500000');
  const [actualCash, setActualCash] = useState('');
  const [notes, setNotes] = useState('');

  const expectedCash = shift?.openingCash || 0; // + sales - refunds in real implementation
  const actualValue = parseInt(actualCash.replace(/\D/g, '')) || 0;
  const difference = actualValue - expectedCash;

  const handleOpenShift = () => {
    const amount = parseInt(openingCash.replace(/\D/g, '')) || 0;
    openShift(amount);
    onOpenChange(false);
  };

  const handleCloseShift = () => {
    if (difference !== 0 && !notes.trim()) {
      return; // Notes required if difference
    }
    closeShift(actualValue, notes);
    onOpenChange(false);
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  if (action === 'open') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Buka Shift
            </DialogTitle>
            <DialogDescription>
              Masukkan modal awal untuk memulai shift kasir.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="opening-cash">Modal Awal (Rp)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  Rp
                </span>
                <Input
                  id="opening-cash"
                  value={formatCurrency(openingCash)}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  className="pl-10 text-lg font-mono"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleOpenShift}>
              Buka Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Tutup Shift
          </DialogTitle>
          <DialogDescription>
            Hitung kas dan selesaikan shift Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Expected vs Actual */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Kas Diharapkan</p>
              <p className="text-xl font-semibold font-mono">
                Rp {expectedCash.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actual-cash">Kas Aktual (Rp)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  Rp
                </span>
                <Input
                  id="actual-cash"
                  value={formatCurrency(actualCash)}
                  onChange={(e) => setActualCash(e.target.value)}
                  className="pl-10 font-mono"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Difference indicator */}
          {actualCash && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              difference === 0 
                ? 'bg-success/10 text-success' 
                : difference > 0 
                  ? 'bg-info/10 text-info'
                  : 'bg-destructive/10 text-destructive'
            }`}>
              {difference === 0 ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Kas Balance</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Selisih: {difference > 0 ? '+' : ''}Rp {difference.toLocaleString('id-ID')}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Notes - required if difference */}
          {difference !== 0 && (
            <div className="space-y-2">
              <Label htmlFor="notes">
                Catatan <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jelaskan penyebab selisih kas..."
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button 
            onClick={handleCloseShift}
            disabled={!actualCash || (difference !== 0 && !notes.trim())}
          >
            Tutup Shift
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
