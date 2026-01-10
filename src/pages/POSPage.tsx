import { POSProvider } from '@/contexts/POSContext';
import { POSHeader } from '@/components/pos/POSHeader';
import { ProductSearch } from '@/components/pos/ProductSearch';
import { Cart } from '@/components/pos/Cart';
import { POSActions } from '@/components/pos/POSActions';

export default function POSPage() {
  return (
    <POSProvider>
      <div className="h-screen flex flex-col bg-background">
        <POSHeader />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Product Search */}
          <div className="w-[400px] shrink-0">
            <ProductSearch />
          </div>
          
          {/* Center: Cart */}
          <div className="flex-1 min-w-[350px]">
            <Cart />
          </div>
          
          {/* Right: Actions */}
          <div className="w-[320px] shrink-0">
            <POSActions />
          </div>
        </div>
      </div>
    </POSProvider>
  );
}
