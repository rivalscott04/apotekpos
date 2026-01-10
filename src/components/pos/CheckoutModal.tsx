import { useState, useEffect } from 'react';
import { Banknote, QrCode, CreditCard, Smartphone, Coins, Printer, CheckCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePOS } from '@/contexts/POSContext';
import type { PaymentMethod, Payment } from '@/types';

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const paymentMethods: PaymentMethodOption[] = [
  { id: 'cash', label: 'Tunai', icon: Banknote },
  { id: 'qris', label: 'QRIS', icon: QrCode },
  { id: 'card', label: 'Kartu', icon: CreditCard },
  { id: 'transfer', label: 'Transfer', icon: Smartphone },
];

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { cart, grandTotal, selectedMember, clearCart } = usePOS();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [pointsToUse, setPointsToUse] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Calculate totals
  const pointsValue = parseInt(pointsToUse.replace(/\D/g, '')) || 0;
  const maxPoints = selectedMember 
    ? Math.min(selectedMember.pointsBalance, Math.floor(grandTotal * 0.3)) // Max 30%
    : 0;
  const validPointsValue = Math.min(pointsValue, maxPoints);
  const remainingTotal = grandTotal - validPointsValue;
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const stillOwed = Math.max(0, remainingTotal - paidAmount);
  
  const cashValue = parseInt(cashAmount.replace(/\D/g, '')) || 0;
  const change = cashValue > stillOwed ? cashValue - stillOwed : 0;

  // Points earned (1% of total)
  const pointsEarned = Math.floor(grandTotal * 0.01);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setPayments([]);
      setSelectedMethod('cash');
      setCashAmount('');
      setPointsToUse('');
      setIsComplete(false);
    }
  }, [open]);

  const handleAddPayment = () => {
    if (selectedMethod === 'cash' && cashValue > 0) {
      setPayments(prev => [...prev, { method: 'cash', amount: Math.min(cashValue, stillOwed), status: 'success' }]);
      setCashAmount('');
    } else if (selectedMethod !== 'cash') {
      // Simulate other payment
      setPayments(prev => [...prev, { method: selectedMethod, amount: stillOwed, status: 'success' }]);
    }
  };

  const handleAddPoints = () => {
    if (validPointsValue > 0) {
      setPayments(prev => [...prev, { method: 'points', amount: validPointsValue, status: 'success' }]);
      setPointsToUse('');
    }
  };

  const handleComplete = () => {
    if (stillOwed <= 0) {
      setIsComplete(true);
    }
  };

  const handleFinish = () => {
    clearCart();
    onOpenChange(false);
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const quickCashAmounts = [50000, 100000, 150000, 200000];

  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="py-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Pembayaran Berhasil</h2>
            <p className="text-muted-foreground mb-6">Transaksi telah selesai</p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
              {change > 0 && (
                <div className="flex justify-between text-success">
                  <span>Kembalian</span>
                  <span className="font-semibold">Rp {change.toLocaleString('id-ID')}</span>
                </div>
              )}
              {selectedMember && (
                <>
                  <Separator className="my-3" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Poin diperoleh</span>
                    <span className="text-primary font-medium">+{pointsEarned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saldo poin</span>
                    <span>{(selectedMember.pointsBalance - validPointsValue + pointsEarned).toLocaleString('id-ID')}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2" onClick={handleFinish}>
                <Printer className="h-4 w-4" />
                Cetak Struk
              </Button>
              <Button className="flex-1" onClick={handleFinish}>
                Selesai
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left: Payment methods */}
          <div className="space-y-4">
            {/* Member Points */}
            {selectedMember && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="font-medium">Gunakan Poin</span>
                  </div>
                  <Badge variant="secondary">
                    {selectedMember.pointsBalance.toLocaleString('id-ID')} poin
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={formatCurrency(pointsToUse)}
                      onChange={(e) => setPointsToUse(e.target.value)}
                      placeholder="0"
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      max {maxPoints.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleAddPoints}
                    disabled={validPointsValue <= 0}
                  >
                    Pakai
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Maksimal 30% dari total transaksi
                </p>
              </div>
            )}

            {/* Payment Method Selection */}
            <div>
              <Label className="mb-2 block">Metode Pembayaran</Label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map(method => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-3 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                        selectedMethod === method.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cash Input */}
            {selectedMethod === 'cash' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cash-amount">Jumlah Diterima</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      id="cash-amount"
                      value={formatCurrency(cashAmount)}
                      onChange={(e) => setCashAmount(e.target.value)}
                      className="pl-10 text-lg font-mono"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {quickCashAmounts.map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setCashAmount(amount.toString())}
                    >
                      {(amount / 1000).toLocaleString('id-ID')}K
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCashAmount(stillOwed.toString())}
                  >
                    Uang Pas
                  </Button>
                </div>
              </div>
            )}

            {/* QRIS Placeholder */}
            {selectedMethod === 'qris' && (
              <div className="p-6 rounded-lg bg-muted/50 text-center">
                <div className="w-32 h-32 mx-auto bg-foreground/10 rounded-lg flex items-center justify-center mb-3">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  QR Code akan ditampilkan di sini
                </p>
              </div>
            )}

            <Button onClick={handleAddPayment} className="w-full" disabled={stillOwed <= 0}>
              Tambah Pembayaran
            </Button>
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-3">Ringkasan</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cart.length} item)</span>
                  <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
                
                {validPointsValue > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Bayar dengan Poin</span>
                    <span>-Rp {validPointsValue.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>Rp {remainingTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Payments list */}
            {payments.length > 0 && (
              <div className="space-y-2">
                <Label>Pembayaran</Label>
                {payments.map((payment, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {payment.method === 'points' ? 'Poin' : payment.method}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        Rp {payment.amount.toLocaleString('id-ID')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setPayments(prev => prev.filter((_, i) => i !== idx))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Remaining / Change */}
            <div className={`p-4 rounded-lg ${stillOwed > 0 ? 'bg-warning/10' : 'bg-success/10'}`}>
              {stillOwed > 0 ? (
                <div className="flex justify-between">
                  <span className="font-medium text-warning">Kurang</span>
                  <span className="font-semibold text-warning">
                    Rp {stillOwed.toLocaleString('id-ID')}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="font-medium text-success">Kembalian</span>
                  <span className="font-semibold text-success">
                    Rp {change.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>

            <Button 
              size="lg" 
              className="w-full" 
              onClick={handleComplete}
              disabled={stillOwed > 0}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Selesaikan Transaksi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
