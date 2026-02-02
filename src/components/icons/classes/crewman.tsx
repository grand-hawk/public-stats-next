import { Icon } from '@chakra-ui/react';
import React from 'react';

import type { IconProps } from '@chakra-ui/react';

export default function CrewmanIcon({ ...props }: IconProps) {
  return (
    <Icon {...props}>
      <svg viewBox="0 0 956 1024">
        <path
          fill="currentColor"
          d="m0 964l21-143-2-76-5-42 9-46 32-10 3-4 2-43-10-58 16-2-2-7-39-37-15-104 28-104 53-96 72-78 88-56 94-38 108-20h40l74 3 106 28 91 51 19 52 45-32 7-2 54 67 18 41 9 29 9 12-50 47 3 10 10 1 4 42-26 9-30 19-33 27-29 36-14 28-9 31 5 73 22 52 55 104 40 54 64 72 19 26v12l-6 32-13 4 9 9-25 42-5 7h-14l-2 6 4 7-28 25h-4l-27-18-20 15-9-2-27-21 10-14-22-18-87-41-66-26-85-25-66-15-145-22h-5l-12 37-38 53-58 33-63 13-50 6-78 5-24-7z"
        />
      </svg>
    </Icon>
  );
}
