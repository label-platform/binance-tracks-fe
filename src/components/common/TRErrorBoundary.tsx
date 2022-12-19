import React from 'react';
import { TRButton } from './buttons/button';
import { Column } from './flex';
import { TRLabel } from './labels/label';

interface Props {
    children: JSX.Element | JSX.Element[];
}

interface State {
    hasError: boolean;
}

/* TODO:: 에러 핸들링 하기  */
export default class TRGlobalErrorBoundary extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_error) {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log(error, errorInfo);
    }

    render() {
        const { hasError } = this.state;

        if (hasError) {
            return (
                <Column gap={1} sx={{ width: '100%', height: '100%' }}>
                    <TRLabel weight="bold" sizing="ml">
                        Error has been occurred.
                    </TRLabel>
                    <TRButton onClick={() => window.location.reload()}>Reload</TRButton>
                </Column>
            );
        }
        const { children } = this.props;
        return children;
    }
}
