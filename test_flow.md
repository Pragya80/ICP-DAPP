# Test Flow Guide - Supply Chain DApp

## 🧪 **Complete Test Flow**

### **Step 1: Start Local Development**
```bash
# Start dfx
dfx start --clean --background

# Deploy canisters
dfx deploy

# Start frontend development server
cd src/my_dapp_frontend
npm start
```

### **Step 2: Test Mode Authentication**

1. **Go to**: http://localhost:3000/
2. **Click**: "Use Test Mode Instead"
3. **Click**: "Enter Test Mode"
4. **Register**: Choose a test user or fill form
5. **Verify**: You should see dashboard with user info

### **Step 3: Test Product Creation (Manufacturer)**

1. **Register as Manufacturer** (if not already)
2. **Go to Products page**
3. **Click**: "Add Product"
4. **Fill form**:
   - Name: "Test Laptop"
   - Description: "High-performance laptop"
   - Price: 999.99
   - Quantity: 10
   - Category: "Electronics"
5. **Click**: "Create Product"
6. **Verify**: Product appears in list

### **Step 4: Test Product Transfer**

1. **Copy Principal ID** from dashboard
2. **Switch to Distributor** using test user switcher
3. **Register as Distributor**
4. **Go to Products page**
5. **Click**: "Transfer" on the product
6. **Paste Manufacturer's Principal ID**
7. **Click**: "Transfer Product"
8. **Verify**: Product ownership changes

### **Step 5: Test Complete Supply Chain**

1. **Manufacturer**: Create products
2. **Distributor**: Receive transfers from manufacturer
3. **Retailer**: Receive transfers from distributor
4. **Customer**: Receive transfers from retailer

## 🔧 **Troubleshooting**

### **Issue: "User not logged in" error**
**Solution**: 
- Ensure test mode is active
- Check console for authentication logs
- Refresh page and try again

### **Issue: Product creation fails**
**Solution**:
- Check backend service logs
- Verify test mode principal is set
- Check canister deployment status

### **Issue: Transfer fails**
**Solution**:
- Verify Principal IDs are correct
- Check product ownership
- Ensure proper role permissions

### **Issue: Test user switching not working**
**Solution**:
- Check console for switching logs
- Refresh page after switching
- Re-register with new user

## 📋 **Expected Console Logs**

### **Test Mode Initialization**
```
Setting test mode with principal: test-manufacturer-principal-123
Using test mode with principal: test-manufacturer-principal-123
Using host: http://127.0.0.1:4943
Root key fetched successfully
Backend actor initialized successfully with canister ID: uxrrr-q7777-77774-qaaaq-cai
```

### **User Registration**
```
Test mode registration - creating mock user: {user_principal: "test-manufacturer-principal-123", ...}
```

### **Product Creation**
```
Creating product: {name: "Test Laptop", description: "High-performance laptop", ...}
Backend create_product result: {Ok: {...}}
```

### **Product Transfer**
```
Transferring product: {productId: "123", toPrincipal: "test-distributor-principal-456", ...}
```

## ✅ **Success Indicators**

- ✅ Test mode authentication works
- ✅ User registration completes
- ✅ Product creation succeeds
- ✅ Product transfers work
- ✅ Role switching functions
- ✅ Principal IDs are copyable
- ✅ All console logs appear correctly

## 🚀 **Next Steps**

1. **Test local deployment** with above flow
2. **Deploy to mainnet** for friends testing
3. **Share URLs** with friends
4. **Test complete supply chain** workflow

The test mode should now work perfectly for all supply chain operations! 🎉 