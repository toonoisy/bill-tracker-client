export interface StatsItem {
  type_id: number;
  pay_type: number;
  total_amount: string;
}

export type StatsList = StatsItem[];

export interface Stats {
  total_expense: string;
  total_income: string;
  list: StatsList;
}
