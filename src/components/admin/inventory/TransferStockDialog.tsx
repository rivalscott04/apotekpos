import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { branches, products } from "@/data/mockData"; // Assuming we can reuse mockData
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

export function TransferStockDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Transfer Stok Antar Cabang</DialogTitle>
                    <DialogDescription>
                        Pindahkan stok ke cabang lain. Membutuhkan approval penerima.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Dari Cabang (Asal)</Label>
                            <Select disabled defaultValue="br-001">
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih cabang asal" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map(b => (
                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Ke Cabang (Tujuan)</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih cabang tujuan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.filter(b => b.id !== 'br-001').map(b => (
                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Item Transfer</h4>
                            <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Tambah Item</Button>
                        </div>

                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Batch</TableHead>
                                        <TableHead className="w-[100px]">Qty</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Select defaultValue="prd-001">
                                                <SelectTrigger className="w-[200px] border-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map(p => (
                                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select defaultValue="bat-001">
                                                <SelectTrigger className="w-[140px] border-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="bat-001">PCM-2024-001</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input type="number" defaultValue={10} className="h-8" />
                                        </TableCell>
                                        <TableCell>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Catatan Transfer</Label>
                        <Input placeholder="Alasan transfer / No. Referensi..." />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                    <Button onClick={() => onOpenChange(false)} className="bg-emerald-600 hover:bg-emerald-700">Kirim Transfer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
