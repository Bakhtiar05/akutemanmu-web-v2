import crypto from 'crypto';

/**
 * Generates MD5 signature for Duitku API requests.
 */
export function generateDuitkuSignature(merchantCode: string, merchantOrderId: string, paymentAmount: number, apiKey: string): string {
  const payload = `${merchantCode}${merchantOrderId}${paymentAmount}${apiKey}`;
  return crypto.createHash('md5').update(payload).digest('hex');
}

/**
 * Generates MD5 signature for Duitku Webhook/Callback verification.
 */
export function verifyDuitkuCallbackSignature(merchantCode: string, amount: string, merchantOrderId: string, apiKey: string): string {
  const payload = `${merchantCode}${amount}${merchantOrderId}${apiKey}`;
  return crypto.createHash('md5').update(payload).digest('hex');
}
