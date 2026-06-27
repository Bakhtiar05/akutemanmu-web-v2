const isSandbox = process.env.DUITKU_SANDBOX === 'true';

export const DUITKU_API_URL = isSandbox 
  ? 'https://api-sandbox.duitku.com/api/merchant' 
  : 'https://api-prod.duitku.com/api/merchant';

export const DUITKU_CONFIG = {
  merchantCode: process.env.DUITKU_MERCHANT_CODE || '',
  apiKey: process.env.DUITKU_API_KEY || '',
  callbackUrl: process.env.DUITKU_CALLBACK_URL || '',
  returnUrl: process.env.DUITKU_RETURN_URL || '',
};

export async function fetchDuitku<T>(endpoint: string, body: any): Promise<T> {
  const url = `${DUITKU_API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorText = await response.text();
    throw new Error(`Duitku API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  if (data.statusCode && data.statusCode !== '00') {
      throw new Error(`Duitku API Failed: ${data.statusMessage || 'Unknown error'} (Code: ${data.statusCode})`);
  }

  return data as T;
}
