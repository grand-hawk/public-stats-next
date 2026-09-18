import { Box, Icon, Text, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuSearch } from 'react-icons/lu';

import { SelectedVehicleRow } from '@/components/features/tools/armor/controls/selectedVehicleRow';
import {
  LABEL_CSS,
  LABEL_ROW_CSS,
} from '@/components/features/tools/armor/controls/styles';
import { UploadField } from '@/components/features/tools/armor/controls/uploadField';
import { VehicleDropdown } from '@/components/features/tools/armor/controls/vehicleDropdown';
import { FOCUS_RING_CSS } from '@/components/ui/styles';
import { IS_DEV } from '@/env';

import type { SystemStyleObject } from '@chakra-ui/react';

export interface VehicleOption {
  name: string;
  slug: string;
}

const SEARCH_ICON_CSS: SystemStyleObject = {
  position: 'absolute',
  insetInlineStart: '12px',
  top: '12px',
  width: '16px',
  height: '16px',
  color: 'var(--color-placeholder)',
  pointerEvents: 'none',
};

const SEARCH_INPUT_CSS: SystemStyleObject = {
  width: '100%',
  height: '40px',
  paddingInlineStart: '36px',
  paddingInlineEnd: '12px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border-color-interactive)',
  borderRadius: '4px',
  backgroundColor: 'var(--color-surface-1)',
  boxShadow: 'inset 0 0 0 1px transparent',
  color: 'var(--color-base)',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  transitionProperty: 'background-color, color, border-color, box-shadow',
  transitionDuration: '250ms',
  transitionTimingFunction: 'var(--transition-timing-function-ease, ease)',
  '&::placeholder': { color: 'var(--color-placeholder)' },
  '&:hover': { borderColor: 'var(--border-color-interactive--hover)' },
  '&:focus, &:focus-visible': {
    ...FOCUS_RING_CSS,
    borderColor: 'var(--border-color-progressive--focus)',
  },
};

interface VehiclePickerProps {
  onClearUpload: () => void;
  onClearVehicle: () => void;
  onSelectVehicle: (slug: string) => void;
  onUploadFile: (file: File) => void;
  overrideFileName: string | null;
  selectedName: string;
  selectedSlug: string | null;
  uploadError: string | null;
  vehicles: VehicleOption[];
  version: number | null;
}

export function VehiclePicker({
  onClearUpload,
  onClearVehicle,
  onSelectVehicle,
  onUploadFile,
  overrideFileName,
  selectedName,
  selectedSlug,
  uploadError,
  vehicles,
  version,
}: VehiclePickerProps) {
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = React.useCallback(
    (slug: string) => {
      onSelectVehicle(slug);
      setQuery('');
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onSelectVehicle],
  );

  return (
    <Box
      ref={containerRef}
      data-tour="vehicle"
      css={{
        paddingInline: '12px',
        paddingBlock: '12px',
        borderBottom: '1px solid var(--border-color-subtle)',
        backgroundColor: 'var(--color-surface-0)',
      }}
    >
      <Box css={LABEL_ROW_CSS} marginBottom="8px">
        <Text as="span" css={LABEL_CSS}>
          Vehicle
        </Text>
      </Box>

      <Box position="relative">
        <Icon aria-hidden as={LuSearch} css={SEARCH_ICON_CSS} />
        <chakra.input
          ref={inputRef}
          aria-label="Search vehicles"
          autoComplete="off"
          css={SEARCH_INPUT_CSS}
          placeholder="Search vehicles"
          value={isOpen ? query : selectedName}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setQuery('');
          }}
        />

        {selectedSlug && !isOpen && (
          <SelectedVehicleRow
            name={selectedName}
            slug={selectedSlug}
            onClear={onClearVehicle}
            onOpen={() => inputRef.current?.focus()}
          />
        )}

        {isOpen && (
          <VehicleDropdown
            query={query}
            selectedSlug={selectedSlug}
            vehicles={vehicles}
            onSelect={handleSelect}
          />
        )}
      </Box>

      {IS_DEV && (
        <UploadField
          error={uploadError}
          fileName={overrideFileName}
          version={version}
          onClear={onClearUpload}
          onUpload={onUploadFile}
        />
      )}
    </Box>
  );
}
