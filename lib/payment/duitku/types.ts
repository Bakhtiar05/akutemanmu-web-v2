export interface DuitkuItemDetails {
  name: string;
  price: number;
  quantity: number;
}

export interface DuitkuCreateInvoiceRequest {
  paymentAmount: number;
  merchantOrderId: string;
  productDetails: string;
  additionalParam?: string;
  merchantUserInfo: string;
  customerVaName: string;
  email: string;
  phoneNumber: string;
  itemDetails: DuitkuItemDetails[];
  customerDetail?: any;
  returnUrl: string;
  callbackUrl: string;
  expiryPeriod?: number; // In minutes
}

export interface DuitkuCreateInvoiceResponse {
  merchantCode: string;
  reference: string;
  paymentUrl: string;
  statusCode: string;
  statusMessage: string;
}

export interface DuitkuCallbackPayload {
  merchantCode: string;
  amount: string;
  merchantOrderId: string;
  productDetail: string;
  additionalParam: string;
  paymentMethod: string;
  resultCode: string;
  merchantUserId: string;
  reference: string;
  signature: string;
  publisherOrderId?: string;
  spUserHash?: string;
  settlementDate?: string;
  issuerCode?: string;
}
