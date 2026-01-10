import { useState } from "react";
import { ChevronDown, ChevronRight, Search, Filter } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";

interface StockListProps {
    products: Product[];
}

export function StockList({ products }: StockListProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState("");

    const toggleRow = (productId: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(productId)) {
            newExpanded.delete(productId);
        } else {
            newExpanded.add(productId);
        }
        setExpandedRows(newExpanded);
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    const getTotalStock = (product: Product) =>
        product.batches.reduce((sum, b) => sum + b.quantity, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Nama Produk</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Total Stok</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => {
                            const totalStock = getTotalStock(product);
                            const isExpanded = expandedRows.has(product.id);

                            return (
                                <>
                                    <TableRow
                                        key={product.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => toggleRow(product.id)}
                                    >
                                        <TableCell>
                                            {isExpanded ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.categoryName}</TableCell>
                                        <TableCell>{totalStock} {product.unit}</TableCell>
                                        <TableCell>
                                            {totalStock === 0 ? (
                                                <Badge variant="destructive">Habis</Badge>
                                            ) : totalStock < 20 ? (
                                                <Badge variant="secondary" className="bg-orange-100 text-orange-700">Menipis</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">Aman</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    {isExpanded && (
                                        <TableRow className="bg-muted/50">
                                            <TableCell colSpan={6} className="p-4">
                                                <div className="rounded-md border bg-background">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>No. Batch</TableHead>
                                                                <TableHead>Expired Date</TableHead>
                                                                <TableHead>Stok</TableHead>
                                                                <TableHead>Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {product.batches.length === 0 ? (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                                        Tidak ada data batch.
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                product.batches.map((batch) => (
                                                                    <TableRow key={batch.id}>
                                                                        <TableCell className="font-mono">{batch.batchNumber}</TableCell>
                                                                        <TableCell>
                                                                            {new Date(batch.expiryDate).toLocaleDateString("id-ID", {
                                                                                day: "numeric",
                                                                                month: "long",
                                                                                year: "numeric",
                                                                            })}
                                                                        </TableCell>
                                                                        <TableCell>{batch.quantity}</TableCell>
                                                                        <TableCell>
                                                                            <Badge variant="outline">Active</Badge>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
