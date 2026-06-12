'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';

// ==========================================
// MOCK DATA
// ==========================================
const breakdownData = [
  { id: '1', component: 'Bahan Baku (Gula, Botol, Ekstrak)', budget: 40000000, actual: 42500000, variance: '+2.5 Juta', type: 'over' },
  { id: '2', component: 'Tenaga Kerja Langsung', budget: 15000000, actual: 12500000, variance: '-2.5 Juta', type: 'under' },
  { id: '3', component: '↳ Overhead: Listrik & Air', budget: 5000000, actual: 6000000, variance: '+1.0 Juta', type: 'over' },
  { id: '4', component: '↳ Overhead: Pemeliharaan Mesin', budget: 5000000, actual: 4000000, variance: '-1.0 Juta', type: 'under' }
];

export default function LaporanHppPage() {
  const [selectedBatch, setSelectedBatch] = useState('B-202310-001');
  const batchOptions = [
    { label: 'B-202310-001 (Sirup Mangga)', value: 'B-202310-001' },
    { label: 'B-202310-002 (Ekstrak Jeruk)', value: 'B-202310-002' },
    { label: 'B-202310-003 (Jelly Leci)', value: 'B-202310-003' },
  ];
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  // ==========================================
  // TEMPLATES
  // ==========================================
  const varianceTemplate = (rowData: any) => {
    const isOver = rowData.type === 'over';
    const textColor = isOver ? 'text-red-500' : 'text-indigo-500';
    return <span className={`font-bold ${textColor}`}>{rowData.variance}</span>;
  };

  const visualTemplate = (rowData: any) => {
    const isOver = rowData.type === 'over';
    const barColor = isOver ? 'bg-red-500' : 'bg-indigo-500';
    const maxVal = Math.max(rowData.budget, rowData.actual);
    const widthPercent = Math.round((rowData.actual / maxVal) * 100);
    
    return (
      <div className="w-8rem bg-gray-200 border-round" style={{ height: '6px' }}>
        <div className={`${barColor} h-full border-round`} style={{ width: `${widthPercent}%` }}></div>
      </div>
    );
  };

  const componentTemplate = (rowData: any) => {
    const isSub = rowData.component.startsWith('↳');
    return (
      <span className={`${isSub ? 'ml-4 text-600' : 'font-bold text-800'}`}>
        {rowData.component}
      </span>
    );
  };

  return (
    <div className="grid">
      {/* HEADER PAGE */}
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between mb-4 gap-3">
          <div>
            <div className="flex align-items-center gap-2 mb-2">
              <span className="text-500 font-medium text-sm">Sistem Produksi</span>
              <i className="pi pi-angle-right text-500 text-xs"></i>
              <span className="text-500 font-medium text-sm">Kalkulasi HPP</span>
            </div>
            <h1 className="text-3xl font-bold m-0 text-900">Analisis Biaya Batch</h1>
            <div className="flex align-items-center gap-2 mt-2">
              <span className="text-color-secondary m-0">Rincian detail HPP untuk Batch </span>
              <Dropdown 
                value={selectedBatch} 
                options={batchOptions} 
                onChange={(e) => setSelectedBatch(e.value)} 
                className="w-18rem border-none bg-indigo-50 text-indigo-800 font-mono font-bold shadow-none"
                panelClassName="font-mono text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button label="Ekspor PDF" icon="pi pi-download" outlined className="bg-white text-700 border-300 font-bold" />
            <Button label="Setujui HPP" icon="pi pi-check-circle" className="bg-indigo-600 hover:bg-indigo-700 border-none font-bold" />
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="col-12 md:col-3">
        <Card className="border-1 surface-border shadow-none h-full relative overflow-hidden">
          <span className="text-500 font-bold uppercase text-xs tracking-wide">TOTAL HPP PER UNIT</span>
          <div className="text-3xl font-bold text-900 mt-2 mb-2">Rp 14.823</div>
          <div className="flex align-items-center gap-1 text-xs text-red-500 font-bold bg-red-50 w-max px-2 py-1 border-round">
            <i className="pi pi-arrow-up-right text-[10px]"></i>
            <span>+2.4% vs anggaran (Rp 14.475)</span>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-3">
        <Card className="border-1 surface-border shadow-none h-full border-bottom-3 border-blue-500">
          <span className="text-500 font-bold uppercase text-xs tracking-wide">TOTAL BAHAN BAKU (BB)</span>
          <div className="text-3xl font-bold text-900 mt-2 mb-2">Rp 42,5 Juta</div>
          <div className="text-xs text-500 font-medium text-right mt-3 border-top-1 surface-border pt-2">
            65% dari Total Biaya
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-3">
        <Card className="border-1 surface-border shadow-none h-full border-bottom-3 border-orange-500">
          <span className="text-500 font-bold uppercase text-xs tracking-wide">TOTAL TENAGA KERJA (TK)</span>
          <div className="text-3xl font-bold text-900 mt-2 mb-2">Rp 12,5 Juta</div>
          <div className="text-xs text-500 font-medium text-right mt-3 border-top-1 surface-border pt-2">
            19% dari Total Biaya
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-3">
        <Card className="border-1 surface-border shadow-none h-full border-bottom-3 border-purple-500">
          <span className="text-500 font-bold uppercase text-xs tracking-wide">TOTAL OVERHEAD (BOP)</span>
          <div className="text-3xl font-bold text-900 mt-2 mb-2">Rp 10,0 Juta</div>
          <div className="text-xs text-500 font-medium text-right mt-3 border-top-1 surface-border pt-2">
            16% dari Total Biaya
          </div>
        </Card>
      </div>

      {/* BOTTOM SECTION */}
      <div className="col-12 lg:col-8 mt-3">
        <Card className="border-1 surface-border shadow-1 h-full p-0 custom-hpp-card">
          <style>{`
            .custom-hpp-card .p-card-body { padding: 0; }
            .custom-hpp-card .p-datatable .p-datatable-thead > tr > th { background: #f8f9ff; color: #475569; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 1rem; }
            .custom-hpp-card .p-datatable .p-datatable-tbody > tr > td { padding: 1rem; border-bottom: 1px solid #e2e8f0; }
          `}</style>

          <div className="p-4 flex justify-content-between align-items-center border-bottom-1 surface-border">
            <h5 className="m-0 text-lg font-bold text-900">Rincian Komponen Biaya</h5>
            <div className="flex align-items-center gap-3 text-xs font-bold text-600">
              <span className="flex align-items-center gap-1"><i className="pi pi-circle-fill text-indigo-500 text-[10px]"></i> Sesuai / Di Bawah Anggaran</span>
              <span className="flex align-items-center gap-1"><i className="pi pi-circle-fill text-red-500 text-[10px]"></i> Lebihi Anggaran</span>
            </div>
          </div>

          <DataTable value={breakdownData} responsiveLayout="scroll">
            <Column header="KOMPONEN BIAYA" body={componentTemplate} style={{ width: '35%' }} />
            <Column header="ANGGARAN (RP)" body={(r) => <span className="font-mono text-600">{formatCurrency(r.budget)}</span>} style={{ width: '20%' }} />
            <Column header="AKTUAL (RP)" body={(r) => <span className="font-mono font-bold text-900">{formatCurrency(r.actual)}</span>} style={{ width: '20%' }} />
            <Column header="SELISIH" body={varianceTemplate} align="center" style={{ width: '10%' }} />
            <Column header="VISUAL" body={visualTemplate} style={{ width: '15%' }} />
          </DataTable>

          <div className="p-4 bg-indigo-50 border-round-bottom-xl flex justify-content-between align-items-center">
            <span className="text-xl font-bold text-indigo-900 uppercase">TOTAL BIAYA BATCH</span>
            <div className="flex align-items-center gap-4">
              <div className="flex flex-column text-right">
                <span className="text-xs text-indigo-700 font-bold">ANGGARAN</span>
                <span className="font-mono text-indigo-900">Rp 65.000.000</span>
              </div>
              <div className="flex flex-column text-right border-left-2 border-indigo-200 pl-4">
                <span className="text-xs text-indigo-700 font-bold">AKTUAL</span>
                <span className="font-mono font-bold text-xl text-indigo-900">Rp 65.000.000</span>
              </div>
              <div className="flex flex-column text-right border-left-2 border-indigo-200 pl-4">
                <span className="text-xs text-indigo-700 font-bold">STATUS</span>
                <span className="font-bold text-green-600">Sesuai Anggaran</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12 lg:col-4 mt-3 flex flex-column gap-3">
        {/* METADATA CARD */}
        <Card className="border-1 surface-border shadow-1 h-max">
          <h5 className="m-0 text-sm font-bold text-600 uppercase tracking-wide border-bottom-1 surface-border pb-3 mb-3">Metadata Batch</h5>
          
          <div className="flex flex-column gap-3">
            <div className="flex justify-content-between">
              <span className="text-500">Produk:</span>
              <span className="font-bold text-900 text-right">Sirup Mangga 500ml</span>
            </div>
            <div className="flex justify-content-between">
              <span className="text-500">Kuantitas:</span>
              <span className="font-bold text-900 text-right">4.385 Unit</span>
            </div>
            <div className="flex justify-content-between">
              <span className="text-500">Tanggal Mulai:</span>
              <span className="font-bold text-900 text-right font-mono text-sm">12 Okt 2023</span>
            </div>
            <div className="flex justify-content-between">
              <span className="text-500">Tanggal Selesai:</span>
              <span className="font-bold text-900 text-right font-mono text-sm">18 Okt 2023</span>
            </div>
            <div className="flex justify-content-between align-items-center">
              <span className="text-500">Status:</span>
              <Tag value="Selesai" severity="success" rounded className="px-3" />
            </div>
          </div>
        </Card>

        {/* ALERT CARD */}
        <Card className="border-1 border-red-200 shadow-none bg-red-50">
          <div className="flex gap-3">
            <i className="pi pi-exclamation-triangle text-red-500 text-2xl mt-1"></i>
            <div className="flex flex-column">
              <span className="font-bold text-red-700 mb-2">Peringatan Selisih Material</span>
              <span className="text-red-600 text-sm line-height-3 mb-3">
                Biaya bahan baku melampaui anggaran sebesar 6,2% (Rp 2,5 Juta) akibat lonjakan harga pembelian Gula Pasir di pertengahan siklus produksi.
              </span>
              <a href="#" className="text-red-700 font-bold text-sm no-underline hover:underline flex align-items-center gap-1">
                Lihat Log Pembelian Material <i className="pi pi-arrow-right text-xs"></i>
              </a>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
