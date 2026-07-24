'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  BarChart3,
  Settings,
  Shield,
  Network,
  Bot,
  BookOpen,
  ChevronRight,
  Activity,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  badgeVariant?: 'danger' | 'warning' | 'info';
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Core',
    items: [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        href: '/crimes',
        label: 'FIR Records',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        href: '/cases',
        label: 'Cases',
        icon: <Briefcase className="h-4 w-4" />,
      },
      {
        href: '/accused',
        label: 'Accused',
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      {
        href: '/analytics',
        label: 'Analytics',
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        href: '/network-analysis',
        label: 'Network Analysis',
        icon: <Network className="h-4 w-4" />,
      },
      {
        href: '/ai-assistant',
        label: 'AI Assistant',
        icon: <Bot className="h-4 w-4" />,
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        href: '/reports',
        label: 'Reports',
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        href: '/audit-logs',
        label: 'Audit Logs',
        icon: <Activity className="h-4 w-4" />,
      },
      {
        href: '/settings',
        label: 'Settings',
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
];

const badgeVariantStyles = {
  danger: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" aria-hidden="true" />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 h-screen w-64 bg-sidebar z-30 flex flex-col',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          !isOpen && '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shadow-lg bg-white/5 flex items-center justify-center">
            <img src="/CID.jpg" alt="CID logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">ShadowProtocol</p>
            <p className="text-white/40 text-xs mt-0.5">Crime Intelligence</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-5">
              <p className="px-3 mb-2 text-xs font-semibold text-white/30 uppercase tracking-wider">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                          'transition-all duration-150',
                          isActive
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-white/60 hover:bg-white/8 hover:text-white'
                        )}
                      >
                        <span
                          className={clsx(
                            'flex-shrink-0',
                            isActive ? 'text-white' : 'text-white/50'
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className={clsx(
                              'text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center',
                              badgeVariantStyles[item.badgeVariant ?? 'danger']
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <ChevronRight className="h-3 w-3 text-white/50 flex-shrink-0" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="border-t border-white/10 p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">SI</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Sub-Inspector</p>
              <p className="text-white/40 text-xs truncate">Karnataka Police</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
