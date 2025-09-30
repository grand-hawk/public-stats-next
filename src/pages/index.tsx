import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import CenterSpinner from '@/components/centerSpinner';
import config from '@generated/config';

export default function Root() {
  const router = useRouter();

  React.useEffect(() => {
    const preferredInitials = 'mtc';
    const availableInitials = Object.values(config.data.placeNameInitials);

    router.push(
      `/${availableInitials.includes(preferredInitials) ? preferredInitials : availableInitials[0]}`,
    );
  }, [router]);

  return (
    <Box height="100svh">
      <CenterSpinner />
    </Box>
  );
}
