// res.data.list[0].bills[0]
export interface BillListItem {
  id: number;
  pay_type: number;
  amount: string;
  date: string;
  ctime: string;
  mtime: null | string;
  type_id: number;
  remark: string;
}

export interface BillDetail extends BillListItem {
  user_id: number;
  lastModifiedTime?: string;
}

// res.data.list[0].bills
export type BillList = BillListItem[];

// res.data.list[0]
export interface Bill {
  date: string;
  bills: BillList;
}

// res.data
export interface BillListData {
  list: Bill[];
  totalExpense: number;
  totalIncome: number;
  totalPage: number;
}
