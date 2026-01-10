import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { products } from "@/data/mockData";

export function CreatePODialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [items, setItems] = useState([{ productId: "", qty: 1, price: 0 }]);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const addItem = () => {
        setItems([...items, { productId: "", qty: 1, price: 0 }]);
    };

    const confirmDelete = (index: number) => {
        setItemToDelete(index);
    };

    const handleDelete = () => {
        if (itemToDelete !== null) {
            const newItems = [...items];
            newItems.splice(itemToDelete, 1);
            setItems(newItems);
            setItemToDelete(null);
        }
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;
        setItems(newItems);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const calculateSubtotal = (qty: number, price: number) => {
        return qty * price;
    };

    const totalPO = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[900px]">
                    <DialogHeader>
                        <DialogTitle>Buat Purchase Order Baru</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Supplier</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Supplier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sup-001">PT. Sehat Farma</SelectItem>
                                        <SelectItem value="sup-002">PT. Kimia Global</SelectItem>
                                        <SelectItem value="sup-003">PT. Distributor Obat</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Rencana Tanggal Kirim</Label>
                                <Input type="date" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Daftar Barang</h4>
                                <Button size="sm" variant="outline" onClick={addItem}><Plus className="w-4 h-4 mr-2" /> Tambah Item</Button>
                            </div>

                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[200px]">Produk</TableHead>
                                            <TableHead className="w-[120px]">Qty</TableHead>
                                            <TableHead className="w-[180px]">Estimasi Harga</TableHead>
                                            <TableHead className="w-[180px]">Subtotal</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Select
                                                        value={item.productId}
                                                        onValueChange={(v) => updateItem(index, "productId", v)}
                                                    >
                                                        <SelectTrigger className="border-0 w-full">
                                                            <SelectValue placeholder="Pilih Produk" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {products.map(p => (
                                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={item.qty}
                                                        onChange={(e) => updateItem(index, "qty", parseInt(e.target.value) || 0)}
                                                        className="h-8 w-full"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            value={item.price === 0 ? "" : item.price}
                                                            onChange={(e) => updateItem(index, "price", parseInt(e.target.value) || 0)}
                                                            className="h-8 pl-9 w-full"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-medium">
                                                        {formatCurrency(calculateSubtotal(item.qty, item.price))}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => confirmDelete(index)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex justify-end">
                                <div className="flex items-center gap-4 border p-4 rounded-lg bg-slate-50">
                                    <span className="font-semibold text-muted-foreground">Total Estimasi:</span>
                                    <span className="text-xl font-bold text-emerald-600">{formatCurrency(totalPO)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Catatan</Label>
                            <Input placeholder="Catatan untuk supplier..." />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button onClick={() => onOpenChange(false)} className="bg-emerald-600 hover:bg-emerald-700">Simpan PO</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Item?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus item ini dari daftar Purchase Order?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
