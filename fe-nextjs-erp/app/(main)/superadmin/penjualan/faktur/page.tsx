'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Dropdown } from 'primereact/dropdown';

// ==========================================
// TYPES
// ==========================================
interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  customerName: string;
  customerCode: string;
  amount: number;
  status: 'Tertunda' | 'Lunas' | 'Jatuh Tempo';
}

// ==========================================
// MOCK DATA
// ==========================================
const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2023-0891', issueDate: '2023-10-24', customerName: 'PT Maju Logistik', customerCode: 'ML', amount: 12450000, status: 'Tertunda' },
  { id: '2', invoiceNumber: 'INV-2023-0890', issueDate: '2023-10-22', customerName: 'CV Sentosa Manufaktur', customerCode: 'SM', amount: 4120500, status: 'Lunas' },
  { id: '3', invoiceNumber: 'INV-2023-0885', issueDate: '2023-09-15', customerName: 'Baja Indo Industri', customerCode: 'BI', amount: 28300000, status: 'Jatuh Tempo' },
  { id: '4', invoiceNumber: 'INV-2023-0889', issueDate: '2023-10-20', customerName: 'PT Maju Logistik', customerCode: 'ML', amount: 8900000, status: 'Lunas' },
  { id: '5', invoiceNumber: 'INV-2023-0888', issueDate: '2023-10-18', customerName: 'Karya Komponen Nusantara', customerCode: 'KK', amount: 1250750, status: 'Tertunda' },
  { id: '6', invoiceNumber: 'INV-2023-0887', issueDate: '2023-10-15', customerName: 'Solusi Pionir Utama', customerCode: 'SP', amount: 5600000, status: 'Lunas' },
  { id: '7', invoiceNumber: 'INV-2023-0886', issueDate: '2023-10-10', customerName: 'Global Impor Indonesia', customerCode: 'GI', amount: 14200250, status: 'Tertunda' },
];

export default function FakturPenjualanPage() {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const statuses = [
    { label: 'Semua Status', value: null },
    { label: 'Tertunda', value: 'Tertunda' },
    { label: 'Lunas', value: 'Lunas' },
    { label: 'Jatuh Tempo', value: 'Jatuh Tempo' }
  ];

  // Helper Templates
  const statusBodyTemplate = (rowData: Invoice) => {
    let severity: 'success' | 'warning' | 'danger' | 'info' = 'info';
    let icon = 'pi pi-circle-fill';

    if (rowData.status === 'Lunas') {
      severity = 'success';
      icon = 'pi pi-check';
    } else if (rowData.status === 'Jatuh Tempo') {
      severity = 'danger';
      icon = 'pi pi-exclamation-circle';
    } else if (rowData.status === 'Tertunda') {
      severity = 'warning';
      icon = 'pi pi-clock';
    }

    return <Tag value={rowData.status} severity={severity} rounded className="px-3" />;
  };

  const amountBodyTemplate = (rowData: Invoice) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(rowData.amount);
  };

  const customerBodyTemplate = (rowData: Invoice) => {
    // Generate color based on customer code string
    const colors = ['bg-indigo-100 text-indigo-800', 'bg-blue-100 text-blue-800', 'bg-orange-100 text-orange-800', 'bg-teal-100 text-teal-800', 'bg-purple-100 text-purple-800'];
    const charCode = rowData.customerCode.charCodeAt(0) + rowData.customerCode.charCodeAt(1);
    const colorClass = colors[charCode % colors.length];

    return (
      <div className="flex align-items-center gap-3">
        <div className={`flex align-items-center justify-content-center border-round w-2rem h-2rem font-bold text-xs ${colorClass}`}>
          {rowData.customerCode}
        </div>
        <span className="font-medium text-900">{rowData.customerName}</span>
      </div>
    );
  };

  const actionBodyTemplate = () => {
    return (
      <div className="flex gap-2">
        <Button icon="pi pi-eye" rounded text severity="secondary" aria-label="Lihat Detail" />
        <Button icon="pi pi-file-pdf" rounded text severity="secondary" aria-label="Unduh PDF" />
      </div>
    );
  };

  const headerTable = (
    <div className="flex flex-column md:flex-row align-items-center justify-content-between gap-3 bg-white p-3 border-round-top">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Cari berdasarkan ID atau Pelanggan..." className="w-full md:w-20rem" />
      </span>
      <div className="flex align-items-center gap-2 w-full md:w-auto">
        <Dropdown 
          value={selectedStatus} 
          options={statuses} 
          onChange={(e) => setSelectedStatus(e.value)} 
          placeholder="Filter: Semua Status" 
          className="w-full md:w-14rem"
        />
        <Button label="Rentang Tanggal" icon="pi pi-calendar" outlined className="w-full md:w-auto text-700 surface-50 border-300" />
      </div>
    </div>
  );

  return (
    <div className="grid">
      {/* HEADER PAGE */}
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between mb-2 gap-3">
          <div>
            <h1 className="text-3xl font-bold m-0 text-900">Manajemen Faktur Penjualan</h1>
            <p className="text-color-secondary m-0 mt-2">Ikhtisar dan pemrosesan tagihan klien terbaru.</p>
          </div>
          <div className="flex align-items-center gap-2">
            <Button label="Ekspor" icon="pi pi-download" outlined className="bg-white" />
            <Button label="Buat Faktur Baru" icon="pi pi-plus" className="bg-indigo-600 hover:bg-indigo-700 border-none" />
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">TOTAL TERTUNGGAK</span>
            <div className="p-2 border-round-md surface-100 flex align-items-center justify-content-center">
              <i className="pi pi-wallet text-xl text-yellow-600"></i>
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-900 mb-2">Rp 142.500.000</div>
          <div className="flex align-items-center gap-2 text-sm text-green-600 font-medium">
            <i className="pi pi-arrow-up-right text-xs"></i>
            <span>+5.2% dari bulan lalu</span>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full relative overflow-hidden">
          {/* Subtle red indicator border on top */}
          <div className="absolute top-0 left-0 w-full h-1rem border-top-3 border-red-500"></div>
          
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">JUMLAH JATUH TEMPO</span>
            <div className="p-2 border-round-md bg-red-50 flex align-items-center justify-content-center">
              <i className="pi pi-exclamation-triangle text-xl text-red-500"></i>
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-900 mb-2">Rp 28.300.000</div>
          <div className="text-sm text-500">
            12 Faktur melewati 30 hari
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-4">
        <Card className="border-1 surface-border shadow-none h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-600 font-bold uppercase text-xs tracking-wide">TERKUMPUL (BULAN INI)</span>
            <div className="p-2 border-round-md bg-blue-50 flex align-items-center justify-content-center border-circle">
              <i className="pi pi-check text-xl text-blue-600 font-bold"></i>
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-900 mb-3">Rp 84.250.000</div>
          <div className="w-full">
            <ProgressBar value={65} displayValueTemplate={() => <></>} style={{ height: '6px' }} className="border-round" color="#4f46e5"></ProgressBar>
          </div>
        </Card>
      </div>

      {/* DATATABLE */}
      <div className="col-12 mt-3">
        <div className="border-1 surface-border border-round-xl bg-white shadow-1 overflow-hidden">
          <DataTable 
            value={mockInvoices.filter(i => !selectedStatus || i.status === selectedStatus)} 
            paginator 
            rows={5} 
            dataKey="id" 
            globalFilter={globalFilter} 
            header={headerTable} 
            emptyMessage="Faktur tidak ditemukan." 
            className="p-datatable-lg border-none"
            rowHover
            stripedRows
          >
            <Column field="invoiceNumber" header="NOMOR FAKTUR" className="font-mono font-bold text-700" style={{ width: '15%' }} />
            <Column field="issueDate" header="TANGGAL DIKELUARKAN" style={{ width: '15%' }} />
            <Column header="PELANGGAN" body={customerBodyTemplate} style={{ width: '25%' }} />
            <Column field="amount" header="JUMLAH" body={amountBodyTemplate} className="font-mono font-bold" style={{ width: '15%' }} />
            <Column header="STATUS" body={statusBodyTemplate} style={{ width: '15%' }} />
            <Column header="AKSI" body={actionBodyTemplate} align="center" style={{ width: '15%' }} />
          </DataTable>
        </div>
      </div>
    </div>
  );
}
