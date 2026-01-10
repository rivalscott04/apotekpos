import { Package, AlertTriangle, AlertCircle, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InventoryDashboard() {
    // Mock data for dashboard
    const stats = [
        {
            title: "Total Produk",
            value: "1,245",
            description: "SKU Aktif",
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Stok Menipis",
            value: "12",
            description: "Perlu Reorder",
            icon: AlertCircle,
            color: "text-orange-600",
            bg: "bg-orange-100",
        },
        {
            title: "Near Expired",
            value: "8",
            description: "< 3 Bulan",
            icon: AlertTriangle,
            color: "text-red-600",
            bg: "bg-red-100",
        },
        {
            title: "Pending Transfer",
            value: "5",
            description: "Menunggu Terima",
            icon: ArrowRightLeft,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${stat.bg}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
