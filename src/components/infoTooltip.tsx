import { Icon } from '@chakra-ui/react';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';

import { Tooltip } from '@/components/ui/tooltip';

import type { TooltipProps } from '@/components/ui/tooltip';
import type { IconProps } from '@chakra-ui/react';

export default function InfoTooltip({
  content,
  iconProps,
  ...props
}: TooltipProps & { content: string; iconProps?: IconProps }) {
  return (
    <Tooltip
      closeDelay={50}
      content={content}
      lazyMount
      openDelay={50}
      positioning={{ placement: 'top' }}
      {...props}
    >
      <Icon aria-label={content} height={5} width={5} {...iconProps}>
        <MdInfoOutline />
      </Icon>
    </Tooltip>
  );
}
