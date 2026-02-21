'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333333'
    },
    header: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#E2E8F0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    logoSection: {
        width: '40%'
    },
    companyLogo: {
        height: 40,
        marginBottom: 10,
        objectFit: 'contain'
    },
    metaSection: {
        textAlign: 'right',
        fontSize: 8,
        color: '#64748B',
        lineHeight: 1.4
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 5,
        textTransform: 'uppercase'
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
        color: '#0F172A',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingBottom: 4,
        textTransform: 'uppercase'
    },
    bold: {
        fontWeight: 'bold',
        color: '#0F172A'
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginTop: 10,
        marginBottom: 20
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        alignItems: 'stretch',
        minHeight: 24,
    },
    colRef: { width: '10%', borderRightWidth: 1, borderColor: '#E2E8F0', padding: 5 },
    colDesc: { width: '45%', borderRightWidth: 1, borderColor: '#E2E8F0', padding: 5, flexDirection: 'column' },
    colUnit: { width: '15%', borderRightWidth: 1, borderColor: '#E2E8F0', padding: 5, textAlign: 'right' },
    colQty: { width: '12%', borderRightWidth: 1, borderColor: '#E2E8F0', padding: 5, textAlign: 'center' },
    colTotal: { width: '18%', padding: 5, textAlign: 'right' },
    tableHeader: {
        backgroundColor: '#F8FAFC',
        fontWeight: 'bold',
        fontSize: 8,
        color: '#475569'
    },
    totalSection: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        width: '40%'
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 4
    },
    totalLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#64748B'
    },
    totalValue: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#0F172A',
        textAlign: 'right'
    },
    finalTotal: {
        fontSize: 14,
        color: '#0F172A',
        fontWeight: 'bold',
        marginTop: 8,
        borderTopWidth: 1,
        borderColor: '#E2E8F0',
        paddingTop: 5
    },
    footerContainer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
    },
    footerLine: {
        borderTopWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 5
    },
    footerText: {
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 7,
    },
});

interface DemoBudgetDocumentProps {
    budgetNumber: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    items: any[];
    costBreakdown: any;
    date: string;
    logoUrl?: string;
}

const Footer = ({ pageNumber, companyName, cif, address }: { pageNumber: number, companyName?: string, cif?: string, address?: string }) => {
    const defaultCompany = 'Basis';
    const defaultCif = '';
    const defaultAddress = '';

    const companyPart = (companyName || defaultCompany) + (cif || defaultCif ? ` - CIF: ${cif || defaultCif}` : '');
    const addressPart = address || defaultAddress ? ` - ${address || defaultAddress}` : '';

    return (
        <View style={styles.footerContainer} fixed>
            <View style={styles.footerLine} />
            <Text style={styles.footerText}>
                {companyPart}{addressPart} {"\n"}
                Página {pageNumber}
            </Text>
        </View>
    );
};

const Header = ({ budgetNumber, date, logoUrl, companyName }: { budgetNumber: string, date: string, logoUrl?: string, companyName?: string }) => (
    <View style={styles.header}>
        <View style={styles.logoSection}>
            {logoUrl ? (
                <Image
                    src={logoUrl}
                    style={styles.companyLogo}
                />
            ) : (
                <Image
                    src="/images/logo-negro.png"
                    style={{ height: 32, marginBottom: 10, objectFit: 'contain' }}
                />
            )}
        </View>
        <View style={styles.metaSection}>
            <Text style={styles.bold}>PRESUPUESTO Nº {budgetNumber}</Text>
            <Text>Fecha: {date}</Text>
        </View>
    </View>
);

export const DemoBudgetDocument = ({
    budgetNumber,
    clientName,
    clientEmail,
    clientAddress,
    items,
    costBreakdown,
    date,
    logoUrl
}: DemoBudgetDocumentProps) => {

    const itemsByChapter = items.reduce((acc: Record<string, any[]>, item) => {
        const chapter = item.chapter || 'Partidas Generales';
        if (!acc[chapter]) acc[chapter] = [];
        acc[chapter].push(item);
        return acc;
    }, {});

    const chapters = Object.keys(itemsByChapter);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Header budgetNumber={budgetNumber} date={date} logoUrl={logoUrl} companyName={clientEmail} />

                <Text style={styles.title}>Propuesta Técnica y Económica</Text>

                <View style={{ marginBottom: 20, backgroundColor: '#F8FAFC', padding: 15, borderRadius: 8, marginTop: 10 }}>
                    <Text style={{ fontSize: 9, color: '#64748B', marginBottom: 6, textTransform: 'uppercase', fontWeight: 'bold' }}>Cliente / Ubicación</Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 }}>{clientName}</Text>
                    <Text style={{ fontSize: 10, color: '#475569' }}>{clientEmail}</Text>
                    <Text style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{clientAddress || 'Dirección de obra facilitada'}</Text>
                </View>

                <Text style={styles.sectionTitle}>Desglose Detallado de Partidas</Text>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <View style={styles.colRef}><Text>REF</Text></View>
                        <View style={styles.colDesc}><Text>CONCEPTO</Text></View>
                        <View style={styles.colUnit}><Text>P. UNIT</Text></View>
                        <View style={styles.colQty}><Text>CANT.</Text></View>
                        <View style={styles.colTotal}><Text>TOTAL</Text></View>
                    </View>

                    {chapters.map((chapterName) => (
                        <View key={chapterName}>
                            <View style={{ backgroundColor: '#F1F5F9', padding: 5, borderBottomWidth: 1, borderColor: '#E2E8F0' }}>
                                <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#334155' }}>{chapterName}</Text>
                            </View>
                            {itemsByChapter[chapterName].map((item: any, index: number) => (
                                <View style={styles.tableRow} key={item.id || index}>
                                    <View style={styles.colRef}><Text>{item.item?.code || '-'}</Text></View>
                                    <View style={styles.colDesc}>
                                        <Text style={styles.bold}>{item.originalTask}</Text>
                                        {(item.item?.description) && (
                                            <Text style={{ fontSize: 7, color: '#64748B', marginTop: 3 }}>{item.item?.description}</Text>
                                        )}
                                    </View>
                                    <View style={styles.colUnit}><Text>{(item.item?.unitPrice || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</Text></View>
                                    <View style={styles.colQty}><Text>{item.item?.quantity || 1} {item.item?.unit}</Text></View>
                                    <View style={styles.colTotal}><Text>{(item.item?.totalPrice || item.item?.price || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</Text></View>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                <View style={styles.totalSection} wrap={false}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>P.E.M.</Text>
                        <Text style={styles.totalValue}>{costBreakdown.materialExecutionPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>IVA (21%)</Text>
                        <Text style={styles.totalValue}>{costBreakdown.tax.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, styles.finalTotal]}>TOTAL</Text>
                        <Text style={[styles.totalValue, styles.finalTotal]}>{costBreakdown.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</Text>
                    </View>
                </View>

                <Footer pageNumber={1} companyName={clientEmail} cif={clientEmail ? "Generado por Basis" : undefined} address={clientEmail ? "Demostración Pública" : undefined} />
                <Footer pageNumber={2} companyName={clientEmail} cif={clientEmail ? "Generado por Basis" : undefined} address={clientEmail ? "Demostración Pública" : undefined} />
                <Footer pageNumber={3} companyName={clientEmail} cif={clientEmail ? "Generado por Basis" : undefined} address={clientEmail ? "Demostración Pública" : undefined} />
            </Page>
        </Document>
    );
};
