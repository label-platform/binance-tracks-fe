import { Column, Row } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { LabelRound } from '@components/common/labels/label-round';
import { ListContainer } from '@components/common/list-container';
import { useTheme } from '@emotion/react';
import { ATTRIBUTE, QUALITY } from '@models/common.interface';
import { useContext } from 'react';
import { useFilterState, useMarketPlacefilterDispatch } from 'src/recoil/filter';
import { FilterIdContext } from './drawer-filter';

const attributes = [ATTRIBUTE.COMFORT, ATTRIBUTE.EFFICIENCY, ATTRIBUTE.LUCK, ATTRIBUTE.RESILIENCE].map((item) =>
    item.toLowerCase()
);

export function AttributeFilter() {
    const filterDispatch = useMarketPlacefilterDispatch();
    const filterId = useContext(FilterIdContext);
    const filterState = useFilterState(filterId);

    const {
        clesson: { attribute: attributeColors },
    } = useTheme();

    const handleOptionClick = (e) => {
        filterDispatch.set(filterId, { attribute: e.target.id });
    };

    const handleOptionReClick = () => {
        filterDispatch.unset(filterId, 'attribute');
    };

    return (
        <Column alignItems="flex-start" style={{ width: '100%', gap: '20px', height: '173px' }}>
            <TRLabel style={{ textTransform: 'capitalize' }} weight="bold">
                Attribute
            </TRLabel>
            <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                <ListContainer style={{ width: '100%', gap: '20px' }}>
                    {attributes.map((attribute) => (
                        <LabelRound
                            weight="bold"
                            sizing="xs"
                            color={attributeColors[attribute]}
                            variant={filterState?.attribute === attribute ? 'contained' : 'outlined'}
                            key={attribute}
                            style={{ textTransform: 'capitalize', height: '28px' }}
                            asLabel={attribute}
                            id={attribute}
                            onClick={filterState?.attribute === attribute ? handleOptionReClick : handleOptionClick}
                        />
                    ))}
                </ListContainer>
            </div>
        </Column>
    );
}
