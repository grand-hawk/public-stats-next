import { createListCollection, Field, Portal, Select } from '@chakra-ui/react';

import type { SelectRootProps } from '@chakra-ui/react';
import type React from 'react';

export const NO_VALUE = '<none>';

export default function SimpleSelect({
  allowEmpty = true,
  items,
  label,
  noValueLabel = 'None',
  onValueChange: onValueChangeProp,
  value,
  ...props
}: {
  allowEmpty?: boolean;
  items: string[];
  label: string;
  noValueLabel?: string;
  value: string | null;
  onValueChange: (value: string | null) => void;
} & Omit<SelectRootProps, 'collection' | 'value' | 'onValueChange'>) {
  const optionItems = items.map((item) => ({
    value: item,
    label: item,
  }));

  const collection = createListCollection({
    items: allowEmpty
      ? [
          {
            value: NO_VALUE,
            label: noValueLabel,
          },
          ...optionItems,
        ]
      : optionItems,
  });

  const selectedValue = (() => {
    if (allowEmpty) return value === null ? [NO_VALUE] : [value];
    if (value !== null) return [value];
    if (items.length > 0) return [items[0]];
    return [];
  })();

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>

      <Select.Root
        collection={collection}
        lazyMount
        size="sm"
        {...props}
        value={selectedValue}
        onValueChange={(details) => {
          const nextValue = details.value[0] ?? null;

          if (allowEmpty && nextValue === NO_VALUE) {
            onValueChangeProp(null);
            return;
          }

          onValueChangeProp(nextValue);
        }}
      >
        <Select.HiddenSelect />

        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
            <Select.IndicatorGroup paddingInline={2}>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Trigger>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content>
              {collection.items.map((item) => (
                <Select.Item key={item.value} item={item}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Field.Root>
  );
}
