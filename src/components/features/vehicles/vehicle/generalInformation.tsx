import {
  Box,
  FormatNumber,
  HStack,
  Link,
  Quote,
  Span,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import Markdown from 'react-markdown';

import CrewmanIcon from '@/components/icons/classes/crewman';
import EngineerIcon from '@/components/icons/classes/engineer';
import InfantryIcon from '@/components/icons/classes/infantry';
import { inWhere, Prose } from '@/components/ui/prose';
import { ToggleTip } from '@/components/ui/toggle-tip';
import SectionMarker from '@/components/wiki/sectionMarker';
import Stat from '@/components/wiki/stat';
import TitledCard from '@/components/wiki/titledCard';
import { useVehicle } from '@/hooks/providers/vehicle';
import { capitalizeFirst } from '@/utils/capitalizeFirst';

import type { BoxProps, IconProps } from '@chakra-ui/react';

const COLLAPSED_MAX_HEIGHT = 200;

const classIcons: Record<string, (props: IconProps) => React.ReactNode> = {
  Engineer: EngineerIcon,
  Infantry: InfantryIcon,
  Crewman: CrewmanIcon,
};

const baseContentProps: BoxProps = {
  fontSize: 'sm',
  fontWeight: 'light',
  id: 'vehicle-page-description',
  whiteSpace: 'pre-wrap',
  'aria-label': 'Description',
};

export default function VehicleGeneralInformation({
  isAvailable,
}: {
  isAvailable: boolean;
}) {
  const vehicle = useVehicle();

  const customDescription = vehicle.content?.Description;

  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [needsExpand, setNeedsExpand] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState(0);

  React.useEffect(() => {
    if (!contentRef.current) return;
    const height = contentRef.current.scrollHeight;
    setContentHeight(height);
    setNeedsExpand(height > COLLAPSED_MAX_HEIGHT);
  }, [customDescription]);

  return (
    <>
      <SectionMarker name="General information" />

      <TitledCard as="section" title="General information" withAnchor>
        <Stack gap={4}>
          <Stat
            label={customDescription ? 'Description' : 'In-game description'}
          >
            {customDescription ? (
              <div>
                <Box
                  ref={contentRef}
                  overflow="hidden"
                  position="relative"
                  css={{
                    maxHeight: isExpanded
                      ? `${contentHeight}px`
                      : `${COLLAPSED_MAX_HEIGHT}px`,
                    transition: 'max-height 0.3s ease',
                  }}
                >
                  <Box asChild {...baseContentProps}>
                    <Quote asChild>
                      <Prose
                        color="fg"
                        data-prose
                        size="md"
                        css={{
                          [inWhere('& h3, h4')]: {
                            marginTop: '0.4em',
                            marginBottom: 0,
                          },
                        }}
                      >
                        <Markdown
                          components={{ p: (props) => <Span {...props} /> }}
                        >
                          {customDescription}
                        </Markdown>
                      </Prose>
                    </Quote>
                  </Box>

                  {needsExpand && !isExpanded && (
                    <Box
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      height="80px"
                      bgGradient="to-t"
                      gradientFrom="bg.panel"
                      gradientTo="transparent"
                      pointerEvents="none"
                    />
                  )}
                </Box>

                {needsExpand && (
                  <Link
                    as="button"
                    variant="underline"
                    fontSize="xs"
                    color="fg.muted"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    marginTop={1}
                    alignSelf="start"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </Link>
                )}
              </div>
            ) : (
              <Box asChild {...baseContentProps}>
                <Quote>{vehicle.info.description}</Quote>
              </Box>
            )}
          </Stat>

          <Box display="flex" flexWrap="wrap" gap={4}>
            <Stat label="Locomotion">
              {capitalizeFirst(vehicle.info.locomotion)}
            </Stat>

            {vehicle.info.amphibious && <Stat label="Amphibious">Yes</Stat>}

            {vehicle.info.supportedClasses.length > 0 && (
              <Stat label="Supported classes" valueProps={{ height: '100%' }}>
                <HStack gap={1}>
                  {vehicle.info.supportedClasses.map((className) => {
                    const Icon = classIcons[className];
                    if (Icon)
                      return (
                        <ToggleTip
                          closeDelay={50}
                          content={className}
                          key={className}
                          openDelay={50}
                        >
                          <Icon boxSize="1em" />
                        </ToggleTip>
                      );
                  })}
                </HStack>
              </Stat>
            )}

            <Stat label="Obtainment">
              {isAvailable
                ? !vehicle.info.premium
                  ? 'Free'
                  : vehicle.info.premium.type === 'coins'
                    ? 'Premium'
                    : vehicle.info.premium.type === 'money'
                      ? 'Shop'
                      : 'Badge'
                : 'Dev-spawner only'}
            </Stat>

            {vehicle.info.premium?.cost !== undefined && (
              <Stat label="Price">
                <FormatNumber value={vehicle.info.premium.cost} />{' '}
                {vehicle.info.premium.type === 'coins' ? 'coins' : 'money'}
              </Stat>
            )}
          </Box>
        </Stack>
      </TitledCard>
    </>
  );
}
