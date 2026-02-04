import { Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { VscMarkdown } from 'react-icons/vsc';

import IconLink from '@/components/common/buttonIconLink';
import { setExtension } from '@/utils/extensions';

export default function ButtonMarkdownLink() {
  const router = useRouter();

  const [asPath] = router.asPath.split(/[?#]/);

  return (
    <IconLink
      linkProps={{
        target: '_blank',
      }}
      href={setExtension(`/md${asPath}`, 'md')}
      rel="nofollow"
      size="sm"
      title="View as markdown"
      variant="surface"
    >
      <Icon size="md">
        <VscMarkdown />
      </Icon>
    </IconLink>
  );
}
