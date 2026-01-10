import { useState } from "react";
import { Warehouse, ArrowRightLeft, ClipboardList, Package, AlertCircle, AlertTriangle, RefreshCw, Search, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { StockList } from "@/components/admin/inventory/StockList";
import { StockOpnameDialog } from "@/components/admin/inventory/StockOpnameDialog";
import { TransferStockDialog } from "@/components/admin/inventory/TransferStockDialog";
import { products } from "@/data/mockData";

export default function InventoryPage() {
    const [isOpnameOpen, setIsOpnameOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        <Warehouse className="h-6 w-6 text-emerald-600" />
                        Inventori & Stok
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Pantau stok, batch, dan pergerakan barang antar cabang.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsOpnameOpen(true)}>
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Stock Opname
                    </Button>
                    <Button
                        onClick={() => setIsTransferOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Transfer Stok
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="stock">Data Stok</TabsTrigger>
                    <TabsTrigger value="mutations">Mutasi & Riwayat</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Package className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{products.length}</div>
                                <p className="text-xs text-muted-foreground">SKU Aktif</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
                                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                                    <AlertCircle className="h-4 w-4 text-orange-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">Perlu Reorder</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Near Expired</CardTitle>
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">8</div>
                                <p className="text-xs text-muted-foreground">&lt; 3 Bulan</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Transfer</CardTitle>
                                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    <RefreshCw className="h-4 w-4 text-purple-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">5</div>
                                <p className="text-xs text-muted-foreground">Menunggu Terima</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Attention List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Stok Perlu Perhatian</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari produk..."
                                    className="pl-9"
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Nama Produk</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Total Stok</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.slice(0, 3).map(product => {
                                        const totalStock = product.batches.reduce((a, b) => a + b.quantity, 0);
                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.sku}</TableCell>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>{product.categoryName}</TableCell>
                                                <TableCell>{totalStock} {product.unit}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                                        Stok Menipis (Sisa {totalStock})
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
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

            {/* Dialogs */}
            <StockOpnameDialog open={isOpnameOpen} onOpenChange={setIsOpnameOpen} />
            <TransferStockDialog open={isTransferOpen} onOpenChange={setIsTransferOpen} />
        </div>
    );
}


