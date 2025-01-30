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

    // We never invalidate the powerpoint vouchers so we can make the demo
    // again and again
    if (isVoucherAPowerPointVoucher(voucher.code)) {
      const result = {
        showError: false,
        isValid: true,
        voucher: {
          ...voucher,
          isAlreadyUsed: false,
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
        ? 'Der Gutschein wurde bereits entwertet'
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

export async function redeemVoucher(voucherId: string) {
  try {
    const code = voucherId.toUpperCase();
    console.log(`Got voucher ${voucherId} to redeem`);
    const kv = kvClient();
    const voucher = await kv.get<Voucher>(code);

    const redeemedVoucher: Voucher = {
      ...voucher,
      isAlreadyUsed: true,
      code: code,
    };

    console.log(
      `try to update ${voucherId} with ${JSON.stringify(redeemedVoucher, null, 2)}`
    );
    await kv.set(code, redeemedVoucher);
    console.log(`Redeemed ${voucherId}!`);
    return true;
  } catch (e) {
    console.log(
      `Something went wrong during redeeming voucher ${voucherId}`,
      e
    );
    return false;
  }
}

function isQRCodeValid(qrCode: string) {
  const lowerCase = qrCode.toLowerCase();
  const forgroundVoucher = 'PC012576543214950956'.toLowerCase();

  return lowerCase.startsWith('pc') && qrCode !== forgroundVoucher;
}

function logResult(voucherState: VoucherValidateState) {
  console.log(`sende result backe: ${JSON.stringify(voucherState, null, 2)}`);
}

function isVoucherAPowerPointVoucher(qrCode: string) {
  const backgroundVoucher = 'PC012512345674950956';
  return qrCode === backgroundVoucher;
}
