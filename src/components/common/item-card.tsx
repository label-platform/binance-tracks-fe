import { Column } from '@components/common/flex';
import styled from '@emotion/styled';

export const ItemCard = styled(Column)`
    width: 148px;
    height: 237px;
    padding: 8px;
    gap: 10px;
    &:active {
        background-color: rgba(255, 255, 255, 0.12);
    }
`;
