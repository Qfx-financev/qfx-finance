'use client';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PortfolioChartProps {
  data?: number[];
  labels?: string[];
  height?: number;
}

export function PortfolioChart({ data = [], labels = [], height = 220 }: PortfolioChartProps) {
  const mockLabels = labels.length ? labels : Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const mockData = data.length ? data : Array.from({ length: 30 }, (_, i) => {
    return Math.round(10000 + i * 320 + Math.random() * 500 - 100);
  });

  const options: ApexCharts.ApexOptions = {
    chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: false }, background: 'transparent' },
    theme: { mode: 'dark' },
    stroke: { curve: 'smooth', width: 2, colors: ['#00d4ff'] },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0, stops: [0, 100], colorStops: [{ offset: 0, color: '#00d4ff', opacity: 0.25 }, { offset: 100, color: '#00d4ff', opacity: 0 }] } },
    grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4, xaxis: { lines: { show: false } } },
    xaxis: { categories: mockLabels, labels: { style: { colors: '#6b7280', fontSize: '11px' }, rotate: 0 }, axisBorder: { show: false }, axisTicks: { show: false }, tickAmount: 6 },
    yaxis: { labels: { style: { colors: '#6b7280', fontSize: '11px' }, formatter: (v) => `$${(v / 1000).toFixed(1)}k` } },
    tooltip: { theme: 'dark', x: { format: 'MMM dd' }, y: { formatter: (v) => `$${v.toLocaleString()}` } },
    dataLabels: { enabled: false },
    markers: { size: 0 },
  };

  return (
    <ApexChart
      type="area"
      height={height}
      series={[{ name: 'Portfolio Value', data: mockData }]}
      options={options}
    />
  );
}

export function AllocationChart({ plans }: { plans: { name: string; value: number }[] }) {
  const defaultPlans = plans?.length ? plans : [
    { name: 'BRONZE', value: 15000 },
    { name: 'SILVER', value: 35000 },
    { name: 'GOLD', value: 28000 },
    { name: 'VIP', value: 42000 },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: { type: 'donut', background: 'transparent' },
    theme: { mode: 'dark' },
    labels: defaultPlans.map(p => p.name),
    colors: ['#cd7f32', '#c0c0c0', '#f4c430', '#7b61ff'],
    legend: { position: 'bottom', labels: { colors: '#a0aec0' } },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total AUM', color: '#6b7280', formatter: (w) => `$${w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toLocaleString()}` } } } } },
    stroke: { width: 0 },
    tooltip: { theme: 'dark', y: { formatter: (v) => `$${v.toLocaleString()}` } },
  };

  return (
    <ApexChart
      type="donut"
      height={280}
      series={defaultPlans.map(p => p.value)}
      options={options}
    />
  );
}
