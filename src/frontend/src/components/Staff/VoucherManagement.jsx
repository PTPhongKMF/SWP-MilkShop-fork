// src/OrderManagement.js

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./VoucherManagement.css";

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([
    {
      VoucherID: 1,
      Discount: "10%",
      Quantity: 100,
      Expiration: "2023-12-31",
      Content: "10% off on all products",
    },
    {
      VoucherID: 2,
      Discount: "20%",
      Quantity: 50,
      Expiration: "2024-01-15",
      Content: "20% off on orders over $50",
    },
    {
      VoucherID: 3,
      Discount: "15%",
      Quantity: 200,
      Expiration: "2024-06-30",
      Content: "15% off on selected items",
    },
  ]);

  return (
    <div className="order-management-container">
      <Sidebar />
      <div className="content">
        <div className="content-header">
          <h1>Voucher Management</h1>
          <header>
            <button className="staff-name">Staff Name</button>
          </header>
        </div>
        <div className="table-container">
          <div className="table-actions">
            <label>Search Voucher:</label>
            <input type="text" placeholder="Search" className="search-input" />
            <button className="searchProduct">Search</button>
            <button className="addOrder">Add Voucher</button>
          </div>

          <table className="issues-table">
            <thead>
              <tr>
                <th>VoucherID</th>
                <th>Discount</th>
                <th>Quantity</th>
                <th>Expiration</th>
                <th>Content</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher) => (
                <tr key={voucher.VoucherID}>
                  <td>{voucher.VoucherID}</td>
                  <td>{voucher.Discount}</td>
                  <td>{voucher.Quantity}</td>
                  <td>{voucher.Expiration}</td>
                  <td>{voucher.Content}</td>
                  <td className="deleteDiv">
                    <div className="delete">
                      <button className="delete-button">
                        <a href="#">Delete</a>
                      </button>
                    </div>
                  </td>
                  <td className="deleteDiv">
                    <div className="delete">
                      <button className="delete-button">
                        <a href="#">Update</a>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VoucherManagement;