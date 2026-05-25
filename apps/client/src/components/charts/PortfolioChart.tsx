'use client';
import { useEffect, useState } from 'react';

interface PortfolioChartProps {
  height?: number;
}

export function PortfolioChart({ height = 220 }: PortfolioChartProps) {
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    import('react-apexcharts').then(mod => setChart(() => mod.default));
  }, []);

  const data = Array.from({ length: 30 }, (_, i) =>
    Math.round(10000 + i * 320 + Math.random() * 500 - 100)
  );

  const labels = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const options: any = {
    chart: { type: 'area', toolbar: { show: false }, background: 'transparent' },
    theme: { mode: 'dark' },
    stroke: { curve: 'smooth', width: 2, colors: ['#00d4ff'] },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0 } },
    grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
    xaxis: { categories: labels, labels: { style: { colors: '#6b7280', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false }, tickAmount: 6 },
    yaxis: { labels: { style: { colors: '#6b7280', fontSize: '11px' }, formatter: (v: number) => `$${(v/1000).toFixed(1)}k` } },
    tooltip: { theme: 'dark' },
    dataLabels: { enabled: false },
  };

  if (!Chart) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading chart...</div>;

  return <Chart type="area" height={height} series={[{ name: 'Portfolio Value', data }]} options={options} />;
}

export function AllocationChart({ plans }: { plans?: { name: string; value: number }[] }) {
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    import('react-apexcharts').then(mod => setChart(() => mod.default));
  }, []);

  const defaultPlans = plans?.length ? plans : [
    { name: 'BRONZE', value: 15000 },
    { name: 'SILVER', value: 35000 },
    { name: 'GOLD', value: 28000 },
    { name: 'VIP', value: 42000 },
  ];

  const options: any = {
    chart: { type: 'donut', background: 'transparent' },
    theme: { mode: 'dark' },
    labels: defaultPlans.map(p => p.name),
    colors: ['#cd7f32', '#c0c0c0', '#f4c430', '#7b61ff'],
    legend: { position: 'bottom', labels: { colors: '#a0aec0' } },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    tooltip: { theme: 'dark' },
  };

  if (!Chart) return <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading chart...</div>;

  return <Chart type="donut" height={280} series={defaultPlans.map(p => p.value)} options={options} />;
}
