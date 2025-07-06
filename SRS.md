# Supply Chain Management DApp - Software Requirements Specification (SRS)

## **1. Project Overview**

### **1.1 Project Name**
Supply Chain Management DApp (SCM-DApp)

### **1.2 Project Description**
A decentralized application (DApp) built on the Internet Computer (ICP) that provides a simple, transparent, and secure supply chain management system. The MVP focuses on connecting manufacturers and customers through a streamlined ordering and tracking process.

### **1.3 Project Scope**
**MVP Version 1.0** - Simple supply chain management with basic product management, order processing, and tracking capabilities.

### **1.4 Target Users**
- **Manufacturers**: Create and manage products, supply to distributors
- **Distributors**: Purchase from manufacturers, supply to retailers
- **Retailers**: Purchase from distributors, sell to customers
- **Customers**: Browse products, place orders, track deliveries

---

## **2. System Architecture**

### **2.1 Technology Stack**
```
Frontend: React + TypeScript + Vite
Backend: Rust (Internet Computer Canisters)
Interface: Candid
Storage: Internet Computer (on-chain)
Authentication: Internet Identity
```

### **2.2 System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Storage       │
│   (React)       │◄──►│   (Rust)        │◄──►│   (ICP)         │
│                 │    │                 │    │                 │
│ - User Interface│    │ - Product Mgmt  │    │ - Product Data  │
│ - Order Mgmt    │    │ - Order Mgmt    │    │ - Order Data    │
│ - Tracking      │    │ - Tracking      │    │ - User Data     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **2.3 Canister Structure**
```
Single Canister Approach (MVP):
┌─────────────────────────────────────┐
│           SCM-Canister              │
│                                     │
│ ├── Product Management              │
│ ├── Order Management                │
│ ├── User Management                 │
│ ├── Tracking System                 │
│ └── Data Storage                    │
└─────────────────────────────────────┘
```

---

## **3. Functional Requirements**

### **3.1 User Management**
#### **3.1.1 User Registration**
- Users can register using Internet Identity
- System assigns user role (Manufacturer/Distributor/Retailer/Customer)
- Store basic user information

#### **3.1.2 User Authentication**
- Secure login using Internet Identity
- Role-based access control
- Session management

### **3.2 Product Management**
#### **3.2.1 Product Creation**
- Manufacturers can create new products
- Required fields: name, description, price
- Optional fields: category, specifications

#### **3.2.2 Product Listing**
- Display all available products
- Filter by manufacturer
- Search functionality

#### **3.2.3 Product Updates**
- Manufacturers can update their products
- Availability status management

### **3.3 Order Management**
#### **3.3.1 Order Creation**
- Customers can create orders
- Select products and quantities
- Calculate total amount
- Order validation

#### **3.3.2 Order Processing**
- Order status management
- Manufacturer notification
- Order fulfillment workflow

#### **3.3.3 Order History**
- View order history for customers
- View orders for manufacturers

### **3.4 Supply Chain Workflow**
#### **3.4.1 4-Level Supply Chain**
- **Level 1**: Manufacturer creates products
- **Level 2**: Distributor purchases from Manufacturer
- **Level 3**: Retailer purchases from Distributor  
- **Level 4**: Customer purchases from Retailer

#### **3.4.2 Order Types**
- **Manufacturer-Distributor Orders**: Bulk supply orders
- **Distributor-Retailer Orders**: Regional supply orders
- **Retailer-Customer Orders**: Final retail orders

### **3.5 Supply Chain Tracking**
#### **3.5.1 Order Tracking**
- Real-time order status updates across all levels
- Location tracking at each transfer point
- Status change notifications to all parties

#### **3.5.2 Event Logging**
- Log all supply chain events at each level
- Timestamp and actor information
- Complete chain of custody tracking

---

## **4. Data Models**

### **4.1 User Model**
```rust
struct User {
    id: Principal,
    name: String,
    email: String,
    role: UserRole,
    created_at: u64,
    is_active: bool
}

enum UserRole {
    Manufacturer,
    Distributor,
    Retailer,
    Customer
}
```

### **4.2 Product Model**
```rust
struct Product {
    id: String,
    name: String,
    description: String,
    price: f64,
    manufacturer: Principal,
    is_available: bool,
    created_at: u64
}
```

### **4.3 Order Model**
```rust
struct Order {
    id: String,
    customer: Principal,
    items: Vec<OrderItem>,
    total_amount: f64,
    status: OrderStatus,
    created_at: u64,
    updated_at: u64
}

struct OrderItem {
    product_id: String,
    quantity: u32,
    unit_price: f64
}

enum OrderStatus {
    Pending,
    Confirmed,
    Shipped,
    Delivered,
    Cancelled
}
```

### **4.4 Tracking Model**
```rust
struct TrackingUpdate {
    order_id: String,
    status: OrderStatus,
    location: String,
    notes: String,
    timestamp: u64
}
```

---

## **5. User Interface Requirements**

### **5.1 Dashboard**
- **Manufacturer Dashboard**: Product management, distributor orders, inventory
- **Distributor Dashboard**: Purchase from manufacturers, supply to retailers, inventory
- **Retailer Dashboard**: Purchase from distributors, customer orders, inventory
- **Customer Dashboard**: Product browsing, order history, tracking

### **5.2 Product Pages**
- Product listing page
- Product detail page
- Product creation/editing forms

### **5.3 Order Pages**
- Order creation page
- Order history page
- Order detail page with tracking

### **5.4 Navigation**
- Responsive design
- Role-based navigation
- Breadcrumb navigation

---

## **6. Non-Functional Requirements**

### **6.1 Performance**
- Page load time < 3 seconds
- Order processing < 5 seconds
- Support 100+ concurrent users

### **6.2 Security**
- Internet Identity authentication
- Role-based access control
- Data encryption in transit
- Secure canister calls

### **6.3 Scalability**
- Modular architecture for future expansion
- Efficient data storage
- Optimized queries

### **6.4 Usability**
- Intuitive user interface
- Mobile-responsive design
- Clear error messages
- Loading states

---

## **7. Development Roadmap**

### **Phase 1: Foundation (Week 1)**
- [ ] Project setup and configuration
- [ ] Basic canister structure
- [ ] User authentication
- [ ] Simple product management

### **Phase 2: Core Features (Week 2)**
- [ ] Order management system
- [ ] Basic tracking functionality
- [ ] User interface development
- [ ] Integration testing

### **Phase 3: Enhancement (Week 3)**
- [ ] Advanced tracking features
- [ ] UI/UX improvements
- [ ] Error handling
- [ ] Performance optimization

### **Phase 4: Deployment (Week 4)**
- [ ] Testing and bug fixes
- [ ] Documentation
- [ ] Mainnet deployment
- [ ] User training

---

## **8. Technical Specifications**

### **8.1 Backend API Endpoints**
```
Products:
- POST /create_product
- GET /get_product/{id}
- GET /get_all_products
- PUT /update_product/{id}

Orders:
- POST /create_order
- GET /get_order/{id}
- GET /get_customer_orders
- GET /get_manufacturer_orders
- PUT /update_order_status/{id}

Tracking:
- GET /get_order_tracking/{id}
- POST /add_tracking_update
```

### **8.2 Frontend Routes**
```
/ - Dashboard
/products - Product listing
/products/create - Create product
/products/:id - Product detail
/orders - Order history
/orders/create - Create order
/orders/:id - Order detail
/tracking/:id - Order tracking
```

### **8.3 Database Schema**
```
Users: id, name, email, role, created_at, is_active
Products: id, name, description, price, manufacturer, is_available, created_at
Orders: id, customer, items, total_amount, status, created_at, updated_at
Tracking: order_id, status, location, notes, timestamp
```

---

## **9. Testing Strategy**

### **9.1 Unit Testing**
- Backend function testing
- Data model validation
- Error handling

### **9.2 Integration Testing**
- Canister interaction testing
- Frontend-backend integration
- User workflow testing

### **9.3 User Acceptance Testing**
- End-to-end workflow testing
- User interface testing
- Performance testing

---

## **10. Deployment Strategy**

### **10.1 Development Environment**
- Local development with dfx
- Testing on local replica

### **10.2 Staging Environment**
- Testnet deployment
- User acceptance testing

### **10.3 Production Environment**
- Mainnet deployment
- Monitoring and maintenance

---

## **11. Success Criteria**

### **11.1 Functional Success**
- All core features working
- User workflows complete
- Data integrity maintained

### **11.2 Performance Success**
- Response times within limits
- System stability
- Error rate < 1%

### **11.3 User Success**
- Intuitive user experience
- Positive user feedback
- Successful order completion

---

## **12. Future Enhancements**

### **12.1 Phase 2 Features**
- Advanced analytics
- Payment integration
- Multi-language support
- Mobile app

### **12.2 Phase 3 Features**
- AI-powered insights
- IoT integration
- Advanced reporting
- API marketplace

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Next Review:** [Date + 1 week] 