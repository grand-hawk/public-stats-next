import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import CenterSpinner from '@/components/centerSpinner';

export default function Root() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace(`/mtc`);
  }, [router]);

  return (
    <Box height="100svh">
      <CenterSpinner />
    </Box>
  );
}
