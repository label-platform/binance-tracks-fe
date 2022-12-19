import { useModalDispatch, useModalState } from 'src/recoil/modal';
import confirm from './confirm';
import type { Props as DialogProps } from './dialog';
import { CustomDialog } from './dialog';

interface Props extends Omit<DialogProps, 'open' | 'title'> {
    modalID: string;
    visible?: boolean;
}

export function Modal(props: Props) {
    const { modalID, visible, ...rest } = props;
    const { close } = useModalDispatch();
    const { visible: visibleState } = useModalState(modalID);
    const modalVisible = visible !== undefined ? visible : visibleState;
    const handleModalClose = (e) => {
        e.stopPropagation();
        close(modalID);
    };

    return <CustomDialog open={modalVisible} onClose={handleModalClose} {...rest} />;
}

Modal.confirm = confirm;
