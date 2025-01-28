'use server';

import 'server-only';
import kvClient from '@/lib/kv-client';
import { Voucher } from '../domain/voucher';

export type VoucherValidateState = {
  voucher: Voucher;
  showError?: boolean;
  isValid?: boolean;
  errorMessage?: string;
};

export async function isVoucherValid(
  voucherState: VoucherValidateState
): Promise<VoucherValidateState> {
  console.log(`Chekcing ${JSON.stringify(voucherState, null, 2)}`);
  try {
    const kv = kvClient();
    const timeoutConfig = (await kv.get<{ inMs: number }>(
      'timeout-config'
    )) ?? {
      inMs: 2000,
    };
    await new Promise((resolve) => setTimeout(resolve, timeoutConfig?.inMs));
    if (!voucherState) {
      return {} as VoucherValidateState;
    }
    const voucher = voucherState.voucher;
    if (!isQRCodeValid(voucher.code)) {
      const result = {
        showError: true,
        isValid: false,
        errorMessage: 'Der angegebne QR-Code ist ungültig',
        voucher: {
          ...voucher,
          isValid: false,
        },
      };
      logResult(result);
      return result;
    }

    const qrcode = await kv.get<{ isAlreadyUsed: boolean }>(
      voucher.code.toLocaleUpperCase()
    );

    if (!qrcode) {
      await kv.set(voucher.code.toLocaleUpperCase(), { isAlreadyUsed: false });
      const resutl = {
        showError: false,
        isValid: true,
        voucher: {
          ...voucher,
          isAlreadyUsed: false,
        },
      };
      logResult(resutl);
      return resutl;
    }

    const result = {
      showError: qrcode.isAlreadyUsed,
      isValid: !qrcode.isAlreadyUsed,
      errorMessage: qrcode.isAlreadyUsed
        ? 'Der Gutschein wurde schon entwerted'
        : undefined,
      voucher: {
        ...voucher,
        isAlreadyUsed: qrcode.isAlreadyUsed,
      },
    };
    logResult(result);
    return result;
  } catch (e) {
    console.log(
      `There was an error by getting the ${JSON.stringify(voucherState, null, 2)} QR-Code`,
      e
    );

    const result = {
      showError: true,
      voucher: {
        ...voucherState.voucher,
      },
    };

    logResult(result);

    return result;
  }
}

function isQRCodeValid(qrCode: string) {
  const lowerCase = qrCode.toLocaleLowerCase();
  return lowerCase.startsWith('pc');
}

function logResult(voucherState: VoucherValidateState) {
  console.log(`sende result backe: ${JSON.stringify(voucherState, null, 2)}`);
}
