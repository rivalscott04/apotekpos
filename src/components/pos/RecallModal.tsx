import { useState } from 'react';
import { RotateCcw, Search, Clock, ShoppingCart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePOS } from '@/contexts/POSContext';

interface RecallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecallModal({ open, onOpenChange }: RecallModalProps) {
  const { heldTransactions, recallTransaction } = usePOS();
  const [search, setSearch] = useState('');

  const filteredHolds = heldTransactions.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleRecall = (id: string) => {
    recallTransaction(id);
    onOpenChange(false);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            Recall Transaksi
          </DialogTitle>
          <DialogDescription>
            Panggil kembali transaksi yang di-hold.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari transaksi..."
              className="pl-9"
            />
          </div>

          {/* Held list */}
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {filteredHolds.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>Tidak ada transaksi yang di-hold</p>
                </div>
              ) : (
                filteredHolds.map(held => (
                  <button
                    key={held.id}
                    onClick={() => handleRecall(held.id)}
                    className="w-full p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{held.label}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(held.createdAt)}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {held.items.length}
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
