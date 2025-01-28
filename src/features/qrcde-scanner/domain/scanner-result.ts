export type Voucher = {
  checkingStatus: 'success' | 'fialure' | 'inProgress';
  message: string;
  code?: string;
};
