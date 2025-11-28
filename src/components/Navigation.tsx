import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, PlusCircle, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/log', icon: PlusCircle, label: 'Log' },
  { to: '/report', icon: BarChart3, label: 'Report' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="container max-w-lg mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                  "hover:bg-primary/10 active:scale-95",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "animate-bounce-subtle")} />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Safe area padding for mobile */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
}
