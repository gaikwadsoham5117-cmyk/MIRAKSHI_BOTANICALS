export interface PaymentOrderParams {
  orderId: string;
  amount: number;
  customerName: string;
  phone: string;
  email?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  transactionId?: string;
  paymentMethod: string;
  error?: string;
}

export const paymentService = {
  /**
   * Initializes an online payment session (e.g. Razorpay, UPI, Cashfree)
   */
  async createOnlinePaymentOrder(params: PaymentOrderParams): Promise<{
    paymentSessionId: string;
    gateway: string;
    amount: number;
  }> {
    // Modular payment session creation
    return {
      paymentSessionId: 'PAY_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      gateway: 'BotanicalPaySecure',
      amount: params.amount
    };
  },

  /**
   * Backend payment verification
   */
  async verifyPayment(orderId: string, transactionId: string): Promise<PaymentVerificationResult> {
    // Simulate secure verification validation
    if (!orderId || !transactionId) {
      return {
        success: false,
        paymentMethod: 'online',
        error: 'Invalid payment parameters for verification'
      };
    }

    return {
      success: true,
      transactionId,
      paymentMethod: 'UPI / Online Banking'
    };
  }
};
