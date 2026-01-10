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
import { Textarea } from "@/components/ui/textarea";

export function StockOpnameDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [step, setStep] = useState(1);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Stock Opname Baru</DialogTitle>
                    <DialogDescription>
                        Mulai sesi stok opname baru untuk mencocokkan stok fisik dan sistem.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="type">Tipe Opname</Label>
                        <Select defaultValue="partial">
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="partial">Parsial (Per Kategori/Rak)</SelectItem>
                                <SelectItem value="full">Full (Seluruh Toko)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Kategori / Rak Target</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih target" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="obat_bebas">Obat Bebas</SelectItem>
                                <SelectItem value="obat_keras">Obat Keras</SelectItem>
                                <SelectItem value="rak_a">Rak A (Depan)</SelectItem>
                                <SelectItem value="rak_b">Rak B (Belakang)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Catatan Sesi</Label>
                        <Textarea placeholder="Contoh: Opname rutin bulanan Rak A..." />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                    <Button onClick={() => onOpenChange(false)}>Mulai Sesi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
