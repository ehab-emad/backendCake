export type PaymentGateway = 'stripe' | 'tamara' | 'mimo';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled' | 'under_review';

export interface PaymentDetails {
  amount: number;
  currency?: string;
  description?: string;
  customerEmail: string;
  metadata?: Record<string, any>;
  successUrl?: string;
  cancelUrl?: string;
  [key: string]: any; // Allow additional properties
}

export interface PaymentResult {
  success: boolean;
  status: PaymentStatus;
  paymentId?: string;
  redirectUrl?: string;
  error?: string;
}
