import { CSSProperties } from 'react';

export type SizeGurad = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ColorGuard = 'primary' | 'error' | 'warning' | 'success' | 'dark' | 'light';
export type WeightGuard = 'medium' | 'bold' | 'extrabold';
export type VariantGuard = 'outlined' | 'none' | 'contained';
export interface ModalState {
    modalID: Set<string>;
}

export interface ExtendStyleProps {
    style?: CSSProperties;
}
