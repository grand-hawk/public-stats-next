import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import CenterSpinner from '@/components/centerSpinner';
import { useSuspenseConfig } from '@/hooks/useSuspenseConfig';

export default function Root() {
  const router = useRouter();
  const config = useSuspenseConfig();

  React.useEffect(() => {
    router.replace(`/${Object.values(config.placeNameInitials)[0]}`);
  }, [router, config]);

  return (
    <Box height="100svh">
      <CenterSpinner />
    </Box>
  );
}
