import styled from '@emotion/styled';
import { Stack, StackProps } from '@mui/material';
import React, { DOMAttributes } from 'react';
import { ExtendStyleProps } from 'types/track-const-types';

const StackeBase = styled(Stack)`
    box-sizing: border-box;
`;

interface ItemProps extends DOMAttributes<HTMLDivElement>, ExtendStyleProps {
    selfAlign?: StackProps['alignItems'];
    range?: number;
}

interface DividerProps {
    size?: number;
    color?: string;
}

const RowDivider = (props: DividerProps) => {
    const { color = 'rgba(255, 255, 255, 0.2)', size = 1 } = props;
    return <div style={{ height: '100%', boxSizing: 'border-box', backgroundColor: color, width: `${size}px` }} />;
};

const ColumnDivider = (props: DividerProps) => {
    const { color = 'rgba(255, 255, 255, 0.2)', size = 1 } = props;
    return <div style={{ width: '100%', boxSizing: 'border-box', backgroundColor: color, height: `${size}px` }} />;
};

export const Row = React.forwardRef((props: Omit<StackProps, 'direction'>, ref: any) => {
    const { children, justifyContent = 'center', alignItems = 'center', ...otherProps } = props;
    return (
        <StackeBase ref={ref} alignItems={alignItems} justifyContent={justifyContent} direction="row" {...otherProps}>
            {children}
        </StackeBase>
    );
});
Row.displayName = 'Row';

export const FlexItem = React.forwardRef((props: ItemProps, ref: any) => {
    const { children, selfAlign = 'stretch', range = 1, style = {}, ...rest } = props;

    return (
        <div style={{ ...style, alignItems: selfAlign as any, flex: range }} {...rest} ref={ref}>
            {children}
        </div>
    );
});

FlexItem.displayName = 'FlexItem';

export const Column = React.forwardRef((props: Omit<StackProps, 'direction'>, ref: any) => {
    const { children, justifyContent = 'center', alignItems = 'center', ...otherProps } = props;
    return (
        <StackeBase
            ref={ref}
            direction="column"
            justifyContent={justifyContent}
            alignItems={alignItems}
            {...otherProps}
        >
            {children}
        </StackeBase>
    );
});

Column.displayName = 'Column';

export const TRDivider = {
    Column: ColumnDivider,
    Row: RowDivider,
};
