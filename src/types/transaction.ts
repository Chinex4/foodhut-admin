export type Transaction = {
  id: string;
  order_id: string;
  amount: number | string;
  status: string;
  payment_method?: string;
  reference?: string;
  created_at?: string;
};
