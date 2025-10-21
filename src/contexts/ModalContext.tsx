import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AuthModal } from '../components/shared/AuthModal';
import { LowBalanceModal } from '../components/shared/LowBalanceModal';
import { UnlockModelModal, type UnlockModelModalOptions } from '../components/shared/UnlockModelModal';
import type { SubscriptionTier } from '../types/economy';

type ModalState =
  | { type: 'none' }
  | { type: 'auth' }
  | { type: 'lowBalance'; payload: LowBalanceOptions }
  | { type: 'unlockModel'; payload: UnlockModelModalOptions };

export interface LowBalanceOptions {
  requiredCredits?: number;
  onClose?: () => void;
  onPurchase?: (packId: string) => void;
  onSubscribe?: (tier: SubscriptionTier) => void;
  title?: string;
  description?: string;
}

interface ModalContextValue {
  openAuthModal: () => void;
  openLowBalanceModal: (options?: LowBalanceOptions) => void;
  openUnlockModelModal: (options: UnlockModelModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return ctx;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });

  const closeModal = useCallback(() => {
    setModalState((prev) => {
      if (prev.type !== 'none' && 'payload' in prev) {
        prev.payload?.onClose?.();
      }
      return { type: 'none' };
    });
  }, []);

  const openAuthModal = useCallback(() => {
    setModalState({ type: 'auth' });
  }, []);

  const openLowBalanceModal = useCallback((options?: LowBalanceOptions) => {
    setModalState({
      type: 'lowBalance',
      payload: options ?? {},
    });
  }, []);

  const openUnlockModelModal = useCallback((options: UnlockModelModalOptions) => {
    setModalState({
      type: 'unlockModel',
      payload: options,
    });
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openAuthModal,
        openLowBalanceModal,
        openUnlockModelModal,
        closeModal,
      }}
    >
      {children}

      {modalState.type === 'auth' && <AuthModal onClose={closeModal} />}

      {modalState.type === 'lowBalance' && (
        <LowBalanceModal
          isOpen
          onClose={closeModal}
          requiredCredits={modalState.payload.requiredCredits}
          onPurchase={modalState.payload.onPurchase}
          onSubscribe={modalState.payload.onSubscribe}
          title={modalState.payload.title}
          description={modalState.payload.description}
        />
      )}

      {modalState.type === 'unlockModel' && (
        <UnlockModelModal
          {...modalState.payload}
          onClose={closeModal}
        />
      )}
    </ModalContext.Provider>
  );
}
