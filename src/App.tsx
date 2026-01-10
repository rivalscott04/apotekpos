import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import AccessDenied from "./pages/AccessDenied";
import POSPage from "./pages/POSPage";
import ApprovalsPage from "./pages/admin/ApprovalsPage";
import ProductPage from "./pages/admin/ProductPage";
import InventoryPage from "./pages/admin/InventoryPage";
import PurchasingPage from "./pages/admin/PurchasingPage";
import OwnerDashboardPage from "./pages/owner/DashboardPage";
import AnalyticsPage from "./pages/owner/AnalyticsPage";
import AuditPage from "./pages/owner/AuditPage";
import SuperadminDashboardPage from "./pages/superadmin/DashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* POS - Full screen, no sidebar */}
            <Route
              path="/pos"
              element={
                <ProtectedRoute allowedRoles={['kasir', 'apoteker', 'manager', 'owner', 'superadmin']}>
                  <POSPage />
                </ProtectedRoute>
              }
            />

            {/* Admin routes with sidebar */}
            <Route element={<AdminLayout />}>
              <Route
                path="/admin/approvals"
                element={
                  <ProtectedRoute allowedRoles={['manager', 'owner', 'superadmin']}>
                    <ApprovalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute allowedRoles={['manager', 'owner', 'superadmin']}>
                    <ProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/inventory"
                element={
                  <ProtectedRoute allowedRoles={['gudang', 'manager', 'owner', 'superadmin']}>
                    <InventoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/purchasing"
                element={
                  <ProtectedRoute allowedRoles={['gudang', 'manager', 'owner', 'superadmin']}>
                    <PurchasingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/promos"
                element={
                  <ProtectedRoute allowedRoles={['manager', 'owner', 'superadmin']}>
                    <div className="p-6"><h1 className="text-2xl font-semibold">Promo</h1><p className="text-muted-foreground mt-1">Halaman ini dalam pengembangan.</p></div>
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Owner routes with sidebar */}
            <Route element={<AdminLayout />}>
              <Route
                path="/owner"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'superadmin']}>
                    <OwnerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/analytics"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'superadmin']}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/reports"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'superadmin']}>
                    <div className="p-6"><h1 className="text-2xl font-semibold">Laporan</h1><p className="text-muted-foreground mt-1">Halaman ini dalam pengembangan.</p></div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/audit"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'superadmin']}>
                    <AuditPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Superadmin routes */}
            <Route element={<AdminLayout />}>
              <Route
                path="/superadmin"
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <SuperadminDashboardPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
