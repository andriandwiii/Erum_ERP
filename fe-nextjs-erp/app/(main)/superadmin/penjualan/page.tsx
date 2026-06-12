'use client';

import React, { useState, useEffect } from "react";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Chart } from 'primereact/chart';
import { InputNumber } from 'primereact/inputnumber';
import { Message } from 'primereact/message';

// ==========================================
// TYPES & ENUMS
// ==========================================
export interface Promotion {
  id: string;
  type: string;
  fitRatio: number;
  title: string;
  description: string;
  isApproved: boolean;
  isAiGenerated?: boolean;
}

export interface MaterialStock {
  sku: string;
  name: string;
  currentStock: number;
  unit: string;
  consumptionRate: number;
  daysRemaining: number;
  status: "danger" | "warning" | "normal";
  actionState: "idle" | "draft_reviewed" | "ordered";
  requestedQuantity?: number;
  suggestedSupplier?: string;
}

// ==========================================
// INITIAL DATA
// ==========================================
const initialPromotions: Promotion[] = [
  {
    id: "promo-1",
    type: "PENAWARAN LOYALITAS",
    fitRatio: 85,
    title: "Diskon Jelly Mangga",
    description: "Menargetkan 20% pembeli sering teratas untuk menghabiskan kelebihan stok ekstrak mangga secepatnya.",
    isApproved: false
  },
  {
    id: "promo-2",
    type: "PAKET MUSIMAN",
    fitRatio: 72,
    title: "Paket Sirup Campur",
    description: "Gabungkan Melon yang bergerak lambat dengan Cocopandan yang banyak diminati untuk penawaran bundel khusus.",
    isApproved: false
  }
];

const initialMaterials: MaterialStock[] = [
  {
    sku: "RM-Sug-01",
    name: "Gula Pasir",
    currentStock: 1200,
    unit: "kg",
    consumptionRate: 400,
    daysRemaining: 3,
    status: "danger",
    actionState: "idle"
  },
  {
    sku: "PKG-Bot-500",
    name: "Botol 500ml",
    currentStock: 15000,
    unit: "pcs",
    consumptionRate: 2500,
    daysRemaining: 6,
    status: "warning",
    actionState: "idle"
  },
  {
    sku: "FLV-Mng-02",
    name: "Ekstrak Mangga",
    currentStock: 85,
    unit: "L",
    consumptionRate: 5,
    daysRemaining: 17,
    status: "normal",
    actionState: "idle"
  }
];

// ==========================================
// MAIN EXPORT
// ==========================================
export default function PenjualanPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [materials, setMaterials] = useState<MaterialStock[]>(initialMaterials);

  const [selectedMaterialForRefill, setSelectedMaterialForRefill] = useState<MaterialStock | null>(null);
  const [isRefillDrawerOpen, setIsRefillDrawerOpen] = useState(false);
  const [isAiPromoModalOpen, setIsAiPromoModalOpen] = useState(false);
  
  const [globalFilter, setGlobalFilter] = useState<string>('');

  // Form State for Refill
  const [refillQuantity, setRefillQuantity] = useState<number>(0);
  const [refillSupplier, setRefillSupplier] = useState<string>("");
  const [refillJustification, setRefillJustification] = useState<string>("");
  const [refillLoadingAi, setRefillLoadingAi] = useState<boolean>(false);
  const [refillPricePerUnit, setRefillPricePerUnit] = useState<number>(1000);

  // Form State for AI Promo
  const [promoExcessMaterial, setPromoExcessMaterial] = useState<string>("");
  const [promoLoading, setPromoLoading] = useState<boolean>(false);
  const [generatedPromo, setGeneratedPromo] = useState<Promotion | null>(null);

  // Chart Setup
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const data = {
      labels: ['Bulan 1', 'Bulan 2', 'Bulan 3', 'Bulan 4 (Prediksi)', 'Bulan 5 (Prediksi)', 'Bulan 6 (Prediksi)'],
      datasets: [
        {
          type: 'line',
          label: 'Tren AI',
          borderColor: documentStyle.getPropertyValue('--indigo-500'),
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          data: [4400, 4800, 5200, 5800, 6400, 7100]
        },
        {
          type: 'bar',
          label: 'Aktual',
          backgroundColor: documentStyle.getPropertyValue('--blue-200'),
          data: [4800, 5200, 4900, null, null, null],
          borderRadius: 4
        },
        {
          type: 'bar',
          label: 'Prediksi',
          backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
          data: [null, null, null, 6100, 7800, 9200],
          borderRadius: 4
        }
      ]
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false
        },
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    setChartData(data);
    setChartOptions(options);
  }, []);


  const handleApprovePromotion = (id: string) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, isApproved: true } : p));
  };

  const handleDeletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  const handleOpenRefillDrawer = (material: MaterialStock) => {
    setSelectedMaterialForRefill(material);
    
    // Set initial values
    let basePrice = 1000;
    let initialQty = 1000;
    let defaultSupplier = "";

    if (material.sku === "RM-Sug-01") {
      basePrice = 15000;
      initialQty = 2000;
      defaultSupplier = "Koperasi Tani Jaya Mandiri";
    } else if (material.sku === "PKG-Bot-500") {
      basePrice = 800;
      initialQty = 15000;
      defaultSupplier = "PT Surya Plastindo";
    } else if (material.sku === "FLV-Mng-02") {
      basePrice = 120000;
      initialQty = 100;
      defaultSupplier = "PT Arsitektur Rasa Indonesia";
    }

    setRefillQuantity(initialQty);
    setRefillPricePerUnit(basePrice);
    setRefillSupplier(defaultSupplier);
    setRefillJustification("Kuantitas standar berdasar laju konsumsi mingguan.");

    setIsRefillDrawerOpen(true);
  };

  const handleConfirmRefillOrder = () => {
    if (!selectedMaterialForRefill) return;

    setMaterials(prev => prev.map(m => {
      if (m.sku === selectedMaterialForRefill.sku) {
        const updatedStock = m.currentStock + refillQuantity;
        let updatedStatus: "danger" | "warning" | "normal" = "normal";
        const futureDays = Math.ceil(updatedStock / m.consumptionRate);
        if (futureDays <= 3) {
          updatedStatus = "danger";
        } else if (futureDays <= 7) {
          updatedStatus = "warning";
        }

        return {
          ...m,
          currentStock: updatedStock,
          daysRemaining: futureDays,
          status: updatedStatus,
          actionState: "ordered" as const,
          requestedQuantity: refillQuantity,
          suggestedSupplier: refillSupplier
        };
      }
      return m;
    }));
    setIsRefillDrawerOpen(false);
  };

  const getSmartAiGuidance = async () => {
    if (!selectedMaterialForRefill) return;
    setRefillLoadingAi(true);
    setTimeout(() => {
      setRefillQuantity(selectedMaterialForRefill.consumptionRate * 14);
      setRefillSupplier("Pemasok Utama Rekomendasi AI");
      setRefillJustification("Rekomendasi dihitung menggunakan akselerasi stok AI untuk buffer 14 hari kedepan.");
      setRefillLoadingAi(false);
    }, 1500);
  };

  const handleGeneratePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoExcessMaterial.trim()) return;

    setPromoLoading(true);
    setGeneratedPromo(null);

    setTimeout(() => {
      const newPromo: Promotion = {
        id: `promo-gen-${Date.now()}`,
        type: "PROMOSI KILAT",
        fitRatio: Math.floor(Math.random() * 30) + 70,
        title: `Promosi Kilat ${promoExcessMaterial}`,
        description: `Optimalkan utilitas bahan ${promoExcessMaterial} dengan strategi bundling diskon berjenjang.`,
        isApproved: false,
        isAiGenerated: true
      };
      setGeneratedPromo(newPromo);
      setPromoLoading(false);
    }, 1500);
  };

  const applyGeneratedPromo = () => {
    if (generatedPromo) {
      setPromotions([generatedPromo, ...promotions]);
      setIsAiPromoModalOpen(false);
      setPromoExcessMaterial("");
      setGeneratedPromo(null);
    }
  };

  const exportChartData = () => {
    // Standard mock export function
    alert("Data tren penjualan berhasil diekspor ke format CSV.");
  };

  // DataTable Template Functions
  const statusBodyTemplate = (rowData: MaterialStock) => {
    let severity: "danger" | "warning" | "success" = "success";
    let icon = "pi pi-check-circle";
    
    if (rowData.status === "danger") {
      severity = "danger";
      icon = "pi pi-exclamation-triangle";
    } else if (rowData.status === "warning") {
      severity = "warning";
      icon = "pi pi-info-circle";
    }

    return (
      <div className="flex align-items-center gap-2">
        <Tag severity={severity} icon={icon} value={`${rowData.currentStock.toLocaleString('id-ID')} ${rowData.unit}`} className="text-sm font-bold" />
      </div>
    );
  };

  const daysRemainingBodyTemplate = (rowData: MaterialStock) => {
    let severity: "danger" | "warning" | "success" = "success";
    if (rowData.status === "danger") severity = "danger";
    else if (rowData.status === "warning") severity = "warning";

    return <Tag severity={severity} value={`${rowData.daysRemaining} Hari`} rounded />;
  };

  const actionBodyTemplate = (rowData: MaterialStock) => {
    if (rowData.actionState === "ordered") {
      return (
        <span className="text-green-600 font-bold text-sm flex align-items-center gap-2">
          <i className="pi pi-check-circle"></i>
          Terpesan ({rowData.requestedQuantity} {rowData.unit})
        </span>
      );
    }
    
    let buttonLabel = "Stok Memadai";
    let severity: "secondary" | "warning" | "danger" = "secondary";
    
    if (rowData.status === "danger") {
      buttonLabel = "Pesan Otomatis";
      severity = "danger";
    } else if (rowData.status === "warning") {
      buttonLabel = "Tinjau Draf";
      severity = "warning";
    }

    return (
      <Button 
        label={buttonLabel} 
        severity={severity} 
        size="small" 
        outlined={severity === 'secondary'}
        onClick={() => handleOpenRefillDrawer(rowData)} 
      />
    );
  };

  const skuBodyTemplate = (rowData: MaterialStock) => {
    return (
      <div className="flex flex-column">
        <span className="font-bold text-primary mb-1">{rowData.sku}</span>
        <span className="text-color-secondary text-sm">{rowData.name}</span>
      </div>
    );
  };

  const headerTable = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Daftar Material</span>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Cari SKU atau nama..." />
      </span>
    </div>
  );

  return (
    <div className="grid">
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between mb-4 gap-3">
          <div>
            <h1 className="text-3xl font-bold m-0 flex align-items-center gap-2 text-primary">
              <i className="pi pi-bolt text-3xl"></i> Pusat Pemasaran AI
            </h1>
            <p className="text-color-secondary m-0 mt-2">Wawasan prediktif dan strategi operasional otomatis berbasis AI.</p>
          </div>
          <div className="flex align-items-center gap-2 bg-indigo-50 px-3 py-2 border-round-3xl border-1 border-indigo-100">
            <span className="text-indigo-900 font-bold text-sm">STATUS MODEL:</span>
            <Tag value="Aktif" severity="success" icon="pi pi-circle-fill" className="fadein animation-iteration-infinite animation-duration-2000" />
          </div>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="col-12 xl:col-8">
        <Card className="h-full border-1 surface-border shadow-1">
          <div className="flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="m-0 text-xl font-bold text-900">Prediksi Tren Penjualan</h5>
              <span className="text-500 text-sm">Prakiraan untuk Bulan Depan (30 Hari)</span>
            </div>
            <Button label="Ekspor Data" icon="pi pi-download" size="small" outlined onClick={exportChartData} />
          </div>
          <div className="h-20rem">
             <Chart type="bar" data={chartData} options={chartOptions} className="h-full w-full" />
          </div>
        </Card>
      </div>

      {/* PROMOTIONS SECTION */}
      <div className="col-12 xl:col-4">
        <Card className="h-full border-1 surface-border shadow-1 flex flex-column">
          <div className="flex justify-content-between align-items-center mb-4">
            <h5 className="m-0 text-xl font-bold text-900">Promosi Otomatis</h5>
            <Tag value={`${promotions.length} Promosi`} severity="info" rounded />
          </div>

          <div className="flex-1 overflow-y-auto" style={{ maxHeight: '350px' }}>
            {promotions.length === 0 ? (
              <div className="text-center p-4">
                <i className="pi pi-box text-400 text-4xl mb-3"></i>
                <p className="m-0 text-600 font-medium">Tidak ada rekomendasi saat ini.</p>
              </div>
            ) : (
              promotions.map((p) => (
                <div key={p.id} className={`p-3 border-round-xl border-1 mb-3 ${p.isApproved ? 'surface-ground border-green-300' : 'surface-card border-200'} shadow-1`}>
                  <div className="flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-500 uppercase">{p.type}</span>
                      <div className="text-900 font-bold mt-1">{p.title}</div>
                    </div>
                    <div className="flex align-items-center gap-2">
                      <Tag value={`Kecocokan ${p.fitRatio}%`} severity="info" />
                      {p.isApproved && <i className="pi pi-check-circle text-green-500 text-xl"></i>}
                    </div>
                  </div>
                  <p className="text-600 text-sm m-0 line-height-3">{p.description}</p>
                  
                  <div className="flex align-items-center gap-2 mt-3 pt-3 border-top-1 border-200">
                    {p.isApproved ? (
                      <span className="text-green-600 font-bold text-sm">PROMOSI AKTIF</span>
                    ) : (
                      <>
                        <Button label="Setujui" icon="pi pi-check" size="small" className="flex-1" onClick={() => handleApprovePromotion(p.id)} />
                        <Button icon="pi pi-trash" severity="danger" size="small" outlined onClick={() => handleDeletePromotion(p.id)} />
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-top-1 surface-border">
            <Button label="Buat Promosi dengan AI" icon="pi pi-sparkles" className="w-full bg-indigo-600 hover:bg-indigo-700 border-none" onClick={() => setIsAiPromoModalOpen(true)} />
          </div>
        </Card>
      </div>

      {/* INVENTORY INTELLIGENCE SECTION */}
      <div className="col-12">
        <Card className="border-1 surface-border shadow-1">
          <div className="mb-4">
            <h5 className="m-0 text-xl font-bold text-900">Intelijen Isi Ulang</h5>
            <span className="text-500 text-sm">Berdasarkan produksi waktu nyata & kecepatan penjualan.</span>
          </div>

          <DataTable value={materials} paginator rows={5} dataKey="sku" globalFilter={globalFilter} header={headerTable} emptyMessage="Material tidak ditemukan." className="p-datatable-sm">
            <Column header="SKU / BARANG" body={skuBodyTemplate} />
            <Column header="STOK SAAT INI" body={statusBodyTemplate} align="right" />
            <Column field="consumptionRate" header="LAJU KONSUMSI" body={(r) => `${r.consumptionRate.toLocaleString()} ${r.unit}/hari`} align="right" />
            <Column header="PERKIRAAN HABIS" body={daysRemainingBodyTemplate} align="center" />
            <Column header="TINDAKAN AI" body={actionBodyTemplate} align="center" />
          </DataTable>
        </Card>
      </div>

      {/* ---------------- DRAWERS & DIALOGS ---------------- */}
      
      <Sidebar visible={isRefillDrawerOpen} position="right" onHide={() => setIsRefillDrawerOpen(false)} className="w-full md:w-30rem">
        {selectedMaterialForRefill && (
          <div className="flex flex-column h-full">
            <h3 className="m-0 text-xl font-bold text-900 mb-2">Rencana Pengisian: {selectedMaterialForRefill.name}</h3>
            <span className="text-500 font-mono text-sm mb-4 block">SKU: {selectedMaterialForRefill.sku}</span>
            
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-nogutter surface-100 p-3 border-round-lg mb-4 gap-3 md:gap-0">
                <div className="col-12 md:col-6">
                  <span className="text-500 text-sm block mb-1">Stok Sekarang</span>
                  <span className="text-900 font-bold text-xl">{selectedMaterialForRefill.currentStock.toLocaleString()} {selectedMaterialForRefill.unit}</span>
                </div>
                <div className="col-12 md:col-6">
                  <span className="text-500 text-sm block mb-1">Laju Konsumsi</span>
                  <span className="text-red-500 font-bold text-xl">{selectedMaterialForRefill.consumptionRate.toLocaleString()} {selectedMaterialForRefill.unit}/hr</span>
                </div>
              </div>

              <div className="mb-4">
                <Button 
                  label={refillLoadingAi ? "Mengalkulasi..." : "Gunakan Rekomendasi AI"} 
                  icon={refillLoadingAi ? "pi pi-spin pi-spinner" : "pi pi-sparkles"} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 border-none mb-2" 
                  onClick={getSmartAiGuidance} 
                  disabled={refillLoadingAi}
                />
                <small className="text-500 text-center block">Gemini akan menghitung perkiraan optimal.</small>
              </div>

              <div className="flex flex-column gap-3 mb-4">
                <div className="flex flex-column gap-2">
                  <label htmlFor="qty" className="font-bold text-sm text-700">Kuantitas Pesanan ({selectedMaterialForRefill.unit})</label>
                  <InputNumber id="qty" value={refillQuantity} onValueChange={(e) => setRefillQuantity(e.value || 0)} className="w-full" />
                </div>
                <div className="flex flex-column gap-2">
                  <label htmlFor="supplier" className="font-bold text-sm text-700">Nama Pemasok</label>
                  <InputText id="supplier" value={refillSupplier} onChange={(e) => setRefillSupplier(e.target.value)} className="w-full" />
                </div>
                {refillJustification && (
                  <Message severity="info" text={refillJustification} className="w-full justify-content-start border-round-md" />
                )}
              </div>

              <div className="border-top-1 surface-border pt-4">
                <div className="flex justify-content-between mb-2 text-600">
                  <span>Harga Satuan Estimasi</span>
                  <span className="font-mono">Rp {refillPricePerUnit.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-content-between align-items-center">
                  <span className="font-bold text-900">Total Anggaran (Estimasi)</span>
                  <span className="font-bold text-2xl text-primary font-mono">Rp {(refillQuantity * refillPricePerUnit).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-top-1 surface-border mt-auto">
              <Button label="Batal" severity="secondary" outlined className="flex-1" onClick={() => setIsRefillDrawerOpen(false)} />
              <Button label="Setujui & Pesan" icon="pi pi-check" className="flex-1" onClick={handleConfirmRefillOrder} />
            </div>
          </div>
        )}
      </Sidebar>

      <Dialog header="AI Campaign Strategist" visible={isAiPromoModalOpen} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} onHide={() => setIsAiPromoModalOpen(false)}>
        <p className="text-500 m-0 mb-4">Formulasi promosi kilat otomatis dengan Gemini berdasarkan data ERP.</p>
        
        <form onSubmit={handleGeneratePromo} className="flex flex-column gap-2 mb-4">
          <label htmlFor="excess" className="font-bold text-sm text-700">Bahan Baku Berlebih / Material Surplus</label>
          <div className="p-inputgroup">
            <InputText id="excess" required placeholder="Contoh: Gula Pasir 400 kg yang mendekati kadaluwarsa" value={promoExcessMaterial} onChange={(e) => setPromoExcessMaterial(e.target.value)} />
            <Button type="submit" label="Rancang AI" icon={promoLoading ? "pi pi-spin pi-spinner" : "pi pi-sparkles"} disabled={promoLoading || !promoExcessMaterial.trim()} />
          </div>
          <small className="text-500">Sebutkan jenis bahan, jumlah, atau urgensi kondisi surplus.</small>
        </form>

        {promoLoading && (
          <div className="flex flex-column align-items-center justify-content-center py-5">
            <i className="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
            <span className="font-bold text-900">Gemini sedang mengalkulasi strategi...</span>
          </div>
        )}

        {generatedPromo && (
          <div className="surface-ground p-4 border-round-xl border-1 border-indigo-200">
            <div className="flex justify-content-between align-items-center mb-3">
              <Tag value="Formulasi AI" icon="pi pi-sparkles" className="bg-indigo-600" />
              <span className="text-indigo-600 font-bold text-sm bg-white px-2 py-1 border-round border-1 border-indigo-100">Kecocokan {generatedPromo.fitRatio}%</span>
            </div>
            <span className="text-xs font-bold text-500 uppercase block mb-1">{generatedPromo.type}</span>
            <div className="text-lg font-bold text-900 mb-2">{generatedPromo.title}</div>
            <p className="m-0 text-600 line-height-3">{generatedPromo.description}</p>
          </div>
        )}

        <div className="flex justify-content-end gap-2 mt-5">
          <Button label="Tutup" severity="secondary" outlined onClick={() => setIsAiPromoModalOpen(false)} />
          {generatedPromo && (
            <Button label="Terapkan ke Daftar" icon="pi pi-check" onClick={applyGeneratedPromo} />
          )}
        </div>
      </Dialog>
    </div>
  );
}
