import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirect based on role
    switch (user?.role) {
      case 'kasir':
      case 'apoteker':
        navigate('/pos');
        break;
      case 'gudang':
        navigate('/admin/inventory');
        break;
      case 'manager':
        navigate('/admin/approvals');
        break;
      case 'owner':
        navigate('/owner');
        break;
      default:
        navigate('/pos');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-12 w-12 rounded-xl bg-primary mx-auto mb-4 flex items-center justify-center animate-pulse-subtle">
          <span className="text-primary-foreground font-bold text-xl">AS</span>
        </div>
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    </div>
  );
}
