import { Box, Span, Stack, Text } from '@chakra-ui/react';
import React from 'react';

import UpdateBlocks from '@/components/features/updates/blocks';
import UpdateNeighbours from '@/components/features/updates/neighbours';
import ArticleTitle from '@/components/wiki/articleTitle';
import { updateDateLabel, updatePageTitle } from '@/utils/updateDate';

import type { Update, UpdateSummary } from '@/server/utils/updates/types';

export default function UpdateEntry({
  initials,
  next,
  previous,
  update,
}: {
  initials: string;
  next?: UpdateSummary;
  previous?: UpdateSummary;
  update: Update;
}) {
  return (
    <>
      {update.draft ? (
        <Box
          css={{
            backgroundColor: 'yellow.subtle',
            border: '1px solid',
            borderColor: 'yellow.emphasized',
            borderRadius: '8px',
            marginBlockEnd: '16px',
            padding: '8px 12px',
          }}
        >
          <Text color="fg.emphasized" fontSize="0.875rem">
            Preview of an unpublished update. Nobody else can see this page.
          </Text>
        </Box>
      ) : null}

      <ArticleTitle
        id="update-page-title"
        title={updatePageTitle(update.title)}
        meta={
          updateDateLabel(update) ? (
            <Span data-md-ignore>{updateDateLabel(update)}</Span>
          ) : undefined
        }
      />

      <UpdateNeighbours initials={initials} next={next} previous={previous} />

      <Stack gap="20px" marginBlockStart="24px">
        {update.summary ? (
          <Text color="fg.emphasized" fontSize="1.0625rem">
            {update.summary}
          </Text>
        ) : null}

        <UpdateBlocks blocks={update.blocks} />
      </Stack>
    </>
  );
}
