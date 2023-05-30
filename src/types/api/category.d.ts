export interface Category {
  id: number;
  pay_type: number;
  name: string;
  en_name: string;
  user_id: number;
}

export type CategoryList = Category[];
