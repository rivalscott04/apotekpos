import { useState } from "react";
import { FileText, Truck, RotateCcw, Plus, Search, Filter, Eye, MoreHorizontal, CheckCircle } from "lucide-react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreatePODialog } from "@/components/admin/purchasing/CreatePODialog";
import { ReceiveGoodsDialog } from "@/components/admin/purchasing/ReceiveGoodsDialog";
import { PODetailDialog } from "@/components/admin/purchasing/PODetailDialog";
import { useToast } from "@/components/ui/use-toast";

const purchaseOrders = [
    { id: 'PO-001', supplier: 'PT. Sehat Farma', date: '2025-01-10', total: 15400000, status: 'open', items: 12 },
    { id: 'PO-002', supplier: 'PT. Kimia Global', date: '2025-01-09', total: 8250000, status: 'closed', items: 5 },
    { id: 'PO-003', supplier: 'PT. Distributor Obat', date: '2025-01-08', total: 24500000, status: 'partial', items: 25 },
];

const grnItems = [
    { id: 'GRN-001', poRef: 'PO-002', receivedDate: '2025-01-10', supplier: 'PT. Kimia Global', status: 'completed' },
    { id: 'GRN-002', poRef: 'PO-003', receivedDate: '2025-01-09', supplier: 'PT. Distributor Obat', status: 'pending_qc' },
];

const returns = [
    { id: 'RT-001', grnRef: 'GRN-002', date: '2025-01-10', supplier: 'PT. Distributor Obat', reason: 'Rusak', status: 'pending' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'open': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Open</Badge>;
        case 'closed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
        case 'partial': return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Partial</Badge>;
        case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
        case 'completed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
        case 'pending_qc': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Pending QC</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

export default function PurchasingPage() {
    const { toast } = useToast();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isReceiveOpen, setIsReceiveOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPO, setSelectedPO] = useState<any>(null);

    const handleViewDetail = (po: any) => {
        setSelectedPO(po);
        setIsDetailOpen(true);
    };

    const handleReceive = (po: any) => {
        setSelectedPO(po);
        setIsReceiveOpen(true);
    };

    const handlePrint = (id: string) => {
        toast({
            title: "Mencetak PO",
            description: `Sedang mencetak dokumen ${id}...`,
            duration: 3000,
        });
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        <FileText className="h-6 w-6 text-emerald-600" />
                        Pembelian (Purchasing)
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola Purchase Order, Penerimaan Barang, dan Retur Pembelian.
                    </p>
                </div>
                <div>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Buat PO Baru
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="po" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="po" className="gap-2"><FileText className="w-4 h-4" /> Purchase Orders</TabsTrigger>
                    <TabsTrigger value="grn" className="gap-2"><Truck className="w-4 h-4" /> Penerimaan (GRN)</TabsTrigger>
                    <TabsTrigger value="returns" className="gap-2"><RotateCcw className="w-4 h-4" /> Retur Pembelian</TabsTrigger>
                </TabsList>

                <TabsContent value="po" className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari No. PO / Supplier..."
                                className="pl-9"
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. PO</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Tanggal Order</TableHead>
                                    <TableHead>Total Item</TableHead>
                                    <TableHead>Total Nominal</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchaseOrders.map(po => (
                                    <TableRow key={po.id}>
                                        <TableCell className="font-medium">{po.id}</TableCell>
                                        <TableCell>{po.supplier}</TableCell>
                                        <TableCell>{po.date}</TableCell>
                                        <TableCell>{po.items} Item</TableCell>
                                        <TableCell>Rp {po.total.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>{getStatusBadge(po.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleViewDetail(po)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Lihat Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handlePrint(po.id)}>Cetak PO</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleReceive(po)}>Terima Barang (GRN)</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="grn" className="space-y-4">
                    <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 mb-4">
                        <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5" />
                            <span>
                                <strong>Penerimaan Barang:</strong> Pastikan cek fisik, batch number, dan expired date saat terima barang.
                            </span>
                        </div>
                    </div>
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. GRN</TableHead>
                                    <TableHead>Ref. PO</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Tanggal Terima</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {grnItems.map(grn => (
                                    <TableRow key={grn.id}>
                                        <TableCell className="font-medium">{grn.id}</TableCell>
                                        <TableCell className="text-muted-foreground">{grn.poRef}</TableCell>
                                        <TableCell>{grn.supplier}</TableCell>
                                        <TableCell>{grn.receivedDate}</TableCell>
                                        <TableCell>{getStatusBadge(grn.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Detail</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="returns" className="space-y-4">
                    <div className="flex justify-end mb-4">
                        <Button variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Retur Baru
                        </Button>
                    </div>
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Retur</TableHead>
                                    <TableHead>Ref. GRN</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Alasan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {returns.map(ret => (
                                    <TableRow key={ret.id}>
                                        <TableCell className="font-medium">{ret.id}</TableCell>
                                        <TableCell className="text-muted-foreground">{ret.grnRef}</TableCell>
                                        <TableCell>{ret.supplier}</TableCell>
                                        <TableCell>{ret.date}</TableCell>
                                        <TableCell>{ret.reason}</TableCell>
                                        <TableCell>{getStatusBadge(ret.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Detail</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <CreatePODialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
            <ReceiveGoodsDialog
                open={isReceiveOpen}
                onOpenChange={setIsReceiveOpen}
                poId={selectedPO?.id || null}
            />
            <PODetailDialog
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                po={selectedPO}
            />
        </div>
    );
}
