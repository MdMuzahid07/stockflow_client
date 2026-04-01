# StockFlow Enterprise | Inventory Management System

StockFlow is a modern, professional, and minimalist inventory management system built with **Next.js 15** and **Tailwind CSS v4**. It features a premium UI/UX designed for operational efficiency, absolute clarity, and high-trust enterprise environments.

---

## 🚀 Key Features

### 📊 Dashboard Intelligence
- **System Overview**: High-level metrics for revenue, total orders, low-stock alerts, and daily completions.
- **Revenue Analytics**: Interactive trend charts powered by Recharts for data-driven decisions.
- **Real-time Activity**: Live audit trail of system actions and inventory events.

### 📦 Inventory & Products
- **Unified Catalog**: Comprehensive management of stock levels, pricing, and product metadata.
- **Cloudinary Integration**: Seamless image uploads with auto-optimization via Next.js `Image`.
- **Threshold Monitoring**: Automated "Low Stock" identification based on custom per-product thresholds.

### 🏷️ Category Management
- **Logical Organization**: Create and manage product categories for precise inventory sorting.
- **Filtering System**: Instant search and category-based filtering across all management modules.

### 🛒 Order Fulfillment
- **Manifest Creation**: Advanced order creation flow with dynamic line-items and real-time total calculation.
- **Stock Guard**: Intelligent validation to prevent overselling based on current warehouse availability.
- **Order Tracking**: Complete lifecycle management from `pending` to `delivered`.

### 🔄 Replenishment Queue
- **Restock Intelligence**: Dedicated queue for depleted items with priority-based sorting.
- **One-Click Restock**: Swift replenishment workflow to restore operational efficiency.

---

## 🛠️ Technical Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Design System**: OKLCH Color Model (Premium Blue Palette)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & RTK Query
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.stevenly.com/)

---

## 📐 Design Philosophy

StockFlow follows a strict **"Operation First"** design language:
- **Minimalist Core**: Every element earns its place. No unnecessary decorations.
- **Breathing Room**: Strategic use of whitespace to reduce cognitive load.
- **Typography Hierarchy**: Clear structure for high operational accuracy.
- **Premium OKLCH Colors**: High-contrast, accessibility-aware blue palette for a professional enterprise feel.

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18.x or higher
- Yarn or NPM

### Installation
1. Clone the repository and navigate to the `client` directory:
   ```bash
   cd StockFlow/client
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root of the client directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=your_backend_api_url
   ```

4. Launch Development Server:
   ```bash
   yarn dev
   ```

---

## 📂 Architecture

- `/src/app`: Next.js App Router for layouts and page routes.
- `/src/components`: Reusable UI components (Atomic design).
- `/src/redux`: Global state management and API service layers.
- `/src/lib`: Shared utilities and helper functions.
- `/public`: Static assets including branding and iconography.

---

## 🛡️ License

Built with precision for professional inventory mastery.
