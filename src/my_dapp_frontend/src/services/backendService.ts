import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from '../../../declarations/my_dapp_backend/my_dapp_backend.did.js';
import type { User, UserRole, Product, ProductEvent } from '@shared/types';
import { getRoleString } from '@shared/types';

class BackendService {
  private agent: HttpAgent | null = null;
  private actor: any = null;
  private authClient: AuthClient | null = null;

  async initialize(): Promise<boolean> {
    try {
      // For testing, use anonymous identity
      this.agent = new HttpAgent({
        host: import.meta.env.MODE === 'production' 
          ? 'https://ic0.app' 
          : 'http://localhost:4943'
      });

      // Fetch root key for local development
      if (import.meta.env.MODE !== 'production') {
        await this.agent.fetchRootKey();
      }

      // Create actor
      const canisterId = import.meta.env.MODE === 'production'
        ? import.meta.env.CANISTER_ID_MY_DAPP_BACKEND
        : 'uxrrr-q7777-77774-qaaaq-cai'; // Updated to match deployed canister ID

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

  // Helper function to convert UserRole variant to Candid format
  private convertRoleToCandid(role: UserRole): any {
    const roleString = getRoleString(role);
    return { [roleString]: null };
  }

  // User Management
  async registerUser(name: string, role: UserRole, email: string, company: string): Promise<any> {
    try {
      console.log('Registering user with:', { name, role, email, company });
      
      // Convert UserRole variant to Candid format
      const candidRole = this.convertRoleToCandid(role);
      console.log('Candid role format:', candidRole);
      
      const result = await this.actor.register_user(name, candidRole, email, company);
      console.log('Registration result:', result);
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
      console.log('Updating user role to:', role);
      
      // Convert UserRole variant to Candid format
      const candidRole = this.convertRoleToCandid(role);
      console.log('Candid role format:', candidRole);
      
      const result = await this.actor.update_user_role(candidRole);
      console.log('Role update result:', result);
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