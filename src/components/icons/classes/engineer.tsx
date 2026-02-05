import { Icon } from '@chakra-ui/react';
import React from 'react';

import type { IconProps } from '@chakra-ui/react';

export default function EngineerIcon({ ...props }: IconProps) {
  return (
    <Icon {...props}>
      <svg viewBox="0 0 517 1024">
        <path
          fill="currentColor"
          d="m0 39l23-39h3l131 75 2 4-3 8 37 20 13 13 46 169h3l2 8 5 2 7 29h8l2 11 10-3 2 4 13 48v6l-7 2 12 41v5h-3l2 10h52l27 23 130 485v15l-36 14-116 31-25 4h-10l-8-17-128-478 12-36 43-23 1-4-2-8h-5l-11-45-6 2-3-2-14-52 1-4 9-2-3-13 6-3-8-30 9-2-2-5 2-6-43-160-40-24-5 8-8-3-127-74z"
        />
      </svg>
    </Icon>
  );
}
