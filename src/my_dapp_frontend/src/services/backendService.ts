import { Actor, HttpAgent } from '@dfinity/agent';
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

// Dummy principal for development
const DUMMY_PRINCIPAL = "2vxsx-fae"; // This is a valid dummy principal format

class BackendService {
  private actor: _SERVICE | null = null;

  private async getActor(): Promise<_SERVICE> {
    if (!this.actor) {
      await this.initializeActor();
    }
    return this.actor!;
  }

  private async initializeActor() {
    const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://127.0.0.1:4943'
      : window.location.origin;

    console.log('Using host:', host);

    const agent = new HttpAgent({ host });

    if (host.includes('localhost')) {
      await agent.fetchRootKey();
    }

    this.actor = Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId: canisterId
    });

    console.log('Backend actor initialized successfully');
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
      
      // Use dummy principal for development
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
        // Return a dummy user if none found
        return {
          user_principal: DUMMY_PRINCIPAL,
          name: "Demo User",
          role: { Manufacturer: null },
          email: "demo@example.com",
          company: "Demo Company",
          is_active: true,
          created_at: BigInt(Date.now())
        };
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      // Return dummy user on error
      return {
        user_principal: DUMMY_PRINCIPAL,
        name: "Demo User",
        role: { Manufacturer: null },
        email: "demo@example.com",
        company: "Demo Company",
        is_active: true,
        created_at: BigInt(Date.now())
      };
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
        from_user: event.from_user,
        to_user: event.to_user,
        timestamp: event.timestamp
      }));
    } catch (error) {
      console.error('Error getting product events:', error);
      showToast('Failed to fetch product events.', 'error');
      throw error;
    }
  }

  async transferProduct(request: ProductTransferRequest): Promise<void> {
    try {
      showToast('Transferring product...', 'loading');
      const actor = await this.getActor();
      
      const toPrincipal = request.toPrincipal || DUMMY_PRINCIPAL;
      
      const result = await actor.transfer_product(
        request.productId,
        Principal.fromText(toPrincipal),
        request.notes || 'Product transfer'
      );
      
      if ('Ok' in result) {
        showToast('Product transferred successfully!', 'success');
      } else {
        showToast(result.Err, 'error');
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Error transferring product:', error);
      showToast('Product transfer failed. Please try again.', 'error');
      throw error;
    }
  }

  async sellProduct(
    productId: string,
    customer: string,
    price: number,
    quantity: number,
    description: string
  ): Promise<Product> {
    try {
      showToast('Processing sale...', 'loading');
      const actor = await this.getActor();
      
      const customerPrincipal = customer || DUMMY_PRINCIPAL;
      
      const result = await actor.sell_product(productId, Principal.fromText(customerPrincipal), price, quantity, description);
      
      if ('Ok' in result) {
        showToast('Product sold successfully!', 'success');
        return this.convertBackendProductToFrontend(result.Ok);
      } else {
        showToast(result.Err, 'error');
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Error selling product:', error);
      showToast('Sale failed. Please try again.', 'error');
      throw error;
    }
  }

  private convertBackendUserToFrontend(backendUser: any): User {
    return {
      user_principal: backendUser.user_principal,
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
      manufacturer: backendProduct.manufacturer,
      current_owner: backendProduct.current_owner,
      price: backendProduct.price,
      quantity: backendProduct.quantity,
      status: backendProduct.status,
      category: backendProduct.category,
      created_at: backendProduct.created_at,
      updated_at: backendProduct.updated_at
    };
  }
}

const backendService = new BackendService();
export default backendService; 