import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ReceiveGoodsDialog({ open, onOpenChange, poId }: { open: boolean; onOpenChange: (open: boolean) => void, poId: string | null }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Penerimaan Barang (GRN)</DialogTitle>
                    <p className="text-sm text-muted-foreground">Referensi PO: {poId || '-'}</p>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>No. Surat Jalan / Faktur Supplier</Label>
                            <Input placeholder="Masukkan nomor dokumen fisik" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Tanggal Terima</Label>
                            <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-medium">Cek Fisik & Batch</h4>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead className="w-[80px]">Qty PO</TableHead>
                                        <TableHead className="w-[80px]">Qty Terima</TableHead>
                                        <TableHead className="w-[150px]">No. Batch</TableHead>
                                        <TableHead className="w-[140px]">Expired Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Paracetamol 500mg (Strip)</TableCell>
                                        <TableCell>50</TableCell>
                                        <TableCell>
                                            <Input type="number" defaultValue={50} className="h-8" />
                                        </TableCell>
                                        <TableCell>
                                            <Input className="h-8" placeholder="Batch No" />
                                        </TableCell>
                                        <TableCell>
                                            <Input type="date" className="h-8" />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Amoxicillin 500mg (Strip)</TableCell>
                                        <TableCell>20</TableCell>
                                        <TableCell>
                                            <Input type="number" defaultValue={20} className="h-8" />
                                        </TableCell>
                                        <TableCell>
                                            <Input className="h-8" placeholder="Batch No" />
                                        </TableCell>
                                        <TableCell>
                                            <Input type="date" className="h-8" />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                    <Button onClick={() => onOpenChange(false)} className="bg-emerald-600 hover:bg-emerald-700">Simpan Penerimaan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
