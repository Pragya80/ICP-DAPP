# Supply Chain Management DApp - Software Requirements Specification (SRS)

## **1. Project Overview**

### **1.1 Project Name**
Supply Chain Management DApp (SCM-DApp)

### **1.2 Project Description**
A decentralized application (DApp) built on the Internet Computer (ICP) that provides a simple, transparent, and secure supply chain tracking system. The MVP focuses on tracking products from manufacturer to customer through a simplified product flow system.

### **1.3 Project Scope**
**MVP Version 1.0** - Simple supply chain tracking with product management and flow tracking capabilities.

### **1.4 Target Users**
- **Manufacturers**: Create and manage products, transfer to distributors
- **Distributors**: Receive products from manufacturers, transfer to retailers
- **Retailers**: Receive products from distributors, sell to customers
- **Customers**: Browse products, purchase and track product history

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
│ - Product Mgmt  │    │ - User Mgmt     │    │ - User Data     │
│ - Tracking      │    │ - Tracking      │    │ - Event Data    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **2.3 Canister Structure**
```
Single Canister Approach (MVP):
┌─────────────────────────────────────┐
│           SCM-Canister              │
│                                     │
│ ├── User Management                 │
│ ├── Product Management              │
│ ├── Product Tracking                │
│ ├── Event Logging                   │
│ └── Data Storage                    │
└─────────────────────────────────────┘
```

---

## **3. Functional Requirements**

### **3.1 User Management**
#### **3.1.1 User Registration**
- Users authenticate using Internet Identity
- After authentication, users register with additional details
- System assigns user role (Manufacturer/Distributor/Retailer/Customer)
- Store basic user information (name, email, company)

#### **3.1.2 User Authentication**
- Secure login using Internet Identity
- Role-based access control
- Session management

### **3.2 Product Management**
#### **3.2.1 Product Creation**
- Manufacturers can create new products
- Required fields: name, description, price, quantity, category
- Product gets unique ID and tracking starts

#### **3.2.2 Product Listing**
- Display all available products
- Filter by manufacturer, category, status
- Search functionality

#### **3.2.3 Product Updates**
- Manufacturers can update their products
- Status management (Available, OutOfStock, Discontinued)

### **3.3 Product Flow Management**
#### **3.3.1 Product Transfer**
- Manufacturers transfer products to Distributors
- Distributors transfer products to Retailers
- Retailers sell products to Customers
- Each transfer creates a tracking event

#### **3.3.2 Product Purchase**
- Customers can purchase products from Retailers
- Purchase creates final tracking event
- Product status updated to "Sold"

### **3.4 Supply Chain Tracking**
#### **3.4.1 Product Journey**
- **Level 1**: Manufacturer creates product
- **Level 2**: Manufacturer → Distributor transfer
- **Level 3**: Distributor → Retailer transfer  
- **Level 4**: Retailer → Customer sale

#### **3.4.2 Event Tracking**
- Every product movement is logged
- Complete chain of custody tracking
- Timestamp and actor information for each event

### **3.5 Product History**
#### **3.5.1 Product Timeline**
- View complete journey of any product
- See all transfers and owners
- Track from creation to final sale

#### **3.5.2 User History**
- Manufacturers: See all products they created
- Distributors: See products they received/transferred
- Retailers: See products they received/sold
- Customers: See products they purchased

---

## **4. Data Models**

### **4.1 User Model**
```rust
struct User {
    principal: Principal,
    name: String,
    role: UserRole,
    email: Option<String>,
    company: Option<String>,
    is_active: bool,
    created_at: u64
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
    manufacturer: Principal,
    current_owner: Principal,
    price: f64,
    quantity: u32,
    status: ProductStatus,
    category: String,
    created_at: u64,
    updated_at: u64
}

enum ProductStatus {
    Available,
    OutOfStock,
    Discontinued,
    Sold
}
```

### **4.3 Product Event Model**
```rust
struct ProductEvent {
    product_id: String,
    event_type: String,      // "Created", "Transferred", "Sold"
    from_user: Principal,
    to_user: Principal,
    description: String,
    timestamp: u64
}
```

---

## **5. User Interface Requirements**

### **5.1 Dashboard**
- **Manufacturer Dashboard**: Product creation, transfer to distributors, product history
- **Distributor Dashboard**: Receive from manufacturers, transfer to retailers, inventory
- **Retailer Dashboard**: Receive from distributors, sell to customers, inventory
- **Customer Dashboard**: Browse products, purchase history, product tracking

### **5.2 Product Pages**
- Product listing page with filters
- Product detail page with tracking history
- Product creation form (manufacturers only)
- Product transfer form

### **5.3 Tracking Pages**
- Product tracking timeline
- User's product history
- Transfer/sale forms

### **5.4 Navigation**
- Responsive design
- Role-based navigation
- User registration flow after login

---

## **6. Non-Functional Requirements**

### **6.1 Performance**
- Page load time < 3 seconds
- Product tracking queries < 2 seconds
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

### **Phase 1: Foundation (Completed)**
- [x] Project setup and configuration
- [x] Basic canister structure
- [x] User authentication with Internet Identity
- [x] User registration system

### **Phase 2: Core Features (Current)**
- [ ] Product management system
- [ ] Product tracking functionality
- [ ] User interface development
- [ ] Backend-frontend integration

### **Phase 3: Enhancement**
- [ ] Advanced tracking features
- [ ] UI/UX improvements
- [ ] Error handling
- [ ] Performance optimization

### **Phase 4: Deployment**
- [ ] Testing and bug fixes
- [ ] Documentation
- [ ] Mainnet deployment
- [ ] User training

---

## **8. Technical Specifications**

### **8.1 Backend API Endpoints**
```
Users:
- POST /register_user
- GET /get_user/{principal}
- GET /get_current_user
- PUT /update_user_role

Products:
- POST /create_product
- GET /get_products
- GET /get_product/{id}
- PUT /update_product/{id}
- POST /transfer_product

Events:
- GET /get_product_events/{product_id}
- GET /get_user_events/{principal}
```

### **8.2 Frontend Routes**
```
/ - Dashboard
/register - User registration (after login)
/products - Product listing
/products/create - Create product (manufacturers)
/products/:id - Product detail with tracking
/transfer - Transfer products
/history - User's product history
```

### **8.3 Database Schema**
```
Users: principal, name, role, email, company, is_active, created_at
Products: id, name, description, manufacturer, current_owner, price, quantity, status, category, created_at, updated_at
ProductEvents: product_id, event_type, from_user, to_user, description, timestamp
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
- Product tracking accurate
- Data integrity maintained

### **11.2 Performance Success**
- Response times within limits
- System stability
- Error rate < 1%

### **11.3 User Success**
- Intuitive user experience
- Positive user feedback
- Successful product tracking

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

**Document Version:** 2.0  
**Last Updated:** [Current Date]  
**Next Review:** [Date + 1 week] 