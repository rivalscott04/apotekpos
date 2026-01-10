import { useState } from "react";
import { Warehouse, ArrowRightLeft, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InventoryDashboard } from "@/components/admin/inventory/InventoryDashboard";
import { StockList } from "@/components/admin/inventory/StockList";
import { products } from "@/data/mockData";

export default function InventoryPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        <Warehouse className="h-6 w-6 text-primary" />
                        Inventori & Stok
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Pantau stok, batch, dan pergerakan barang antar cabang.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Stock Opname
                    </Button>
                    <Button>
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Transfer Stok
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="stock">Data Stok</TabsTrigger>
                    <TabsTrigger value="mutations">Mutasi & Riwayat</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <InventoryDashboard />
                    <div className="rounded-lg border p-4">
                        <h3 className="font-semibold mb-4">Stok Perlu Perhatian</h3>
                        <StockList products={products.filter(p => p.batches.reduce((sum, b) => sum + b.quantity, 0) < 50)} />
                    </div>
                </TabsContent>

                <TabsContent value="stock">
                    <Card className="p-4">
                        <StockList products={products} />
                    </Card>
                </TabsContent>

                <TabsContent value="mutations">
                    <div className="flex items-center justify-center h-48 border rounded-lg bg-muted/10 text-muted-foreground">
                        Riwayat mutasi akan tampil di sini
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Temporary internal component import to avoid circular dependency issues if file isn't created yet
// In real implementation this is separate
import { Card } from "@/components/ui/card";
