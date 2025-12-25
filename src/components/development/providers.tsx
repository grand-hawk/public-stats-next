import {
  Box,
  CodeBlock,
  createShikiAdapter,
  Tabs,
  useTabs,
} from '@chakra-ui/react';
import React from 'react';

import { useDevelopmentStore } from '@/stores/development';

import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';

const shikiAdapter = createShikiAdapter<
  HighlighterGeneric<BundledLanguage, BundledTheme>
>({
  async load() {
    const { createHighlighter } = await import('shiki');
    return createHighlighter({
      langs: ['json'],
      themes: ['dark-plus'],
    });
  },
  theme: 'dark-plus',
});

export default React.memo(function ProvidersDebug() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLPreElement>(null);
  const items = React.useMemo(() => ['DynamicData', 'Shell', 'Vehicle'], []);

  const debugData = useDevelopmentStore((state) => state.debugData);
  const highlightedModule = useDevelopmentStore(
    (state) => state.highlightedModule,
  );
  const setHighlightedModule = useDevelopmentStore(
    (state) => state.setHighlightedModule,
  );

  const tabs = useTabs({
    defaultValue: items[0],
  });
  const activeItem = items.find((item) => item === tabs.value) ?? items[0];

  const data = debugData[activeItem] ?? {};
  const code = JSON.stringify(data, null, 2);
  const lines = React.useMemo(() => code.split('\n'), [code]);
  const lineCount = lines.length;

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

        // Check if this line is the start of a declaration
        if (line.trim().startsWith(`"${highlightedModule}": {`)) {
          const indent = line.match(/^\s*/)?.[0] || '';
          // Find the matching closing brace
          for (let i = index + 1; i < lines.length; i += 1)
            if (lines[i]!.startsWith(`${indent}}`)) {
              declarationRange = { start: lineNumber, end: i + 1 };
              break;
            }
        }
      }
    }

    if (declarationRange)
      for (let i = declarationRange.start; i <= declarationRange.end; i += 1)
        result.add(i);

    return Array.from(result).sort((a, b) => a - b);
  }, [lines, highlightedModule]);

  const scrollToLine = (line: number) => {
    if (!scrollRef.current) return;

    const totalHeight = scrollRef.current.scrollHeight;
    const scrollPos = (line / lineCount) * totalHeight;
    scrollRef.current.scrollTo({
      top: scrollPos - scrollRef.current.clientHeight / 2,
      behavior: 'smooth',
    });
  };

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
          >
            <Tabs.List border="0" marginStart="-1" width="full">
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
            language="json"
            meta={{ highlightLines: highlightedLines }}
            onClick={(event: React.MouseEvent) => {
              const target = event.target as HTMLElement;
              const span = target.closest('span');
              if (!span || span.classList.contains('line')) return;

              const text = span.textContent?.trim().replace(/^"|"$/g, '');

              if (
                text?.startsWith('#/module/') ||
                text?.startsWith('#/modules/')
              )
                setHighlightedModule(text === highlightedModule ? null : text);
            }}
            position="relative"
            ref={containerRef}
            width="100%"
            css={{
              '--code-block-highlight-border': 'colors.blue.500',
              '& [data-line][data-highlight]:after': {
                background: 'blue.400/10',
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
                    backgroundColor="blue.500"
                    height="2px"
                    key={line}
                    position="absolute"
                    top={`${(line / lineCount) * 100}%`}
                    width="100%"
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

