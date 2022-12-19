import styled from '@emotion/styled';
import { FormControlLabel, Modal, Radio, RadioGroup } from '@mui/material';
import React, { DOMAttributes, Reducer, useCallback, useContext, useEffect, useReducer } from 'react';

import { useUnmount } from 'react-use';
import { TRLabel } from '../labels/label';
import { CustomDialog } from '../modals/dialog';
import { TRRadio } from './radio';

const initialState: { value?: string; isOpen?: boolean; options?: string[]; name: string } = {
    value: undefined,
    isOpen: false,
    options: [],
    name: '',
};

const dispatchType = {
    CLOSE: 'close',
    OPEN: 'open',
    SELECT: 'select',
    CLEAR: 'clear',
} as const;

type DrowdownDispatch = { type: typeof dispatchType[keyof typeof dispatchType]; payload?: any };

const DropdownContext = React.createContext<
    typeof initialState & { dispatch?: { [key: string]: (value?: string) => void } }
>({ ...initialState });

function DropdownModal(props: any) {
    const { children } = props;
    const { isOpen, name, value, dispatch } = useContext(DropdownContext);
    const handleDropdownCloseClick = () => {
        dispatch.closeDropdown();
    };

    return (
        <CustomDialog
            sx={{ '& .MuiPaper-root': { padding: '0px !important' } }}
            onClose={handleDropdownCloseClick}
            open={isOpen}
        >
            <RadioGroup
                sx={{
                    '& > label:not(:last-child)': { borderBottom: '1px solid rgba(255, 255, 255, 0.3)' },
                }}
                value={value}
                name={name}
            >
                {children}
            </RadioGroup>
        </CustomDialog>
    );
}

interface TriggerProps {
    as: React.ReactNode;
}

function Trigger(props: TriggerProps) {
    const { as } = props;
    const { dispatch, isOpen } = useContext(DropdownContext);

    const handleTriggerClick = () => {
        if (isOpen) {
            dispatch.closeDropdown();
            return;
        }
        dispatch.openDropdown();
    };
    return <span onClick={handleTriggerClick}>{as}</span>;
}

interface ItemProps {
    value: any;
    label: string;
    asLabel?: React.ReactElement;
    onClick(value: any): void;
}

function DropdownSingleItem(props: ItemProps) {
    const { value, label, onClick, asLabel } = props;
    const { dispatch } = useContext(DropdownContext);
    const handleItemClick = (e) => {
        onClick(e.target.value);
        dispatch.closeDropdown();
    };
    return (
        <FormControlLabel
            labelPlacement="start"
            onClick={handleItemClick}
            value={value}
            sx={{ justifyContent: 'space-between', margin: '0px', padding: '16px 20px' }}
            control={<TRRadio sx={{ padding: '0px' }} />}
            label={asLabel ? asLabel : <TRLabel style={{ fontSize: '20px' }}>{label}</TRLabel>}
        />
    );
}

const reducer: Reducer<typeof initialState, DrowdownDispatch> = (state, action): typeof initialState => {
    switch (action.type) {
        case dispatchType.SELECT: {
            return { ...state, value: action.payload };
        }
        case dispatchType.OPEN: {
            return { ...state, isOpen: true };
        }
        case dispatchType.CLOSE: {
            return { ...state, isOpen: false };
        }
        case dispatchType.CLEAR: {
            return { ...state, value: undefined };
        }
        default: {
            return { ...state };
        }
    }
};

interface Props extends DOMAttributes<HTMLSpanElement> {
    value: string;
    name: string;
}

export function Dropdown(props: Props) {
    const { children, value, name, ...rest } = props;
    const [state, dropdownDispatch] = useReducer(reducer, { ...initialState, value, name });

    useEffect(() => {
        dropdownDispatch({ type: dispatchType.SELECT, payload: value });
    }, [value]);

    useUnmount(() => {
        dropdownDispatch({ type: dispatchType.CLEAR });
    });

    const openDropdown = useCallback(() => {
        dropdownDispatch({ type: dispatchType.OPEN });
    }, [dropdownDispatch]);

    const closeDropdown = useCallback(() => {
        dropdownDispatch({ type: dispatchType.CLOSE });
    }, [dropdownDispatch]);

    const dispatch = {
        openDropdown,
        closeDropdown,
    };
    return (
        <DropdownContext.Provider value={{ ...state, dispatch }}>
            <span {...rest}>{children}</span>
        </DropdownContext.Provider>
    );
}

Dropdown.Modal = DropdownModal;
Dropdown.Trigger = Trigger;
Dropdown.Single = DropdownSingleItem;
