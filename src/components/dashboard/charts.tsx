'use client';

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#e2e8f0',
};

export function FindingsTrendChart({ data }: { data: { month: string; findings: number; closed: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="findingsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="closedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Area type="monotone" dataKey="findings" stroke="#06b6d4" fill="url(#findingsGrad)" name="New Findings" />
        <Area type="monotone" dataKey="closed" stroke="#10b981" fill="url(#closedGrad)" name="Closed" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ComplaintTrendChart({ data }: { data: { month: string; complaints: number; resolved: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Bar dataKey="complaints" fill="#f59e0b" name="Complaints" radius={[4, 4, 0, 0]} />
        <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RiskPieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBarChart({ data, dataKey, nameKey }: { data: Record<string, unknown>[]; dataKey: string; nameKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis type="number" stroke="#64748b" fontSize={12} />
        <YAxis type="category" dataKey={nameKey} stroke="#64748b" fontSize={11} width={160} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey={dataKey} fill="#06b6d4" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RootCauseChart({ data }: { data: { name: string; value: number }[] }) {
  const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CapaProgressChart({ data }: { data: { status: string; count: number }[] }) {
  const colors: Record<string, string> = {
    Open: '#3b82f6', Assigned: '#06b6d4', 'In Progress': '#f59e0b', Verification: '#8b5cf6', Closed: '#10b981',
  };
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={90} dataKey="count" nameKey="status" label>
          {data.map((entry) => (
            <Cell key={entry.status} fill={colors[entry.status] || '#64748b'} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function HeatmapGrid({ data }: { data: { terminal: string; zone: string; score: number }[] }) {
  const getColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/80';
    if (score >= 80) return 'bg-cyan-500/80';
    if (score >= 70) return 'bg-amber-500/80';
    return 'bg-red-500/80';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {data.map((item, i) => (
        <div
          key={i}
          className={`rounded-lg p-3 ${getColor(item.score)} transition-all hover:scale-105 cursor-pointer`}
        >
          <p className="text-xs font-bold text-white">{item.terminal}</p>
          <p className="text-[10px] text-white/80">{item.zone}</p>
          <p className="text-lg font-bold text-white mt-1">{item.score}%</p>
        </div>
      ))}
    </div>
  );
}