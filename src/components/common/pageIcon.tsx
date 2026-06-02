import { Box, Flex } from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';
import { GiArtilleryShell } from 'react-icons/gi';
import { LuArrowRight, LuFlag } from 'react-icons/lu';
import { MdViewList } from 'react-icons/md';
import { TbTank } from 'react-icons/tb';

import ShellIcon from '@/components/features/shells/shellIcon';
import VehicleIcon from '@/components/features/vehicles/vehicleIcon';
import VehicleImage from '@/components/features/vehicles/vehicleImage';
import { getShellIcon } from '@/components/icons/shells';
import TeamIcon from '@/components/icons/teams';
import { MEDIA_PREFIX } from '@/env';

export type PageRef =
  | { type: 'vehicle'; name: string; slug: string }
  | { type: 'team'; name: string }
  | { type: 'loadout'; slug: string }
  | { type: 'shell'; shellType: string }
  | { type: 'page' };

interface PageIconProps {
  page: PageRef;
  variant: 'thumbnail' | 'icon';
  iconSize?: number;
}

function loadoutThumbnailUrl(slug: string): string {
  return `${MEDIA_PREFIX}/assets/loadouts/thumbnails/${slug}.png`;
}

function ThumbnailFrame({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      alignItems="center"
      backgroundColor="bg.muted"
      flexShrink={0}
      height="48px"
      justifyContent="center"
      overflow="hidden"
      position="relative"
      width="80px"
    >
      {children}
    </Flex>
  );
}

export default function PageIcon({
  iconSize = 24,
  page,
  variant,
}: PageIconProps) {
  if (variant === 'thumbnail') {
    if (page.type === 'vehicle') {
      return (
        <Box flexShrink={0} height="48px" position="relative" width="80px">
          <VehicleImage
            height={48}
            name={page.name}
            slug={page.slug}
            width={80}
          />
        </Box>
      );
    }
    if (page.type === 'team') {
      return (
        <ThumbnailFrame>
          <TeamIcon size={9} team={page.name} />
        </ThumbnailFrame>
      );
    }
    if (page.type === 'loadout') {
      return (
        <Box flexShrink={0} height="48px" position="relative" width="80px">
          <NextImage
            fill
            alt=""
            sizes="80px"
            src={loadoutThumbnailUrl(page.slug)}
            style={{ objectFit: 'cover' }}
          />
        </Box>
      );
    }
    if (page.type === 'shell') {
      const src = getShellIcon(page.shellType);
      return (
        <ThumbnailFrame>
          {src ? (
            <ShellIcon alt="" size={36} src={src} />
          ) : (
            <GiArtilleryShell size={36} />
          )}
        </ThumbnailFrame>
      );
    }
    return (
      <ThumbnailFrame>
        <LuArrowRight />
      </ThumbnailFrame>
    );
  }

  if (page.type === 'vehicle') {
    return <VehicleIcon size={iconSize} slug={page.slug} />;
  }
  if (page.type === 'team') return <TeamIcon team={page.name} />;
  if (page.type === 'shell') {
    const src = getShellIcon(page.shellType);
    if (src) return <ShellIcon alt="" size={iconSize} src={src} />;
    return <GiArtilleryShell />;
  }
  if (page.type === 'loadout') return <MdViewList />;
  if (page.type === 'page') return <LuArrowRight />;
  return <TbTank />;
}

export const PAGE_TYPE_LABELS: Record<PageRef['type'], string> = {
  vehicle: 'Vehicle',
  shell: 'Shell',
  team: 'Team',
  loadout: 'Loadout',
  page: 'Page',
};

export const PAGE_TYPE_FALLBACK_ICONS: Record<
  PageRef['type'],
  React.ReactNode
> = {
  vehicle: <TbTank />,
  shell: <GiArtilleryShell />,
  team: <LuFlag />,
  loadout: <MdViewList />,
  page: <LuArrowRight />,
};
