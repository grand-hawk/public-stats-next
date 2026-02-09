import {
  Box,
  HStack,
  Icon,
  IconButton,
  Popover,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { GoCodespaces } from 'react-icons/go';
import { MdEdit } from 'react-icons/md';
import { SiStackblitz } from 'react-icons/si';
import { VscGithubInverted } from 'react-icons/vsc';

const options = [
  {
    icon: SiStackblitz,
    label: 'StackBlitz',
    description: 'Fully local environment, simpler but slower.',
    href: (filePath: string) =>
      `https://pr.new/grand-hawk/public-stats-next/edit/next/${filePath}`,
  },
  {
    icon: GoCodespaces,
    label: 'GitHub Codespaces',
    description: 'Cloud environment, faster but more complex.',
    href: () =>
      `https://codespaces.new/grand-hawk/public-stats-next?quickstart=1`,
  },
  {
    icon: VscGithubInverted,
    label: 'GitHub',
    description: 'Regular GitHub, no preview.',
    href: (filePath: string) =>
      `https://github.com/grand-hawk/public-stats-next/edit/next/${filePath}`,
  },
];

export interface EditPagePopoverProps {
  filePath: string;
}

export default function EditPagePopover({ filePath }: EditPagePopoverProps) {
  return (
    <Popover.Root lazyMount>
      <Popover.Trigger asChild>
        <IconButton
          borderRadius="none"
          height={10}
          minWidth="unset"
          size="sm"
          title="Edit"
          variant="surface"
          width={10}
        >
          <MdEdit />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            backgroundColor="bg.muted"
            borderRadius="none"
            borderWidth="1px"
            css={{ '--popover-size': 'var(--sizes-xs)' }}
            maxWidth="calc(100vw - 2rem)"
          >
            <Popover.Body>
              <Popover.Title fontWeight="medium">Edit this page</Popover.Title>
              <VStack align="stretch" gap={2} mt={3}>
                {options.map((option) => (
                  <Box
                    asChild
                    borderWidth="1px"
                    display="block"
                    key={option.label}
                    overflow="hidden"
                    padding={3}
                    _hover={{ backgroundColor: 'bg.subtle' }}
                  >
                    <a
                      href={option.href(filePath)}
                      rel="nofollow noreferrer"
                      target="_blank"
                    >
                      <HStack>
                        <Icon as={option.icon} />
                        <Text fontWeight="medium">{option.label}</Text>
                      </HStack>

                      <Text
                        color="fg.muted"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        textStyle="xs"
                        whiteSpace="nowrap"
                      >
                        {option.description}
                      </Text>
                    </a>
                  </Box>
                ))}
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
