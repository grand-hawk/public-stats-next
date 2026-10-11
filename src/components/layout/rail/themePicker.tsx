import { Flex } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import React from 'react';

import PreferenceField from '@/components/layout/rail/preferenceField';
import ThemeCircle from '@/components/layout/rail/themeCircle';

const THEMES = [
  { value: 'system', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const;

export default function ThemePicker() {
  const { setTheme, theme } = useTheme();
  const [hovered, setHovered] = React.useState<string | null>(null);
  const readout = THEMES.find((t) => t.value === (hovered ?? theme))?.label;

  const select = (value: string) => {
    setTheme(value);
    setHovered(null);
  };

  return (
    <PreferenceField id="preferences-theme" label="Theme" readout={readout}>
      <Flex
        aria-labelledby="preferences-theme"
        gap="12px"
        role="radiogroup"
        wrap="wrap"
        onMouseLeave={() => setHovered(null)}
      >
        {THEMES.map((t) => (
          <ThemeCircle
            key={t.value}
            checked={theme === t.value}
            label={t.label}
            name="theme"
            value={t.value}
            onHover={setHovered}
            onSelect={select}
          />
        ))}
      </Flex>
    </PreferenceField>
  );
}
