import React, { useRef, useState, useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import logo from '../../assets/logo.jpg';

const BillGenerator = ({ calculations, formData, product, customerInfo, onClose }) => {
    const printRef = useRef();
    const [logoBase64, setLogoBase64] = useState('');

    // Convert logo to base64 for reliable printing
    useEffect(() => {
        const convertToBase64 = async () => {
            try {
                const response = await fetch(logo);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoBase64(reader.result);
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.error("Error converting logo to base64:", error);
                // Fallback to direct path if fetch fails
                setLogoBase64(logo);
            }
        };
        convertToBase64();
    }, []);

    // Generate bill number with timestamp
    const generateBillNumber = () => {
        const date = new Date();
        const timestamp = date.getTime().toString().slice(-6);
        return `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${timestamp}`;
    };

    const billNumber = generateBillNumber();
    const currentDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const handlePrint = () => {
        const printContent = printRef.current;
        const WindowPrint = window.open('', '', 'width=900,height=650');
        WindowPrint.document.write(printContent.innerHTML);
        WindowPrint.document.close();
        WindowPrint.focus();
        // Allow images to load before printing
        setTimeout(() => {
            WindowPrint.print();
            WindowPrint.close();
        }, 500);
    };

    // Bill content component - OPTIMIZED FOR SINGLE PAGE
    const BillContent = () => (
        <div style={{ padding: '20px', maxWidth: '750px', margin: '0 auto', fontSize: '10px', lineHeight: '1.3' }}>
            {/* Header with Logo */}
            <div style={{ borderBottom: '3px solid #2563eb', paddingBottom: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    {/* Use base64 logo if available, otherwise fall back to imported logo */}
                    <img
                        src={logoBase64 || logo}
                        alt="Athanuramman Fencing"
                        style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                    />
                    <div>
                        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0, lineHeight: '1.2' }}>Athanuramman Fencing</h1>
                        <p style={{ fontSize: '9px', color: '#6b7280', margin: '2px 0' }}>Professional Fencing Solutions</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '9px' }}>
                    <div>
                        <p style={{ fontWeight: '600', color: '#111827', margin: '0 0 2px 0' }}>Office 1:</p>
                        <p style={{ color: '#374151', margin: '1px 0' }}>17/295, Othakkadai, Sakthipalayam (Post)</p>
                        <p style={{ color: '#374151', margin: '1px 0' }}>Tirchy Road, VELLAKOVIL - 638 111, Tirupur Dist.</p>
                    </div>
                    <div>
                        <p style={{ fontWeight: '600', color: '#111827', margin: '0 0 2px 0' }}>Office 2:</p>
                        <p style={{ color: '#374151', margin: '1px 0' }}>IBP Bunk Near, Kovai Road, KANGAYAM - 638 701</p>
                        <p style={{ color: '#374151', margin: '2px 0 0 0' }}><span style={{ fontWeight: '600' }}>Ph:</span> 94426 20912, 73736 78796</p>
                    </div>
                </div>
            </div>

            {/* Invoice Title and Details */}
            <div style={{ marginBottom: '8px' }}>
                <div style={{ marginBottom: '6px' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 2px 0' }}>INVOICE</h2>
                    <p style={{ fontSize: '10px', color: '#6b7280', margin: '1px 0' }}>Bill No: <span style={{ fontWeight: '600', color: '#111827' }}>{billNumber}</span> | Date: <span style={{ fontWeight: '600', color: '#111827' }}>{currentDate}</span></p>
                </div>

                {/* Bill To */}
                <div style={{ background: '#f9fafb', padding: '6px', borderRadius: '4px', marginBottom: '6px' }}>
                    <p style={{ fontSize: '9px', fontWeight: '600', color: '#374151', margin: '0 0 2px 0' }}>BILL TO:</p>
                    <p style={{ fontSize: '11px', color: '#111827', fontWeight: '600', margin: '1px 0' }}>{customerInfo.name}</p>
                    <p style={{ fontSize: '9px', color: '#374151', margin: '1px 0' }}>{customerInfo.email}</p>
                </div>

                {/* Project Details */}
                <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '4px', marginBottom: '6px' }}>
                    <p style={{ fontSize: '9px', fontWeight: '600', color: '#374151', margin: '0 0 4px 0' }}>PROJECT DETAILS:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '9px' }}>
                        <div>
                            <p style={{ color: '#6b7280', margin: 0 }}>Product: <span style={{ fontWeight: '600', color: '#111827' }}>{product.name}</span></p>
                        </div>
                        <div>
                            <p style={{ color: '#6b7280', margin: 0 }}>Area: <span style={{ fontWeight: '600', color: '#111827' }}>{calculations.area} sq ft</span></p>
                        </div>
                        <div>
                            <p style={{ color: '#6b7280', margin: 0 }}>Size: <span style={{ fontWeight: '600', color: '#111827' }}>{formData.length}×{formData.width}×{formData.height} ft</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Itemized Costs */}
            <div style={{ marginBottom: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #d1d5db' }}>
                            <th style={{ textAlign: 'left', padding: '4px 0', color: '#374151', fontWeight: '600' }}>Description</th>
                            <th style={{ textAlign: 'right', padding: '4px 0', color: '#374151', fontWeight: '600' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '4px 0', color: '#111827' }}>
                                Material Cost <span style={{ fontSize: '8px', color: '#6b7280' }}>({calculations.area} sq ft)</span>
                            </td>
                            <td style={{ textAlign: 'right', padding: '4px 0', color: '#111827', fontWeight: '600' }}>
                                ₹{parseFloat(calculations.materialCost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '4px 0', color: '#111827' }}>
                                Labor Cost <span style={{ fontSize: '8px', color: '#6b7280' }}>(Installation & Setup)</span>
                            </td>
                            <td style={{ textAlign: 'right', padding: '4px 0', color: '#111827', fontWeight: '600' }}>
                                ₹{parseFloat(calculations.laborCost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '4px 0', color: '#111827' }}>
                                Transportation <span style={{ fontSize: '8px', color: '#6b7280' }}>(Delivery & Logistics)</span>
                            </td>
                            <td style={{ textAlign: 'right', padding: '4px 0', color: '#111827', fontWeight: '600' }}>
                                ₹{parseFloat(calculations.transportCost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                        </tr>
                        <tr style={{ borderTop: '2px solid #d1d5db', background: '#eff6ff' }}>
                            <td style={{ padding: '6px 4px', color: '#111827', fontWeight: 'bold', fontSize: '12px' }}>TOTAL ESTIMATE</td>
                            <td style={{ textAlign: 'right', padding: '6px 4px', color: '#2563eb', fontWeight: 'bold', fontSize: '14px' }}>
                                {parseFloat(calculations.grandTotal) > 0
                                    ? `₹${parseFloat(calculations.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : 'QUOTATION PENDING'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Amount in Words */}
            <div style={{ marginBottom: '8px', padding: '6px', background: '#f9fafb', borderRadius: '4px' }}>
                <p style={{ fontSize: '9px', color: '#374151', margin: 0 }}>
                    <span style={{ fontWeight: '600' }}>Amount Status:</span> {parseFloat(calculations.grandTotal) > 0 ? `${numberToWords(parseFloat(calculations.grandTotal))} Rupees Only` : 'Awaiting Administrative Valuation Audit'}
                </p>
            </div>

            {/* Terms and Conditions */}
            <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '8px', marginTop: '8px' }}>
                <h3 style={{ fontWeight: '600', color: '#111827', margin: '0 0 4px 0', fontSize: '10px' }}>Terms & Conditions:</h3>
                <ul style={{ fontSize: '8px', color: '#374151', listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.4' }}>
                    <li style={{ marginBottom: '2px' }}>• Payment: 50% advance, 50% on completion | Warranty: 1 year on materials & workmanship</li>
                    <li style={{ marginBottom: '2px' }}>• Installation timeline: As per project scope | Computer-generated estimate, subject to site inspection</li>
                </ul>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                <p style={{ fontSize: '10px', color: '#6b7280', fontWeight: '600', margin: '2px 0' }}>Thank you for choosing Athanuramman Fencing!</p>
                <p style={{ fontSize: '9px', color: '#9ca3af', margin: '2px 0' }}>For queries, contact us at the numbers above</p>
            </div>
        </div>
    );

    return (
        <>
            {/* Hidden print content */}
            <div ref={printRef} style={{ display: 'none' }}>
                <BillContent />
            </div>

            {/* Modal Display */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Action Button */}
                    <div className="absolute top-4 left-4 z-10">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            <Printer className="w-4 h-4" />
                            Print / PDF
                        </button>
                    </div>

                    {/* Bill Preview */}
                    <BillContent />
                </div>
            </div>
        </>
    );
};

// Helper function to convert number to words (simplified for Indian numbering)
const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';

    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = Math.floor((num % 1000) / 100);
    const remainder = Math.floor(num % 100);

    let words = '';

    if (crore > 0) words += convertTwoDigit(crore) + ' Crore ';
    if (lakh > 0) words += convertTwoDigit(lakh) + ' Lakh ';
    if (thousand > 0) words += convertTwoDigit(thousand) + ' Thousand ';
    if (hundred > 0) words += ones[hundred] + ' Hundred ';
    if (remainder > 0) words += convertTwoDigit(remainder);

    return words.trim();

    function convertTwoDigit(n) {
        if (n < 10) return ones[n];
        if (n >= 10 && n < 20) return teens[n - 10];
        return tens[Math.floor(n / 10)] + ' ' + ones[n % 10];
    }
};

export default BillGenerator;
