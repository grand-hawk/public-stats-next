import { Center, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { tabs } from '@/components/navigation/tabData';

export default function Index() {
  const router = useRouter();

  React.useLayoutEffect(() => {
    const firstTab = Object.values(tabs)?.[0];
    if (firstTab) router.replace(firstTab.path);
  }, [router]);

  return (
    <Center height="100%">
      <Spinner size="xl" />
    </Center>
  );
}
