'use client';

import React, { useState } from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import {
  User,
  Shield,
  Bell,
  Key,
  Building2,
  ChevronRight,
  Check,
  Lock,
} from 'lucide-react';
import clsx from 'clsx';

const TABS = [
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { id: 'department', label: 'Department', icon: <Building2 className="h-4 w-4" /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-5 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your account, security, and preferences
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          {/* Sidebar tabs */}
          <nav className="sm:w-52 flex-shrink-0">
            <ul className="space-y-1">
              {TABS.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-secondary hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={activeTab === tab.id ? 'text-primary-600' : 'text-muted-foreground'}>
                        {tab.icon}
                      </span>
                      {tab.label}
                    </div>
                    <ChevronRight className={clsx('h-4 w-4 transition-opacity', activeTab === tab.id ? 'opacity-100 text-primary-500' : 'opacity-0')} />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {activeTab === 'profile' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                      <div className="w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-2xl font-bold">SI</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Sub Inspector</p>
                        <p className="text-sm text-secondary">Karnataka Police · Bengaluru Urban</p>
                        <Badge variant="info" className="mt-1.5">Active</Badge>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="First Name" defaultValue="Kiran" />
                      <Input label="Last Name" defaultValue="Kumar" />
                      <Input label="KG ID" defaultValue="KG-2021-04521" disabled hint="Karnataka Government ID — cannot be changed" />
                      <Input label="Email" type="email" defaultValue="kiran.kumar@ksp.gov.in" />
                      <Input label="Phone" defaultValue="+91 98000 00001" />
                      <Input label="Badge Number" defaultValue="KSP-SUB-2021-0045" disabled />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button onClick={handleSave} leftIcon={saved ? <Check className="h-4 w-4" /> : undefined}>
                    {saved ? 'Saved!' : 'Save Changes'}
                  </Button>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">Change Password</h4>
                      <div className="space-y-3">
                        <Input label="Current Password" type="password" />
                        <Input label="New Password" type="password" hint="Minimum 12 characters, include uppercase, numbers, symbols" />
                        <Input label="Confirm New Password" type="password" />
                      </div>
                      <Button className="mt-4" size="sm">Update Password</Button>
                    </div>

                    <div className="border-t border-border pt-5">
                      <h4 className="text-sm font-semibold text-foreground mb-3">Two-Factor Authentication</h4>
                      <div className="flex items-start justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-foreground">Authenticator App</p>
                          <p className="text-xs text-secondary mt-0.5">Use TOTP for secure login</p>
                        </div>
                        <Badge variant="danger">Not Enabled</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="mt-3" leftIcon={<Key className="h-3.5 w-3.5" />}>
                        Enable 2FA
                      </Button>
                    </div>

                    <div className="border-t border-border pt-5">
                      <h4 className="text-sm font-semibold text-foreground mb-3">Active Sessions</h4>
                      {[
                        { device: 'Chrome · Windows 11', location: 'Bengaluru, Karnataka', time: 'Now', current: true },
                        { device: 'Firefox · macOS', location: 'Bengaluru, Karnataka', time: '2 hrs ago', current: false },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div>
                            <p className="text-sm font-medium text-foreground">{s.device}</p>
                            <p className="text-xs text-secondary">{s.location} · {s.time}</p>
                          </div>
                          {s.current ? (
                            <Badge variant="success">Current</Badge>
                          ) : (
                            <Button variant="ghost" size="xs" className="text-red-600 hover:bg-red-50">
                              Revoke
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'New FIR assignments', desc: 'When a case is assigned to you', enabled: true },
                      { label: 'Court deadline alerts', desc: 'Chargesheet & hearing reminders', enabled: true },
                      { label: 'High-priority case updates', desc: 'Heinous crime status changes', enabled: true },
                      { label: 'System announcements', desc: 'Platform updates and maintenance', enabled: false },
                      { label: 'Weekly digest', desc: 'Summary of your case activity', enabled: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-secondary mt-0.5">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                          <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary-600 peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-1 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                        </label>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-5" onClick={handleSave}>
                    {saved ? 'Saved!' : 'Save Preferences'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'department' && (
              <Card>
                <CardHeader>
                  <CardTitle>Department Information</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'State', value: 'Karnataka' },
                      { label: 'District', value: 'Bengaluru Urban' },
                      { label: 'Police Station', value: 'Cubbon Park PS' },
                      { label: 'Unit Type', value: 'City PS' },
                      { label: 'Rank', value: 'Sub-Inspector' },
                      { label: 'Designation', value: 'Investigating Officer' },
                      { label: 'Appointment Date', value: '15 Mar 2021' },
                    ].map((item) => (
                      <div key={item.label} className="bg-muted rounded-lg p-3">
                        <dt className="text-xs text-muted-foreground">{item.label}</dt>
                        <dd className="text-sm font-semibold text-foreground mt-0.5">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-xs text-muted-foreground mt-4">
                    Department details are managed by the admin. Contact your supervisor to update.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
