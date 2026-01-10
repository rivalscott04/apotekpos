import { useState } from "react";
import { Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProductList } from "@/components/admin/products/ProductList";
import { ProductForm, ProductFormValues } from "@/components/admin/products/ProductForm";
import { products as initialProducts, categories } from "@/data/mockData";
import { Product } from "@/types";
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

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const { toast } = useToast();

    const handleAddProduct = (data: ProductFormValues) => {
        // Simulate ID generation
        const newProduct: Product = {
            id: `prd-${Date.now()}`,
            name: data.name,
            sku: data.sku,
            categoryId: data.categoryId,
            categoryName: categories.find((c) => c.id === data.categoryId)?.name || "",
            price: data.price,
            unit: data.unit,
            requiresPrescription: data.requiresPrescription,
            batches: [],
        };

        setProducts([newProduct, ...products]);
        toast({
            title: "Produk Berhasil Ditambahkan",
            description: `${data.name} telah ditambahkan ke database.`,
        });
    };

    const handleEditProduct = (data: ProductFormValues) => {
        if (!editingProduct) return;

        const updatedProducts = products.map((p) =>
            p.id === editingProduct.id
                ? {
                    ...p,
                    name: data.name,
                    sku: data.sku,
                    categoryId: data.categoryId,
                    price: data.price,
                    unit: data.unit,
                    requiresPrescription: data.requiresPrescription,
                    categoryName: categories.find((c) => c.id === data.categoryId)?.name || "",
                }
                : p
        );

        setProducts(updatedProducts);
        setEditingProduct(null);
        toast({
            title: "Produk Berhasil Diupdate",
            description: `Data ${data.name} telah diperbarui.`,
        });
    };

    const confirmDelete = () => {
        if (!deletingProduct) return;

        const updatedProducts = products.filter((p) => p.id !== deletingProduct.id);
        setProducts(updatedProducts);

        toast({
            title: "Produk Dihapus",
            description: `${deletingProduct.name} telah dihapus dari database.`,
            variant: "destructive",
        });
        setDeletingProduct(null);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" />
                    Manajemen Produk
                </h1>
                <p className="text-muted-foreground mt-1">
                    Kelola master data produk, harga, dan kategori.
                </p>
            </div>

            {/* Product List */}
            <ProductList
                products={products}
                categories={categories}
                onAdd={() => {
                    setEditingProduct(null);
                    setIsFormOpen(true);
                }}
                onEdit={(product) => {
                    setEditingProduct(product);
                    setIsFormOpen(true);
                }}
                onDelete={(product) => setDeletingProduct(product)}
            />

            {/* Form Dialog */}
            <ProductForm
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingProduct(null);
                }}
                initialData={editingProduct}
                categories={categories}
                onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            />

            {/* Delete Confirmation Alert */}
            <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Produk <strong>{deletingProduct?.name}</strong> akan dihapus permanen dari database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
