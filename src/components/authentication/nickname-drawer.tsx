import { TRButton } from '@components/common/buttons/button';
import { Column, Row } from '@components/common/flex';
import { Drawer } from '@components/common/drawer';
import { DRAWER_ID } from '@constants/common';
import { TRInput } from '@components/common/inputs/input';
import { HeaderDrawer } from '@components/common/header-drawer';
import { yupResolver } from '@hookform/resolvers/yup';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useTracksRouter } from '@hooks/use-tracks-router';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { useUpdateUserName, useUserSelfInfoQuery } from 'src/react-query/user';
import { doEither, sendToNative } from '@utils/native';
import { NATIVE_EVENT, NATIVE_STACK } from '@constants/native-event';
import { TokenManagerSingleTon } from '@services/token';

const schema = Yup.object().shape({
    nickname: Yup.string()
        .required('Required Input')
        .matches(/^[a-zA-Z][a-zA-Z0-9_.]*$/, 'Invalid Format')
        .max(20, 'It must be 20 characters or less.'),
});
export function NicknameDrawer() {
    const router = useTracksRouter();
    const { close } = useDrawerDispatch();
    const { mutate } = useUpdateUserName();
    const { user } = useUserSelfInfoQuery();

    const {
        register,
        trigger,
        formState: { errors, isValid },
        getFieldState,
        getValues,
        setError,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            nickname: null,
        },
    });

    const handleEnterClick = async () => {
        await trigger('nickname');
        const { error } = getFieldState('nickname');
        if (error) return;
        const code = getValues('nickname');
        mutate(code, {
            onSuccess() {
                close(DRAWER_ID.NICKNAME);
                doEither(
                    () => {
                        router.replace('/');
                    },
                    () => {
                        sendToNative({
                            name: NATIVE_EVENT.LOGIN,
                            params: {
                                user: { ...user._user },
                                accessToken: TokenManagerSingleTon.getInstance().accessToken,
                                refreshToken: TokenManagerSingleTon.getInstance().refreshToken,
                            },
                        });
                    }
                );
            },
            onError() {
                setError('nickname', {
                    message: 'Username already exists',
                });
            },
        });
    };

    const handleCloseButton = () => {
        close(DRAWER_ID.NICKNAME);
    };

    return (
        <Drawer from="right" widthPercent={100} drawerID={DRAWER_ID.NICKNAME}>
            <Column
                style={{
                    // width: '312px',
                    marginBottom: 'auto',
                    marginLeft: '24px',
                    marginRight: '24px',
                }}
            >
                <Row alignSelf="stretch" justifyContent="space-between">
                    <HeaderDrawer
                        asLeftIcon={<ChevronLeft onClick={handleCloseButton} sx={{ fill: 'white' }} />}
                        title="Make Your Nickname"
                    />
                </Row>
                <TRInput
                    data-test-id="activation-code"
                    {...register('nickname')}
                    errors={errors.nickname}
                    inputStyle={{ width: '100%' }}
                    helperText="Nickname"
                    style={{ marginTop: '20px' }}
                />
            </Column>
            <Column>
                <TRButton
                    data-test-id="submit-activation-code"
                    onClick={handleEnterClick}
                    sx={{ marginBottom: '20px' }}
                    sizing="xl"
                    type="submit"
                    disabled={!isValid}
                >
                    Get Started
                </TRButton>
            </Column>
        </Drawer>
    );
}
