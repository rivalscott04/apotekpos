import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Barcode, Grid3X3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { products, categories } from '@/data/mockData';
import { usePOS } from '@/contexts/POSContext';
import type { Product, Category } from '@/types';

export function ProductSearch() {
  const { addToCart, isShiftOpen } = usePOS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on mount and F2 shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    inputRef.current?.focus();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleProductClick = (product: Product) => {
    if (!isShiftOpen) return;
    
    // Get FEFO batch (earliest expiry with stock)
    const fefoBatch = product.batches
      .filter(b => b.quantity > 0 && new Date(b.expiryDate) > new Date())
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0];

    if (fefoBatch) {
      addToCart(product, fefoBatch);
    }
  };

  const formatExpiry = (date: string) => {
    const expiry = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 90) {
      return { text: `Exp: ${diffDays}d`, isWarning: true };
    }
    return { text: expiry.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }), isWarning: false };
  };

  const getTotalStock = (product: Product) => {
    return product.batches.reduce((sum, b) => sum + b.quantity, 0);
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Search Input */}
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk atau scan barcode..."
            className="pl-9 pr-16"
            disabled={!isShiftOpen}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="kbd">F2</kbd>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="shrink-0"
          >
            <Grid3X3 className="h-3.5 w-3.5 mr-1" />
            Semua
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="shrink-0"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredProducts.map(product => {
            const stock = getTotalStock(product);
            const fefoBatch = product.batches
              .filter(b => b.quantity > 0)
              .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0];
            
            const expiryInfo = fefoBatch ? formatExpiry(fefoBatch.expiryDate) : null;

            return (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                disabled={!isShiftOpen || stock === 0}
                className="w-full p-3 rounded-lg text-left transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        {product.sku}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {product.categoryName}
                      </Badge>
                      {product.requiresPrescription && (
                        <Badge variant="destructive" className="text-xs">
                          Resep
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Stok: {stock} {product.unit}
                    </p>
                  </div>
                </div>
                
                {/* FEFO Badge */}
                {fefoBatch && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${expiryInfo?.isWarning ? 'bg-warning/10 text-warning border-warning/20' : ''}`}
                    >
                      FEFO: {fefoBatch.batchNumber}
                    </Badge>
                    {expiryInfo && (
                      <span className={`text-xs ${expiryInfo.isWarning ? 'text-warning font-medium' : 'text-muted-foreground'}`}>
                        {expiryInfo.text}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <p>Produk tidak ditemukan</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
