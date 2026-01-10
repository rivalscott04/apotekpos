import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  FileText,
  TrendingUp,
  Settings,
  Users,
  CheckSquare,
  ClipboardList,
  BarChart3,
  Shield,
  ChevronDown,
  ChevronRight,
  Menu,
  ShieldAlert,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
  children?: Omit<NavItem, 'children'>[];
}

const navItems: NavItem[] = [
  {
    title: 'POS',
    href: '/pos',
    icon: ShoppingCart,
    roles: ['kasir', 'apoteker', 'manager', 'owner', 'superadmin'],
  },
  {
    title: 'Admin',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['manager', 'owner', 'gudang', 'superadmin'],
    children: [
      { title: 'Produk', href: '/admin/products', icon: Package, roles: ['manager', 'owner', 'superadmin'] },
      { title: 'Inventori', href: '/admin/inventory', icon: Warehouse, roles: ['gudang', 'manager', 'owner', 'superadmin'] },
      { title: 'Pembelian', href: '/admin/purchasing', icon: FileText, roles: ['gudang', 'manager', 'owner', 'superadmin'] },
      { title: 'Promo', href: '/admin/promos', icon: TrendingUp, roles: ['manager', 'owner', 'superadmin'] },
      { title: 'Approval Center', href: '/admin/approvals', icon: CheckSquare, roles: ['manager', 'owner', 'superadmin'] },
    ],
  },
  {
    title: 'Owner',
    href: '/owner',
    icon: BarChart3,
    roles: ['owner', 'superadmin'],
    children: [
      { title: 'Dashboard', href: '/owner', icon: LayoutDashboard, roles: ['owner', 'superadmin'] },
      { title: 'Analitik & AI', href: '/owner/analytics', icon: TrendingUp, roles: ['owner', 'superadmin'] },
      { title: 'Laporan', href: '/owner/reports', icon: ClipboardList, roles: ['owner', 'superadmin'] },
      { title: 'Audit Log', href: '/owner/audit', icon: Shield, roles: ['owner', 'superadmin'] },
    ],
  },
  {
    title: 'Superadmin',
    href: '/superadmin',
    icon: ShieldAlert,
    roles: ['superadmin'],
    children: [
      { title: 'God View', href: '/superadmin', icon: Eye, roles: ['superadmin'] },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(['Admin', 'Owner']);

  const toggleGroup = (title: string) => {
    setOpenGroups(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const filteredNav = navItems.filter(
    item => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar border-r transition-all duration-200 flex flex-col',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">AS</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">Apotek Sehat</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {filteredNav.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openGroups.includes(item.title);
            const filteredChildren = item.children?.filter(
              child => !child.roles || (user && child.roles.includes(user.role))
            );

            if (hasChildren && filteredChildren && filteredChildren.length > 0) {
              return (
                <Collapsible
                  key={item.title}
                  open={!collapsed && isOpen}
                  onOpenChange={() => toggleGroup(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.title}</span>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                      {filteredChildren.map(child => {
                        const ChildIcon = child.icon;
                        const isChildActive = location.pathname === child.href;

                        return (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                              isChildActive
                                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                            )}
                          >
                            <ChildIcon className="h-4 w-4 shrink-0" />
                            <span>{child.title}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
            'text-sidebar-foreground hover:bg-sidebar-accent/50'
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Pengaturan</span>}
        </NavLink>
      </div>
    </aside>
  );
}
