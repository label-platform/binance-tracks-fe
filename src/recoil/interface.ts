import React from 'react';

export const MessageType = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    LOADING: 'loading',
    NONE: 'none',
} as const;

export const VERTICAL = {
    TOP: 'top',
    CENTER: 'center',
    BOTTOM: 'bottom',
} as const;

export const HORIZONTAL = {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right',
} as const;

export type MessageGuard = typeof MessageType[keyof typeof MessageType];
export type VerticalGuard = typeof VERTICAL[keyof typeof VERTICAL];
export type HorizontalGuard = typeof HORIZONTAL[keyof typeof HORIZONTAL];

export interface Message {
    id: string;
    type: MessageGuard;
    content: React.ReactNode;
    isConfirm: boolean;
    duration: number;
    position: {
        vertical: VerticalGuard;
        horizontal: HorizontalGuard;
    };
    executeAfterConfirm?: () => void;
}
