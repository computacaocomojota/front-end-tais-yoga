export interface PricingPlan {
  name: string;
  price: number;
  desc: string;
  features: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}
