import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Column, Row } from '@components/common/flex';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { useFilterState, useMarketPlacefilterDispatch } from 'src/recoil/filter';
import { Drawer } from '@components/common/drawer';
import { LabelRound } from '@components/common/labels/label-round';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { TRSelectModal } from '@components/common/inputs/select';
import SortIcon from '@mui/icons-material/Sort';
import { TRButton } from '@components/common/buttons/button';
import { TRLabel } from '@components/common/labels/label';
import { useTheme } from '@emotion/react';
import { TRSlider } from '@components/common/inputs/slider';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

export const FilterIdContext = React.createContext('');
interface Props {
    drawerId?: string;
    filterId?: string;
    children?: React.ReactNode;
}
interface SingleProps {
    title: string;
    filterId?: string;
    options: string[];
    doBeforeClick?: () => void;
}
interface SliderProps {
    title: string;
    filterId?: string;

    max?: number;
}

const sortOptions = [
    { label: 'Lowest Price', value: 1 },
    { label: 'Highest Price', value: 2 },
    { label: 'Latest', value: 3 },
];

export const DrawerFilter = (props: Props) => {
    const { drawerId, filterId, children } = props;
    const drawerDispatch = useDrawerDispatch();
    const filterState = useFilterState(filterId);
    const filterDispatch = useMarketPlacefilterDispatch();
    const [option, setOption] = useState<number>();
    const optionLabel = useMemo(() => {
        const [item] = sortOptions.filter((item) => item.value === option);
        if (!item) return '';
        return item.label;
    }, [option]);
    const [filterOptionCount, setFilterOptionCount] = useState(0);
    const handleOpenDrawerButton = () => {
        drawerDispatch.open(drawerId);
    };
    const handleResetAndCloseButton = () => {
        drawerDispatch.close(drawerId);
        filterDispatch.clear(filterId);
    };
    const handleResetFilterButton = () => {
        filterDispatch.clear(filterId);
    };

    const handleCloseButton = () => {
        drawerDispatch.close(drawerId);
    };

    const handleOptionChange = (value: string) => {
        setOption(+value);
    };

    useEffect(() => {
        if (filterState) {
            setFilterOptionCount(Object.keys(filterState).length);
        }
    }, [filterState]);

    return (
        <FilterIdContext.Provider value={filterId}>
            <Row style={{ width: '100%' }} justifyContent="space-between">
                <TRSelectModal
                    name="sort options"
                    options={sortOptions}
                    onChange={handleOptionChange}
                    defaultValue={1}
                    value={option}
                    asTrigger={
                        <LabelRound
                            color="primary"
                            sizing="sm"
                            weight="bold"
                            asLabel={
                                optionLabel ? (
                                    <>
                                        {optionLabel}
                                        <ArrowDropDownRoundedIcon sx={{ fontSize: '20px' }} />
                                    </>
                                ) : (
                                    <>
                                        <SortIcon sx={{ fontSize: '20px' }} />
                                        Sort By
                                    </>
                                )
                            }
                            style={{
                                width: '135px',
                                height: '31px',
                                justifyContent: 'space-between',
                            }}
                        />
                    }
                />

                {/* <LabelRound
                    color="primary"
                    sizing="sm"
                    weight="bold"
                    asLabel={
                        <>
                            <FilterAltIcon sx={{ fontSize: '12px', marginRight: '8px' }} />
                            Filter {filterOptionCount === 0 ? '' : `(${filterOptionCount})`}
                        </>
                    }
                    onClick={handleOpenDrawerButton}
                    style={{ height: '31px', justifyContent: 'space-between', whiteSpace: 'nowrap' }}
                /> */}
            </Row>
            <Drawer
                paperSx={{ maxWidth: '312px', padding: '0px 24px' }}
                drawerID={drawerId}
                from="right"
                widthPercent={80}
                onClose={handleResetAndCloseButton}
            >
                <DrawerLayout style={{ height: '100%', width: '100%' }} justifyContent="space-between">
                    <Column justifyContent="flex-start" alignSelf="stretch" style={{ flex: 1 }}>
                        <Row
                            style={{ padding: '12px 0px', marginBottom: '36px' }}
                            alignSelf="stretch"
                            justifyContent="space-between"
                        >
                            <TRLabel weight="bold" sizing="sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Filter
                            </TRLabel>
                            <TRButton
                                variant="text"
                                sizing="sm"
                                color="light"
                                onClick={handleResetFilterButton}
                                disabled={!filterOptionCount}
                            >
                                <TRLabel weight="bold" disabled={!filterOptionCount} color="primary" sizing="sm">
                                    Clear Filter
                                </TRLabel>
                            </TRButton>
                        </Row>
                        <Column justifyContent="flex-start" style={{ flex: 1 }} alignSelf="stretch" gap={3}>
                            {children}
                        </Column>
                    </Column>
                    <Column style={{ padding: '26px 0px', width: '100%' }}>
                        <TRButton
                            variant="contained"
                            style={{ width: '100%', height: '56px' }}
                            onClick={handleCloseButton}
                        >
                            Confirm
                        </TRButton>
                    </Column>
                </DrawerLayout>
            </Drawer>
        </FilterIdContext.Provider>
    );
};

const DrawerFilterSingle = (props: SingleProps) => {
    const filterDispatch = useMarketPlacefilterDispatch();
    const filterId = useContext(FilterIdContext);
    const filterState = useFilterState(filterId);

    const theme = useTheme();
    const { title, options, doBeforeClick } = props;

    const handleOptionButton = (e) => {
        doBeforeClick && doBeforeClick();
        filterDispatch.set(filterId, { [title]: e.target.id });
    };

    const handleOptionReClickButton = () => {
        filterDispatch.unset(filterId, title);
    };

    useEffect(() => {
        filterDispatch.set(filterId, {});
    }, []);
    return (
        <Column alignItems="flex-start" style={{ width: '100%', gap: '20px' }}>
            <TRLabel style={{ textTransform: 'capitalize' }} weight="bold">
                {title}
            </TRLabel>
            {filterState ? (
                <Row style={{ width: '100%', flexWrap: 'wrap' }} gap={2}>
                    {options.map((option, index) => {
                        return filterState[title] === option ? (
                            <LabelRound
                                style={{ flex: 1 }}
                                asLabel={option}
                                variant="contained"
                                weight="bold"
                                sizing="xs"
                                key={index}
                                onClick={handleOptionReClickButton}
                            />
                        ) : (
                            <LabelRound
                                color={theme.palette.text.disabled}
                                style={{ flex: 1 }}
                                asLabel={option}
                                variant="outlined"
                                weight="bold"
                                sizing="xs"
                                key={index}
                                id={option}
                                onClick={handleOptionButton}
                            />
                        );
                    })}
                </Row>
            ) : (
                <></>
            )}
        </Column>
    );
};

const DrawerFilterSlider = (props: SliderProps) => {
    const filterDispatch = useMarketPlacefilterDispatch();
    const filterId = useContext(FilterIdContext);
    const filterState = useFilterState(filterId);

    const { title, max } = props;
    const [value, setValue] = useState([]);

    useEffect(() => {
        setValue([0, max]);
        if (filterState) {
            filterState[title] && setValue(filterState[title]);
        }
        filterDispatch.set(filterId, {});
    }, []);

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        filterDispatch.set(filterId, { [title]: newValue });
    };
    return (
        <Column alignItems="flex-start" style={{ width: '100%', gap: '20px' }}>
            <TRLabel style={{ textTransform: 'capitalize' }} weight="bold">
                {title}
            </TRLabel>
            {filterState && <TRSlider onChange={handleSliderChange} max={max} value={value} />}
        </Column>
    );
};

const DrawerFilterMulti = (props: SingleProps) => {
    const filterDispatch = useMarketPlacefilterDispatch();
    const filterId = useContext(FilterIdContext);
    const filterState = useFilterState(filterId);

    const { title, options, doBeforeClick } = props;

    const handleOptionButton = (e) => {
        doBeforeClick && doBeforeClick();
        filterDispatch.setMulti(filterId, title, e.target.id);
    };

    const handleOptionReClickButton = (e) => {
        filterDispatch.unsetMulti(filterId, title, e.target.id);
    };

    useEffect(() => {
        filterDispatch.set(filterId, {});
    }, []);
    return (
        <Column alignItems="flex-start" style={{ width: '100%', gap: '20px' }}>
            <TRLabel style={{ textTransform: 'capitalize' }} weight="bold">
                {title}
            </TRLabel>
            {filterState[filterId] ? (
                <Row gap={2} flexWrap="wrap" justifyContent="flex-start">
                    {options.map((option, index) => {
                        return filterState[filterId][title] && filterState[filterId][title].includes(option) ? (
                            <TRLabel key={index} id={option} onClick={handleOptionReClickButton}>
                                {option}
                            </TRLabel>
                        ) : (
                            <TRLabel key={index} id={option} onClick={handleOptionButton}>
                                {option}
                            </TRLabel>
                        );
                    })}
                </Row>
            ) : (
                <></>
            )}
        </Column>
    );
};

DrawerFilter.Single = DrawerFilterSingle;
DrawerFilter.Slider = DrawerFilterSlider;
DrawerFilter.Multi = DrawerFilterMulti;
