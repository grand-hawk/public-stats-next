import { Box, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { TbChevronRight } from 'react-icons/tb';

import type { Tab } from '@/components/layout/navigation/tabs';

export interface NavCardProps {
  item: Tab;
  onClick: () => void;
  featured?: boolean;
}

export default function NavCard({
  featured = false,
  item,
  onClick,
}: NavCardProps) {
  const IconComponent = item.icon;
  const palette = item.color.split('.')[0];

  return (
    <Box
      as="button"
      position="relative"
      cursor="pointer"
      onClick={onClick}
      textAlign="left"
      colorPalette={palette}
      _hover={{
        '& .nav-card-bracket': { opacity: 1, width: '16px', height: '16px' },
        '& .nav-card-inner': {
          borderColor: 'colorPalette.500',
        },
        '& .nav-card-gradient': { opacity: 1 },
        '& .nav-card-icon-box': {
          background: 'colorPalette.500/20',
          borderColor: 'colorPalette.500',
        },
        '& .nav-card-glow': { opacity: 0.15 },
        '& .nav-card-chevron': { transform: 'translateX(4px)' },
      }}
    >
      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(
        (corner) => (
          <Box
            key={corner}
            className="nav-card-bracket"
            position="absolute"
            top={corner.startsWith('top') ? 0 : undefined}
            bottom={corner.startsWith('bottom') ? 0 : undefined}
            left={corner.endsWith('left') ? 0 : undefined}
            right={corner.endsWith('right') ? 0 : undefined}
            width="12px"
            height="12px"
            borderTopWidth={corner.startsWith('top') ? '2px' : undefined}
            borderBottomWidth={corner.startsWith('bottom') ? '2px' : undefined}
            borderLeftWidth={corner.endsWith('left') ? '2px' : undefined}
            borderRightWidth={corner.endsWith('right') ? '2px' : undefined}
            borderColor="colorPalette.500"
            opacity={0.5}
            transition="all 0.2s"
          />
        ),
      )}

      <Box
        className="nav-card-inner"
        position="relative"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        padding={featured ? 8 : 6}
        height="100%"
        transition="all 0.25s ease-out"
        overflow="hidden"
      >
        <Box
          className="nav-card-gradient"
          position="absolute"
          inset={0}
          background="linear-gradient(135deg, var(--chakra-colors-color-palette-500) 0%, transparent 50%)"
          opacity={0}
          transition="opacity 0.3s ease-out"
          pointerEvents="none"
          css={{ mixBlendMode: 'soft-light' }}
        />

        <Flex direction="column" gap={4} height="100%" position="relative">
          <Flex alignItems="center" gap={4}>
            <Box
              className="nav-card-icon-box"
              position="relative"
              padding={3}
              background="colorPalette.500/10"
              borderWidth="1px"
              borderColor="colorPalette.500/30"
              transition="all 0.25s"
            >
              <IconComponent
                boxSize={featured ? 8 : 6}
                color="colorPalette.500"
              />

              <Box
                className="nav-card-glow"
                position="absolute"
                inset={0}
                background="radial-gradient(circle, var(--chakra-colors-color-palette-500) 0%, transparent 70%)"
                opacity={0}
                transition="opacity 0.25s"
              />
            </Box>

            <Heading
              size={featured ? 'lg' : 'md'}
              fontWeight="medium"
              letterSpacing="tight"
            >
              {item.label}
            </Heading>
          </Flex>

          <Text
            color="fg.muted"
            fontSize={featured ? 'md' : 'sm'}
            lineHeight="tall"
            flex={1}
          >
            {item.description}
          </Text>

          <Flex alignItems="center" gap={1} marginTop="auto">
            <Text
              color="colorPalette.500"
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              View {item.label}
            </Text>
            <Icon
              className="nav-card-chevron"
              as={TbChevronRight}
              color="colorPalette.500"
              boxSize={4}
              transition="transform 0.2s"
            />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
