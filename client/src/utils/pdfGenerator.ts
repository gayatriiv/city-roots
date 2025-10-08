import jsPDF from 'jspdf';

export interface InvoiceData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentId: string;
}

export const generateInvoicePDF = (data: InvoiceData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = [34, 197, 94]; // Green color
  const textColor = [55, 65, 81]; // Gray-700
  const lightGray = [243, 244, 246]; // Gray-100
  
  let yPosition = 20;
  
  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Company Logo/Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('City Roots', 20, 25);
  
  // Invoice Title
  doc.setFontSize(18);
  doc.text('INVOICE', pageWidth - 60, 25);
  
  // Invoice Number and Date
  doc.setFontSize(10);
  doc.text(`Invoice #: ${data.orderNumber}`, pageWidth - 60, 32);
  doc.text(`Date: ${data.orderDate}`, pageWidth - 60, 37);
  
  yPosition = 60;
  
  // Customer Information
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.customerName, 20, yPosition);
  yPosition += 5;
  doc.text(data.customerPhone, 20, yPosition);
  if (data.customerEmail) {
    yPosition += 5;
    doc.text(data.customerEmail, 20, yPosition);
  }
  
  // Shipping Address
  yPosition += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Ship To:', 20, yPosition);
  
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.text(data.address.fullName, 20, yPosition);
  yPosition += 5;
  doc.text(data.address.addressLine1, 20, yPosition);
  if (data.address.addressLine2) {
    yPosition += 5;
    doc.text(data.address.addressLine2, 20, yPosition);
  }
  yPosition += 5;
  doc.text(`${data.address.city}, ${data.address.state} ${data.address.postalCode}`, 20, yPosition);
  yPosition += 5;
  doc.text(data.address.country, 20, yPosition);
  
  yPosition += 20;
  
  // Items Table Header
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(20, yPosition, pageWidth - 40, 12, 'F');
  
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 25, yPosition + 8);
  doc.text('Qty', 100, yPosition + 8);
  doc.text('Price', 130, yPosition + 8);
  doc.text('Total', 170, yPosition + 8);
  
  yPosition += 15;
  
  // Items
  doc.setFont('helvetica', 'normal');
  data.items.forEach((item, index) => {
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(item.name, 25, yPosition);
    doc.text(item.quantity.toString(), 100, yPosition);
    doc.text(`₹${item.price.toFixed(2)}`, 130, yPosition);
    doc.text(`₹${item.total.toFixed(2)}`, 170, yPosition);
    
    yPosition += 8;
    
    // Add line separator
    if (index < data.items.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 5;
    }
  });
  
  yPosition += 15;
  
  // Totals
  const totalsX = pageWidth - 80;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, yPosition);
  doc.text(`₹${data.subtotal.toFixed(2)}`, totalsX + 40, yPosition);
  yPosition += 8;
  
  doc.text('Tax:', totalsX, yPosition);
  doc.text(`₹${data.tax.toFixed(2)}`, totalsX + 40, yPosition);
  yPosition += 8;
  
  doc.text('Shipping:', totalsX, yPosition);
  doc.text(`₹${data.shipping.toFixed(2)}`, totalsX + 40, yPosition);
  yPosition += 8;
  
  // Total line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.line(totalsX, yPosition - 2, totalsX + 50, yPosition - 2);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', totalsX, yPosition + 5);
  doc.text(`₹${data.total.toFixed(2)}`, totalsX + 40, yPosition + 5);
  
  yPosition += 25;
  
  // Payment Information
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Payment Method: ${data.paymentMethod}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Transaction ID: ${data.paymentId}`, 20, yPosition);
  
  // Footer
  const footerY = pageHeight - 20;
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });
  doc.text('City Roots - Premium Plants & Gardening Supplies', pageWidth / 2, footerY + 5, { align: 'center' });
  
  // Download the PDF
  doc.save(`invoice-${data.orderNumber}.pdf`);
};
