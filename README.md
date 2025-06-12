# 🏥 HospiSync – Smart Hospital Coordination System

**HospiSync** is a modular, real-time hospital coordination prototype designed to improve patient flow, enhance staff coordination, and streamline emergency and inventory systems within a hospital setting.

## 👨‍⚕️ Project Team
- **Developer:** Vivek Shre  
- **Institution:** Canara Engineering College  
- **Department:** Computer Science and Engineering (3rd Year)

---

## 🚀 Project Overview

HospiSync integrates multiple critical systems into a unified hospital dashboard and smart display infrastructure:

### 🔹 1. Token Management System
- Auto-generates tokens in sequence (`A0` to `Z9`, then `AA0`...).
- Doctors and staff can update token statuses: `waiting`, `called`, `in_progress`, `completed`.
- Department transfer logic and token completion support.
- Token display system for each department using smart TVs.

### 🔹 2. Inventory Sync & TV Display
- Live inventory view for medicines and equipment, showing item names, quantity, and units.
- Stock status monitored continuously and broadcast to display.
- Reorder alerts triggered when stock falls below a threshold.
- Inventory logs record both **consume** and **restock** events.
  - Future integration: map logs to doctor/staff ID for accountability.
- Accessible displays for pharmacy and staff to view real-time availability.

### 🔹 3. Emergency Code Alert System
- Dedicated alert buttons: Code Blue, Code Red, Code Green, Code Orange.
- Broadcasts visual + audio alerts across all smart displays.
- Overlay system draws attention in emergencies with auto-clear support.

---

## 🛡️ Role-Based Access Control

- **Admin:** Creates users and assigns them roles.
- **Doctor:** Manages patient tokens, updates status, changes department.
- **Staff:** Handles inventory consumption/restocking and emergency alerts.

---

## 🛠️ Tech Stack

| Component        | Stack Used                            |
|------------------|----------------------------------------|
| **Dashboard**    | React.js, Tailwind CSS, Express.js, PostgreSQL |
| **Smart Display**| Vanilla JavaScript, WebSockets, PostgreSQL |
| **Utilities**    | NodeCron, HTML5 Audio API              |

---

## 📦 Folder Structure

