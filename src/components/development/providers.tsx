import {
  Box,
  CodeBlock,
  createShikiAdapter,
  IconButton,
  Tabs,
  useTabs,
} from '@chakra-ui/react';
import React from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

import { useDevelopmentStore } from '@/stores/development';

import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';

const shikiAdapter = createShikiAdapter<
  HighlighterGeneric<BundledLanguage, BundledTheme>
>({
  async load() {
    const { createHighlighter } = await import('shiki');
    return createHighlighter({
      langs: ['jsonc'],
      themes: ['dark-plus'],
    });
  },
  theme: 'dark-plus',
});

export default React.memo(function ProvidersDebug() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLPreElement>(null);
  const items = React.useMemo(() => ['DynamicData', 'Shell', 'Vehicle'], []);

  const debugData = useDevelopmentStore((s) => s.debugData);
  const highlightedModule = useDevelopmentStore(
    (state) => state.highlightedModule,
  );
  const setHighlightedModule = useDevelopmentStore(
    (state) => state.setHighlightedModule,
  );
  const scrollToModule = useDevelopmentStore((state) => state.scrollToModule);
  const setScrollToModule = useDevelopmentStore(
    (state) => state.setScrollToModule,
  );

  const tabs = useTabs({
    defaultValue: items[0],
  });
  const activeItem = items.find((item) => item === tabs.value) ?? items[0];

  const data = React.useMemo(
    () => debugData[activeItem] ?? {},
    [debugData, activeItem],
  );

  const rawCode = JSON.stringify(data, null, 2);
  const lines = React.useMemo(() => {
    const rawLines = rawCode.split('\n');

    const idToType: Record<string, string> = {};
    const modules =
      (data as { assembledModules?: Record<string, unknown> })
        .assembledModules ||
      (data as { modules?: Record<string, unknown> }).modules ||
      data;

    if (typeof modules === 'object' && modules !== null) {
      for (const [id, module] of Object.entries(modules)) {
        if (
          module &&
          typeof module === 'object' &&
          'type' in (module as Record<string, unknown>)
        ) {
          const type = (module as Record<string, string>).type;
          const normalizedId = id.replace(/^#\/module\//, '#/modules/');

          idToType[normalizedId] = type;
          idToType[normalizedId.replace('#/modules/', '')] = type;
        }
      }
    }

    return rawLines.map((line) => {
      const strings = line.match(/"([^"]+)"/g);
      if (!strings) return line;

      for (const quotedId of strings) {
        const id = quotedId.slice(1, -1);
        const normalizedId = id.replace(/^#\/module\//, '#/modules/');
        const type = idToType[normalizedId] || idToType[id];

        if (type && !line.trim().startsWith(`"${id}": {`)) {
          return `${line} // ${type}`;
        }
      }
      return line;
    });
  }, [rawCode, data]);
  const code = React.useMemo(() => lines.join('\n'), [lines]);
  const lineCount = lines.length;

  const scrollToLine = React.useCallback(
    (line: number) => {
      if (!scrollRef.current) return;

      const container = scrollRef.current;
      const lineElement = container.querySelector(
        `[data-line="${line}"]`,
      ) as HTMLElement | null;

      if (lineElement) {
        const containerRect = container.getBoundingClientRect();
        const lineRect = lineElement.getBoundingClientRect();

        const relativeTop =
          lineRect.top - containerRect.top + container.scrollTop;

        container.scrollTo({
          top: relativeTop,
          behavior: 'smooth',
        });
      } else {
        const totalHeight = container.scrollHeight;
        const scrollPos = ((line - 1) / lineCount) * totalHeight;

        container.scrollTo({
          top: scrollPos,
          behavior: 'smooth',
        });
      }
    },
    [lineCount],
  );

  const declarationLine = React.useMemo(() => {
    if (!highlightedModule) return null;
    const index = lines.findIndex((l) =>
      l.trim().startsWith(`"${highlightedModule}": {`),
    );
    return index !== -1 ? index + 1 : null;
  }, [lines, highlightedModule]);

  React.useEffect(() => {
    if (!scrollToModule) return;

    const index = lines.findIndex((l) =>
      l.trim().startsWith(`"${scrollToModule}": {`),
    );
    if (index !== -1) {
      scrollToLine(index + 1);
      setScrollToModule(null);
    }
  }, [scrollToModule, lines, setScrollToModule, scrollToLine]);

  const highlightedLines = React.useMemo(() => {
    if (!highlightedModule) return [];

    interface Range {
      start: number;
      end: number;
    }

    const result = new Set<number>();
    let declarationRange: Range | null = null;

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index]!;
      const lineNumber = index + 1;
      const isReference = line.includes(`"${highlightedModule}"`);

      if (isReference) {
        result.add(lineNumber);

        if (line.trim().startsWith(`"${highlightedModule}": {`)) {
          const indent = line.match(/^\s*/)?.[0] || '';
          for (let i = index + 1; i < lines.length; i += 1) {
            if (lines[i]!.startsWith(`${indent}}`)) {
              declarationRange = { start: lineNumber, end: i + 1 };
              break;
            }
          }
        }
      }
    }

    if (declarationRange) {
      for (let i = declarationRange.start; i <= declarationRange.end; i += 1) {
        result.add(i);
      }
    }

    return Array.from(result).sort((a, b) => a - b);
  }, [lines, highlightedModule]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      overflow="hidden"
      width="100%"
    >
      <CodeBlock.AdapterProvider value={shikiAdapter}>
        <Tabs.RootProvider
          display="flex"
          flexDirection="column"
          height="100%"
          size="sm"
          value={tabs}
          variant="line"
        >
          <Box
            borderBottomWidth="1px"
            height="36px"
            minHeight="36px"
            paddingX={1}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Tabs.List border="0" marginStart="-1" flex="1">
              {items.map((item) => (
                <Tabs.Trigger
                  colorPalette="teal"
                  key={item}
                  textStyle="xs"
                  value={item}
                >
                  {item}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {declarationLine && (
              <IconButton
                size="2xs"
                variant="ghost"
                onClick={() => scrollToLine(declarationLine)}
                title="Scroll to declaration"
                aria-label="Scroll to declaration"
              >
                <LuArrowUpRight />
              </IconButton>
            )}
          </Box>

          <CodeBlock.Root
            borderRadius="none"
            code={code}
            display="flex"
            flex="1"
            flexDirection="column"
            height="100%"
            maxHeight="100%"
            border="none"
            language="jsonc"
            meta={{ highlightLines: highlightedLines }}
            onClick={(event: React.MouseEvent) => {
              const target = event.target as HTMLElement;
              const span = target.closest('span');
              if (!span || span.classList.contains('line')) return;

              const text = span.textContent
                ?.trim()
                .replace(/^"|"$/g, '')
                .replace(/^#\/module\//, '#/modules/');

              if (text?.startsWith('#/modules/')) {
                setHighlightedModule(text === highlightedModule ? null : text);
              }
            }}
            position="relative"
            ref={containerRef}
            width="100%"
            css={{
              '--code-block-highlight-border': 'colors.blue.500',
              '& [data-line][data-highlight]:after': {
                background: 'blue.400/10',
                pointerEvents: 'none',
              },
            }}
          >
            <CodeBlock.Content
              display="flex"
              flex="1"
              flexDirection="column"
              overflow="hidden"
              paddingRight={lineCount > 10 ? '14px' : '0'}
            >
              <CodeBlock.Code
                flex="1"
                overflowX="hidden"
                overflowY="scroll"
                padding="none"
                ref={scrollRef}
                whiteSpace="pre-wrap"
                wordBreak="break-all"
              >
                <CodeBlock.CodeText />
              </CodeBlock.Code>
            </CodeBlock.Content>

            {lineCount > 10 && (
              <Box
                backgroundColor="bg.muted"
                borderLeftWidth="1px"
                bottom="0"
                onClick={(event: React.MouseEvent) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const clickPos = (event.clientY - rect.top) / rect.height;
                  scrollToLine(Math.floor(clickPos * lineCount));
                }}
                position="absolute"
                right="0"
                top="0"
                width="14px"
                zIndex="2"
              >
                {highlightedLines.map((line) => (
                  <Box
                    backgroundColor={
                      line === declarationLine ? 'teal.500' : 'blue.500'
                    }
                    height={line === declarationLine ? '4px' : '2px'}
                    key={line}
                    position="absolute"
                    top={`${(line / lineCount) * 100}%`}
                    width="100%"
                    zIndex={line === declarationLine ? '3' : '2'}
                  />
                ))}
              </Box>
            )}
          </CodeBlock.Root>
        </Tabs.RootProvider>
      </CodeBlock.AdapterProvider>
    </Box>
  );
});
