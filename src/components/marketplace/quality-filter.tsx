import { Column, Row } from '@components/common/flex';
import { TRLabel } from '@components/common/labels/label';
import { LabelRound } from '@components/common/labels/label-round';
import { ListContainer } from '@components/common/list-container';
import { useTheme } from '@emotion/react';
import { QUALITY } from '@models/common.interface';
import { useContext } from 'react';
import { useFilterState, useMarketPlacefilterDispatch } from 'src/recoil/filter';
import { FilterIdContext } from './drawer-filter';

const qualities = [QUALITY.COMMON, QUALITY.UNCOMMON, QUALITY.RARE, QUALITY.EPIC, QUALITY.LEGENDARY].map((item) =>
    item.toLowerCase()
);

export function QualityFilter() {
    const filterDispatch = useMarketPlacefilterDispatch();
    const filterId = useContext(FilterIdContext);
    const filterState = useFilterState(filterId);

    const {
        clesson: { quality: qualityColors },
    } = useTheme();

    const handleOptionClick = (e) => {
        filterDispatch.set(filterId, { quality: e.target.id });
    };

    const handleOptionReClick = () => {
        filterDispatch.unset(filterId, 'quality');
    };

    return (
        <Column alignItems="flex-start" style={{ width: '100%', gap: '20px', height: '173px' }}>
            <TRLabel style={{ textTransform: 'capitalize' }} weight="bold">
                quality
            </TRLabel>
            <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                <ListContainer style={{ width: '100%', gap: '20px' }}>
                    {qualities.map((quality) => (
                        <LabelRound
                            weight="bold"
                            sizing="xs"
                            color={qualityColors[quality]}
                            variant={filterState?.quality === quality ? 'contained' : 'outlined'}
                            key={quality}
                            style={{ textTransform: 'capitalize', height: '28px' }}
                            asLabel={quality}
                            id={quality}
                            onClick={filterState?.quality === quality ? handleOptionReClick : handleOptionClick}
                        />
                    ))}
                </ListContainer>
            </div>
        </Column>
    );
}
