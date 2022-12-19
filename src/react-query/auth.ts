import { SECOND } from '@constants/common';
import { core } from '@utils/core/core';
import { getSecretFromQR } from '@utils/utilities';
import Jimp from 'jimp';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { UserQueryKey } from './user';

const QUERYKEY = 'AUTH';

export const useLoginQuery = () => {
    const queryClient = useQueryClient();
    const sendVcode = useMutation(({ email }: { email: string }) => {
        return core.auth.sendVcode(email);
    });

    const loginByPassword = useMutation(
        ({ email, password }: { email: string; password: string }) => {
            return core.auth.loginByPassword({ email, password });
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([UserQueryKey.SelfInfo]);
            },
        }
    );

    const loginByVcode = useMutation(
        ({ email, verificationCode }: { email: string; verificationCode: string }) => {
            return core.auth.loginByVcode({ email, otp: verificationCode });
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([UserQueryKey.SelfInfo]);
            },
        }
    );

    return { sendVcode, loginByPassword, loginByVcode };
};

export const useGetOTPQuery = ({ enabled = true }) => {
    const { data, isError, isLoading } = useQuery(
        [QUERYKEY],
        async () => {
            const buffers = await core.auth.createOTPQR();
            const image = await Jimp.read(buffers);
            return {
                url: await image.getBase64Async('image/png'),
                secret: await getSecretFromQR(image.bitmap),
            };
        },
        {
            retry: 3,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            enabled,
            onError(error) {
                console.log(error);
            },
        }
    );
    return { data, isError, isLoading };
};

export const useConfirmOTPBeforeRegiserQuery = () => {
    const queryClient = useQueryClient();
    const { mutate } = useMutation(
        async ({ code, email, otp }: { code: string; email: string; otp: string }) => {
            await core.auth.confirmVerificationCode(email, otp);
            await core.auth.confirmOTPBeforeRegister(code);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([UserQueryKey.SelfInfo]);
            },
        }
    );
    return { mutate };
};

export const useConfirmEmailWithOTPQuery = () => {
    const queryClient = useQueryClient();
    const { mutate } = useMutation(
        async ({ email, otp }: { email: string; otp: string }) => {
            await core.auth.confirmVerificationCode(email, otp);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([UserQueryKey.SelfInfo]);
            },
        }
    );
    return { mutate };
};

export const useConfirmOTP = () => {
    const { mutate } = useMutation(async ({ code }: { code: string }) => {
        return await core.auth.confirmOTP(code);
    });
    return { mutate };
};

export const useUpdatePassword = () => {
    const { mutate, isLoading } = useMutation(
        ({ email, password, vcode }: { email: string; password: string; vcode: string }) => {
            return core.auth.updatePassword(email, password, vcode);
        }
    );
    return { mutate, isLoading };
};

export const useSetOtpEnable = () => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation(
        async (enable: boolean) => {
            if (enable) {
                return await core.auth.setOtpEnable();
            }
            return await core.auth.setOtpDisable();
        },
        {
            onSuccess() {
                queryClient.invalidateQueries([UserQueryKey.SelfInfo]);
            },
        }
    );
    return { mutate, isLoading };
};
