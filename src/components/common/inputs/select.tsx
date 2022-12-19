import React, { useState } from 'react';
import { Dropdown } from './dropdown';

type OptionType = {
    label: string;
    value: any;
};

interface Props {
    asTrigger: React.ReactElement;
    name: string;
    onChange(value): void;
    options: OptionType[];
    value?: any;
    defaultValue?: any;
    children?: React.ReactElement[];
}
export const TRSelectModal = React.forwardRef((props: Props, ref: any) => {
    const { asTrigger, options, value, onChange, name, defaultValue, children } = props;
    return (
        <span style={{ position: 'relative' }} ref={ref}>
            <Dropdown name={name} value={value || defaultValue}>
                <Dropdown.Trigger as={asTrigger} />
                <Dropdown.Modal>
                    {children
                        ? React.Children.map(children, (child, index) => (
                              <Dropdown.Single
                                  onClick={onChange}
                                  key={options[index]?.value}
                                  value={options[index]?.value}
                                  label={options[index]?.label}
                                  asLabel={child}
                              />
                          ))
                        : options.map((option) => (
                              <Dropdown.Single
                                  onClick={onChange}
                                  key={option.value}
                                  value={option.value}
                                  label={option.label}
                              />
                          ))}
                </Dropdown.Modal>
            </Dropdown>
        </span>
    );
});
TRSelectModal.displayName = 'TRSelectModal';
