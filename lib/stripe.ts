import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16"
});

export const PLATFORM_FEE_DEFAULTS = {
  verifiedBps: 1500,
  unverifiedBps: 2500
};

export function calculateApplicationFee(amount: number, feeBps: number) {
  return Math.round((amount * feeBps) / 10000);
}
