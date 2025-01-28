'use server';
import kvClient from '@/lib/kv-client';
import { Voucher } from '../domain/voucher';
import { resolve } from 'path';

export type VoucherValidateState = {
  voucher: Voucher;
  showError?: boolean;
  errorMessage?: string;
};

export async function isVoucherValid(
  voucherState: VoucherValidateState
): Promise<VoucherValidateState> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (!voucherState) {
    return {} as VoucherValidateState;
  }
  const voucher = voucherState.voucher;
  if (!isQRCodeValid(voucher.code)) {
    return {
      showError: true,
      errorMessage: 'Der angegebne QR-Code ist ungültig',
      voucher: {
        ...voucher,
        isValid: false,
      },
    };
  }

  try {
    const kv = kvClient();
    const qrcode = await kv.get<{ isAlreadyUsed: boolean }>(voucher.code);

    if (!qrcode) {
      await kv.set(voucher.code, { isAlreadyUsed: false });
      return {
        showError: false,
        voucher: {
          ...voucher,
          isAlreadyUsed: false,
        },
      };
    }

    return {
      showError: !qrcode.isAlreadyUsed,
      errorMessage: !qrcode.isAlreadyUsed
        ? 'Der Gutschein wurde schon entwerted'
        : undefined,
      voucher: {
        ...voucher,
        isAlreadyUsed: qrcode.isAlreadyUsed,
      },
    };
  } catch (e) {
    console.error(`There was an error by getting the ${voucher} QR-Code`, e);
    return {
      showError: true,
      voucher,
    };
  }
}

function isQRCodeValid(qrCode: string) {
  const lowerCase = qrCode.toLocaleLowerCase();
  return lowerCase.startsWith('pc');
}
