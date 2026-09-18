import { Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import { QUIET_TEXT_BUTTON_CSS } from '@/components/features/tools/armor/controls/styles';

interface UploadFieldProps {
  error: string | null;
  fileName: string | null;
  onClear: () => void;
  onUpload: (file: File) => void;
  version: number | null;
}

export function UploadField({
  error,
  fileName,
  onClear,
  onUpload,
  version,
}: UploadFieldProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={fileInputRef}
        accept=".mtca"
        hidden
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUpload(file);
          event.target.value = '';
        }}
      />

      {fileName ? (
        <Flex alignItems="center" gap="8px" marginTop="8px">
          <Text
            color="fg.emphasized"
            flex={1}
            fontSize="0.75rem"
            lineHeight="1.25rem"
            minWidth={0}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {fileName}
            {version != null && (
              <Text as="span" color="fg.muted">
                {' '}
                v{version}
              </Text>
            )}
          </Text>
          <chakra.button
            css={{ ...QUIET_TEXT_BUTTON_CSS, fontSize: '0.75rem' }}
            type="button"
            onClick={onClear}
          >
            Clear
          </chakra.button>
        </Flex>
      ) : (
        <chakra.button
          css={{
            ...QUIET_TEXT_BUTTON_CSS,
            marginInlineStart: 0,
            marginTop: '4px',
            paddingInline: '4px',
          }}
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          or upload .mtca
        </chakra.button>
      )}

      {error && (
        <Text
          color="fg.error"
          fontSize="0.75rem"
          lineHeight="1.25rem"
          marginTop="4px"
        >
          {error}
        </Text>
      )}
    </>
  );
}
