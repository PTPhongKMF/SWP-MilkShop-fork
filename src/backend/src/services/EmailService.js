import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import { readFile } from 'fs/promises';
import path from 'path';
import { vndPriceFormat } from '../utils/generalFormatting.js';

dotenv.config();

export class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });
    }

    async sendResetPasswordEmail(email, token, req) {
        const url = `${req.protocol}://${req.get('host')}/api/reset-password?token=${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="text-align: center; color: #333;">Reset Your Password</h2>
                    <p style="font-size: 16px; color: #333;">You requested to reset your password. Click the button below to confirm the password reset:</p>
                    <div style="text-align: center;">
                        <a href="${url}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Password Reset</a>
                    </div>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Email sent: ${info.response}`);
        } catch (error) {
            console.error(`Error sending email: ${error}`);
            throw error; // Throw the error to be caught in the service method
        }
    }
    async sendVerificationEmail(email, token, userId, phone, req) {
        const url = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="text-align: center; color: #333;">Welcome to Milk Shop!</h2>
                    <p style="font-size: 16px; color: #333;">Thank you for registering. Please verify your email by clicking the button below:</p>
                    <div style="text-align: center;">
                        <a href="${url}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
                    </div>
                    <p style="font-size: 16px; color: #333;">Your details:</p>
                    <ul style="font-size: 16px; color: #333;">
                        <li>UserID: ${userId}</li>
                        <li>Phone: ${phone}</li>
                        <li>Email: ${email}</li>
                    </ul>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Verification email sent: ${info.response}`);
        } catch (error) {
            console.error(`Error sending verification email: ${error}`);
            throw error;
        }
    }

    async sendOrderConfirmationEmail(email, orderId, cartItems, initialTotalPrice, totalPrice, vouchers, contactInfo) {
        // const itemsDetails = cartItems.map(item => `
        //     <tr>
        //         <td style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif; color: #444;">${item.ProductID}</td>
        //         <td style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif; color: #444;">${item.ProductName}</td>
        //         <td style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif; color: #444;">${item.CartQuantity}</td>
        //         <td style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif; color: #444;">${item.Price}</td>
        //     </tr>`).join('');

        // const userDetails = `
        //     <p style="font-size: 16px; color: #007bff; margin: 5px 0; font-family: 'Courier New', Courier, monospace;">Name: ${contactInfo.Name}</p>
        //     <p style="font-size: 16px; color: #007bff; margin: 5px 0; font-family: 'Courier New', Courier, monospace;">Email: ${contactInfo.Email}</p>
        //     <p style="font-size: 16px; color: #007bff; margin: 5px 0; font-family: 'Courier New', Courier, monospace;">Phone: ${contactInfo.Phone}</p>
        //     <p style="font-size: 16px; color: #007bff; margin: 5px 0; font-family: 'Courier New', Courier, monospace;">Address: ${contactInfo.Address}</p>`;

        // const voucherDetails = vouchers.map(voucher => `
        //     <tr>
        //         <td style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif; color: #444;">${voucher.VoucherID}</td>
        //         <td style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif; color: #444;">${voucher.Discount}</td>
        //         <td style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif; color: #444;">${voucher.Content}</td>
        //     </tr>`).join('');

        // const mailOptions = {
        //     from: process.env.EMAIL_USER,
        //     to: email,
        //     subject: 'Order Confirmation',
        //     html: `
        //         <div style="font-family: 'Verdana', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 2px solid #f8f9fa; border-radius: 10px; background-color: #f1f1f1;">
        //             <h2 style="text-align: center; color: #e67e22; font-family: 'Georgia', serif;">Thank You for Your Order!</h2>
        //             <p style="font-size: 18px; color: #333; font-family: 'Times New Roman', Times, serif;">Here are the details of your order:</p>
        //             <p style="font-size: 18px; color: #333; font-family: 'Times New Roman', Times, serif;">Order ID: <span style="color: #e74c3c;">${orderId}</span></p>
        //             ${userDetails}
        //             <p style="font-size: 18px; color: #333; font-family: 'Times New Roman', Times, serif;">Items:</p>
        //             <table style="width: 100%; border-collapse: collapse;">
        //                 <thead>
        //                     <tr style="background-color: #3498db; color: white;">
        //                         <th style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif;">Product ID</th>
        //                         <th style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif;">Product Name</th>
        //                         <th style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif;">Quantity</th>
        //                         <th style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif;">Price</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     ${itemsDetails}
        //                 </tbody>
        //             </table>
        //             <p style="font-size: 18px; color: #333; font-family: 'Times New Roman', Times, serif; margin-top: 20px;">Initial Total Price: <span style="color: #27ae60;">${initialTotalPrice}</span></p>
        //             <p style="font-size: 18px; color: #333; font-family: 'Times New Roman', Times, serif; margin-top: 20px;">Total Price after Discounts: <span style="color: #27ae60;">${totalPrice}</span></p>
        //             <p style="font-size: 18px; color: #333; font-family: 'Times New Roman', Times, serif;">Vouchers Used:</p>
        //             <table style="width: 100%; border-collapse: collapse;">
        //                 <thead>
        //                     <tr style="background-color: #3498db; color: white;">
        //                         <th style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif;">Voucher ID</th>
        //                         <th style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif;">Discount</th>
        //                         <th style="padding: 10px; border: 1px solid #ddd; font-family: 'Arial', sans-serif;">Content</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     ${voucherDetails}
        //                 </tbody>
        //             </table>
        //         </div>
        //     `
        // };

        cartItems.map(item => {
            item.Price = vndPriceFormat(item.Price);
        });
        initialTotalPrice = initialTotalPrice ? vndPriceFormat(initialTotalPrice) : null;
        totalPrice = totalPrice ? vndPriceFormat(totalPrice) : null;

        const templatePath = path.join(process.cwd(), 'src', 'services', 'emailTemplates', `orderTemplate.ejs`);
        const template = await readFile(templatePath, 'utf-8');
        const html = ejs.render(template, { email, orderId, cartItems, initialTotalPrice, totalPrice, vouchers, contactInfo });

        const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Order Confirmation',
                html: html
        }

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Order confirmation email sent: ${info.response}`);
        } catch (error) {
            console.error(`Error sending order confirmation email: ${error}`);
        }
    }

    async sendPreorderConfirmationEmail(preorderId, product, totalPrice, user) {
        product.price = product.price ? vndPriceFormat(product.price) : null;
        totalPrice = totalPrice ? vndPriceFormat(totalPrice) : null;

        const templatePath = path.join(process.cwd(), 'src', 'services', 'emailTemplates', `preorderTemplate.ejs`);
        const template = await readFile(templatePath, 'utf-8');
        const html = ejs.render(template, { preorderId, product, totalPrice, user });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: `${user.email}`,
            subject: 'Pre-order Confirmation',
            html: html
        }

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Order confirmation email sent: ${info.response}`);
        } catch (error) {
            console.error(`Error sending order confirmation email: ${error}`);
        }
    }
}
