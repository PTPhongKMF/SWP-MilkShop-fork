import React from "react";
import "./SidebarAdmin.css";
function SidebarAdmin() {
  return (
    <div className="sidebar">
      <h1>Admin</h1>
      <div className="sidebar-content">
        <div>
          <a href="/Admin/StaffManagement">Staff</a>
        </div>
        <div>
          <a href="/Admin/MemberManagement">Member</a>
        </div>
        <div>
          <a href="/Admin/ProductManagement">Diagram</a>
        </div>
      </div>
    </div>
  );
}

export default SidebarAdmin;