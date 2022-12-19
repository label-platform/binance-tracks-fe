import { SECOND } from '@constants/common';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { Message, MessageGuard, MessageType } from './interface';

const messageState = atom<Array<Message>>({
    key: 'messageState',
    default: [],
});

const messageAccumulateCount = atom({
    key: 'messageAccumulateCount',
    default: 1,
});

export const useMessageState = () => {
    return useRecoilValue(messageState);
};

export const useMessageDispatch = () => {
    const [messages, setMessage] = useRecoilState(messageState);
    const [count, setCount] = useRecoilState(messageAccumulateCount);

    const close = (messageID: string) => {
        setMessage((prevMessages) => [...prevMessages.filter((message) => message.id !== messageID)]);
    };

    const closeAll = () => {
        setMessage([]);
    };

    const open = ({
        content = null,
        duration = SECOND * 3,
        isConfirm = false,
        type = 'none',
        position = {
            horizontal: 'center',
            vertical: 'center',
        },
    }: Partial<Message>): (() => void) => {
        const messageKey = `message-${count}`;
        setCount((curValue) => curValue + 1);
        const message: Message = {
            id: messageKey,
            content,
            duration,
            isConfirm,
            type,
            position,
        };
        setMessage((messages) => [...messages, message]);

        const closeTimeoutID = setTimeout(() => {
            close(messageKey);
        }, duration);

        return () => {
            if (type !== 'loading') return;
            clearTimeout(closeTimeoutID);
            close(messageKey);
        };
    };

    const message: Record<MessageGuard, (props: Partial<Message> | string) => void> = {
        [MessageType.ERROR]: (props) => {
            if (typeof props === 'string') {
                open({ content: props, type: MessageType.ERROR });
                return;
            }
            open({ ...props, type: MessageType.ERROR });
        },
        [MessageType.LOADING]: (props) => {
            if (typeof props === 'string') {
                open({ content: props, type: MessageType.LOADING, duration: SECOND * 1000 });
                return;
            }
            open({ ...props, type: MessageType.LOADING, duration: SECOND * 1000 });
        },
        [MessageType.NONE]: (props) => {
            if (typeof props === 'string') {
                open({ content: props, type: MessageType.NONE });
                return;
            }
            open({ ...props, type: MessageType.NONE });
        },
        [MessageType.SUCCESS]: (props) => {
            if (typeof props === 'string') {
                open({ content: props, type: MessageType.SUCCESS });
                return;
            }
            open({ ...props, type: MessageType.SUCCESS });
        },
        [MessageType.WARNING]: (props) => {
            if (typeof props === 'string') {
                open({ content: props, type: MessageType.WARNING });
                return;
            }
            open({ ...props, type: MessageType.WARNING });
        },
    };

    const confirm: Record<MessageGuard, (props: Partial<Message>) => void> = {
        [MessageType.ERROR]: (props) => {
            if (typeof props === 'string') {
                open({ content: props, type: MessageType.ERROR, isConfirm: true, duration: SECOND * 1000 });
                return;
            }
            open({ ...props, type: MessageType.ERROR, isConfirm: true, duration: SECOND * 1000 });
        },
        [MessageType.LOADING]: (props) => {
            if (typeof props === 'string') {
                open({
                    content: 'props',
                    type: MessageType.LOADING,
                    duration: SECOND * 1000,
                    isConfirm: true,
                });
                return;
            }
            open({
                ...props,
                type: MessageType.LOADING,
                duration: SECOND * 1000,
                isConfirm: true,
            });
        },
        [MessageType.NONE]: (props) => {
            if (typeof props === 'string') {
                open({ content: props, type: MessageType.NONE, isConfirm: true, duration: SECOND * 1000 });
                return;
            }
            open({ ...props, type: MessageType.NONE, isConfirm: true, duration: SECOND * 1000 });
        },
        [MessageType.SUCCESS]: (props) => {
            if (typeof props === 'string') {
                open({ content: props, type: MessageType.SUCCESS, isConfirm: true, duration: SECOND * 1000 });
                return;
            }
            open({ ...props, type: MessageType.SUCCESS, isConfirm: true, duration: SECOND * 1000 });
        },
        [MessageType.WARNING]: (props) => {
            if (typeof props === 'string') {
                open({ content: props, type: MessageType.WARNING, isConfirm: true, duration: SECOND * 1000 });
                return;
            }
            open({ ...props, type: MessageType.WARNING, isConfirm: true, duration: SECOND * 1000 });
        },
    };

    return {
        message,
        confirm,
        closeAll,
    };
};
