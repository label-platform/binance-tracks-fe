import { NextComponentType } from 'next';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { ObserverDebug } from './observer-debug';

export function withRecoil(Component: NextComponentType): React.FC<any> {
    Component.displayName = 'nextRoot';
    RecoilRoot.displayName = 'recoilRootStore';
    // eslint-disable-next-line react/display-name
    return (props: any) => (
        <RecoilRoot>
            <ObserverDebug />
            <Component {...props} />
        </RecoilRoot>
    );
}
