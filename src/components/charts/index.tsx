import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  ApprovalStatusPoint,
  CategorySpendPoint,
  MonthlySpendPoint,
  PurchaseTrendPoint,
  VendorPerformancePoint,
} from '@/types'
import { formatCurrency, formatNumber } from '@/lib/format'

const PALETTE = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

const axisProps = {
  tick: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' },
  tickLine: false,
  axisLine: false,
}

const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: '1px solid hsl(var(--border))',
    background: 'hsl(var(--card))',
    fontSize: 12,
    boxShadow: '0 10px 38px -10px rgb(0 0 0 / 0.18)',
  },
}

export function MonthlySpendChart({ data }: { data: MonthlySpendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatCurrency(v, true)} width={56} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="purchase" name="Purchase" stroke="#4f46e5" strokeWidth={2.5} fill="url(#spendFill)" />
        <Line type="monotone" dataKey="budget" name="Budget" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function CategorySpendChart({ data }: { data: CategorySpendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="category" innerRadius={62} outerRadius={100} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function ApprovalStatusChart({ data }: { data: ApprovalStatusPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 24, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
        <XAxis type="number" {...axisProps} />
        <YAxis type="category" dataKey="status" {...axisProps} width={92} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function PurchaseTrendChart({ data }: { data: PurchaseTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="date" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatNumber(v, true)} width={40} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="orders" name="Orders" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function VendorPerformanceChart({ data }: { data: VendorPerformancePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ left: -10, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="vendor" {...axisProps} interval={0} angle={-12} textAnchor="end" height={48} />
        <YAxis {...axisProps} width={36} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="onTime" name="On-Time %" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={16} />
        <Bar dataKey="quality" name="Quality %" fill="#10b981" radius={[6, 6, 0, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  )
}
