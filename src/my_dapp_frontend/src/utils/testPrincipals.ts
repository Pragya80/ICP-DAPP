// Simple utility to generate different principal IDs for testing
export const getTestPrincipal = (): string => {
  // Check if we already have a principal for this session
  let sessionPrincipal = sessionStorage.getItem('test_principal');
  
  if (!sessionPrincipal) {
    // Generate a simple test principal based on session
    const randomNum = Math.floor(Math.random() * 10000);
    const principals = [
      `test-manufacturer-${randomNum}`,
      `test-distributor-${randomNum}`,
      `test-retailer-${randomNum}`,
      `test-customer-${randomNum}`
    ];
    
    // Pick a random one
    sessionPrincipal = principals[Math.floor(Math.random() * principals.length)];
    sessionStorage.setItem('test_principal', sessionPrincipal);
  }
  
  return sessionPrincipal;
};

// Test principal IDs for different roles
export const TEST_PRINCIPALS = {
  MANUFACTURER: 'manufacturer-test-001',
  DISTRIBUTOR: 'distributor-test-002', 
  RETAILER: 'retailer-test-003',
  CUSTOMER: 'customer-test-004'
}; 