import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyDuitkuCallbackSignature } from '@/lib/payment/duitku/signature';

export async function POST(request: Request) {
  try {
    // Duitku sends data via application/x-www-form-urlencoded or application/json.
    // Handling JSON for this implementation, but it's good practice to support both.
    const contentType = request.headers.get('content-type') || '';
    
    let body: any = {};
    if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        formData.forEach((value, key) => {
            body[key] = value;
        });
    } else {
        body = await request.json();
    }

    const { merchantCode, amount, merchantOrderId, signature, reference, resultCode } = body;

    const apiKey = process.env.DUITKU_API_KEY || '';

    // 1. Verify signature
    const expectedSignature = verifyDuitkuCallbackSignature(merchantCode, amount, merchantOrderId, apiKey);
    
    if (signature !== expectedSignature) {
      console.error('Invalid Duitku Callback Signature');
      return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
    }

    // 2. Initialize Supabase Admin Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials missing for webhook');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Map Duitku resultCode to internal payment_status
    let paymentStatus = 'PENDING';
    if (resultCode === '00') {
      paymentStatus = 'PAID';
    } else if (resultCode === '01') {
      paymentStatus = 'PENDING';
    } else if (resultCode === '02') {
      paymentStatus = 'FAILED';
    }

    // 4. Update the payment record
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from('payments')
      .update({ payment_status: paymentStatus })
      .eq('provider_reference', merchantOrderId)
      .select('consultation_request_id')
      .single();

    if (paymentError || !paymentData) {
      console.error('Failed to update payment:', paymentError);
      return NextResponse.json({ error: 'Payment record not found or failed to update' }, { status: 500 });
    }

    // 5. Update the booking status if PAID
    if (paymentStatus === 'PAID') {
      const { error: bookingError } = await supabaseAdmin
        .from('consultation_requests')
        .update({ db_status: 'Waiting Admin Confirmation' })
        .eq('id', paymentData.consultation_request_id);
        
      if (bookingError) {
        console.error('Failed to update booking status:', bookingError);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
