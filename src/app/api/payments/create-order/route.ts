import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
    try {
        // **THE FIX IS HERE: The Razorpay instance is now created inside the function.**
        // This ensures the environment variables are loaded before the instance is created.
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const { amount, currency } = await request.json();

        if (!amount || !currency) {
            return NextResponse.json({ message: 'Amount and currency are required.' }, { status: 400 });
        }
        
        const options = {
            amount: amount * 100, // Amount in the smallest currency unit (e.g., paisa)
            currency,
            receipt: `receipt_order_${new Date().getTime()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);

    } catch (error) {
        console.error("Create Razorpay Order API Error:", error);
        // Provide a more specific error message if possible
        const message = error instanceof Error ? error.message : "Failed to create Razorpay order.";
        return NextResponse.json({ message }, { status: 500 });
    }
}