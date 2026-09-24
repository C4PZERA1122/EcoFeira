export type UserRole = 'consumer' | 'farmer';

export type ProductCategory =
  | 'todos'
  | 'folhas_verduras'
  | 'frutas'
  | 'legumes_raizes'
  | 'temperos_ervas'
  | 'artesanal';

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: 'kg' | 'maço' | 'bandeja' | 'dúzia' | 'unidade' | 'pote';
  description: string;
  isOrganic?: boolean;
  isFamilyFarm?: boolean;
  harvestNotice?: string;
  imageEmoji: string;
  harvestLimitKg: number; // Maximum batch harvestable
  currentReservedKg: number;
  isActive: boolean;
}

export interface FairLocation {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  nextDate: string; // e.g., "Próximo Sábado, 26 de Setembro"
  timeWindow: string; // e.g., "06:30 às 12:30"
  status: 'reservas_abertas' | 'em_separacao' | 'em_andamento' | 'encerrada';
}

export interface Vendor {
  id: string;
  name: string;
  stallNumber: string; // e.g. "Banca 14 - Setor Hortifrúti"
  ownerName: string;
  community: string; // e.g., "Sítio Vista Alegre - Teresópolis"
  rating: number;
  reviewCount: number;
  fairId: string;
  avatarEmoji: string;
  description: string;
  specialties: string[];
  pixKeyType: string;
  pixKey: string;
}

export type OrderStatus = 'pendente' | 'separado' | 'retirado' | 'cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageEmoji: string;
}

export interface ReservationOrder {
  id: string;
  code: string; // e.g. "ECO-7821"
  createdAt: string;
  fairId: string;
  fairName: string;
  vendorId: string;
  vendorName: string;
  stallNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  estimatedWeightKg: number;
  status: OrderStatus;
  pickupTimeEstimate?: string; // e.g. "Entre 08h e 09h30"
  paymentMethod: 'pix_na_retirada' | 'dinheiro_na_retirada' | 'cartao_na_retirada';
  notes?: string;
  offlineSynced?: boolean;
}

export interface ImpactMetrics {
  foodSavedKg: number; // Alimentos salvos do desperdício
  co2AvoidedKg: number; // Emissões de CO2 equivalentes evitadas
  guaranteedRevenue: number; // R$ assegurados antes de sair de casa
  activeProducersCount: number;
  totalOrdersCount: number;
}
