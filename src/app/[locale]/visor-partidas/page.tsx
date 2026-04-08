"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('es-ES', { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
    }).format(num);
};

const data = [
  {
    "code": "RSP_MAR_60x60",
    "description": "Suministro y colocación de pavimento de mármol formato medio 60x60x2 cm, calidad comercial. Incluye limpieza, preparación del reverso, asentado mediante doble encolado con adhesivo cementoso de alta deformabilidad extrema tipo C2TE S2, sistema de nivelación mecánica con calzos y cuñas, y sellado de juntas con mortero modificado CG2 WA. Limpieza final.",
    "unit": "m2",
    "priceTotal": 91.97,
    "chapter": "Pavimentos de piedra natural",
    "section": "Mármol formato medio",
    "page": 1,
    "breakdown": [
      {
        "code": "mtmar_coto_60",
        "description": "Losa de mármol Crema Marfil calidad Comercial/Coto, formato 60x60x2 cm, acabado pulido.",
        "quantity": 1.05,
        "unit": "m2",
        "price_unit": 36.00,
        "price": 37.80,
        "is_variable": true
      },
      {
        "code": "mo023",
        "description": "Oficial 1ª solador.",
        "quantity": 0.70,
        "unit": "h",
        "price_unit": 35.20,
        "price": 24.64,
        "is_variable": false
      },
      {
        "code": "mo061",
        "description": "Ayudante solador.",
        "quantity": 0.70,
        "unit": "h",
        "price_unit": 23.92,
        "price": 16.74,
        "is_variable": false
      },
      {
        "code": "mt09mcr210_s2",
        "description": "Mortero adhesivo cementoso de altas prestaciones, deformabilidad extrema tipo C2TE S2.",
        "quantity": 6.00,
        "unit": "kg",
        "price_unit": 0.91,
        "price": 5.46,
        "is_variable": false
      },
      {
        "code": "mtniv01_calzo",
        "description": "Calzos plásticos termoformados para nivelación perimétrica.",
        "quantity": 11.00,
        "unit": "u",
        "price_unit": 0.0585,
        "price": 0.64,
        "is_variable": false
      },
      {
        "code": "mtniv02_cuna",
        "description": "Repercusión de desgaste de cuñas poliméricas poliuretano y tensores mecánicos.",
        "quantity": 11.00,
        "unit": "u",
        "price_unit": 0.02,
        "price": 0.22,
        "is_variable": false
      },
      {
        "code": "mt09mcr060_WA",
        "description": "Mortero técnico de juntas modificado con resinas, clasificación CG2 WA.",
        "quantity": 0.30,
        "unit": "kg",
        "price_unit": 1.50,
        "price": 0.45,
        "is_variable": false
      },
      {
        "code": "%",
        "description": "Medios auxiliares",
        "quantity": 7.00,
        "unit": "%",
        "price_unit": 85.95,
        "price": 6.02,
        "is_variable": false
      }
    ]
  },
  {
    "code": "RSP_MAR_80x80",
    "description": "Suministro y colocación de pavimento de mármol gran formato 80x80x2 cm, calidad primera/selecto. Incluye limpieza, preparación del reverso con medios especiales, técnica de doble encolado obligatorio con adhesivo C2TE S2, nivelación mecánica de alta precisión y rejuntado CG2 WA. Manipulación sincronizada bidireccional.",
    "unit": "m2",
    "priceTotal": 149.58,
    "chapter": "Pavimentos de piedra natural",
    "section": "Mármol gran formato",
    "page": 1,
    "breakdown": [
      {
        "code": "mtmar_selecto_80",
        "description": "Losa de mármol Crema Marfil calidad Primera/Selecto, formato 80x80x2 cm, acabado pulido.",
        "quantity": 1.05,
        "unit": "m2",
        "price_unit": 76.42,
        "price": 80.24,
        "is_variable": true
      },
      {
        "code": "mo023",
        "description": "Oficial 1ª solador.",
        "quantity": 0.90,
        "unit": "h",
        "price_unit": 35.20,
        "price": 31.68,
        "is_variable": false
      },
      {
        "code": "mo061",
        "description": "Ayudante solador.",
        "quantity": 0.90,
        "unit": "h",
        "price_unit": 23.92,
        "price": 21.53,
        "is_variable": false
      },
      {
        "code": "mt09mcr210_s2",
        "description": "Mortero adhesivo cementoso de altas prestaciones, deformabilidad extrema tipo C2TE S2.",
        "quantity": 6.00,
        "unit": "kg",
        "price_unit": 0.91,
        "price": 5.46,
        "is_variable": false
      },
      {
        "code": "mtniv01_calzo",
        "description": "Calzos plásticos termoformados para nivelación perimétrica.",
        "quantity": 7.00,
        "unit": "u",
        "price_unit": 0.0585,
        "price": 0.41,
        "is_variable": false
      },
      {
        "code": "mtniv02_cuna",
        "description": "Repercusión de desgaste de cuñas poliméricas poliuretano y tensores mecánicos.",
        "quantity": 7.00,
        "unit": "u",
        "price_unit": 0.02,
        "price": 0.14,
        "is_variable": false
      },
      {
        "code": "mt09mcr060_WA",
        "description": "Mortero técnico de juntas modificado con resinas, clasificación CG2 WA.",
        "quantity": 0.22,
        "unit": "kg",
        "price_unit": 1.50,
        "price": 0.33,
        "is_variable": false
      },
      {
        "code": "%",
        "description": "Medios auxiliares",
        "quantity": 7.00,
        "unit": "%",
        "price_unit": 139.79,
        "price": 9.79,
        "is_variable": false
      }
    ]
  },
  {
    "code": "RSP_MAR_120x120",
    "description": "Suministro y colocación de pavimento de mármol formato XXL 120x120x2 cm, calidad alta gama exportación. Incluye logística mediante bastidores y ventosas de succión, limpieza exhaustiva y back-buttering pre-humectante. Técnica estricta de doble encolado con adhesivo termoplástico C2TE S2, sistema nivelador (calzo-cuña) y vibración orbital para ajuste final. Sellado milimétrico de juntas con CG2 WA.",
    "unit": "m2",
    "priceTotal": 210.82,
    "chapter": "Pavimentos de piedra natural",
    "section": "Mármol súper gran formato XXL",
    "page": 1,
    "breakdown": [
      {
        "code": "mtmar_imp_120",
        "description": "Losa de mármol genérico de importación calidad Alta Gama Exportación, formato XXL 120x120x2 cm.",
        "quantity": 1.05,
        "unit": "m2",
        "price_unit": 120.00,
        "price": 126.00,
        "is_variable": true
      },
      {
        "code": "mo023",
        "description": "Oficial 1ª solador.",
        "quantity": 1.10,
        "unit": "h",
        "price_unit": 35.20,
        "price": 38.72,
        "is_variable": false
      },
      {
        "code": "mo061",
        "description": "Ayudante solador.",
        "quantity": 1.10,
        "unit": "h",
        "price_unit": 23.92,
        "price": 26.31,
        "is_variable": false
      },
      {
        "code": "mt09mcr210_s2",
        "description": "Mortero adhesivo cementoso de altas prestaciones, deformabilidad extrema tipo C2TE S2.",
        "quantity": 6.00,
        "unit": "kg",
        "price_unit": 0.91,
        "price": 5.46,
        "is_variable": false
      },
      {
        "code": "mtniv01_calzo",
        "description": "Calzos plásticos termoformados para nivelación perimétrica.",
        "quantity": 4.00,
        "unit": "u",
        "price_unit": 0.0585,
        "price": 0.23,
        "is_variable": false
      },
      {
        "code": "mtniv02_cuna",
        "description": "Repercusión de desgaste de cuñas poliméricas poliuretano y tensores mecánicos.",
        "quantity": 4.00,
        "unit": "u",
        "price_unit": 0.02,
        "price": 0.08,
        "is_variable": false
      },
      {
        "code": "mt09mcr060_WA",
        "description": "Mortero técnico de juntas modificado con resinas, clasificación CG2 WA, alta resistencia.",
        "quantity": 0.15,
        "unit": "kg",
        "price_unit": 1.50,
        "price": 0.23,
        "is_variable": false
      },
      {
        "code": "%",
        "description": "Medios auxiliares",
        "quantity": 7.00,
        "unit": "%",
        "price_unit": 197.03,
        "price": 13.79,
        "is_variable": false
      }
    ]
  }
];

export default function VisorPartidasPage() {
    const [selectedItem, setSelectedItem] = useState(data[0]);

    // Keep active styling updated if component reloads with new data
    useEffect(() => {
        const freshItem = data.find(i => i.code === selectedItem.code);
        if (freshItem) {
            setSelectedItem(freshItem);
        }
    }, []);

    return (
        <div className="flex bg-gray-50 font-sans text-gray-800" style={{ minHeight: "calc(100vh - 64px)" }}>
            {/* Sidebar */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-y-auto hidden md:flex h-screen sticky top-0">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catálogo Temporal</h2>
                    <h1 className="text-lg font-semibold text-gray-800 mt-1">Partidas Gran Formato</h1>
                </div>
                <div className="flex-1">
                    {data.map((item) => (
                        <div 
                            key={item.code}
                            onClick={() => setSelectedItem(item)}
                            className={`p-5 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50
                            ${selectedItem.code === item.code ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="text-[11px] font-semibold text-gray-500 mb-1">{item.code}</div>
                            <div className="text-sm text-gray-700 line-clamp-2 leading-snug">{item.section}</div>
                            <div className="text-base font-medium text-gray-900 mt-2">
                                {formatNumber(item.priceTotal)} € <span className="text-xs font-normal text-gray-400">/{item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto flex justify-center items-start">
                <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 w-full max-w-4xl p-6 md:p-10 relative">
                    <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="mb-4 pr-10">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                            {selectedItem.code} &bull; {selectedItem.chapter.toUpperCase()} / {selectedItem.section.toUpperCase()}
                        </span>
                    </div>

                    <div className="mb-6 flex items-baseline">
                        <span className="text-3xl md:text-5xl font-light text-gray-900 tracking-tight">
                            {formatNumber(selectedItem.priceTotal)} €
                        </span>
                        <span className="ml-2 text-base md:text-xl text-gray-400">/ {selectedItem.unit}</span>
                    </div>

                    <div className="text-gray-500 text-sm leading-relaxed mb-10">
                        {selectedItem.description}
                    </div>

                    <hr className="border-gray-100 mb-8" />

                    <div className="mb-5">
                        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">COST BREAKDOWN</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase border-b border-gray-200">
                                    <th className="pb-3 px-2 w-[18%]">CODE</th>
                                    <th className="pb-3 px-2 w-[52%]">DESCRIPTION</th>
                                    <th className="pb-3 px-2 text-right w-[10%]">QTY</th>
                                    <th className="pb-3 px-2 text-right w-[10%]">PRICE</th>
                                    <th className="pb-3 px-2 text-right w-[10%]">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedItem.breakdown.map((b, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
                                        <td className="py-3 px-2 text-[13px] font-mono font-medium text-[#eab308] whitespace-nowrap">{b.code}</td>
                                        <td className="py-3 px-2 text-[13px] text-gray-600 leading-snug pr-4">{b.description}</td>
                                        <td className="py-3 px-2 text-[13px] text-gray-600 text-right font-mono whitespace-nowrap">
                                            {formatNumber(b.quantity, 3)} {b.unit}
                                        </td>
                                        <td className="py-3 px-2 text-[13px] text-gray-600 text-right font-mono whitespace-nowrap">
                                            {formatNumber(b.price_unit, 2)} €
                                        </td>
                                        <td className="py-3 px-2 text-[13px] text-gray-900 font-bold text-right font-mono whitespace-nowrap">
                                            {formatNumber(b.price, 2)} €
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
