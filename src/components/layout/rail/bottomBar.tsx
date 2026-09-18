import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import RailHomeLink from '@/components/layout/rail/homeLink';
import {
  RailPrimaryItems,
  RailSecondaryItems,
} from '@/components/layout/rail/railItems';
import { DESKTOP_MEDIA, RAIL_WIDTH } from '@/components/layout/shell/constants';

export default function BottomBar({
  triggerRef,
}: {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Flex
      alignItems="center"
      as="nav"
      backgroundColor="bg"
      borderTopColor="border"
      borderTopWidth="1px"
      direction="row"
      flexShrink={0}
      gap="4px"
      height={RAIL_WIDTH}
      justifyContent="space-between"
      padding="8px"
      css={{ display: 'flex', [DESKTOP_MEDIA]: { display: 'none' } }}
    >
      <Flex alignItems="center" gap="4px">
        <Box
          borderRightColor="border.subtle"
          borderRightWidth="1px"
          margin="0 4px"
          padding="0 8px 0 0"
        >
          <RailHomeLink />
        </Box>

        <RailPrimaryItems triggerRef={triggerRef} />
      </Flex>

      <Flex alignItems="center" gap="4px">
        <RailSecondaryItems />
      </Flex>
    </Flex>
  );
}
