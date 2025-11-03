import { createListCollection, Field, Portal, Select } from '@chakra-ui/react';

import type { SelectRootProps } from '@chakra-ui/react';
import type React from 'react';

export const NO_VALUE = '<none>';

export default function SimpleSelect({
  items,
  label,
  noValueLabel = 'None',
  onValueChange,
  value,
  ...props
}: {
  items: string[];
  label: string;
  noValueLabel?: string;
  value: string | null;
  onValueChange: (value: string | null) => void;
} & Omit<SelectRootProps, 'collection' | 'value' | 'onValueChange'>) {
  const collection = createListCollection({
    items: [
      {
        value: NO_VALUE,
        label: noValueLabel,
      },
      ...items.map((item) => ({
        value: item,
        label: item,
      })),
    ],
  });

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>

      <Select.Root
        collection={collection}
        lazyMount
        size="sm"
        {...props}
        value={value === null ? [NO_VALUE] : [value]}
        onValueChange={(details) =>
          onValueChange(details.value[0] === NO_VALUE ? null : details.value[0])
        }
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
