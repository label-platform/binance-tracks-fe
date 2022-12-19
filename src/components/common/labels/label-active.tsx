import React, { DOMAttributes } from 'react';

interface Props extends DOMAttributes<HTMLDivElement> {
    isActive?: boolean;
    asActive: React.ReactElement;
    asInActive: React.ReactElement;
}

export function LabelActive(props: Props) {
    const { isActive, asActive, asInActive, ...rest } = props;
    return isActive ? React.cloneElement(asActive, rest) : React.cloneElement(asInActive, rest);
}
