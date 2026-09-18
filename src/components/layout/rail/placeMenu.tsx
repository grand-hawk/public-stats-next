import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { LuGlobe } from 'react-icons/lu';

import RailButton from '@/components/layout/rail/railButton';
import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover';
import { GLASS_SURFACE_CSS, QUIET_ROW_CSS } from '@/components/ui/styles';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { useSuspenseConfig } from '@/hooks/useSuspenseConfig';

export default function PlaceMenu({
  placement = 'right-end',
}: {
  placement?: 'right-end' | 'top-end';
}) {
  const router = useRouter();
  const config = useSuspenseConfig();
  const currentInitials = usePlaceInitials();
  const [open, setOpen] = React.useState(false);

  const places = Object.entries(config.placeNameInitials).map(
    ([placeName, initials]) => ({ initials, placeName }),
  );

  const switchPlace = (initials: string) => {
    setOpen(false);
    if (initials === currentInitials) return;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, place: initials },
    });
  };

  return (
    <PopoverRoot
      lazyMount
      onOpenChange={(e) => setOpen(e.open)}
      open={open}
      positioning={{ placement, gutter: 8 }}
    >
      <PopoverTrigger asChild>
        <RailButton active={open} label="Switch place">
          <LuGlobe />
        </RailButton>
      </PopoverTrigger>
      <PopoverContent
        borderColor="border"
        borderRadius="8px"
        borderWidth="1px"
        boxShadow="large"
        css={GLASS_SURFACE_CSS}
        width="14rem"
      >
        <PopoverBody padding="8px">
          <Text
            color="fg.muted"
            css={{
              padding: '8px 16px',
              fontSize: '0.875rem',
              fontWeight: 500,
              lineHeight: '1.375rem',
              textTransform: 'none',
              letterSpacing: 'normal',
            }}
          >
            Place
          </Text>
          {places.map((place) => {
            const active = place.initials === currentInitials;
            return (
              <Box
                as="button"
                backgroundColor={active ? 'quiet.active' : 'transparent'}
                color={active ? 'fg.emphasized' : 'fg'}
                cursor="pointer"
                key={place.initials}
                onClick={() => switchPlace(place.initials)}
                textAlign="left"
                width="100%"
                css={{
                  ...QUIET_ROW_CSS,
                  paddingInline: '16px',
                  transition: `background-color ${DURATION_BASE} ${EASE}`,
                }}
                _hover={{
                  backgroundColor: active ? 'quiet.active' : 'quiet.hover',
                }}
              >
                {place.placeName}
              </Box>
            );
          })}
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}
