import React from 'react';
import { LuGitCompareArrows } from 'react-icons/lu';

import { PageActionLink } from '@/components/common/pageActions';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type { DetailedShell } from '@/server/api/trpc/routers/shells';

export default function ShellHeaderActions({
  shell,
}: {
  shell: DetailedShell;
}) {
  const initials = usePlaceInitials();

  return (
    <PageActionLink
      href={`/${initials}/compare?tab=shells&shells=${shell.slug}`}
      label="Compare"
    >
      <LuGitCompareArrows />
    </PageActionLink>
  );
}
