import React, { useState } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import {
    Brain,
    TrendingUp,
    AlertTriangle,
    Package,
    DollarSign,
    Activity,
    Calendar,
    Download,
    Eye,
    ArrowRight,
    ExternalLink,
    Sparkles,
    Clock,
    ShieldCheck,
    Check,
    ChevronsUpDown,
    Search,
    X,
    ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { InputSelect } from "@/components/ui/input-select";

// Simple CN helper to avoid path issues
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Mock Data
const MOCK_SALES_DATA = [
    { date: "01 Jan", revenue: 4500000, profit: 1200000 },
    { date: "05 Jan", revenue: 5200000, profit: 1500000 },
    { date: "10 Jan", revenue: 4800000, profit: 1300000 },
    { date: "15 Jan", revenue: 6100000, profit: 1800000 },
    { date: "20 Jan", revenue: 5900000, profit: 1600000 },
    { date: "25 Jan", revenue: 7500000, profit: 2200000 },
    { date: "30 Jan", revenue: 8100000, profit: 2500000 },
];

const MOCK_CATEGORY_DATA = [
    { name: "Obat Bebas", value: 45 },
    { name: "Obat Keras", value: 30 },
    { name: "Alat Kesehatan", value: 15 },
    { name: "Supplements", value: 10 },
];

const MOCK_STOCK_HEALTH = [
    { name: "Aman", value: 850, fill: "#16A34A" },
    { name: "Menipis", value: 45, fill: "#F59E0B" },
    { name: "Berlebih", value: 120, fill: "#2563EB" },
    { name: "Kedaluwarsa", value: 15, fill: "#DC2626" },
];

const MOCK_EXPIRY_DATA = [
    { month: "Mar '26", items: 12, value: 4500000, color: "#DC2626" }, // 3 months
    { month: "Jun '26", items: 28, value: 8200000, color: "#EF4444" }, // 6 months
    { month: "Sep '26", items: 45, value: 12500000, color: "#F59E0B" }, // 9 months
    { month: "Des '26+", items: 150, value: 42000000, color: "#16A34A" }, // 12 months+
];

const MOCK_FORECASTING_TABLE = [
    {
        product: "Amoxicillin 500mg",
        stock: 1500,
        avgSales: 650,
        prediction: "Habis dlm 2.3 minggu",
        status: "Segera Habis",
        recommendation: "Restok 800 unit",
    },
    {
        product: "Paracetamol 500mg",
        stock: 5000,
        avgSales: 1200,
        prediction: "Aman (4 bulan)",
        status: "Stok Aman",
        recommendation: "Monitor Saja",
    },
    {
        product: "Vitamin C 1000mg",
        stock: 200,
        avgSales: 45,
        prediction: "Lambat Terjual",
        status: "Perlu Perhatian",
        recommendation: "Bundling Promo",
    },
    {
        product: "Bubuk PK",
        stock: 1500,
        avgSales: 1300,
        prediction: "Habis dlm 1 minggu",
        status: "Segera Habis",
        recommendation: "Restok Segera!",
    },
];

const COLORS = ["#1E40AF", "#16A34A", "#F59E0B", "#DC2626"];

// Simulated Branch List for Combobox
const MOCK_BRANCHES = [
    { value: "all", label: "Semua Cabang (Global)" },
    { value: "pusat", label: "Cabang Pusat" },
    { value: "cabang-a", label: "Cabang A (Pusat Kota)" },
    { value: "cabang-b", label: "Cabang B (Pinggiran)" },
    { value: "cabang-1", label: "Cabang 1 (Utara)" },
    { value: "cabang-2", label: "Cabang 2 (Selatan)" },
    { value: "cabang-3", label: "Cabang 3 (Barat)" },
    { value: "cabang-4", label: "Cabang 4 (Timur)" },
    { value: "cabang-5", label: "Cabang 5 (Bandara)" },
    { value: "cabang-6", label: "Cabang 6 (Pelabuhan)" },
];

const AnalyticsPage = () => {
    const [selectedBranch, setSelectedBranch] = useState("all");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAiAnalysis, setShowAiAnalysis] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleGenerateAnalysis = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setShowAiAnalysis(true);
        }, 1500);
    };

    const openDetails = (prod: any) => {
        setSelectedProduct(prod);
        setIsDetailOpen(true);
    };

    return (
        <div className="space-y-6 p-4 md:p-6 pb-24 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                        Analitik & AI <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-semibold px-2 py-0 h-5">Owner Pro</Badge>
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm">
                        Monitoring performa dan pusat kendali stok otomatis.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <InputSelect
                        options={MOCK_BRANCHES}
                        value={selectedBranch}
                        onValueChange={setSelectedBranch}
                        placeholder="Cari cabang..."
                        emptyMessage="Cabang tidak ditemukan."
                    >
                        <Button
                            variant="outline"
                            role="combobox"
                            className="w-[300px] justify-between h-10 px-3 bg-white border-slate-200 hover:bg-slate-50 transition-all font-medium overflow-hidden group/trigger"
                        >
                            <span className="truncate flex-1 text-left">
                                {selectedBranch !== "all"
                                    ? MOCK_BRANCHES.find((b) => b.value === selectedBranch)?.label
                                    : "Semua Cabang (Global)"}
                            </span>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                {selectedBranch !== "all" && (
                                    <>
                                        <X
                                            className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedBranch("all");
                                            }}
                                        />
                                        <Separator orientation="vertical" className="h-4 bg-slate-200" />
                                    </>
                                )}
                                <ChevronDown className="h-4 w-4 shrink-0 opacity-40 group-hover/trigger:opacity-70 transition-opacity" />
                            </div>
                        </Button>
                    </InputSelect>
                    <Button variant="outline" size="sm" className="font-semibold h-9 bg-white shadow-sm border-slate-200 text-slate-600">
                        <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                        Januari 2026
                    </Button>
                </div>
            </div>

            {/* AI Smart Executive Summary - Clean & Professional */}
            <Card className="border-none bg-[#1E40AF] text-white shadow-md overflow-hidden relative">
                <CardContent className="pt-6 pb-6 pr-6 pl-6 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 opacity-90">
                                <Brain className="h-4 w-4 text-blue-200" />
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">AI Insight Assistant</span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                                Halo Bos, Bisnis Anda tumbuh <span className="text-green-300 font-bold">12.5%</span> bulan ini.
                            </h2>
                            <p className="text-sm md:text-base text-blue-50/90 leading-relaxed max-w-2xl">
                                Performa cabang Sangat Baik. Namun, AI mendeteksi <span className="font-bold text-white border-b border-orange-300/60 pb-0.5">2 produk dalam kondisi kritis</span> dan <span className="font-bold text-white border-b border-red-300/60 pb-0.5">stok senilai Rp 4.5M yang akan kedaluwarsa</span> dalam 90 hari.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button size="sm" className="bg-white text-[#1E40AF] hover:bg-slate-100 font-bold h-9 px-4 rounded-md shadow-sm">
                                    Tindakan Cepat (2) <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 font-medium h-9 px-4 rounded-md">
                                    Lihat Laporan Lengkap
                                </Button>
                            </div>
                        </div>
                        <div className="hidden lg:flex flex-col gap-5 border-l border-white/10 pl-8 w-[280px]">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Kesehatan Bisnis</p>
                                    <span className="text-xs font-bold leading-none">85%</span>
                                </div>
                                <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-green-400 h-full w-[85%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Efisiensi Stok</p>
                                    <span className="text-xs font-bold leading-none">62%</span>
                                </div>
                                <div className="bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-orange-400 h-full w-[62%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-[#E5E7EB] hover:border-blue-200 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
                        <CardTitle className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">Omzet Global</CardTitle>
                        <div className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-[#1E40AF]" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <div className="text-lg md:text-2xl font-bold text-gray-900">42.1M</div>
                        <p className="text-[10px] text-green-600 mt-1 font-bold flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> +12.5%
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-[#E5E7EB] hover:border-green-200 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
                        <CardTitle className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">Margin</CardTitle>
                        <div className="h-7 w-7 rounded-full bg-green-50 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-[#16A34A]" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <div className="text-lg md:text-2xl font-bold text-gray-900">28.4%</div>
                        <p className="text-[10px] text-muted-foreground mt-1 font-bold">Stabil</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-[#E5E7EB] hover:border-orange-200 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
                        <CardTitle className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">Stok Menipis</CardTitle>
                        <div className="h-7 w-7 rounded-full bg-orange-50 flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <div className="text-lg md:text-2xl font-bold text-gray-900">45 Item</div>
                        <p className="text-[10px] text-orange-600 mt-1 font-bold underline cursor-pointer">Cek Detail</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-[#E5E7EB] hover:border-red-200 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-2">
                        <CardTitle className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">Stok Mati</CardTitle>
                        <div className="h-7 w-7 rounded-full bg-red-50 flex items-center justify-center">
                            <Package className="h-4 w-4 text-[#DC2626]" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <div className="text-lg md:text-2xl font-bold text-gray-900">12 Item</div>
                        <p className="text-[10px] text-red-600 mt-1 font-bold underline cursor-pointer">Bikin Promo</p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Analysis Section */}
            <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-[#1E40AF]/10 flex items-center justify-center">
                                <Brain className="h-5 w-5 text-[#1E40AF]" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    AI Forecasting & Pusat Kendali
                                </CardTitle>
                                <CardDescription className="text-xs">Prediksi cerdas stok vs volume penjualan real-time</CardDescription>
                            </div>
                        </div>
                        {!showAiAnalysis ? (
                            <Button
                                size="sm"
                                onClick={handleGenerateAnalysis}
                                disabled={isGenerating}
                                className="w-full sm:w-auto bg-[#1E40AF] hover:bg-[#1D4ED8] text-white font-semibold h-9 shadow-sm"
                            >
                                <Brain className="mr-2 h-4 w-4" />
                                {isGenerating ? "Menganalisa..." : "Mulai Analisa AI"}
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => setShowAiAnalysis(false)} className="w-full sm:w-auto text-xs text-muted-foreground h-8 border-dashed">
                                Reset Analisa
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {!showAiAnalysis ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="h-16 w-16 bg-white rounded-full shadow-inner flex items-center justify-center">
                                <Brain className="h-8 w-8 text-[#DBEAFE] animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-gray-900">Siap Menganalisa Data</h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    AI akan menganalisa stok vs volume penjualan di {selectedBranch === 'all' ? 'seluruh cabang' : 'cabang ' + selectedBranch} untuk memberikan saran restok otomatis.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Recommendations Summary */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-xl border border-orange-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className="absolute top-0 right-0 h-1 md:h-2 w-16 bg-orange-400 opacity-20" />
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-xs md:text-sm flex items-center gap-2 text-orange-900">
                                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                                            Alert: Risiko Stok Habis
                                        </h4>
                                        <Badge variant="secondary" className="text-[8px] md:text-[9px] bg-orange-50 text-orange-700 font-bold uppercase tracking-tighter">Beresiko Tinggi</Badge>
                                    </div>
                                    <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
                                        <strong>Amoxicillin</strong> dan <strong>Bubuk PK</strong> memiliki rasio jual/stok yang tidak seimbang.
                                        Stok saat ini habis dalam &lt; 14 hari. Disarankan segera melalukan PO ke Supplier Utama.
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-[#DBEAFE] shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className="absolute top-0 right-0 h-1 md:h-2 w-16 bg-[#1E40AF] opacity-20" />
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-xs md:text-sm flex items-center gap-2 text-[#1E40AF]">
                                            <Sparkles className="h-4 w-4" />
                                            Optimalisasi Inventori
                                        </h4>
                                        <Badge variant="secondary" className="text-[8px] md:text-[9px] bg-blue-50 text-[#1E40AF] font-bold uppercase tracking-tighter">Strategi</Badge>
                                    </div>
                                    <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
                                        Ditemukan 12 item stok mati.
                                        Disarankan transfer stok ke cabang lain yang permintaannya lebih tinggi atau buat promo bundling POS.
                                    </p>
                                </div>
                            </div>

                            {/* Forecasting Table - Responsive Container */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="px-4 md:px-5 py-3 md:py-4 border-b flex justify-between items-center bg-gray-50/50">
                                    <h4 className="text-[11px] md:text-xs font-semibold text-slate-900 uppercase tracking-wider">Prediksi Persediaan (AI Intelligence)</h4>
                                    <Button variant="outline" size="icon" className="h-7 w-7 md:h-8 md:w-8 border-gray-200 hover:bg-white">
                                        <Download className="h-3 w-3 md:h-4 md:w-4 text-[#1E40AF]" />
                                    </Button>
                                </div>
                                <div className="overflow-x-auto min-w-full">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/80">
                                                <TableHead className="w-[150px] md:w-[200px] text-[10px] font-semibold uppercase text-slate-500 py-4">Produk</TableHead>
                                                <TableHead className="text-right text-[10px] font-semibold uppercase text-slate-500">Stok</TableHead>
                                                <TableHead className="text-right text-[10px] font-semibold uppercase text-slate-400 hidden sm:table-cell">Jual/Bln</TableHead>
                                                <TableHead className="text-[10px] font-semibold uppercase text-slate-500">Estimasi AI</TableHead>
                                                <TableHead className="text-[10px] font-semibold uppercase text-slate-500 text-center">Status</TableHead>
                                                <TableHead className="text-[10px] font-semibold uppercase text-slate-500 hidden md:table-cell">Rekomendasi</TableHead>
                                                <TableHead className="text-[10px] font-semibold uppercase text-slate-500 text-center">Detail</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {MOCK_FORECASTING_TABLE.map((row, i) => (
                                                <TableRow key={i} className="hover:bg-blue-50/30 transition-colors border-b last:border-0">
                                                    <TableCell className="font-bold text-[11px] md:text-xs text-gray-900 py-3">{row.product}</TableCell>
                                                    <TableCell className="text-right text-[11px] md:text-xs font-extrabold">{row.stock.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-[11px] md:text-xs text-gray-400 hidden sm:table-cell">~{row.avgSales.toLocaleString()}</TableCell>
                                                    <TableCell className="text-[11px] md:text-xs text-gray-600 font-medium italic">{row.prediction}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[8px] md:text-[9px] py-0 px-1.5 md:px-2 h-5 font-bold uppercase border-2",
                                                                row.status === 'Segera Habis' ? "bg-red-50 text-red-700 border-red-200" :
                                                                    row.status === 'Perlu Perhatian' ? "bg-orange-50 text-orange-700 border-orange-200" :
                                                                        "bg-green-50 text-green-700 border-green-200"
                                                            )}
                                                        >
                                                            {row.status === 'Segera Habis' ? 'KRITIS' : (row.status === 'Perlu Perhatian' ? 'AWAS' : 'AMAN')}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-[11px] md:text-xs font-semibold text-[#1E40AF] hidden md:table-cell">{row.recommendation}</TableCell>
                                                    <TableCell className="text-center p-0">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 hover:bg-blue-100 text-[#1E40AF]"
                                                            onClick={() => openDetails(row)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* AI Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-blue-600" />
                            Analisa Detail: {selectedProduct?.product}
                        </DialogTitle>
                        <DialogDescription>
                            Wawasan algoritma berdasarkan data {selectedBranch === 'all' ? 'konsolidasi' : 'Cabang ' + selectedBranch}.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedProduct && (
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-muted-foreground text-xs font-medium mb-1">Rasio Penjualan</p>
                                    <p className="font-bold text-lg">{(selectedProduct.avgSales / 30).toFixed(1)} <span className="text-[10px] font-normal">/ hari</span></p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-muted-foreground text-xs font-medium mb-1">Stock Coverage</p>
                                    <p className={cn(
                                        "font-bold text-lg",
                                        selectedProduct.status === 'Segera Habis' ? "text-red-600" : "text-green-600"
                                    )}>
                                        {(selectedProduct.stock / (selectedProduct.avgSales / 30)).toFixed(0)} <span className="text-[10px] font-normal">hari lagi</span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h5 className="text-xs font-bold uppercase text-gray-500 tracking-wider">AI Reasoning</h5>
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                    <p className="text-sm text-blue-900 leading-relaxed font-medium">
                                        Tren menunjukkan kenaikan demand sebesar 15% sejak minggu lalu.
                                        {selectedProduct.status === 'Segera Habis'
                                            ? " Stok saat ini berada di bawah batas aman operasional. Jika tidak dilakukan pengadaan dalam 48 jam, potensi kerugian omzet mencapai Rp 12.000.000."
                                            : " Stok saat ini masih mencukupi, namun distribusi ke cabang lain yang sedang 'Habis' mungkin diperlukan sebagai tindakan preventif."}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h5 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Daftar Supplier Terbaik</h5>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                        <span className="font-semibold text-gray-700">PBF Anugrah Sehat</span>
                                        <span className="text-blue-600 font-bold">Harga Termurah</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                        <span className="font-semibold text-gray-700">PBF Kimia Farma</span>
                                        <span className="text-orange-600 font-bold">Lead Time Cepat</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="sm:flex-1">Tutup</Button>
                        <Button className="bg-[#1E40AF] sm:flex-1">
                            <ArrowRight className="mr-2 h-4 w-4" />
                            {selectedProduct?.status === 'Segera Habis' ? 'Buat PO Sekarang' : 'Detail Riwayat'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Charts Section - Enhanced Grid for Responsiveness */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
                {/* Main Revenue Trend */}
                <Card className="lg:col-span-8 shadow-sm border-[#E5E7EB] hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm md:text-base font-semibold uppercase tracking-tight">Tren Performa Finansial</CardTitle>
                                <CardDescription className="text-[10px] md:text-xs">Omzet vs Profit (Keluaran Global)</CardDescription>
                            </div>
                            <div className="flex gap-1">
                                <Badge className="bg-blue-600 h-2 w-2 p-0 rounded-full" />
                                <Badge className="bg-green-600 h-2 w-2 p-0 rounded-full" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] md:h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={MOCK_SALES_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF', fontWeight: 600 }} />
                                    <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF', fontWeight: 600 }} tickFormatter={(v) => `${v / 1000000}M`} />
                                    <Tooltip
                                        contentStyle={{ fontSize: '11px', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 600 }}
                                    />
                                    <Line type="monotone" dataKey="revenue" name="Omzet" stroke="#1E40AF" strokeWidth={4} dot={{ r: 4, fill: '#1E40AF', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 3, stroke: 'white' }} />
                                    <Line type="monotone" dataKey="profit" name="Profit" stroke="#16A34A" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Expiry Risk Predictor - THE FEFO SECTION */}
                <Card className="lg:col-span-4 shadow-sm border-red-100 bg-red-50/10 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-red-100 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-red-600" />
                            </div>
                            <CardTitle className="text-sm md:text-base font-black uppercase tracking-tight text-red-900">Risiko Kedaluwarsa (FEFO)</CardTitle>
                        </div>
                        <CardDescription className="text-[10px] md:text-xs">Estimasi nilai stok yang expired (Pencegahan Rugi)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MOCK_EXPIRY_DATA}>
                                    <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#4B5563', fontWeight: 700 }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={34}>
                                        {MOCK_EXPIRY_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold p-2 bg-red-50 border border-red-100 rounded-lg">
                                <span className="text-red-700">Total Risiko (90 Hari)</span>
                                <span className="text-red-900">Rp 12,7M</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-[10px] font-black uppercase text-red-600 bg-white border-red-200 hover:bg-red-50">
                                Lihat Daftar Obat Berisiko
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Categorization & Health */}
                <Card className="lg:col-span-4 shadow-sm border-[#E5E7EB]">
                    <CardHeader className="pb-1 p-4">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-500">Komposisi Penjualan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={MOCK_CATEGORY_DATA}
                                        innerRadius={45}
                                        outerRadius={65}
                                        paddingAngle={10}
                                        dataKey="value"
                                    >
                                        {MOCK_CATEGORY_DATA.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={3} stroke="white" />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="middle" align="right" layout="vertical" iconSize={6} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 600, paddingLeft: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-8 shadow-sm border-[#E5E7EB] hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 p-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Distribusi Kesehatan Stok</CardTitle>
                                <CardDescription className="text-[10px] mt-1 font-medium">Status ketersediaan stok di seluruh lini produk (Real-time)</CardDescription>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-extrabold text-[#1E40AF]">1,030</span>
                                <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-widest">Total SKU</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        {/* Custom Stacked Progress Bar */}
                        <div className="h-3 w-full flex rounded-full overflow-hidden bg-slate-100 shadow-inner mb-6 mt-2">
                            {MOCK_STOCK_HEALTH.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{ width: `${(item.value / 1030) * 100}%`, backgroundColor: item.fill }}
                                    className="h-full transition-all hover:scale-y-110 hover:z-10 cursor-alias"
                                />
                            ))}
                        </div>

                        {/* Enhanced Informative Legend */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                            {MOCK_STOCK_HEALTH.map((item, idx) => (
                                <div key={idx} className="space-y-1.5 group">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full shadow-sm group-hover:scale-125 transition-transform" style={{ backgroundColor: item.fill }} />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">{item.name}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-xl font-black text-slate-900">{item.value.toLocaleString()}</span>
                                        <span className="text-[10px] font-bold text-slate-400">({((item.value / 1030) * 100).toFixed(1)}%)</span>
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-medium group-hover:text-slate-600 transition-colors">
                                        {item.name === "Aman" ? "Stok mencukupi" :
                                            item.name === "Menipis" ? "Perlu restok" :
                                                item.name === "Berlebih" ? "Slow moving" : "Risiko Expired"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsPage;
