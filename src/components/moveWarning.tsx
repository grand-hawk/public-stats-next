import { Link } from '@chakra-ui/react';
import React from 'react';

import { Alert } from '@/components/ui/alert';

export default function MoveWarning() {
  const [hostname, setHostname] = React.useState<string>();

  React.useEffect(() => {
    setHostname(window.location.hostname);
  }, [setHostname]);

  if (hostname !== 'kdr.multicrew.dev') return null;

  return (
    <Alert
      marginBottom={4}
      status="warning"
      title="Moving hostname"
      variant="outline"
    >
      kdr.multicrew.dev will soon be moving to{' '}
      <Link href="https://stats.multicrew.dev">stats.multicrew.dev</Link>
    </Alert>
  );
}
