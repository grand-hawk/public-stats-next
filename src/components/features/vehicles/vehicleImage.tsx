import { Center, Text, Box } from '@chakra-ui/react';
import { noCase } from 'change-case';
import NextImage from 'next/image';
import React from 'react';

import { getVehicleImage } from '@/utils/getVehicleImage';

import type { VehicleImageType } from '@/utils/getVehicleImage';
import type { ImageProps as NextImageProps } from 'next/image';

interface VehicleImageProps extends Omit<NextImageProps, 'src' | 'alt'> {
  name: string;
  slug: string;
  type?: VehicleImageType;
  fallbackText?: string;
  aspectRatio?: string | number;
}

const NORMAL_BLUR =
  'data:image/webp;base64,UklGRvAAAABXRUJQVlA4WAoAAAAAAAAAOAAAHwAAVlA4INIAAADQBgCdASo5ACAAPtVapUyoJaOiM/maqQAaiWVjPlnhIy6iqza9tCiwWBGZi5boL03bP6SPbUn9KW00MWkhoAAA/tLnLPsvnTDAj3Umyd6X+DZIRnmngt3M6fapHf49tN0PHNfxuTihBx6Bpz8Z9yfVvWW+Zdj9sVdpoLqudr5MvQMJQxeO9VTgsluWrgYfJ36gM+HnKyI4MpenFjvD6KCLUl8q1T3yNKYqA6kbxzSZc2HqLUDfKixqY+EDskbR65PO3FSDGCtdTKASxmWI0WVVwAA=';
const BANNER_BLUR =
  'data:image/webp;base64,UklGRg4BAABXRUJQVlA4WAoAAAAAAAAAXwAAHwAAVlA4IPAAAAAQBwCdASpgACAAPuFcqU2opSQmNVn6ARAcCWUAzFhLb+CAc09IxPQFJeKw5Sjv8G8G81yKWqDIA+Q2nz7wZaafMAD+0s03TtHkTVFFH/4NkcKisUlVazGjCMW5RYuXdc8Cp7whzLyEfGc/OUCwFjvSSK2VizrJ8czkVXbExwKCSJ2gnpIGX6ITESbHz5NxfM/SAC1ISe167EZBDrZKp3GO8fWQ8fIGzJTs4P0Gq8+5EUdtceguPJI85wD0VL4DNfy6+jhzS2oC96VErAduZaMmNKeDPVWvtigbsDhj1Q0wd82Hin5TbN+GmH9yqCTFQAA=';
const TRANSPARENT_BLUR =
  'data:image/webp;base64,UklGRoADAABXRUJQVlA4WAoAAAAQAAAAPgAAHwAAQUxQSHYCAAANoLNt2zG7up5vzDjLZmzbdqp0duXkL2x7V7Zt21ZsOxn7Leabd77FOiImgHYqA/r8lKI9V16P2/sGR1Hyf9p97WRwzMFnad+z/rnSeM8pn4cBjjPLnh5x4C7aq92WzEu5Z0auNJ959ptYrymnYe77F9qLr+d5wPBV7Lyeod/MTPr2Q9J07vWetFebPzKssaTx3GAAV8+ZPWn46dCPLYPlcqoduEpXjqtsTaEpwIAgq5d6epz8OTpnxx9ttHPSJXACKDHRVEyY5GfjoydqvcbBywUqe14s4peaoBtToVgBgaG7fH3IRl+JuBxOh9MxoPInPf+9ijaWlhKQ0Tv8FFymFxsbWDuzxmGREkxvXlTR364mk6lkMpX545bG9omBQ+GDL/+VHeCzQIEAiuSNv++PG1i6DprtWC0AuTOHQ5cP9TToqEZ1a7C6LvnOb6FAPFOUY0+o7UzLxm5wfD30z79PheI3czoli2i3nuGLmTA8Fo598WFc49yca9+2tBNTY2BFnxW1YzRIR0tp71J+M6aBCrQ74k50c+eqLVKCEkBpSd6xe9FWj6/xWCMgKBCt/Gv3OPR4rm6iBUoAFIKm5ClRTxkUeevevV4pSkCJMhSiCplnfn+Nor9LzEJfCeZKQJSZ5Kncq89g4R17ixAAZYAAiEIoKM/9ipX/Hlzm1DIVPrrUWFUlIGje+y+W3t70zdA540or3GKiBCXqs8c4evb6yAFTq3r37ukR4OYBLL/+6yd/pylpGlVZ0t9pgKTeeA8g9tvBry9nIFDnC8Uu2a0D4tfPnz7ye7ZfSf2AwNXkmX8pnArduHXlRJR2qS7++8+h/8N0ewFWUDgg5AAAABAIAJ0BKj8AIAA+7WKpTamlpCIwGAwBMB2JYwDSrq2zF4LSDZuyp5OGi4aP2dHlJk+MG74wfMfXWIWVbgYZiWLE/g+8K3GdsgAA/v6H0WEbU6yCxoNav16aQFDsXmOdn++ig3Uo+i7p9vGy+Km/v3sYgBY5GghsMKCsPvxXWnbwl4kmRiq+cxeuCEVwHJZsz9k3aV8i73t86UZ3JYF4AZD60dUUnuGb93L6tp/6p7BiNFTP7DKxOaqM3Xk/63WWU7mV4LWqC3ZvFa8H1QlFDSnt2rMkAOmKF5C8AD8lgUqvbOxQAA==';

export default function VehicleImage({
  fallbackText = 'NO IMAGE',
  name,
  slug,
  style,
  type,
  ...props
}: VehicleImageProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [slug]);

  if (hasError) {
    return (
      <Center
        height="100%"
        width="100%"
        backgroundColor="blackAlpha.200"
        userSelect="none"
      >
        <Text color="whiteAlpha.400" fontSize="2xs" fontWeight="bold">
          {fallbackText}
        </Text>
      </Center>
    );
  }

  return (
    <Box asChild objectFit="cover" width="100%" height="100%" userSelect="none">
      <NextImage
        key={slug}
        blurDataURL={
          type === 'perspective_banner'
            ? BANNER_BLUR
            : type?.endsWith('_transparent')
              ? TRANSPARENT_BLUR
              : NORMAL_BLUR
        }
        placeholder="blur"
        alt={`${name}, ${noCase(type || 'perspective')}, in Multicrew Tank Combat`}
        src={getVehicleImage(slug, type)}
        style={{
          objectFit: 'cover',
          ...style,
        }}
        onError={() => setHasError(true)}
        {...props}
      />
    </Box>
  );
}
