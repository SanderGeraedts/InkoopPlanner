'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface ProductQuantity {
  productId: string;
  quantity: number;
}

export async function saveOrderRows(orderListId: string, productQuantities: ProductQuantity[]) {
  try {
    // Get existing order rows for this order list
    const existingOrderRows = await prisma.orderRow.findMany({
      where: { orderListId },
    });

    // Separate products to create/update and delete
    const productsToUpdate = productQuantities.filter(pq => pq.quantity > 0);
    const newProductIds = new Set(productsToUpdate.map(pq => pq.productId));

    // Delete order rows for products with quantity <= 0
    const productsToDelete = existingOrderRows
      .filter(or => !newProductIds.has(or.productId))
      .map(or => or.id);

    if (productsToDelete.length > 0) {
      await prisma.orderRow.deleteMany({
        where: {
          id: { in: productsToDelete },
        },
      });
    }

    // Update or create order rows
    for (const pq of productsToUpdate) {
      const existing = existingOrderRows.find(or => or.productId === pq.productId);
      
      if (existing) {
        // Update existing
        await prisma.orderRow.update({
          where: { id: existing.id },
          data: { quantity: pq.quantity },
        });
      } else {
        // Create new
        await prisma.orderRow.create({
          data: {
            orderListId,
            productId: pq.productId,
            quantity: pq.quantity,
          },
        });
      }
    }

    // Get orderId for revalidation
    const orderList = await prisma.orderList.findUnique({
      where: { id: orderListId },
      select: { orderId: true },
    });

    if (orderList) {
      revalidatePath(`/bestellingen/${orderList.orderId}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error saving order rows:', error);
    return { success: false };
  }
}

export async function createOrderList(orderId: string) {
  try {
    const orderList = await prisma.orderList.create({
      data: {
        orderId,
      },
    });

    revalidatePath(`/bestellingen/${orderId}`);
    return { success: true, orderListId: orderList.id };
  } catch (error) {
    console.error('Error creating order list:', error);
    return { success: false };
  }
}

export async function getPreviousOrderList(orderId: string, currentOrderListId: string) {
  try {
    const currentOrderList = await prisma.orderList.findUnique({
      where: { id: currentOrderListId },
    });

    if (!currentOrderList) {
      return null;
    }

    const previousOrderList = await prisma.orderList.findFirst({
      where: {
        orderId,
        createdAt: { lt: currentOrderList.createdAt },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return previousOrderList ? { success: true, orderListId: previousOrderList.id } : null;
  } catch (error) {
    console.error('Error getting previous order list:', error);
    return null;
  }
}

export async function getNextOrderList(orderId: string, currentOrderListId: string) {
  try {
    const currentOrderList = await prisma.orderList.findUnique({
      where: { id: currentOrderListId },
    });

    if (!currentOrderList) {
      return null;
    }

    const nextOrderList = await prisma.orderList.findFirst({
      where: {
        orderId,
        createdAt: { gt: currentOrderList.createdAt },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return nextOrderList ? { success: true, orderListId: nextOrderList.id } : null;
  } catch (error) {
    console.error('Error getting next order list:', error);
    return null;
  }
}

export async function isFirstOrderList(orderId: string, currentOrderListId: string) {
  try {
    const currentOrderList = await prisma.orderList.findUnique({
      where: { id: currentOrderListId },
    });

    if (!currentOrderList) {
      return false;
    }

    const previousOrderList = await prisma.orderList.findFirst({
      where: {
        orderId,
        createdAt: { lt: currentOrderList.createdAt },
      },
    });

    return !previousOrderList; // If no previous order list, this is the first one
  } catch (error) {
    console.error('Error checking if first order list:', error);
    return false;
  }
}

export async function isLastOrderList(orderId: string, currentOrderListId: string) {
  try {
    const currentOrderList = await prisma.orderList.findUnique({
      where: { id: currentOrderListId },
    });

    if (!currentOrderList) {
      return false;
    }

    const nextOrderList = await prisma.orderList.findFirst({
      where: {
        orderId,
        createdAt: { gt: currentOrderList.createdAt },
      },
    });

    return !nextOrderList; // If no next order list, this is the last one
  } catch (error) {
    console.error('Error checking if last order list:', error);
    return false;
  }
}



