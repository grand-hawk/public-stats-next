import { Box, Flex, Span } from '@chakra-ui/react';
import React from 'react';

import InfoTooltip from '@/components/common/infoTooltip';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';

export interface ChartCardProps {
  children: React.ReactNode;
  title?: string;
  tooltip?: string;
}

export default function ChartCard({
  children,
  title,
  tooltip,
}: ChartCardProps) {
  return (
    <Box className="mtc-frame" css={RAISED_FRAME_CSS} padding="16px">
      {title && (
        <Flex alignItems="center" gap={1} marginBlockEnd="12px">
          <Span
            color="fg.emphasized"
            css={{
              fontSize: '1.125rem',
              fontWeight: 500,
              lineHeight: '1.625rem',
            }}
          >
            {title}
          </Span>

          {tooltip && (
            <InfoTooltip content={tooltip} iconProps={{ color: 'fg.muted' }} />
          )}
        </Flex>
      )}

      {children}
    </Box>
  );
}
