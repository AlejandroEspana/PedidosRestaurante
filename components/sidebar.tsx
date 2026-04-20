"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Package, Settings, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const routes = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders & POS', href: '/orders', icon: ShoppingBag },
  { name: 'Menu Configurator', href: '/menu', icon: UtensilsCrossed },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-background/50 backdrop-blur-xl hidden lg:flex flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2 px-6 font-bold text-xl tracking-tight text-primary">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
          <ChefHat className="h-5 w-5" />
        </div>
        <span>GourmetOS</span>
      </div>
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Main Menu</p>
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-3 h-11 text-base", pathname === route.href && "bg-secondary/60 font-semibold shadow-sm")}
            >
              <route.icon className="h-5 w-5" />
              {route.name}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t bg-muted/20">
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/10">
          <p className="font-semibold mb-1 text-sm text-foreground">Premium Plan</p>
          <p className="text-muted-foreground text-xs mb-3">All pos features unlocked.</p>
          <Button variant="outline" size="sm" className="w-full text-xs h-8">Upgrade</Button>
        </div>
      </div>
    </aside>
  );
}
