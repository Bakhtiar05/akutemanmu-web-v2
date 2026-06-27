import { DuitkuCreateInvoiceRequest, DuitkuCreateInvoiceResponse } from './types';
import { fetchDuitku, DUITKU_CONFIG } from './client';
import { generateDuitkuSignature } from './signature';

export async function createInvoice(params: Omit<DuitkuCreateInvoiceRequest, 'merchantCode' | 'signature' | 'callbackUrl' | 'returnUrl'>): Promise<DuitkuCreateInvoiceResponse> {
  if (!DUITKU_CONFIG.merchantCode || !DUITKU_CONFIG.apiKey) {
    throw new Error("Duitku configuration is missing (DUITKU_MERCHANT_CODE or DUITKU_API_KEY).");
  }

  const signature = generateDuitkuSignature(
    DUITKU_CONFIG.merchantCode,
    params.merchantOrderId,
    params.paymentAmount,
    DUITKU_CONFIG.apiKey
  );

  const payload = {
    merchantCode: DUITKU_CONFIG.merchantCode,
    signature: signature,
    callbackUrl: DUITKU_CONFIG.callbackUrl,
    returnUrl: DUITKU_CONFIG.returnUrl,
    ...params,
  };

  return await fetchDuitku<DuitkuCreateInvoiceResponse>('/createInvoice', payload);
}
