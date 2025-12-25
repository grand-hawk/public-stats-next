import { CodeBlock, createShikiAdapter, Tabs, useTabs } from '@chakra-ui/react';
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
      themes: ['github-dark'],
    });
  },
  theme: 'github-dark',
});

export default function ProvidersDebug() {
  const items = React.useMemo(
    () => [
      { name: 'DynamicData' },
      { name: 'Shell' },
      { name: 'Vehicle' },
    ],
    [],
  );

  const tabs = useTabs({
    defaultValue: items[0].name,
  });

  const activeItem = items.find((item) => item.name === tabs.value) ?? items[0];

  const debugData = useDevelopmentStore((state) => state.debugData);
  const data = debugData[activeItem.name] ?? {};
  const code = JSON.stringify(data, null, 2);

  return (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      <Tabs.RootProvider size="sm" value={tabs} variant="line">
        <CodeBlock.Root
          borderRadius="none"
          code={code}
          language="json"
          paddingTop="36px"
          position="relative"
        >
          <CodeBlock.Header
            borderBottomWidth="1px"
            height="36px"
            left="0"
            paddingX={1}
            position="absolute"
            top="0"
            width="100%"
            zIndex="1"
          >
            <Tabs.List border="0" marginStart="-1" width="full">
              {items.map((item) => (
                <Tabs.Trigger
                  colorPalette="teal"
                  key={item.name}
                  textStyle="xs"
                  value={item.name}
                >
                  {item.name}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </CodeBlock.Header>

          <CodeBlock.Content>
            <CodeBlock.Code>
              <CodeBlock.CodeText />
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock.Root>
      </Tabs.RootProvider>
    </CodeBlock.AdapterProvider>
  );
}
