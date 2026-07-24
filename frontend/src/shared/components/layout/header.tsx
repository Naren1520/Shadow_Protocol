'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/shared/stores/auth-store';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  Shield,
  LogOut,
} from 'lucide-react';
import clsx from 'clsx';

interface HeaderProps {
  onMenuClick?: () => void;
}

const notifications = [
  { id: 1, message: '3 new high-priority FIRs registered', time: '5 min ago', unread: true },
  { id: 2, message: 'Court deadline approaching for Case #044-2026-0012', time: '1 hr ago', unread: true },
  { id: 3, message: 'Accused A1 — Ravi Kumar arrested', time: '2 hrs ago', unread: false },
];

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/auth/login';
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-white/95 backdrop-blur-sm flex items-center px-6 gap-4">
      {/* Left: Menu + breadcrumb */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Search bar */}
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search FIRs, cases, accused..."
            className={clsx(
              'w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-border bg-muted',
              'placeholder:text-muted-foreground text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white',
              'transition-all duration-150'
            )}
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications((v) => !v);
              setShowUserMenu(false);
            }}
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-border shadow-xl animate-slide-up z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                <span className="badge badge-info">{unreadCount} new</span>
              </div>
              <ul className="divide-y divide-border">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={clsx(
                      'px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors',
                      n.unread && 'bg-blue-50/50'
                    )}
                  >
                    <div className="flex gap-3">
                      {n.unread && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      )}
                      <div className={clsx(!n.unread && 'ml-[18px]')}>
                        <p className="text-sm text-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2.5 border-t border-border">
                <button className="text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative ml-1">
          <button
            onClick={() => {
              setShowUserMenu((v) => !v);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">
                {user?.firstName?.charAt(0) ?? 'U'}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-foreground">
              {user?.firstName ?? 'Officer'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-border shadow-xl animate-slide-up z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">
                  {user?.firstName ?? 'Officer'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user?.role ?? 'Sub Inspector'}
                </p>
              </div>
              <ul className="p-1">
                {[
                  { icon: <User className="h-4 w-4" />, label: 'Profile', href: '/settings' },
                  { icon: <Settings className="h-4 w-4" />, label: 'Settings', href: '/settings' },
                  { icon: <Shield className="h-4 w-4" />, label: 'Security', href: '/settings' },
                  { icon: <HelpCircle className="h-4 w-4" />, label: 'Help', href: '#' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-secondary hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
