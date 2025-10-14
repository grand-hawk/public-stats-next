import { Icon } from '@chakra-ui/react';
import React from 'react';

import type { IconProps } from '@chakra-ui/react';

export default function MTC({ ...props }: IconProps) {
  return (
    <Icon {...props}>
      <svg viewBox="0 0 1000 360">
        <g fill="currentColor">
          <path d="m198 157.4l40.4-155.6h157.5v356.4h-126.6v-166.5l-38.5 166.5h-65.7l-38.5-166.5v166.5h-126.6v-356.4h157.5z" />
          <path d="m681 2.3v75.6h-66.6v279.8h-134.3v-279.8h-66.6v-75.6z" />
          <path d="m695.5 57l86.1-56.2h133.2l85.2 56.2v90h-134.2v-66.7h-32.8v203.2h33.8v-82.8h133.2v107.5l-81.8 51h-132.8l-89.9-51z" />
        </g>
      </svg>
    </Icon>
  );
}
