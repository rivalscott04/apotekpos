import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <ShieldX className="h-10 w-10 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-semibold mb-2">Akses Ditolak</h1>
        <p className="text-muted-foreground mb-8">
          Anda tidak memiliki izin untuk mengakses halaman ini. 
          Hubungi administrator jika Anda merasa ini adalah kesalahan.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
