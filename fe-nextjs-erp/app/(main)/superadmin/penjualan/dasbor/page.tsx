'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';

export default function DasborPenjualanPage() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const data = {
      labels: ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN'],
      datasets: [
        {
          label: 'Pendapatan',
          data: [500000000, 750000000, 600000000, 950000000, 800000000, 1240500000],
          fill: true,
          borderColor: documentStyle.getPropertyValue('--indigo-500'),
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          pointBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            color: textColor
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(context.raw);
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { display: false }
        },
        y: {
          ticks: {
            color: textColorSecondary,
            callback: function(value: any) {
              return 'Rp ' + (value / 1000000) + ' Juta';
            }
          },
          grid: { color: surfaceBorder }
        }
      }
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="grid">
      {/* HEADER */}
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between mb-2 gap-3">
          <div>
            <h1 className="text-3xl font-bold m-0 text-900">Ringkasan Penjualan</h1>
            <p className="text-color-secondary m-0 mt-2">Metrik kinerja dan wawasan waktu nyata.</p>
          </div>
          <div className="flex align-items-center gap-2">
            <Button label="Bulan Ini" icon="pi pi-calendar" outlined className="bg-white text-700 border-300" />
            <Button label="Ekspor" icon="pi pi-download" className="bg-indigo-600 hover:bg-indigo-700 border-none" />
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full relative overflow-hidden">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">TOTAL PENJUALAN</span>
            <div className="p-2 border-round-md bg-indigo-50 flex align-items-center justify-content-center border-circle">
              <i className="pi pi-money-bill text-xl text-indigo-600"></i>
            </div>
          </div>
          <div className="text-4xl font-bold text-900 mb-2">Rp 1,24 M</div>
          <div className="flex align-items-center gap-2 text-sm text-green-600 font-medium">
            <i className="pi pi-arrow-up-right text-xs"></i>
            <span>+12.5% vs bulan lalu</span>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">LABA BERSIH</span>
            <div className="p-2 border-round-md surface-100 flex align-items-center justify-content-center">
              <i className="pi pi-building-columns text-xl text-indigo-600"></i>
            </div>
          </div>
          <div className="text-4xl font-bold text-900 mb-2">Rp 342 Juta</div>
          <div className="flex align-items-center gap-2 text-sm text-green-600 font-medium">
            <i className="pi pi-arrow-up-right text-xs"></i>
            <span>+0.2% vs bulan lalu</span>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">PERTUMBUHAN YOY</span>
            <div className="p-2 border-round-md bg-orange-50 flex align-items-center justify-content-center">
              <i className="pi pi-chart-line text-xl text-orange-500"></i>
            </div>
          </div>
          <div className="text-4xl font-bold text-900 mb-2">24.8%</div>
          <div className="flex align-items-center gap-2 text-sm text-700">
            <span className="font-bold text-indigo-600 mr-1">—</span> Sesuai jalur untuk target Q3
          </div>
        </Card>
      </div>

      {/* CHARTS & SUMMARY */}
      <div className="col-12 lg:col-8">
        <Card className="border-1 surface-border shadow-1 h-full">
          <div className="flex flex-column mb-4">
            <h5 className="m-0 text-xl font-bold text-900">Tren Penjualan</h5>
            <span className="text-sm text-500 mt-1">Lintasan Pendapatan 6 Bulan</span>
          </div>
          <div className="w-full" style={{ height: '350px' }}>
            <Chart type="line" data={chartData} options={chartOptions} className="h-full" />
          </div>
        </Card>
      </div>

      <div className="col-12 lg:col-4">
        <Card className="border-1 surface-border shadow-1 h-full">
          <div className="flex align-items-center gap-2 mb-2">
            <i className="pi pi-file text-indigo-600 text-xl"></i>
            <h5 className="m-0 text-xl font-bold text-900">Ringkasan Laba Rugi</h5>
          </div>
          <p className="text-sm text-500 m-0 mb-4 pb-3 border-bottom-1 surface-border">Laba Rugi (YTD)</p>

          <div className="flex flex-column gap-3">
            <div className="flex justify-content-between align-items-center">
              <span className="text-700">Total Pendapatan</span>
              <span className="font-bold text-900">Rp 1.240.500.000</span>
            </div>
            
            <div className="flex justify-content-between align-items-center">
              <span className="text-700">HPP</span>
              <span className="font-bold text-red-500">- Rp 540.200.000</span>
            </div>
            
            <div className="flex justify-content-between align-items-center bg-indigo-50 p-2 border-round">
              <span className="font-bold text-indigo-900">LABA KOTOR</span>
              <span className="font-bold text-indigo-900">Rp 700.300.000</span>
            </div>
            
            <div className="flex justify-content-between align-items-center mt-2">
              <span className="text-700">Biaya Operasional</span>
              <span className="font-bold text-red-500">- Rp 258.000.000</span>
            </div>
            
            <div className="flex justify-content-between align-items-center">
              <span className="text-700">Pajak & Lainnya</span>
              <span className="font-bold text-red-500">- Rp 100.300.000</span>
            </div>

            <div className="border-top-2 border-indigo-600 mt-2 pt-3 flex justify-content-between align-items-center">
              <span className="text-xl font-bold text-900">Laba Bersih</span>
              <span className="text-xl font-bold text-indigo-600">Rp 342.000.000</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
