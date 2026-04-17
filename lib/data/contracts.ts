import type {
  CouponDefinition,
  OrderRecord,
  Product,
  SessionRecord,
  UserRecord,
} from '@/lib/types'

export interface DataStore {
  readProducts(): Promise<Product[]>
  writeProducts(products: Product[]): Promise<void>
  readCoupons(): Promise<CouponDefinition[]>
  writeCoupons(coupons: CouponDefinition[]): Promise<void>
  readOrders(): Promise<OrderRecord[]>
  writeOrders(orders: OrderRecord[]): Promise<void>
  readUsers(): Promise<UserRecord[]>
  writeUsers(users: UserRecord[]): Promise<void>
  readSessions(): Promise<SessionRecord[]>
  writeSessions(sessions: SessionRecord[]): Promise<void>
}
