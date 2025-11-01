'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addProductToExtras(name: string) {
  try {
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        category: 'Extras',
      },
    });
    
    revalidatePath('/bestellingen');
    return { success: true, product };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, product: null };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    
    revalidatePath('/bestellingen');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false };
  }
}

