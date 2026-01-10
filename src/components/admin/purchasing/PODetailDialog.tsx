import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

export function PODetailDialog({ open, onOpenChange, po }: { open: boolean; onOpenChange: (open: boolean) => void, po: any }) {
    if (!po) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Detail PO: {po.id}
                        <Badge variant="outline">{po.status}</Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 text-sm">
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Supplier</p>
                            <p className="font-medium">{po.supplier}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Tanggal Order</p>
                            <p className="font-medium">{po.date}</p>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h4 className="text-sm font-medium mb-3">Item Dipesan</h4>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Harga Satuan</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Paracetamol 500mg</TableCell>
                                        <TableCell className="text-right">50</TableCell>
                                        <TableCell className="text-right">Rp 8.500</TableCell>
                                        <TableCell className="text-right">Rp 425.000</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Vitamin C 1000mg</TableCell>
                                        <TableCell className="text-right">10</TableCell>
                                        <TableCell className="text-right">Rp 45.000</TableCell>
                                        <TableCell className="text-right">Rp 450.000</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Nominal</p>
                            <p className="text-xl font-bold">Rp {po.total.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
