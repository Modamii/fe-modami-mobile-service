import { mockOrders } from '@/data/mock-orders.mock';
import type { Order } from '@/types/app.type';
import type { ResponseData } from '@/types/api.types';

const delay = (ms = 800) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const orderService = {
  async getMyOrders(): Promise<ResponseData<Order[]>> {
    await delay();
    return { data: mockOrders, success: true };
  },

  async getOrderById(id: string): Promise<ResponseData<Order>> {
    await delay(500);
    const order = mockOrders.find((o) => o.id === id);
    if (!order) throw new Error('Không tìm thấy đơn hàng');
    return { data: order, success: true };
  },
};
