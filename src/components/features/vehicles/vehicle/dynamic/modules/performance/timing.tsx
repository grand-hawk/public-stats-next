import { FormatNumber, Text } from '@chakra-ui/react';
import React from 'react';

import { Seconds } from '@/components/features/vehicles/vehicle/dynamic/modules/performance/parts';
import { Tooltip } from '@/components/ui/tooltip';

export const integerDigits = (value: number) =>
  value.toFixed(1).split('.')[0].length;

export default function Timing({
  spooled,
  spooledDigits = 0,
  value,
}: {
  spooled?: number;
  spooledDigits?: number;
  value: number;
}) {
  if (spooled === undefined) return <Seconds value={value} />;

  // pad with figure spaces (same width as a tabular digit) so the slashes line up across rows
  const padding = ' '.repeat(
    Math.max(0, spooledDigits - integerDigits(spooled)),
  );

  return (
    <>
      <Text
        as="span"
        data-md-ignore
        fontVariantNumeric="tabular-nums"
        whiteSpace="pre"
      >
        <FormatNumber
          maximumFractionDigits={1}
          minimumFractionDigits={1}
          value={value}
        />

        <Text as="span" color="fg.muted">
          {' / '}

          <Tooltip content="Time with the engine already spooled up">
            <Text
              as="span"
              cursor="help"
              textDecorationLine="underline"
              textDecorationStyle="dotted"
              textUnderlineOffset="0.25em"
            >
              {spooled.toFixed(1)}
            </Text>
          </Tooltip>
        </Text>
        {`${padding} sec`}
      </Text>

      <span data-md-show hidden>
        <Seconds value={value} /> (<Seconds value={spooled} /> spooled)
      </span>
    </>
  );
}
