import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import RailHomeLink from '@/components/layout/rail/homeLink';
import {
  RailPrimaryItems,
  RailSecondaryItems,
} from '@/components/layout/rail/railItems';
import { DESKTOP_MEDIA, RAIL_WIDTH } from '@/components/layout/shell/constants';

export default function Rail({
  triggerRef,
}: {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Flex
      alignItems="center"
      as="nav"
      backgroundColor="bg"
      borderRightColor="border"
      borderRightWidth="1px"
      direction="column"
      flexShrink={0}
      gap="4px"
      padding="8px"
      width={RAIL_WIDTH}
      css={{ display: 'none', [DESKTOP_MEDIA]: { display: 'flex' } }}
    >
      <Box
        borderBottomColor="border.subtle"
        borderBottomWidth="1px"
        margin="4px 0"
        padding="0 0 8px 0"
      >
        <RailHomeLink />
      </Box>

      <RailPrimaryItems triggerRef={triggerRef} />

      <Flex direction="column" gap="4px" marginTop="auto">
        <RailSecondaryItems />
      </Flex>
    </Flex>
  );
}
