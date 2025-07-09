import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from '../../../declarations/my_dapp_backend/my_dapp_backend.did.js';
import { User, UserRole, Product, ProductEvent } from '../types';

class BackendService {
  private agent: HttpAgent | null = null;
  private actor: any = null;
  private authClient: AuthClient | null = null;

  async initialize(): Promise<boolean> {
    try {
      // Initialize auth client
      this.authClient = await AuthClient.create();
      
      // Create agent with identity
      this.agent = new HttpAgent({
        identity: this.authClient.getIdentity(),
        host: import.meta.env.MODE === 'production' 
          ? 'https://ic0.app' 
          : 'http://localhost:4943'
      });

      // Create actor
      const canisterId = import.meta.env.MODE === 'production'
        ? import.meta.env.CANISTER_ID_MY_DAPP_BACKEND
        : import.meta.env.VITE_CANISTER_ID_MY_DAPP_BACKEND || 'u6s2n-gx777-77774-qaaba-cai';

      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId: canisterId
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize backend service:', error);
      return false;
    }
  }

  // User Management
  async registerUser(name: string, role: UserRole, email?: string, company?: string): Promise<any> {
    try {
      const result = await this.actor.register_user(name, role, email, company);
      return result;
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User[]> {
    try {
      const result = await this.actor.get_current_user();
      return result;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }

  async updateUserRole(role: UserRole): Promise<any> {
    try {
      const result = await this.actor.update_user_role(role);
      return result;
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw error;
    }
  }

  // Product Management
  async createProduct(name: string, description: string, price: number, quantity: number, category: string): Promise<any> {
    try {
      const result = await this.actor.create_product(name, description, price, quantity, category);
      return result;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  }

  async transferProduct(productId: string, toUser: string, description: string): Promise<any> {
    try {
      const result = await this.actor.transfer_product(productId, toUser, description);
      return result;
    } catch (error) {
      console.error('Failed to transfer product:', error);
      throw error;
    }
  }

  async sellProduct(productId: string, customer: string, price: number, quantity: number, description: string): Promise<any> {
    try {
      const result = await this.actor.sell_product(productId, customer, price, quantity, description);
      return result;
    } catch (error) {
      console.error('Failed to sell product:', error);
      throw error;
    }
  }

  async getProductEvents(productId: string): Promise<ProductEvent[]> {
    try {
      const result = await this.actor.get_product_events(productId);
      return result;
    } catch (error) {
      console.error('Failed to get product events:', error);
      throw error;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const result = await this.actor.get_all_products();
      return result;
    } catch (error) {
      console.error('Failed to get all products:', error);
      throw error;
    }
  }

  async getProduct(productId: string): Promise<Product | null> {
    try {
      const result = await this.actor.get_product(productId);
      return result;
    } catch (error) {
      console.error('Failed to get product:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    return this.authClient ? await this.authClient.isAuthenticated() : false;
  }

  // Get current principal
  getPrincipal(): string | null {
    if (this.authClient) {
      const identity = this.authClient.getIdentity();
      return identity.getPrincipal().toString();
    }
    return null;
  }
}

// Create singleton instance
const backendService = new BackendService();
export default backendService; 