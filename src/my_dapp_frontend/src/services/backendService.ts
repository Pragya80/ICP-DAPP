import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as backendIdlFactory } from '../../../declarations/my_dapp_backend/my_dapp_backend.did.js';
import type { _SERVICE } from '../../../declarations/my_dapp_backend/my_dapp_backend.did';
import type { 
  Product as BackendProduct, 
  User as BackendUser, 
  ProductEvent as BackendProductEvent,
  UserRole as BackendUserRole,
  ProductStatus as BackendProductStatus
} from '../../../declarations/my_dapp_backend/my_dapp_backend.did';
import type { User, Product, UserRole, ProductStatus } from '@shared/types';

// Update canister ID to match your deployed backend
const CANISTER_ID = 'uxrrr-q7777-77774-qaaaq-cai';

class BackendService {
  private actor: _SERVICE | null = null;

  async initializeActor() {
    if (!this.actor) {
      try {
        const agent = new HttpAgent({ 
          host: 'http://127.0.0.1:4943'
        });
        
        // Fetch root key for local development
        await agent.fetchRootKey();

        this.actor = Actor.createActor(backendIdlFactory, {
          agent,
          canisterId: CANISTER_ID,
        });
        
        console.log('Backend actor initialized successfully');
      } catch (error) {
        console.error('Failed to initialize backend actor:', error);
        throw error;
      }
    }
    return this.actor;
  }

  // Type conversion helpers
  private convertBackendUserToFrontend(backendUser: BackendUser): User {
    return {
      user_principal: backendUser.user_principal.toString(),
      name: backendUser.name,
      role: backendUser.role,
      created_at: backendUser.created_at,
      email: backendUser.email,
      company: backendUser.company,
      is_active: backendUser.is_active
    };
  }

  private convertBackendProductToFrontend(backendProduct: BackendProduct): Product {
    return {
      id: backendProduct.id,
      name: backendProduct.name,
      description: backendProduct.description,
      price: backendProduct.price,
      quantity: backendProduct.quantity,
      category: backendProduct.category,
      status: backendProduct.status,
      manufacturer: backendProduct.manufacturer.toString(),
      current_owner: backendProduct.current_owner.toString(),
      created_at: backendProduct.created_at,
      updated_at: backendProduct.updated_at
    };
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const actor = await this.initializeActor();
      const result = await actor.get_current_user();
      
      if (result && result.length > 0 && result[0]) {
        return this.convertBackendUserToFrontend(result[0]);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async registerUser(name: string, role: UserRole, email: string = '', company: string = ''): Promise<{ Ok: User } | { Err: string }> {
    try {
      const actor = await this.initializeActor();
      const result = await actor.register_user(name, role as BackendUserRole, email, company);
      
      if ('Ok' in result) {
        return { Ok: this.convertBackendUserToFrontend(result.Ok) };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Failed to register user:', error);
      return { Err: 'Failed to register user' };
    }
  }

  async createProduct(
    name: string,
    description: string,
    price: number,
    quantity: number,
    category: string
  ): Promise<{ Ok: Product } | { Err: string }> {
    try {
      const actor = await this.initializeActor();
      const result = await actor.create_product(name, description, price, quantity, category);
      
      if ('Ok' in result) {
        return { Ok: this.convertBackendProductToFrontend(result.Ok) };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      return { Err: 'Failed to create product' };
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const actor = await this.initializeActor();
      const products = await actor.get_all_products();
      return products.map(product => this.convertBackendProductToFrontend(product));
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const actor = await this.initializeActor();
      const result = await actor.get_product(id);
      
      if (result && result.length > 0 && result[0]) {
        return this.convertBackendProductToFrontend(result[0]);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to get product:', error);
      return null;
    }
  }

  async transferProduct(
    productId: string,
    toPrincipal: string,
    description: string
  ): Promise<{ Ok: Product } | { Err: string }> {
    try {
      const actor = await this.initializeActor();
      const toPrincipalObj = Principal.fromText(toPrincipal);
      const result = await actor.transfer_product(productId, toPrincipalObj, description);
      
      if ('Ok' in result) {
        return { Ok: this.convertBackendProductToFrontend(result.Ok) };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Failed to transfer product:', error);
      return { Err: 'Failed to transfer product. Please check the principal ID and try again.' };
    }
  }

  async getProductEvents(productId: string): Promise<any[]> {
    try {
      const actor = await this.initializeActor();
      const events = await actor.get_product_events(productId);
      
      // Convert backend events to frontend format
      return events.map(event => ({
        ...event,
        from_user: event.from_user.toString(),
        to_user: event.to_user.toString()
      }));
    } catch (error) {
      console.error('Failed to get product events:', error);
      return [];
    }
  }

  async sellProduct(
    productId: string,
    customer: string,
    price: number,
    quantity: number,
    description: string
  ): Promise<{ Ok: Product } | { Err: string }> {
    try {
      const actor = await this.initializeActor();
      const customerPrincipal = Principal.fromText(customer);
      const result = await actor.sell_product(productId, customerPrincipal, price, quantity, description);
      
      if ('Ok' in result) {
        return { Ok: this.convertBackendProductToFrontend(result.Ok) };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Failed to sell product:', error);
      return { Err: 'Failed to sell product' };
    }
  }

  async getUserPrincipal(): Promise<string> {
    try {
      // For now, return a placeholder since we don't have a direct method
      return 'anonymous';
    } catch (error) {
      console.error('Failed to get user principal:', error);
      return '';
    }
  }
}

export default new BackendService(); 