'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';

// ==========================================
// MOCK DATA
// ==========================================
const mockDraftItems = [
  { id: '1', code: 'RM-101', name: 'Gula Pasir', qty: 500.00, unit: 'kg', location: 'WH-A-Z1' },
  { id: '2', code: 'RM-204', name: 'Botol Kaca 500ml', qty: 150.50, unit: 'kg', location: 'WH-A-Z1' },
  { id: '3', code: 'RM-305', name: 'Ekstrak Mangga', qty: 50.00, unit: 'Lt', location: 'WH-B-Z1' },
  { id: '4', code: 'RM-412', name: 'Label Kemasan', qty: 10000, unit: 'pcs', location: 'WH-A-Z2' }
];

const mockHistoryIn = [
  { id: '1', time: '10:45', date: '26 Oct 2023', product: 'Sirup Mangga 500ml', batch: 'B-202310-001', qty: 1250, qc: 'Pass' },
  { id: '2', time: '09:12', date: '26 Oct 2023', product: 'Ekstrak Jeruk Nipis', batch: 'B-202310-002', qty: 450, qc: 'Pass' },
  { id: '3', time: '08:30', date: '26 Oct 2023', product: 'Jelly Leci', batch: 'B-202310-003', qty: 12, qc: 'Fail' },
];

export default function PergerakanBarangPage() {
  // States for Bahan Baku Keluar (Form)
  const [selectedBatchOut, setSelectedBatchOut] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [qtyOut, setQtyOut] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // States for Barang Jadi Masuk (Form)
  const [selectedBatchIn, setSelectedBatchIn] = useState(null);
  const [qtyIn, setQtyIn] = useState<number | null>(null);
  const [dateIn, setDateIn] = useState<Date | null>(new Date());
  const [qcStatus, setQcStatus] = useState<'Pass' | 'Fail'>('Pass');

  // Dropdown Options
  const batchOptions = [
    { label: 'B-202310-001 (Sirup Mangga)', value: 'B-202310-001' },
    { label: 'B-202310-002 (Ekstrak Jeruk)', value: 'B-202310-002' },
  ];
  const materialOptions = [
    { label: 'RM-101 - Gula Pasir', value: 'RM-101' },
    { label: 'RM-204 - Botol Kaca', value: 'RM-204' },
  ];
  const locationOptions = [
    { label: 'Gudang A - Zona 1', value: 'WH-A-Z1' },
    { label: 'Gudang B - Zona 1', value: 'WH-B-Z1' },
  ];

  // Helper Templates
  const qtyTemplate = (rowData: any) => {
    return (
      <span className="font-mono font-bold text-700">
        {rowData.qty.toLocaleString('id-ID')} <span className="text-sm font-normal text-500">{rowData.unit}</span>
      </span>
    );
  };

  const productBatchTemplate = (rowData: any) => {
    return (
      <div className="flex flex-column">
        <span className="font-bold text-900 text-sm">{rowData.product}</span>
        <span className="text-xs text-500 font-mono">{rowData.batch}</span>
      </div>
    );
  };

  const timeDateTemplate = (rowData: any) => {
    return (
      <div className="flex flex-column">
        <span className="font-bold text-900 text-sm">{rowData.time}</span>
        <span className="text-xs text-500">{rowData.date}</span>
      </div>
    );
  };

  const qcTemplate = (rowData: any) => {
    if (rowData.qc === 'Pass') {
      return (
        <span className="flex align-items-center gap-2 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 border-round w-max">
          <i className="pi pi-circle-fill text-[8px]"></i> Pass
        </span>
      );
    }
    return (
      <span className="flex align-items-center gap-2 text-red-500 font-bold text-xs bg-red-50 px-2 py-1 border-round w-max">
        <i className="pi pi-circle-fill text-[8px]"></i> Fail
      </span>
    );
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between mb-4 gap-3">
          <div>
            <h1 className="text-3xl font-bold m-0 text-900">Pergerakan Barang Produksi</h1>
            <p className="text-color-secondary m-0 mt-2">Catat penarikan bahan baku dan input produk jadi ke gudang.</p>
          </div>
        </div>
      </div>

      <div className="col-12">
        <Card className="border-1 surface-border shadow-1 p-0 custom-tabview-card">
          <style>{`
            .custom-tabview-card .p-card-body { padding: 0; }
            .custom-tabview-card .p-tabview-nav { padding: 0 1.5rem; background: #f8f9ff; border-bottom: 1px solid #e2e8f0; }
            .custom-tabview-card .p-tabview-panels { padding: 1.5rem; }
          `}</style>
          
          <TabView>
            
            {/* TAB 1: BAHAN BAKU KELUAR */}
            <TabPanel header="Bahan Baku Keluar (Issue)" leftIcon="pi pi-sign-out mr-2">
              
              {/* TOP METRICS FOR TAB 1 */}
              <div className="grid mb-4">
                <div className="col-12 md:col-4">
                  <div className="border-1 surface-border border-round-xl p-3 flex align-items-center gap-3">
                    <div className="p-2 bg-indigo-50 border-round-md">
                      <i className="pi pi-box text-xl text-indigo-600"></i>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-500 uppercase">TOTAL ITEM</span>
                      <div className="text-2xl font-bold text-900 mt-1">4</div>
                    </div>
                  </div>
                </div>
                <div className="col-12 md:col-4">
                  <div className="border-1 surface-border border-round-xl p-3 flex align-items-center gap-3">
                    <div className="p-2 bg-orange-50 border-round-md">
                      <i className="pi pi-shopping-bag text-xl text-orange-500"></i>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-500 uppercase">EST. TONASE</span>
                      <div className="text-2xl font-bold text-900 mt-1">1.250 <span className="text-sm font-normal text-500">kg</span></div>
                    </div>
                  </div>
                </div>
                <div className="col-12 md:col-4">
                  <div className="border-1 surface-border border-round-xl p-3 flex align-items-center gap-3">
                    <div className="p-2 bg-blue-50 border-round-md">
                      <i className="pi pi-truck text-xl text-blue-500"></i>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-500 uppercase">STATUS PICKER</span>
                      <div className="text-lg font-bold text-900 mt-1">Standby (Truk 02)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid">
                {/* FORM PENARIKAN */}
                <div className="col-12 lg:col-4">
                  <div className="border-1 surface-border border-round-xl p-4 h-full bg-white">
                    <div className="flex align-items-center gap-2 mb-4">
                      <i className="pi pi-clone text-indigo-600 text-xl"></i>
                      <h5 className="m-0 text-lg font-bold text-900">Form Penarikan</h5>
                    </div>

                    <div className="flex flex-column gap-3">
                      <div className="flex flex-column gap-2">
                        <label className="text-xs font-bold text-600 uppercase tracking-wide">Pilih Batch Produksi</label>
                        <Dropdown value={selectedBatchOut} options={batchOptions} onChange={(e) => setSelectedBatchOut(e.value)} placeholder="-- Pilih Batch Aktif --" className="w-full" />
                      </div>

                      <div className="flex flex-column gap-2">
                        <label className="text-xs font-bold text-600 uppercase tracking-wide">Bahan Baku</label>
                        <Dropdown value={selectedMaterial} options={materialOptions} onChange={(e) => setSelectedMaterial(e.value)} placeholder="-- Cari / Pilih Material --" filter className="w-full" />
                      </div>

                      <div className="grid">
                        <div className="col-8 flex flex-column gap-2">
                          <label className="text-xs font-bold text-600 uppercase tracking-wide">Jumlah</label>
                          <InputNumber value={qtyOut} onValueChange={(e) => setQtyOut(e.value || 0)} placeholder="0.00" minFractionDigits={2} className="w-full" />
                        </div>
                        <div className="col-4 flex flex-column gap-2">
                          <label className="text-xs font-bold text-600 uppercase tracking-wide">Satuan</label>
                          <div className="p-inputgroup">
                            <InputText value="Kg" disabled className="text-center font-bold" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-column gap-2">
                        <label className="text-xs font-bold text-600 uppercase tracking-wide">Lokasi Gudang Asal</label>
                        <Dropdown value={selectedLocation} options={locationOptions} onChange={(e) => setSelectedLocation(e.value)} placeholder="-- Pilih Lokasi --" className="w-full" />
                      </div>

                      <Button label="TAMBAH KE DAFTAR" icon="pi pi-plus" className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 border-none font-bold" />
                    </div>
                  </div>
                </div>

                {/* TABLE PENGAMBILAN SEMENTARA */}
                <div className="col-12 lg:col-8">
                  <div className="border-1 surface-border border-round-xl p-4 h-full bg-white flex flex-column">
                    <div className="flex justify-content-between align-items-center mb-4">
                      <div className="flex align-items-center gap-2">
                        <i className="pi pi-list text-700 text-xl"></i>
                        <h5 className="m-0 text-lg font-bold text-900">Daftar Pengambilan Sementara</h5>
                      </div>
                      <Tag value="DRAFT" severity="info" className="bg-indigo-100 text-indigo-800" />
                    </div>

                    <div className="flex-1">
                      <DataTable value={mockDraftItems} responsiveLayout="scroll" className="p-datatable-sm" stripedRows>
                        <Column field="id" header="#" style={{ width: '5%' }} />
                        <Column field="code" header="KODE MATERIAL" className="font-mono text-indigo-600 font-bold" style={{ width: '20%' }} />
                        <Column field="name" header="NAMA BAHAN BAKU" className="font-bold text-800" style={{ width: '30%' }} />
                        <Column header="JUMLAH" body={qtyTemplate} align="right" style={{ width: '20%' }} />
                        <Column field="location" header="LOKASI" className="text-600 text-sm" style={{ width: '25%' }} />
                      </DataTable>
                    </div>

                    <div className="flex justify-content-end gap-3 mt-4 pt-3 border-top-1 surface-border">
                      <Button label="SIMPAN DRAFT" severity="secondary" outlined className="font-bold px-4" />
                      <Button label="PROSES PENARIKAN (SPB)" icon="pi pi-send" className="bg-indigo-600 hover:bg-indigo-700 border-none font-bold px-4" />
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* TAB 2: BARANG JADI MASUK */}
            <TabPanel header="Barang Jadi Masuk (Receipt)" leftIcon="pi pi-sign-in mr-2">
              <div className="grid">
                
                {/* FORM INPUT BARU */}
                <div className="col-12 lg:col-4">
                  <div className="border-1 surface-border border-round-xl p-4 h-full bg-white">
                    <h5 className="m-0 text-lg font-bold text-900 mb-4">Form Input Baru</h5>

                    <div className="flex flex-column gap-3">
                      <div className="flex flex-column gap-2">
                        <label className="text-xs font-bold text-600 uppercase tracking-wide">Pilih Batch Produksi</label>
                        <Dropdown value={selectedBatchIn} options={batchOptions} onChange={(e) => setSelectedBatchIn(e.value)} placeholder="-- Pilih Batch --" className="w-full" />
                      </div>

                      <div className="flex flex-column gap-2">
                        <label className="text-xs font-bold text-600 uppercase tracking-wide">Nama Produk Jadi</label>
                        <InputText value="Sirup Mangga 500ml" disabled className="font-bold bg-gray-50" />
                        <small className="text-500">*Otomatis terisi dari Batch</small>
                      </div>

                      <div className="grid">
                        <div className="col-6 flex flex-column gap-2">
                          <label className="text-xs font-bold text-600 uppercase tracking-wide">Jumlah Hasil</label>
                          <InputNumber value={qtyIn} onValueChange={(e) => setQtyIn(e.value || 0)} placeholder="0" className="w-full" />
                        </div>
                        <div className="col-6 flex flex-column gap-2">
                          <label className="text-xs font-bold text-600 uppercase tracking-wide">Tanggal Masuk</label>
                          <Calendar value={dateIn} onChange={(e) => setDateIn(e.value as Date)} dateFormat="dd/mm/yy" className="w-full" />
                        </div>
                      </div>

                      <div className="flex flex-column gap-2 mb-3">
                        <label className="text-xs font-bold text-600 uppercase tracking-wide">Kualitas (QC)</label>
                        <div className="flex gap-2">
                          <Button 
                            label="Pass" 
                            icon="pi pi-check" 
                            className={`flex-1 ${qcStatus === 'Pass' ? 'bg-green-500 border-green-500 text-white' : 'bg-white text-green-500 border-green-500'}`} 
                            onClick={() => setQcStatus('Pass')} 
                          />
                          <Button 
                            label="Fail" 
                            icon="pi pi-times" 
                            className={`flex-1 ${qcStatus === 'Fail' ? 'bg-red-500 border-red-500 text-white' : 'bg-white text-red-500 border-red-500'}`} 
                            onClick={() => setQcStatus('Fail')} 
                          />
                        </div>
                      </div>

                      <Button label="Simpan & Posting" icon="pi pi-save" className="w-full bg-indigo-600 hover:bg-indigo-700 border-none font-bold" />
                    </div>
                  </div>
                </div>

                {/* TABLE RIWAYAT INPUT */}
                <div className="col-12 lg:col-8">
                  <div className="border-1 surface-border border-round-xl p-4 h-full bg-white flex flex-column">
                    <div className="flex justify-content-between align-items-center mb-4">
                      <h5 className="m-0 text-lg font-bold text-900">Riwayat Input Terakhir</h5>
                      <Button label="Filter" icon="pi pi-filter" outlined size="small" className="text-700 border-300" />
                    </div>

                    <div className="flex-1">
                      <DataTable value={mockHistoryIn} responsiveLayout="scroll" className="p-datatable-sm">
                        <Column header="WAKTU" body={timeDateTemplate} style={{ width: '20%' }} />
                        <Column header="BATCH / PRODUK" body={productBatchTemplate} style={{ width: '40%' }} />
                        <Column field="qty" header="QTY" className="font-mono font-bold text-900" align="right" style={{ width: '15%' }} />
                        <Column header="QC STATUS" body={qcTemplate} align="center" style={{ width: '15%' }} />
                        <Column body={() => <Button icon="pi pi-ellipsis-v" text rounded severity="secondary" />} align="center" style={{ width: '10%' }} />
                      </DataTable>
                    </div>
                  </div>
                </div>

              </div>
            </TabPanel>

          </TabView>
        </Card>
      </div>
    </div>
  );
}
