import { Box, Button, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

interface TocEntry {
  id: string;
  label: string;
  level: number;
}

function collectEntries(root: HTMLElement): TocEntry[] {
  const nodes = root.querySelectorAll<HTMLElement>('h2[id], h3[id]');
  const entries: TocEntry[] = [];

  for (const node of nodes) {
    if (node.closest('[data-toc-ignore]')) continue;
    const label = node.textContent?.trim();
    if (!node.id || !label) continue;

    entries.push({
      id: node.id,
      label,
      level: node.tagName === 'H3' ? 3 : 2,
    });
  }

  return entries;
}

export interface ArticleTocProps {
  articleRef:
    | React.RefObject<HTMLElement | null>
    | React.RefObject<HTMLDivElement | null>;
  title?: string;
}

export default function ArticleToc({
  articleRef,
  title = 'On this page',
}: ArticleTocProps) {
  const [entries, setEntries] = React.useState<TocEntry[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const root = articleRef.current;
    if (!root) return;

    const update = () => setEntries(collectEntries(root));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, {
      attributeFilter: ['id'],
      attributes: true,
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [articleRef]);

  React.useEffect(() => {
    if (entries.length === 0) {
      setActiveId(null);
      return;
    }

    const hash = window.location.hash.slice(1);
    const initial =
      entries.find((entry) => entry.id === hash)?.id ?? entries[0].id;
    setActiveId(initial);

    const elements = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (items) => {
        for (const entry of items) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '0px 0px -85% 0px' },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <Stack as="nav" data-md-ignore data-toc-ignore gap={1}>
      <Text
        color="fg.muted"
        fontSize="xs"
        fontWeight="medium"
        paddingLeft={3}
        textTransform="uppercase"
      >
        {title}
      </Text>
      <Stack gap={0}>
        {entries.map((entry) => {
          const isActive = activeId === entry.id;
          return (
            <Button
              asChild
              backgroundColor={{
                base: 'transparent',
                _hover: 'bg.muted',
              }}
              borderLeftColor={isActive ? 'colorPalette.solid' : 'border.muted'}
              borderLeftWidth="2px"
              borderRadius={0}
              color={isActive ? 'fg' : 'fg.muted'}
              fontWeight={isActive ? 'medium' : 'normal'}
              justifyContent="flex-start"
              key={entry.id}
              size="sm"
              variant="ghost"
            >
              <NextLink href={`#${entry.id}`} shallow>
                <Box as="span" paddingLeft={entry.level === 3 ? 4 : 0}>
                  {entry.label}
                </Box>
              </NextLink>
            </Button>
          );
        })}
      </Stack>
    </Stack>
  );
}
