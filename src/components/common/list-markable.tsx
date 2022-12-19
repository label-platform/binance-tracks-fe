import { Fragment } from 'react';
import { Row } from './flex';

interface Props {
    datas?: any[];
    asMark: React.ReactNode;
    asNotMark: React.ReactNode;
    markedKey: number;
    gap?: number;
}

export function ListMarkable(props: Props) {
    const { asMark, asNotMark, markedKey, datas = [], gap = 0 } = props;
    return (
        <Row gap={gap}>
            {datas.map((_, i) => (
                <Fragment key={i}>{i === markedKey ? asMark : asNotMark}</Fragment>
            ))}
        </Row>
    );
}
