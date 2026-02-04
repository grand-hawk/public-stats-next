import { Icon } from '@chakra-ui/react';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';

import { ToggleTip } from '@/components/ui/toggle-tip';

import type { ToggleTipProps } from '@/components/ui/toggle-tip';
import type { IconProps } from '@chakra-ui/react';

export default function InfoTooltip({
  content,
  iconProps,
  ...props
}: Omit<ToggleTipProps, 'children' | 'content'> & {
  content: string;
  iconProps?: IconProps;
}) {
  return (
    <ToggleTip
      closeDelay={50}
      content={content}
      openDelay={50}
      positioning={{ placement: 'top' }}
      {...props}
    >
      <Icon aria-label={content} height={5} width={5} {...iconProps}>
        <MdInfoOutline />
      </Icon>
    </ToggleTip>
  );
}
