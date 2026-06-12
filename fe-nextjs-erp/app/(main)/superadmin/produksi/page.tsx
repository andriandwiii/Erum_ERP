'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';

// ==========================================
// TYPES & MOCK DATA
// ==========================================
interface BatchItem {
  id: string;
  batchNumber: string;
  productName: string;
  status: 'Diproses' | 'Selesai' | 'Tertunda';
  startDate: string;
  targetDate: string;
}

const mockBatches: BatchItem[] = [
  { id: '1', batchNumber: 'BATCH-2023-001', productName: 'Sirup Mangga 500L', status: 'Diproses', startDate: '12 Okt 2023, 08:00', targetDate: '14 Okt 2023, 16:00' },
  { id: '2', batchNumber: 'BATCH-2023-002', productName: 'Ekstrak Jeruk Nipis 200L', status: 'Selesai', startDate: '10 Okt 2023, 09:30', targetDate: '11 Okt 2023, 14:00' },
  { id: '3', batchNumber: 'BATCH-2023-003', productName: 'Jelly Leci 100Kg', status: 'Diproses', startDate: '13 Okt 2023, 07:15', targetDate: '15 Okt 2023, 18:00' },
  { id: '4', batchNumber: 'BATCH-2023-004', productName: 'Sirup Cocopandan 300L', status: 'Tertunda', startDate: '15 Okt 2023, 08:00', targetDate: '17 Okt 2023, 12:00' },
  { id: '5', batchNumber: 'BATCH-2023-005', productName: 'Ekstrak Melon 150L', status: 'Diproses', startDate: '14 Okt 2023, 10:45', targetDate: '16 Okt 2023, 10:00' },
];

export default function ManajemenProduksiPage() {
  const [globalFilter, setGlobalFilter] = useState<string>('');

  // ==========================================
  // TEMPLATES
  // ==========================================
  const statusBodyTemplate = (rowData: BatchItem) => {
    let severity: 'success' | 'warning' | 'info' | 'danger' = 'info';
    let icon = 'pi pi-circle-fill';

    if (rowData.status === 'Selesai') {
      severity = 'success';
    } else if (rowData.status === 'Tertunda') {
      severity = 'warning';
    } else if (rowData.status === 'Diproses') {
      severity = 'info';
    }

    return (
      <div className="flex align-items-center gap-2">
        <i className={`${icon} text-xs text-${severity === 'info' ? 'blue' : severity === 'success' ? 'green' : 'orange'}-500`}></i>
        <span className="font-medium text-700">{rowData.status}</span>
      </div>
    );
  };

  const actionBodyTemplate = () => {
    return (
      <Button icon="pi pi-ellipsis-v" rounded text severity="secondary" aria-label="Menu Aksi" />
    );
  };

  const headerTable = (
    <div className="flex flex-column md:flex-row align-items-center justify-content-between gap-3 bg-white p-3 border-round-top">
      <h3 className="m-0 text-xl font-bold text-900">Daftar Batch Aktif</h3>
      <div className="flex align-items-center gap-2 w-full md:w-auto">
        <span className="p-input-icon-left w-full md:w-auto">
          <i className="pi pi-search" />
          <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Cari batch..." className="w-full md:w-15rem" />
        </span>
        <Button label="Filter" icon="pi pi-filter" outlined className="w-full md:w-auto bg-white text-700 border-300" />
        <Button label="Ekspor" icon="pi pi-download" outlined className="w-full md:w-auto bg-white text-700 border-300" />
      </div>
    </div>
  );

  return (
    <div className="grid">
      {/* HEADER PAGE */}
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between mb-2 gap-3">
          <div>
            <h1 className="text-3xl font-bold m-0 text-900">Manajemen Batch Produksi</h1>
            <p className="text-color-secondary m-0 mt-2">Pantau dan kendalikan batch produksi yang sedang berjalan di seluruh lini aktif.</p>
          </div>
          <Button label="Buat Batch Baru" icon="pi pi-plus" className="bg-indigo-600 hover:bg-indigo-700 border-none px-4" />
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full relative">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">BATCH AKTIF</span>
            <div className="p-2 border-round-md bg-indigo-50 flex align-items-center justify-content-center">
              <i className="pi pi-server text-xl text-indigo-600"></i>
            </div>
          </div>
          <div className="flex align-items-baseline gap-2 mb-2">
            <div className="text-4xl font-bold text-900">24</div>
            <span className="text-sm text-500">Di 4 lini produksi</span>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full relative">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">TINGKAT EFISIENSI</span>
            <div className="p-2 border-round-md bg-green-50 flex align-items-center justify-content-center">
              <i className="pi pi-chart-line text-xl text-green-600"></i>
            </div>
          </div>
          <div className="flex align-items-baseline gap-2 mb-2">
            <div className="text-4xl font-bold text-900">94.2%</div>
            <span className="text-sm font-medium text-green-600">+1.2% minggu ini</span>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full relative overflow-hidden">
          {/* Subtle warning indicator border on top */}
          <div className="absolute top-0 left-0 w-full h-1rem border-top-3 border-orange-400"></div>
          
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">MENUNGGU PERSETUJUAN</span>
            <div className="p-2 border-round-md bg-orange-50 flex align-items-center justify-content-center">
              <i className="pi pi-hourglass text-xl text-orange-500"></i>
            </div>
          </div>
          <div className="flex align-items-baseline gap-2 mb-2">
            <div className="text-4xl font-bold text-900">7</div>
            <span className="text-sm font-medium text-orange-500">3 butuh tindakan segera</span>
          </div>
        </Card>
      </div>

      {/* DATATABLE */}
      <div className="col-12 mt-3">
        <div className="border-1 surface-border border-round-xl bg-white shadow-1 overflow-hidden">
          <DataTable 
            value={mockBatches} 
            paginator 
            rows={5} 
            dataKey="id" 
            globalFilter={globalFilter} 
            header={headerTable} 
            emptyMessage="Tidak ada batch produksi yang ditemukan." 
            className="p-datatable-lg border-none"
            rowHover
            stripedRows
          >
            <Column field="batchNumber" header="Nomor Batch" className="font-mono font-bold text-indigo-600" style={{ width: '20%' }} />
            <Column field="productName" header="Nama Produk" className="font-bold text-900" style={{ width: '25%' }} />
            <Column header="Status" body={statusBodyTemplate} style={{ width: '15%' }} />
            <Column field="startDate" header="Tanggal Mulai" className="font-mono text-700 text-sm" style={{ width: '15%' }} />
            <Column field="targetDate" header="Target Selesai" className="font-mono text-700 text-sm" style={{ width: '15%' }} />
            <Column header="Aksi" body={actionBodyTemplate} align="center" style={{ width: '10%' }} />
          </DataTable>
        </div>
      </div>
    </div>
  );
}
