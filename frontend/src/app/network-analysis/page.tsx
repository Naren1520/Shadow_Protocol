'use client';

import React, { useState } from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Network,
  Users,
  AlertTriangle,
  Search,
  Info,
  Target,
  ArrowRight,
} from 'lucide-react';

// Mock network data
const NODES = [
  { id: 'A1', name: 'Ravi Kumar', role: 'Kingpin', crimes: 8, centrality: 0.94, group: 'core' },
  { id: 'A2', name: 'Suresh B.', role: 'Distributor', crimes: 5, centrality: 0.71, group: 'core' },
  { id: 'A3', name: 'Mohan L.', role: 'Runner', crimes: 3, centrality: 0.48, group: 'peripheral' },
  { id: 'A4', name: 'Unknown X', role: 'Associate', crimes: 2, centrality: 0.32, group: 'peripheral' },
  { id: 'A5', name: 'Priya S.', role: 'Associate', crimes: 1, centrality: 0.18, group: 'peripheral' },
  { id: 'A6', name: 'Raj T.', role: 'Runner', crimes: 3, centrality: 0.41, group: 'peripheral' },
];

const CONNECTIONS = [
  { from: 'A1', to: 'A2', type: 'Co-accused', strength: 'Strong' },
  { from: 'A1', to: 'A3', type: 'Known Associate', strength: 'Medium' },
  { from: 'A2', to: 'A4', type: 'Co-accused', strength: 'Strong' },
  { from: 'A2', to: 'A6', type: 'Known Associate', strength: 'Medium' },
  { from: 'A3', to: 'A5', type: 'Family', strength: 'Weak' },
];

const roleBadge = (r: string) => {
  if (r === 'Kingpin') return <Badge variant="danger">{r}</Badge>;
  if (r === 'Distributor') return <Badge variant="warning">{r}</Badge>;
  if (r === 'Runner') return <Badge variant="info">{r}</Badge>;
  return <Badge variant="neutral">{r}</Badge>;
};

const strengthColor = (s: string) => {
  if (s === 'Strong') return 'border-red-400 bg-red-50';
  if (s === 'Medium') return 'border-amber-400 bg-amber-50';
  return 'border-slate-300 bg-slate-50';
};

// Simple visual network using CSS/HTML (React Flow would replace this in full implementation)
const NetworkViz: React.FC<{ selectedNode: string | null; onSelect: (id: string) => void }> = ({
  selectedNode,
  onSelect,
}) => {
  const positions: Record<string, { x: number; y: number }> = {
    A1: { x: 50, y: 50 },
    A2: { x: 75, y: 35 },
    A3: { x: 25, y: 30 },
    A4: { x: 85, y: 65 },
    A5: { x: 15, y: 60 },
    A6: { x: 65, y: 75 },
  };

  return (
    <div className="relative w-full h-64 bg-slate-950 rounded-xl overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        {CONNECTIONS.map((c, i) => {
          const from = positions[c.from];
          const to = positions[c.to];
          return (
            <line
              key={i}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke={c.strength === 'Strong' ? '#ef4444' : c.strength === 'Medium' ? '#f59e0b' : '#64748b'}
              strokeWidth={c.strength === 'Strong' ? 2 : 1}
              strokeDasharray={c.strength === 'Weak' ? '4' : undefined}
              opacity={0.6}
            />
          );
        })}
      </svg>
      {NODES.map((node) => {
        const pos = positions[node.id];
        const isSelected = selectedNode === node.id;
        return (
          <button
            key={node.id}
            onClick={() => onSelect(node.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            title={node.name}
          >
            <div
              className={`rounded-full border-2 transition-all flex items-center justify-center text-white text-xs font-bold
                ${node.group === 'core' ? 'w-10 h-10' : 'w-7 h-7'}
                ${isSelected ? 'border-white scale-125 shadow-lg shadow-white/20' : 'border-transparent'}
                ${node.role === 'Kingpin' ? 'bg-red-600' : node.role === 'Distributor' ? 'bg-amber-500' : 'bg-blue-600'}
              `}
            >
              {node.id}
            </div>
          </button>
        );
      })}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs">
        {[
          { color: 'bg-red-600', label: 'Kingpin' },
          { color: 'bg-amber-500', label: 'Distributor' },
          { color: 'bg-blue-600', label: 'Runner / Associate' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
            <span className="text-white/60">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function NetworkAnalysisPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>('A1');
  const [query, setQuery] = useState('');

  const selected = NODES.find((n) => n.id === selectedNode);
  const connections = CONNECTIONS.filter(
    (c) => c.from === selectedNode || c.to === selectedNode
  );

  return (
    <AppShell>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Criminal Network Analysis
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Visualize connections, identify key players, detect criminal communities
            </p>
          </div>
          <Badge variant="info" className="flex items-center gap-1.5">
            <Network className="h-3.5 w-3.5" />
            {NODES.length} nodes · {CONNECTIONS.length} edges
          </Badge>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Network Members', value: NODES.length, icon: <Users className="h-4 w-4 text-blue-600" />, bg: 'bg-blue-50' },
            { label: 'Key Players (High Centrality)', value: NODES.filter(n => n.centrality > 0.7).length, icon: <Target className="h-4 w-4 text-red-600" />, bg: 'bg-red-50' },
            { label: 'Connections', value: CONNECTIONS.length, icon: <Network className="h-4 w-4 text-amber-600" />, bg: 'bg-amber-50' },
            { label: 'Total Crimes Linked', value: NODES.reduce((s, n) => s + n.crimes, 0), icon: <AlertTriangle className="h-4 w-4 text-purple-600" />, bg: 'bg-purple-50' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border border-border p-4 ${s.bg}`}>
              <div className="flex items-center gap-2 mb-2">{s.icon}</div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-secondary mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Network visualization */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Graph</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Click a node to inspect · Full React Flow integration in production
                </p>
              </CardHeader>
              <CardContent>
                <NetworkViz selectedNode={selectedNode} onSelect={setSelectedNode} />
              </CardContent>
            </Card>

            {/* Connections table */}
            <Card noPadding className="overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Connections</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      {['From', 'To', 'Relationship', 'Strength'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {CONNECTIONS.map((c, i) => {
                      const fromNode = NODES.find((n) => n.id === c.from);
                      const toNode = NODES.find((n) => n.id === c.to);
                      return (
                        <tr key={i} className={`hover:bg-muted/40 transition-colors ${strengthColor(c.strength)} border-l-2 border-l-current`}>
                          <td className="px-5 py-3">
                            <span className="font-mono text-xs font-bold text-red-700 mr-2">{c.from}</span>
                            {fromNode?.name}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5">
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <span className="font-mono text-xs font-bold text-red-700 mr-2">{c.to}</span>
                              {toNode?.name}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-secondary">{c.type}</td>
                          <td className="px-5 py-3">
                            <Badge variant={c.strength === 'Strong' ? 'danger' : c.strength === 'Medium' ? 'warning' : 'neutral'}>
                              {c.strength}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right: node inspector + search */}
          <div className="space-y-4">
            <Card className="p-4">
              <Input
                placeholder="Search by name or ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </Card>

            {/* Node inspector */}
            {selected && (
              <Card>
                <CardHeader>
                  <CardTitle>Node Details</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${selected.role === 'Kingpin' ? 'bg-red-600' : selected.role === 'Distributor' ? 'bg-amber-500' : 'bg-blue-600'}`}>
                      {selected.id}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{selected.name}</p>
                      {roleBadge(selected.role)}
                    </div>
                  </div>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Centrality Score</dt>
                      <dd className="text-sm font-semibold text-foreground">{selected.centrality}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Linked Crimes</dt>
                      <dd className="text-sm font-semibold text-foreground">{selected.crimes}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Group</dt>
                      <dd className="text-sm font-semibold text-foreground capitalize">{selected.group}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Connections</dt>
                      <dd className="text-sm font-semibold text-foreground">{connections.length}</dd>
                    </div>
                  </dl>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    View Full Profile
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* All nodes list */}
            <Card>
              <CardHeader>
                <CardTitle>All Members</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {NODES.filter(n => !query || n.name.toLowerCase().includes(query.toLowerCase()) || n.id.toLowerCase().includes(query.toLowerCase())).map((node) => (
                    <li key={node.id}>
                      <button
                        onClick={() => setSelectedNode(node.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${selectedNode === node.id ? 'bg-primary-50 border border-primary-200' : 'hover:bg-muted border border-transparent'}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${node.role === 'Kingpin' ? 'bg-red-600' : node.role === 'Distributor' ? 'bg-amber-500' : 'bg-blue-600'}`}>
                          {node.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{node.name}</p>
                          <p className="text-xs text-secondary">{node.crimes} crimes</p>
                        </div>
                        {roleBadge(node.role)}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
