# Supply Chain Management DApp

A decentralized application (DApp) built on the Internet Computer (ICP) that provides a transparent and secure supply chain tracking system. This DApp enables product tracking from manufacturer to customer through a complete supply chain workflow.

## 🌟 Features

### **Authentication & User Management**
- **Internet Identity Integration**: Secure authentication using ICP's Internet Identity
- **Role-based Access**: Four distinct roles with specific capabilities
- **User Registration**: Complete user profile setup with role assignment

### **Supply Chain Roles**

#### **Manufacturer**
- Create new products with detailed information
- Transfer products to distributors
- View product history and tracking
- Manage product inventory

#### **Distributor**
- Receive products from manufacturers
- Transfer products to retailers
- View product history and tracking
- Manage distribution inventory

#### **Retailer**
- Receive products from distributors
- Sell products to customers
- View product history and tracking
- Manage retail inventory

#### **Customer**
- Browse available products
- Purchase products from retailers
- View product history and tracking
- Track purchased products

### **Product Management**
- **Product Creation**: Manufacturers can create products with detailed information
- **Product Transfer**: Secure transfer between supply chain parties
- **Product Tracking**: Complete audit trail of product movement
- **Event Logging**: Every action is logged with timestamps and user information

### **Security & Transparency**
- **On-chain Storage**: All data stored securely on Internet Computer
- **Immutable Audit Trail**: Complete history of product movements
- **Role-based Permissions**: Strict access control based on user roles
- **Principal-based Authentication**: Secure user identification

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- DFX (Internet Computer SDK)
- Internet Identity setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ICP-DAPP
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd src/my_dapp_frontend
   npm install
   ```

3. **Start local development**
   ```bash
   dfx start --background
   dfx deploy
   ```

4. **Start frontend development server**
   ```bash
   cd src/my_dapp_frontend
   npm run dev
   ```

5. **Access the application**
   - Open your browser to `http://localhost:5173`
   - Use Internet Identity to authenticate
   - Register as a user with your preferred role

## 🏗️ Architecture

### **Technology Stack**
- **Frontend**: React + TypeScript + Vite
- **Backend**: Rust (Internet Computer Canisters)
- **Interface**: Candid
- **Storage**: Internet Computer (on-chain)
- **Authentication**: Internet Identity

### **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Storage       │
│   (React)       │◄──►│   (Rust)        │◄──►│   (ICP)         │
│                 │    │                 │    │                 │
│ - User Interface│    │ - Product Mgmt  │    │ - Product Data  │
│ - Product Mgmt  │    │ - User Mgmt     │    │ - User Data     │
│ - Tracking      │    │ - Tracking      │    │ - Event Data    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Data Flow

### **Complete Supply Chain Journey**
1. **Manufacturer** creates product → Event logged
2. **Manufacturer** transfers to **Distributor** → Event logged
3. **Distributor** transfers to **Retailer** → Event logged
4. **Retailer** sells to **Customer** → Event logged

### **Event Tracking**
Every product movement is logged with:
- Product ID
- Event type (Created, Transferred, Sold)
- From user (Principal ID)
- To user (Principal ID)
- Description
- Timestamp

## 🔧 Development

### **Project Structure**
```
ICP-DAPP/
├── dfx.json                    # DFX configuration
├── src/
│   ├── my_dapp_backend/        # Rust Backend
│   │   ├── my_dapp_backend.did # Candid interface
│   │   └── src/lib.rs          # Main backend logic
│   ├── my_dapp_frontend/       # React Frontend
│   │   ├── src/
│   │   │   ├── App.tsx         # Main app component
│   │   │   ├── contexts/       # Authentication context
│   │   │   ├── services/       # Backend communication
│   │   │   └── components/     # UI components
│   │   └── package.json
│   └── shared/types/           # Shared TypeScript types
└── README.md
```

### **Key Files**
- `src/my_dapp_backend/src/lib.rs` - Backend logic and data structures
- `src/my_dapp_frontend/src/contexts/AuthContext.tsx` - Authentication management
- `src/my_dapp_frontend/src/services/backendService.ts` - Backend communication
- `src/my_dapp_frontend/src/components/` - UI components

## 🚀 Deployment

### **Local Development**
```bash
dfx start --background
dfx deploy
```

### **Mainnet Deployment**
```bash
dfx deploy --network ic
```

## 📝 API Endpoints

### **User Management**
- `register_user(name, role, email, company)` - Register new user
- `get_current_user()` - Get authenticated user
- `update_user_role(role)` - Update user role

### **Product Management**
- `create_product(name, description, price, quantity, category)` - Create product
- `transfer_product(product_id, to_user, description)` - Transfer product
- `sell_product(product_id, customer, price, quantity, description)` - Sell product

### **Query Functions**
- `get_all_products()` - Get all products
- `get_product(product_id)` - Get specific product
- `get_product_events(product_id)` - Get product tracking history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the SRS.md file for detailed specifications

---

**Built with ❤️ on Internet Computer**
