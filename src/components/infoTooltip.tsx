import { Icon } from '@chakra-ui/react';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';

import { Tooltip } from '@/components/ui/tooltip';

import type { TooltipProps } from '@/components/ui/tooltip';
import type { IconProps } from '@chakra-ui/react';

export default function InfoTooltip({
  contentProps,
  ...props
}: TooltipProps & { contentProps?: IconProps }) {
  return (
    <Tooltip closeDelay={30} openDelay={15} {...props}>
      <Icon color="fg.muted" {...contentProps}>
        <MdInfoOutline />
      </Icon>
    </Tooltip>
  );
}
