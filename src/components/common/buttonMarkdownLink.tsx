'use client';

import { Icon } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { VscMarkdown } from 'react-icons/vsc';

import IconLink from '@/components/common/buttonIconLink';
import { setExtension } from '@/utils/extensions';

export default function ButtonMarkdownLink() {
  const pathname = usePathname();

  return (
    <IconLink
      linkProps={{
        target: '_blank',
      }}
      href={setExtension(`/md${pathname}`, 'md')}
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
