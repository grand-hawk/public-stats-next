import { Center, Link, Span } from '@chakra-ui/react';
import React from 'react';

export default function InaccurateDataFooter() {
  return (
    <Center paddingX={4} data-md-ignore>
      <Span color="fg.subtle" fontSize="xs">
        Spotted inaccurate or incomplete data? Report this in our{' '}
        <Link
          color="fg.subtle"
          href="https://discord.gg/multicrew"
          rel="nofollow noopener"
          target="_blank"
        >
          Discord
        </Link>
      </Span>
    </Center>
  );
}
