import {
  FairLocation,
  Vendor,
  Product,
  ReservationOrder,
  ImpactMetrics,
  OrderStatus,
} from '../types';
import {
  INITIAL_FAIRS,
  INITIAL_VENDORS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
} from '../data/mockData';

const STORAGE_KEYS = {
  FAIRS: 'ecofeira_fairs_v1',
  VENDORS: 'ecofeira_vendors_v1',
  PRODUCTS: 'ecofeira_products_v1',
  ORDERS: 'ecofeira_orders_v1',
  OFFLINE_QUEUE: 'ecofeira_offline_queue_v1',
  ACTIVE_FAIR_ID: 'ecofeira_active_fair_id',
  ACTIVE_VENDOR_ID: 'ecofeira_active_vendor_id',
  SIMULATED_OFFLINE: 'ecofeira_simulated_offline',
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.FAIRS)) {
      localStorage.setItem(STORAGE_KEYS.FAIRS, JSON.stringify(INITIAL_FAIRS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VENDORS)) {
      localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(INITIAL_VENDORS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_FAIR_ID)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FAIR_ID, INITIAL_FAIRS[0].id);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_VENDOR_ID)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_VENDOR_ID, INITIAL_VENDORS[0].id);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Getters
  public getFairs(): FairLocation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAIRS);
      return data ? JSON.parse(data) : INITIAL_FAIRS;
    } catch {
      return INITIAL_FAIRS;
    }
  }

  public getVendors(fairId?: string): Vendor[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VENDORS);
      const vendors: Vendor[] = data ? JSON.parse(data) : INITIAL_VENDORS;
      if (fairId) {
        return vendors.filter((v) => v.fairId === fairId);
      }
      return vendors;
    } catch {
      return INITIAL_VENDORS;
    }
  }

  public getProducts(vendorId?: string): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const products: Product[] = data ? JSON.parse(data) : INITIAL_PRODUCTS;
      if (vendorId) {
        return products.filter((p) => p.vendorId === vendorId);
      }
      return products;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  public getOrders(vendorId?: string): ReservationOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      const orders: ReservationOrder[] = data ? JSON.parse(data) : INITIAL_ORDERS;
      if (vendorId) {
        return orders.filter((o) => o.vendorId === vendorId);
      }
      return orders;
    } catch {
      return INITIAL_ORDERS;
    }
  }

  public getActiveFairId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_FAIR_ID) || INITIAL_FAIRS[0].id;
  }

  public setActiveFairId(fairId: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FAIR_ID, fairId);
    this.notify();
  }

  public getActiveVendorId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_VENDOR_ID) || INITIAL_VENDORS[0].id;
  }

  public setActiveVendorId(vendorId: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VENDOR_ID, vendorId);
    this.notify();
  }

  // Simulated Offline Mode for Pitch/Demonstration
  public isSimulatedOffline(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SIMULATED_OFFLINE) === 'true';
  }

  public setSimulatedOffline(val: boolean) {
    localStorage.setItem(STORAGE_KEYS.SIMULATED_OFFLINE, val ? 'true' : 'false');
    this.notify();
  }

  // Mutations
  public createOrder(order: Omit<ReservationOrder, 'id' | 'code' | 'createdAt' | 'status' | 'offlineSynced'>): ReservationOrder {
    const orders = this.getOrders();
    const isSimOffline = this.isSimulatedOffline();

    const newOrder: ReservationOrder = {
      ...order,
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      code: `ECO-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'pendente',
      offlineSynced: !isSimOffline,
    };

    const updated = [newOrder, ...orders];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    // Update product currentReservedKg
    const products = this.getProducts();
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        prod.currentReservedKg += item.quantity;
      }
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    this.notify();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: OrderStatus): void {
    const orders = this.getOrders();
    const isSimOffline = this.isSimulatedOffline();

    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          offlineSynced: !isSimOffline,
        };
      }
      return o;
    });

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    this.notify();
  }

  public updateProduct(updatedProduct: Product): void {
    const products = this.getProducts();
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    this.notify();
  }

  // Calculate ODS 2 and Environmental Impact
  public calculateImpact(vendorId?: string): ImpactMetrics {
    const orders = this.getOrders(vendorId).filter((o) => o.status !== 'cancelado');
    const vendors = this.getVendors();

    const totalOrdersCount = orders.length;
    const guaranteedRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Sum of estimated weights
    const totalWeightKg = orders.reduce((sum, o) => sum + (o.estimatedWeightKg || 2), 0);

    // Food saved: in conventional fairs without pre-booking, ~35% of stock is discarded or spoiled.
    // Pre-orders eliminate this 35% waste fraction because produce is harvested to demand.
    const foodSavedKg = Math.round(totalWeightKg * 0.85);

    // Avoided CO2: approx 2.5 kg CO2e per kg of avoided organic waste decomposition
    const co2AvoidedKg = Math.round(foodSavedKg * 2.5);

    return {
      foodSavedKg: Math.max(12, foodSavedKg),
      co2AvoidedKg: Math.max(30, co2AvoidedKg),
      guaranteedRevenue,
      activeProducersCount: vendors.length,
      totalOrdersCount,
    };
  }

  // Reset to original prototype state
  public resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.FAIRS, JSON.stringify(INITIAL_FAIRS));
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(INITIAL_VENDORS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FAIR_ID, INITIAL_FAIRS[0].id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VENDOR_ID, INITIAL_VENDORS[0].id);
    localStorage.setItem(STORAGE_KEYS.SIMULATED_OFFLINE, 'false');
    this.notify();
  }
}

export const storageService = new StorageService();
