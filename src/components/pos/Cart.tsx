import { Minus, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePOS } from '@/contexts/POSContext';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalDiscount, grandTotal, isShiftOpen } = usePOS();

  const formatExpiry = (date: string) => {
    const expiry = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { days: diffDays, isWarning: diffDays <= 90 };
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Keranjang</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p>Keranjang kosong</p>
            <p className="text-sm mt-1">Scan atau cari produk untuk menambahkan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">Keranjang</h2>
        <Badge variant="secondary">{cart.length} item</Badge>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {cart.map(item => {
            const expiryInfo = formatExpiry(item.batch.expiryDate);
            
            return (
              <div 
                key={item.id}
                className="p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${expiryInfo.isWarning ? 'border-warning/50 text-warning' : ''}`}
                      >
                        {item.batch.batchNumber}
                      </Badge>
                      <span className={`text-xs ${expiryInfo.isWarning ? 'text-warning' : 'text-muted-foreground'}`}>
                        {expiryInfo.isWarning && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                        Exp: {new Date(item.batch.expiryDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                    disabled={!isShiftOpen}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={!isShiftOpen || item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={!isShiftOpen || item.quantity >= item.batch.quantity}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      @ Rp {item.unitPrice.toLocaleString('id-ID')}
                    </p>
                    <p className="font-semibold">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Line Discount - if any */}
                {item.discount > 0 && (
                  <div className="mt-2 pt-2 border-t border-dashed text-sm text-success flex justify-between">
                    <span>Diskon item</span>
                    <span>-Rp {item.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Summary */}
      <div className="p-4 border-t bg-muted/30 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-sm text-success">
            <span>Diskon</span>
            <span>-Rp {totalDiscount.toLocaleString('id-ID')}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span>Total</span>
          <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
        </div>
      </div>
    </div>
  );
}
