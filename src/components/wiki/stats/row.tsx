import { Table } from '@chakra-ui/react';
import React from 'react';

import type { TableRowProps } from '@chakra-ui/react';

export interface StatsRowProps extends TableRowProps {
  children?: React.ReactNode;
  withPaddingLeft?: boolean;
  withPaddingTop?: boolean;
}

export function StatsRow({
  children,
  css,
  withPaddingLeft,
  withPaddingTop,
  ...props
}: StatsRowProps) {
  return (
    <Table.Row
      {...props}
      className={withPaddingTop ? 'with-padding-top' : undefined}
      css={{
        '& .chakra-table__cell:nth-of-type(1)': {
          paddingInlineStart: withPaddingLeft ? 6 : undefined,
        },
        ...css,
      }}
    >
      {children}
    </Table.Row>
  );
}
