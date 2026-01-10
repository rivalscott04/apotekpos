import { useState, useEffect } from 'react';
import { CreditCard, Pause, RotateCcw, ArrowLeftRight, XCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/contexts/POSContext';
import { CheckoutModal } from './CheckoutModal';
import { HoldModal } from './HoldModal';
import { RecallModal } from './RecallModal';
import { MemberModal } from './MemberModal';

export function POSActions() {
  const { cart, grandTotal, isShiftOpen, selectedMember, heldTransactions } = usePOS();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [recallOpen, setRecallOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isShiftOpen) return;
      
      if (e.key === 'F4' && cart.length > 0) {
        e.preventDefault();
        setCheckoutOpen(true);
      } else if (e.key === 'F6' && cart.length > 0) {
        e.preventDefault();
        setHoldOpen(true);
      } else if (e.key === 'F7') {
        e.preventDefault();
        setRecallOpen(true);
      } else if (e.key === 'Escape') {
        setCheckoutOpen(false);
        setHoldOpen(false);
        setRecallOpen(false);
        setMemberOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart.length, isShiftOpen]);

  return (
    <>
      <div className="h-full bg-card border-l flex flex-col">
        {/* Member Section */}
        <div className="p-4 border-b">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => setMemberOpen(true)}
            disabled={!isShiftOpen}
          >
            <Users className="h-4 w-4" />
            {selectedMember ? (
              <div className="flex-1 text-left">
                <p className="font-medium">{selectedMember.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedMember.pointsBalance.toLocaleString('id-ID')} poin
                </p>
              </div>
            ) : (
              <span>Pilih Member</span>
            )}
          </Button>
        </div>

        {/* Summary */}
        <div className="p-4 flex-1">
          <div className="space-y-3">
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-1">Total Pembayaran</p>
              <p className="text-4xl font-bold">
                Rp {grandTotal.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>{cart.length}</span>
              </div>
              {selectedMember && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Poin tersedia</span>
                  <span className="text-primary font-medium">
                    {selectedMember.pointsBalance.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t space-y-2">
          {/* Main Action */}
          <Button
            size="lg"
            className="w-full h-14 text-lg gap-2"
            onClick={() => setCheckoutOpen(true)}
            disabled={!isShiftOpen || cart.length === 0}
          >
            <CreditCard className="h-5 w-5" />
            Bayar
            <kbd className="kbd ml-auto bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground">F4</kbd>
          </Button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-12 gap-2"
              onClick={() => setHoldOpen(true)}
              disabled={!isShiftOpen || cart.length === 0}
            >
              <Pause className="h-4 w-4" />
              Hold
              <kbd className="kbd text-xs">F6</kbd>
            </Button>
            <Button
              variant="outline"
              className="h-12 gap-2 relative"
              onClick={() => setRecallOpen(true)}
              disabled={!isShiftOpen}
            >
              <RotateCcw className="h-4 w-4" />
              Recall
              <kbd className="kbd text-xs">F7</kbd>
              {heldTransactions.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {heldTransactions.length}
                </span>
              )}
            </Button>
          </div>

          {/* Danger Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              className="h-10 gap-2 border-warning/50 text-warning hover:bg-warning/10"
              disabled={!isShiftOpen}
            >
              <ArrowLeftRight className="h-4 w-4" />
              Refund
            </Button>
            <Button
              variant="outline"
              className="h-10 gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
              disabled={!isShiftOpen}
            >
              <XCircle className="h-4 w-4" />
              Void
            </Button>
          </div>
        </div>
      </div>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
      <HoldModal open={holdOpen} onOpenChange={setHoldOpen} />
      <RecallModal open={recallOpen} onOpenChange={setRecallOpen} />
      <MemberModal open={memberOpen} onOpenChange={setMemberOpen} />
    </>
  );
}
