'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveOrderRows, getPreviousOrderList, getNextOrderList, createOrderList } from '@/app/actions/orderRow';

interface OrderActionsProps {
  orderId: string;
  orderListId: string;
  quantities: Record<string, number>;
  onSave: () => void;
  onReset: () => void;
  isFirstOrderList: boolean;
  isLastOrderList: boolean;
}

export default function OrderActions({ orderId, orderListId, quantities, onSave, onReset, isFirstOrderList, isLastOrderList }: OrderActionsProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSave = async (skipRefresh = false) => {
    const productQuantities = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity: quantity as number,
      }));

    const result = await saveOrderRows(orderListId, productQuantities);
    if (result.success) {
      onSave();
      if (!skipRefresh) {
        router.refresh();
      }
      return true;
    } else {
      console.error('Failed to save order rows');
      return false;
    }
  };

  const handleSaveWithLoading = async () => {
    setIsSaving(true);
    try {
      await handleSave();
    } catch (error) {
      console.error('Error saving order rows:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevious = async () => {
    setIsNavigating(true);
    try {
      // Save current order list first
      await handleSave();
      
      // Get previous order list
      const result = await getPreviousOrderList(orderId, orderListId);
      if (result?.success && result.orderListId) {
        router.push(`/bestellingen/${orderId}?orderListId=${result.orderListId}`);
      } else {
        alert('Geen vorige bestellijst gevonden');
      }
    } catch (error) {
      console.error('Error getting previous order list:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleClose = async () => {
    setIsSaving(true);
    try {
      await handleSave();
      router.push(`/bestellingen/${orderId}/overzicht`);
    } catch (error) {
      console.error('Error closing order:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    setIsNavigating(true);
    try {
      // Save current order list first
      await handleSave();
      
      // Get next order list
      const result = await getNextOrderList(orderId, orderListId);
      if (result?.success && result.orderListId) {
        router.push(`/bestellingen/${orderId}?orderListId=${result.orderListId}`);
      } else {
        alert('Geen volgende bestellijst gevonden');
      }
    } catch (error) {
      console.error('Error getting next order list:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleNewOrderList = async () => {
    setIsCreatingNew(true);
    try {
      // Save current order list first
      await handleSave();
      
      // Create new order list
      const result = await createOrderList(orderId);
      if (result.success && result.orderListId) {
        router.push(`/bestellingen/${orderId}?orderListId=${result.orderListId}`);
      } else {
        console.error('Failed to create new order list');
      }
    } catch (error) {
      console.error('Error creating new order list:', error);
    } finally {
      setIsCreatingNew(false);
    }
  };

  return (
    <div className="w-full mt-8 flex md:justify-center md:gap-4">
      <button
        onClick={handlePrevious}
        disabled={isFirstOrderList || isNavigating || isSaving || isCreatingNew}
        className="flex-1 md:flex-none px-6 py-3 bg-beige text-foreground md:rounded-md hover:bg-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isNavigating ? 'Laden...' : 'Vorige'}
      </button>
      <button
        onClick={handleClose}
        disabled={isSaving || isCreatingNew || isNavigating}
        className="flex-1 md:flex-none px-6 py-3 bg-purple text-white md:rounded-md hover:bg-lila transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Opslaan...' : 'Afsluiten'}
      </button>
      {isLastOrderList ? (
        <button
          onClick={handleNewOrderList}
          disabled={isCreatingNew || isSaving || isNavigating}
          className="flex-1 md:flex-none px-6 py-3 bg-purple text-white md:rounded-md hover:bg-lila transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingNew ? 'Aanmaken...' : 'Nieuwe Bestellijst'}
        </button>
      ) : (
        <button
          onClick={handleNext}
          disabled={isNavigating || isSaving || isCreatingNew}
          className="flex-1 md:flex-none px-6 py-3 bg-purple text-white md:rounded-md hover:bg-lila transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isNavigating ? 'Laden...' : 'Volgende'}
        </button>
      )}
    </div>
  );
}

