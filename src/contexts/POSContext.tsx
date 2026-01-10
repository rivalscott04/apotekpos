import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, Product, ProductBatch, HeldTransaction, Member, Shift } from '@/types';
import { currentShift as mockShift, heldTransactions as mockHeld } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface POSContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, batch: ProductBatch, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateDiscount: (itemId: string, discount: number) => void;
  clearCart: () => void;
  
  // Calculations
  subtotal: number;
  totalDiscount: number;
  tax: number;
  grandTotal: number;

  // Hold/Recall
  heldTransactions: HeldTransaction[];
  holdTransaction: (label: string) => void;
  recallTransaction: (id: string) => void;
  
  // Member
  selectedMember: Member | null;
  setSelectedMember: (member: Member | null) => void;
  
  // Shift
  shift: Shift | null;
  openShift: (openingCash: number) => void;
  closeShift: (actualCash: number, notes?: string) => void;
  isShiftOpen: boolean;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [heldTransactions, setHeldTransactions] = useState<HeldTransaction[]>(mockHeld);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [shift, setShift] = useState<Shift | null>(mockShift);

  // Add to cart with FEFO validation
  const addToCart = useCallback((product: Product, batch: ProductBatch, quantity = 1) => {
    // Check if batch is expired
    const expiryDate = new Date(batch.expiryDate);
    const today = new Date();
    
    if (expiryDate <= today) {
      toast({
        title: 'Tidak dapat ditambahkan',
        description: `Batch ${batch.batchNumber} sudah expired`,
        variant: 'destructive',
      });
      return;
    }

    // Check stock
    if (batch.quantity < quantity) {
      toast({
        title: 'Stok tidak cukup',
        description: `Stok tersedia: ${batch.quantity} ${product.unit}`,
        variant: 'destructive',
      });
      return;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.batch.id === batch.id
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        
        if (newQty > batch.quantity) {
          toast({
            title: 'Stok tidak cukup',
            description: `Maksimal: ${batch.quantity} ${product.unit}`,
            variant: 'destructive',
          });
          return prev;
        }

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: (newQty * product.price) - updated[existingIndex].discount,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}`,
        product,
        batch,
        quantity,
        unitPrice: product.price,
        discount: 0,
        subtotal: quantity * product.price,
      };
      return [...prev, newItem];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      if (quantity > item.batch.quantity) {
        toast({
          title: 'Stok tidak cukup',
          description: `Maksimal: ${item.batch.quantity} ${item.product.unit}`,
          variant: 'destructive',
        });
        return item;
      }

      return {
        ...item,
        quantity,
        subtotal: (quantity * item.unitPrice) - item.discount,
      };
    }));
  }, []);

  const updateDiscount = useCallback((itemId: string, discount: number) => {
    setCart(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      const maxDiscount = item.quantity * item.unitPrice;
      const validDiscount = Math.min(Math.max(0, discount), maxDiscount);

      return {
        ...item,
        discount: validDiscount,
        subtotal: (item.quantity * item.unitPrice) - validDiscount,
      };
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedMember(null);
  }, []);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0);
  const tax = 0; // PPN if applicable
  const grandTotal = subtotal - totalDiscount + tax;

  // Hold transaction
  const holdTransaction = useCallback((label: string) => {
    if (cart.length === 0) {
      toast({
        title: 'Keranjang kosong',
        description: 'Tidak ada item untuk di-hold',
        variant: 'destructive',
      });
      return;
    }

    const held: HeldTransaction = {
      id: `hold-${Date.now()}`,
      label,
      items: [...cart],
      createdAt: new Date().toISOString(),
      customerId: selectedMember?.id,
      customerName: selectedMember?.name,
    };

    setHeldTransactions(prev => [...prev, held]);
    setCart([]);
    setSelectedMember(null);
    
    toast({
      title: 'Transaksi di-hold',
      description: `Label: ${label}`,
    });
  }, [cart, selectedMember]);

  // Recall transaction
  const recallTransaction = useCallback((id: string) => {
    const held = heldTransactions.find(t => t.id === id);
    if (!held) return;

    if (cart.length > 0) {
      toast({
        title: 'Keranjang tidak kosong',
        description: 'Selesaikan atau hold transaksi saat ini terlebih dahulu',
        variant: 'destructive',
      });
      return;
    }

    setCart(held.items);
    setHeldTransactions(prev => prev.filter(t => t.id !== id));
    
    toast({
      title: 'Transaksi dipanggil',
      description: held.label,
    });
  }, [cart.length, heldTransactions]);

  // Shift management
  const openShift = useCallback((openingCash: number) => {
    const newShift: Shift = {
      id: `shf-${Date.now()}`,
      cashierId: 'usr-001',
      cashierName: 'Dewi Kusuma',
      branchId: 'br-001',
      openingCash,
      status: 'open',
      openedAt: new Date().toISOString(),
      transactions: [],
    };
    setShift(newShift);
    toast({
      title: 'Shift dibuka',
      description: `Modal awal: Rp ${openingCash.toLocaleString('id-ID')}`,
    });
  }, []);

  const closeShift = useCallback((actualCash: number, notes?: string) => {
    if (!shift) return;
    
    const expectedCash = shift.openingCash; // + sales - refunds
    const difference = actualCash - expectedCash;
    
    setShift({
      ...shift,
      status: 'closed',
      closingCash: actualCash,
      expectedCash,
      difference,
      notes,
      closedAt: new Date().toISOString(),
    });
    
    toast({
      title: 'Shift ditutup',
      description: difference === 0 ? 'Kas balance' : `Selisih: Rp ${Math.abs(difference).toLocaleString('id-ID')}`,
    });
  }, [shift]);

  const isShiftOpen = shift?.status === 'open';

  return (
    <POSContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateDiscount,
      clearCart,
      subtotal,
      totalDiscount,
      tax,
      grandTotal,
      heldTransactions,
      holdTransaction,
      recallTransaction,
      selectedMember,
      setSelectedMember,
      shift,
      openShift,
      closeShift,
      isShiftOpen,
    }}>
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}
