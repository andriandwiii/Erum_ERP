'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

// ==========================================
// MOCK DATA
// ==========================================
const topCustomers = [
  { id: '1', name: 'PT Maju Logistik', tier: 'Tier 1', revenue: 145000000 },
  { id: '2', name: 'Global Tech Indo', tier: 'Tier 1', revenue: 112000000 },
  { id: '3', name: 'CV Suplai Regional', tier: 'Tier 2', revenue: 89000000 },
  { id: '4', name: 'Manufaktur Prima', tier: 'Tier 2', revenue: 76000000 }
];

const topProducts = [
  { sku: 'SKU-SMX1-001', name: 'Motor Servo Industri X1', category: 'Robotika', unitCost: 4500000, sellingPrice: 8900000, margin: 49.4, status: 'Stok Tersedia' },
  { sku: 'SKU-PSA-092', name: 'Array Sensor Presisi', category: 'Elektronik', unitCost: 1205000, sellingPrice: 2150000, margin: 43.9, status: 'Stok Menipis' },
  { sku: 'SKU-HDA-404', name: 'Aktuator Tugas Berat', category: 'Mekanik', unitCost: 3100000, sellingPrice: 5200000, margin: 40.3, status: 'Stok Tersedia' }
];

export default function WawasanPelangganPage() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Bubble chart data for Customer Loyalty vs. Profitability
    const data = {
      datasets: [
        {
          label: 'Tier 1 (VIP)',
          data: [
            { x: 80, y: 35, r: 15 },
            { x: 90, y: 40, r: 20 },
            { x: 85, y: 28, r: 12 },
          ],
          backgroundColor: 'rgba(99, 102, 241, 0.4)', // indigo-500 with opacity
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2
        },
        {
          label: 'Tier 2 (Reguler)',
          data: [
            { x: 60, y: 20, r: 25 },
            { x: 70, y: 15, r: 10 },
          ],
          backgroundColor: 'rgba(168, 85, 247, 0.4)', // purple-500 with opacity
          borderColor: 'rgb(168, 85, 247)',
          borderWidth: 2
        },
        {
          label: 'Beresiko',
          data: [
            { x: 30, y: 5, r: 8 },
          ],
          backgroundColor: 'rgba(239, 68, 68, 0.4)', // red-500 with opacity
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2
        }
      ]
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `Loyalitas: ${context.raw.x}, Margin: ${context.raw.y}%`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Skor Loyalitas (Frekuensi Pembelian & Retensi)',
            color: textColorSecondary
          },
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder }
        },
        y: {
          title: {
            display: true,
            text: 'Margin Laba Bersih (%)',
            color: textColorSecondary
          },
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder }
        }
      }
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  // Helper Templates
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const productBodyTemplate = (rowData: any) => (
    <div className="flex flex-column">
      <span className="font-bold text-900">{rowData.name}</span>
      <span className="text-color-secondary text-sm">{rowData.sku}</span>
    </div>
  );

  const marginBodyTemplate = (rowData: any) => (
    <span className="text-green-600 font-bold bg-green-50 px-2 py-1 border-round text-sm border-1 border-green-200">
      <i className="pi pi-arrow-up text-xs mr-1"></i>
      {rowData.margin}%
    </span>
  );

  const statusBodyTemplate = (rowData: any) => {
    const severity = rowData.status === 'Stok Menipis' ? 'warning' : 'success';
    return <Tag value={rowData.status} severity={severity} rounded />;
  };

  return (
    <div className="grid">
      {/* HEADER PAGE */}
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between mb-2 gap-3">
          <div>
            <h1 className="text-3xl font-bold m-0 text-900">Analisis Profitabilitas Pelanggan</h1>
            <p className="text-color-secondary m-0 mt-2">Evaluasi segmen bernilai tinggi dan optimalkan bauran produk untuk margin maksimal.</p>
          </div>
          <div className="flex align-items-center gap-2">
            <Button label="Ekspor Laporan" icon="pi pi-download" outlined className="bg-white" />
            <Button label="Filter Tampilan" icon="pi pi-filter" className="bg-indigo-600 hover:bg-indigo-700 border-none" />
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">TOTAL MARGIN KEUNTUNGAN</span>
            <div className="p-2 border-round-md surface-100 flex align-items-center justify-content-center">
              <i className="pi pi-chart-line text-xl text-indigo-600"></i>
            </div>
          </div>
          <div className="text-4xl font-bold text-900 mb-2">24.8%</div>
          <div className="flex align-items-center gap-2 text-sm text-green-600 font-medium">
            <i className="pi pi-arrow-up-right text-xs"></i>
            <span>+2.1% dari kuartal lalu</span>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">RATA-RATA PENDAPATAN / PELANGGAN</span>
            <div className="p-2 border-round-md surface-100 flex align-items-center justify-content-center">
              <i className="pi pi-money-bill text-xl text-indigo-600"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-900 mb-2">Rp 12.450.000</div>
          <div className="flex align-items-center gap-2 text-sm text-green-600 font-medium">
            <i className="pi pi-arrow-up-right text-xs"></i>
            <span>+Rp 450.000 dari kuartal lalu</span>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">UKURAN SEGMEN BERNILAI TINGGI</span>
            <div className="p-2 border-round-md bg-orange-50 flex align-items-center justify-content-center">
              <i className="pi pi-users text-xl text-orange-600"></i>
            </div>
          </div>
          <div className="text-4xl font-bold text-900 mb-2">142</div>
          <div className="flex align-items-center gap-2 text-sm text-red-500 font-medium">
            <i className="pi pi-arrow-down-right text-xs"></i>
            <span>-3 dari kuartal lalu</span>
          </div>
        </Card>
      </div>

      {/* MIDDLE SECTION: SCATTER PLOT & TOP CUSTOMERS */}
      <div className="col-12 lg:col-8">
        <Card className="border-1 surface-border shadow-1 h-full">
          <div className="flex justify-content-between align-items-center mb-4">
            <h5 className="m-0 text-xl font-bold text-900">Loyalitas Pelanggan vs. Profitabilitas</h5>
            <Button icon="pi pi-ellipsis-v" rounded text severity="secondary" />
          </div>
          <div className="w-full" style={{ height: '300px' }}>
            <Chart type="bubble" data={chartData} options={chartOptions} className="h-full" />
          </div>
        </Card>
      </div>

      <div className="col-12 lg:col-4">
        <Card className="border-1 surface-border shadow-1 h-full flex flex-column">
          <div className="flex justify-content-between align-items-center mb-4">
            <h5 className="m-0 text-xl font-bold text-900">Pelanggan Teratas</h5>
            <Tag value="By Revenue" severity="info" className="bg-indigo-100 text-indigo-800" />
          </div>

          <div className="flex justify-content-between text-xs font-bold text-500 uppercase tracking-wide border-bottom-1 surface-border pb-2 mb-3">
            <span>PELANGGAN</span>
            <span>PENDAPATAN</span>
          </div>

          <div className="flex-1 flex flex-column gap-3 overflow-y-auto pr-2">
            {topCustomers.map(customer => (
              <div key={customer.id} className="flex justify-content-between align-items-center pb-3 border-bottom-1 surface-border">
                <div className="flex flex-column">
                  <span className="font-bold text-900 text-sm mb-1">{customer.name}</span>
                  <span className="text-xs text-500">{customer.tier}</span>
                </div>
                <span className="font-bold text-900 font-mono text-sm">
                  Rp {(customer.revenue / 1000000)} Juta
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <a href="#" className="text-indigo-600 font-medium text-sm no-underline hover:underline">
              Lihat Papan Peringkat Lengkap
            </a>
          </div>
        </Card>
      </div>

      {/* BOTTOM SECTION: TOP PRODUCTS TABLE */}
      <div className="col-12 mt-2">
        <Card className="border-1 surface-border shadow-1">
          <div className="flex flex-column md:flex-row justify-content-between md:align-items-center mb-4 gap-3">
            <div>
              <h5 className="m-0 text-xl font-bold text-900">Produk Paling Menguntungkan</h5>
              <p className="text-sm text-500 m-0 mt-1">Item bermargin tinggi yang mendorong profitabilitas di segmen pelanggan teratas.</p>
            </div>
            <Button label="Filter Kategori" icon="pi pi-filter" outlined size="small" />
          </div>

          <DataTable value={topProducts} responsiveLayout="scroll" className="p-datatable-sm" rowHover>
            <Column header="PRODUK / SKU" body={productBodyTemplate} style={{ width: '25%' }} />
            <Column field="category" header="KATEGORI" style={{ width: '15%' }} className="text-700" />
            <Column header="BIAYA SATUAN" body={(r) => formatCurrency(r.unitCost)} style={{ width: '15%' }} className="font-mono text-700" />
            <Column header="HARGA JUAL" body={(r) => formatCurrency(r.sellingPrice)} style={{ width: '15%' }} className="font-mono text-900 font-bold" />
            <Column header="MARGIN (%)" body={marginBodyTemplate} style={{ width: '15%' }} />
            <Column header="STATUS" body={statusBodyTemplate} align="center" style={{ width: '15%' }} />
          </DataTable>
        </Card>
      </div>
    </div>
  );
}
