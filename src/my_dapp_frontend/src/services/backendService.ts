import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { idlFactory, canisterId } from '../../../declarations/my_dapp_backend';
import type { _SERVICE } from '../../../declarations/my_dapp_backend/my_dapp_backend.did';
import type { User, UserRole, Product, ProductEvent } from '@shared/types';

// Define ProductTransferRequest interface
export interface ProductTransferRequest {
  productId: string;
  toPrincipal: string;
  notes?: string;
}

// Toast notification helper (simplified version)
let toastId: string | number;
const showToast = (message: string, type: 'loading' | 'success' | 'error' | 'info' = 'info') => {
  // In a real app, you'd use a toast library like react-hot-toast or svelte-sonner
  console.log(`[${type.toUpperCase()}] ${message}`);
  toastId = Date.now(); // Simple ID generation
};

// Simple test identity for test mode
class TestIdentity {
  constructor(private principal: Principal) {}
  
  getPrincipal(): Principal {
    return this.principal;
  }
  
  async transformRequest(request: any): Promise<any> {
    return request;
  }

  async sign(data: ArrayBuffer): Promise<ArrayBuffer> {
    return data;
  }

  async getPublicKey(): Promise<ArrayBuffer> {
    return new ArrayBuffer(32);
  }
}

class BackendService {
  private actor: _SERVICE | null = null;
  private authClient: AuthClient | null = null;
  private testPrincipalId: string | null = null;
  private isTestMode: boolean = false;

  setTestMode(principalId: string) {
    console.log('Setting test mode with principal:', principalId);
    this.isTestMode = true;
    this.testPrincipalId = principalId;
    this.actor = null; // Force reinitialization
  }

  clearTestMode() {
    console.log('Clearing test mode');
    this.isTestMode = false;
    this.testPrincipalId = null;
    this.actor = null;
  }

  private async getActor(): Promise<_SERVICE> {
    if (!this.actor) {
      await this.initializeActor();
    }
    return this.actor!;
  }

  private async initializeActor() {
    try {
      let identity;

      if (this.isTestMode && this.testPrincipalId) {
        console.log('Using test mode with principal:', this.testPrincipalId);
        const principal = Principal.fromText(this.testPrincipalId);
        identity = new TestIdentity(principal);
      } else {
        if (!this.authClient) {
          this.authClient = await AuthClient.create();
        }
        identity = this.authClient.getIdentity();
      }

      const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://127.0.0.1:4943' 
        : window.location.origin;

      const agent = new HttpAgent({ host, identity });

      if (host.includes('localhost')) {
        await agent.fetchRootKey();
      }

      this.actor = Actor.createActor<_SERVICE>(idlFactory, {
        agent,
        canisterId: canisterId
      });

      console.log('Backend actor initialized successfully');
    } catch (error) {
      console.error('Failed to initialize backend actor:', error);
      throw error;
    }
  }

  // User management methods with toast notifications
  async registerUser(
    name: string, 
    role: UserRole, 
    email: string = '', 
    company: string = ''
  ): Promise<{ Ok: User } | { Err: string }> {
    try {
      showToast('Registering user...', 'loading');
      const actor = await this.getActor();
      
      const backendRole = Object.keys(role)[0] as any;
      const backendRoleObj = { [backendRole]: null };
      
      const result = await actor.register_user(name, backendRoleObj as any, email, company);
      
      if ('Ok' in result) {
        showToast('User registered successfully!', 'success');
        return { Ok: this.convertBackendUserToFrontend(result.Ok) };
      } else {
        showToast(result.Err, 'error');
        return result;
      }
    } catch (error) {
      console.error('Error registering user:', error);
      showToast('Registration failed. Please try again.', 'error');
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const actor = await this.getActor();
      
      const result = await actor.get_current_user();
      
      if (result && result.length > 0 && result[0]) {
        return this.convertBackendUserToFrontend(result[0]);
      } else {
        throw new Error('No user found');
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  // Product management methods with multi-step operations
  async createProduct(
    name: string,
    description: string,
    price: number,
    quantity: number,
    category: string
  ): Promise<Product> {
    try {
      showToast('Creating product...', 'loading');
      const actor = await this.getActor();
      
      const result = await actor.create_product(name, description, price, quantity, category);
      
      if ('Ok' in result) {
        showToast('Product created successfully!', 'success');
        return this.convertBackendProductToFrontend(result.Ok);
      } else {
        showToast(result.Err, 'error');
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      showToast('Product creation failed. Please try again.', 'error');
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const actor = await this.getActor();
      const products = await actor.get_all_products();
      return products.map((product: any) => this.convertBackendProductToFrontend(product));
    } catch (error) {
      console.error('Error getting products:', error);
      showToast('Failed to fetch products.', 'error');
      throw error;
    }
  }

  async getProductEvents(productId: string): Promise<ProductEvent[]> {
    try {
      const actor = await this.getActor();
      
      const events = await actor.get_product_events(productId);
      
      return events.map((event: any) => ({
        product_id: event.product_id,
        event_type: event.event_type,
        description: event.description,
        from_user: event.from_user ? event.from_user.toString() : '',
        to_user: event.to_user ? event.to_user.toString() : '',
        timestamp: event.timestamp
      }));
    } catch (error) {
      console.error('Error getting product events:', error);
      showToast('Failed to fetch product events.', 'error');
      throw error;
    }
  }

  // Multi-step product transfer with progress notifications
  async transferProduct(request: ProductTransferRequest): Promise<void> {
    try {
      showToast('Initiating product transfer...', 'loading');
      const actor = await this.getActor();
      
      showToast('Validating transfer permissions...', 'loading');
      const toPrincipal = Principal.fromText(request.toPrincipal);
      
      showToast('Processing transfer...', 'loading');
      const result = await actor.transfer_product(
        request.productId,
        toPrincipal,
        request.notes || ''
      );
      
      if ('Err' in result) {
        showToast(result.Err, 'error');
        throw new Error(result.Err);
      }
      
      showToast('Product transferred successfully!', 'success');
    } catch (error) {
      console.error('Error transferring product:', error);
      showToast('Product transfer failed. Please try again.', 'error');
      throw error;
    }
  }

  // Helper methods for type conversion
  private convertBackendUserToFrontend(backendUser: any): User {
    return {
      user_principal: backendUser.user_principal.toString(),
      name: backendUser.name,
      role: backendUser.role,
      email: backendUser.email,
      company: backendUser.company,
      is_active: backendUser.is_active,
      created_at: backendUser.created_at
    };
  }

  private convertBackendProductToFrontend(backendProduct: any): Product {
    return {
      id: backendProduct.id,
      name: backendProduct.name,
      description: backendProduct.description,
      manufacturer: backendProduct.manufacturer.toString(),
      current_owner: backendProduct.current_owner.toString(),
      price: Number(backendProduct.price),
      quantity: Number(backendProduct.quantity),
      status: backendProduct.status,
      category: backendProduct.category,
      created_at: backendProduct.created_at,
      updated_at: backendProduct.updated_at
    };
  }

  async reinitialize() {
    this.actor = null;
    await this.initializeActor();
  }
}

// Export singleton instance
const backendService = new BackendService();
export default backendService; 