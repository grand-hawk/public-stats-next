import { Flex } from '@chakra-ui/react';
import React from 'react';

import ActionButton from '@/components/features/home/actionButton';
import { Card, CardBody, CardTitle } from '@/components/features/home/card';

import type { SystemStyleObject } from '@chakra-ui/react';

export default function LinkCard({
  action,
  body,
  css,
  href,
  title,
}: {
  action: string;
  body: string;
  css?: SystemStyleObject;
  href: string;
  title: string;
}) {
  return (
    <Card css={css}>
      <Flex
        align="flex-start"
        direction="column"
        css={{ flexGrow: 1, minWidth: 0, padding: '16px' }}
      >
        <CardTitle as="h2">{title}</CardTitle>
        <CardBody>{body}</CardBody>
        <Flex marginTop="auto" paddingTop="16px">
          <ActionButton href={href}>{action}</ActionButton>
        </Flex>
      </Flex>
    </Card>
  );
}
