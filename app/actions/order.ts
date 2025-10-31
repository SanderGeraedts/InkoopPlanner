'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createOrder() {
  try {
    // Create order with an initial order list
    const order = await prisma.order.create({
      data: {
        date: new Date(),
        orderLists: {
          create: {},
        },
      },
    });
    
    revalidatePath('/');
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, orderId: null };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await prisma.order.delete({
      where: {
        id: orderId,
      },
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    return { success: false };
  }
}

