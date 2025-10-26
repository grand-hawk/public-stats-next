import { Table } from '@chakra-ui/react';
import React from 'react';

import type { TableRowProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export function StatsRow({
  children,
  css,
  withPaddingLeft,
  withPaddingTop,
  ...props
}: PropsWithChildren<
  TableRowProps & {
    withPaddingTop?: boolean;
    withPaddingLeft?: boolean;
  }
>) {
  return (
    <Table.Row
      {...props}
      className={withPaddingTop ? 'with-padding-top' : undefined}
      css={{
        '& .chakra-table__cell:nth-child(1)': {
          paddingInlineStart: withPaddingLeft ? 6 : undefined,
        },
        ...css,
      }}
    >
      {children}
    </Table.Row>
  );
}
