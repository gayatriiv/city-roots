import * as nodemailer from 'nodemailer';
import { emailConfig, EMAIL_PROVIDER, emailSettings } from '../config/emailConfig';

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

interface AddressData {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderData {
  orderId: string;
  cartItems: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentData?: {
    paymentId: string;
    paymentMethod: string;
    orderNumber: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  createdAt: Date;
}

// Create email transporter based on configuration
const createTransporter = () => {
  const config = emailConfig[EMAIL_PROVIDER as keyof typeof emailConfig];
  return nodemailer.createTransport(config);
};

export const sendOrderConfirmationEmail = async (order: Order, orderData: any) => {
  try {
    // Extract customer data from orderData
    const customerData = orderData.customerData;
    const addressData = orderData.addressData;

    const orderItems = orderData.cartItems || [];
    const subtotal = orderData.subtotal || 0;
    const tax = orderData.tax || 0;
    const shipping = orderData.shipping || 0;
    const total = orderData.total || order.total;

    // Generate HTML email template
    const htmlContent = generateOrderConfirmationHTML({
      orderNumber: order.orderNumber,
      orderDate: order.createdAt ? order.createdAt.toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      address: addressData,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod: orderData.paymentData?.paymentMethod || 'Razorpay',
      paymentId: orderData.paymentData?.paymentId || 'N/A'
    });

    // Log email details for debugging
    console.log('\n📧 SENDING ORDER CONFIRMATION EMAIL:');
    console.log('=====================================');
    console.log(`To: ${customerData.email}`);
    console.log(`Subject: Order Confirmation - ${order.orderNumber} | City Roots`);
    console.log(`Order Number: ${order.orderNumber}`);
    console.log(`Customer: ${customerData.name}`);
    console.log(`Total: ₹${total.toFixed(2)}`);
    console.log(`Items: ${orderItems.length} items`);
    console.log('=====================================\n');

    // Send real email
    const transporter = createTransporter();
    const mailOptions = {
      from: emailSettings.from,
      to: customerData.email,
      replyTo: emailSettings.replyTo,
      subject: `Order Confirmation - ${order.orderNumber} | City Roots`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const generateOrderConfirmationHTML = (data: {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: AddressData;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentId: string;
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - City Roots</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #22c55e;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #22c55e;
                margin-bottom: 10px;
            }
            .order-number {
                background: #22c55e;
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                display: inline-block;
                font-weight: bold;
            }
            .section {
                margin-bottom: 25px;
            }
            .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #22c55e;
                margin-bottom: 10px;
                border-left: 4px solid #22c55e;
                padding-left: 10px;
            }
            .customer-info, .address-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 15px;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .items-table th, .items-table td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            .items-table th {
                background-color: #22c55e;
                color: white;
            }
            .items-table tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            .total-section {
                background: #f0f9ff;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #22c55e;
            }
            .total-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            .total-final {
                font-size: 20px;
                font-weight: bold;
                color: #22c55e;
                border-top: 2px solid #22c55e;
                padding-top: 10px;
                margin-top: 10px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #666;
            }
            .contact-info {
                background: #e7f5e7;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🌱 City Roots</div>
                <p>Premium Plants & Gardening Supplies</p>
                <div class="order-number">Order #${data.orderNumber}</div>
            </div>

            <div class="section">
                <div class="section-title">✅ Order Confirmed!</div>
                <p>Dear ${data.customerName},</p>
                <p>Thank you for your order! We've received your payment and your order is being processed. Here are your order details:</p>
                <p><strong>Order Date:</strong> ${data.orderDate}</p>
            </div>

            <div class="section">
                <div class="section-title">👤 Customer Information</div>
                <div class="customer-info">
                    <p><strong>Name:</strong> ${data.customerName}</p>
                    <p><strong>Email:</strong> ${data.customerEmail}</p>
                    <p><strong>Phone:</strong> ${data.customerPhone}</p>
                </div>
            </div>

            <div class="section">
                <div class="section-title">📍 Delivery Address</div>
                <div class="address-info">
                    <p><strong>${data.address.fullName}</strong></p>
                    <p>${data.address.addressLine1}</p>
                    ${data.address.addressLine2 ? `<p>${data.address.addressLine2}</p>` : ''}
                    <p>${data.address.city}, ${data.address.state} ${data.address.postalCode}</p>
                    <p>${data.address.country}</p>
                </div>
            </div>

            <div class="section">
                <div class="section-title">🛒 Order Items</div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.items.map(item => `
                            <tr>
                                <td>${item.product?.name || 'Product Name Not Available'}</td>
                                <td>${item.quantity || 1}</td>
                                <td>₹${(item.product?.price || 0).toFixed(2)}</td>
                                <td>₹${((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="total-section">
                <div class="section-title">💰 Order Summary</div>
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>₹${data.subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Tax (18% GST):</span>
                    <span>₹${data.tax.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Shipping:</span>
                    <span>₹${data.shipping.toFixed(2)}</span>
                </div>
                <div class="total-row total-final">
                    <span>Total Amount:</span>
                    <span>₹${data.total.toFixed(2)}</span>
                </div>
                <div style="margin-top: 15px;">
                    <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                    <p><strong>Payment ID:</strong> ${data.paymentId}</p>
                </div>
            </div>

            <div class="section">
                <div class="section-title">📦 What's Next?</div>
                <ul>
                    <li>Your order is being prepared for shipment</li>
                    <li>You'll receive a tracking number once your order ships</li>
                    <li>Expected delivery: 2-5 business days</li>
                    <li>You can track your order using order number: <strong>${data.orderNumber}</strong></li>
                </ul>
            </div>

            <div class="contact-info">
                <div class="section-title">📞 Need Help?</div>
                <p>If you have any questions about your order, please contact us:</p>
                <p><strong>Phone:</strong> +91 12345XXXX</p>
                <p><strong>Email:</strong> help@cityroots.com</p>
                <p><strong>Order Number:</strong> ${data.orderNumber} (Please include this in your inquiry)</p>
            </div>

            <div class="footer">
                <p>Thank you for choosing City Roots! 🌱</p>
                <p>Visit us at <a href="https://cityroots.com">cityroots.com</a></p>
                <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Function to send email via Firebase Cloud Functions (alternative approach)
export const sendEmailViaFirebaseFunction = async (orderData: any) => {
  try {
    // This would call a Firebase Cloud Function
    const response = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error('Failed to send email via Firebase function');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending email via Firebase function:', error);
    throw error;
  }
};
