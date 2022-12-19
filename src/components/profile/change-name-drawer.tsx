import { TRButton } from '@components/common/buttons/button';
import { Drawer } from '@components/common/drawer';
import { Column, Row } from '@components/common/flex';
import { HeaderDrawer } from '@components/common/header-drawer';
import { TRInput } from '@components/common/inputs/input';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';
import { DRAWER_ID } from '@constants/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronLeft } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useUpdateUserName, useUserSelfInfoQuery } from 'src/react-query/user';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { useMessageDispatch } from 'src/recoil/message';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    name: Yup.string()
        .required('please input name')
        .matches(/^[a-zA-Z][a-zA-Z0-9_.]*$/, 'Invalid Format')
        .max(20, 'It must be 20 characters or less.'),
});

export function ChangeNameDrawer() {
    const { close } = useDrawerDispatch();
    const { mutate } = useUpdateUserName();
    const { message } = useMessageDispatch();
    const { user, isLoading } = useUserSelfInfoQuery();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        setError,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            name: user.name,
        },
    });

    const handleCloseClick = () => {
        close(DRAWER_ID.MY_PROFILE_USER_NAME);
    };

    const handleSaveClick = (form) => {
        mutate(form.name, {
            onSuccess() {
                message.success('Successfully Set');
                reset();
                close(DRAWER_ID.MY_PROFILE_USER_NAME);
            },
            onError() {
                setError('name', {
                    message: 'Username already exists',
                });
            },
        });
    };

    return (
        <Drawer paperSx={{ alignItems: 'center' }} widthPercent={100} drawerID={DRAWER_ID.MY_PROFILE_USER_NAME}>
            {!isLoading ? (
                <DrawerLayout>
                    <HeaderDrawer
                        asLeftIcon={<ChevronLeft onClick={handleCloseClick} sx={{ fill: 'white' }} />}
                        title="Change Name"
                    />
                    <Row sx={{ mb: 2 }} alignSelf="stretch">
                        <TRInput errors={errors.name} sx={{ width: '100%' }} helperText="Name" {...register('name')} />
                    </Row>
                    <Row alignSelf="stretch" sx={{ mt: 'auto', mb: 2 }}>
                        <TRButton disabled={!(isDirty && isValid)} onClick={handleSubmit(handleSaveClick)} sizing="xl">
                            Save
                        </TRButton>
                    </Row>
                </DrawerLayout>
            ) : null}
        </Drawer>
    );
}
