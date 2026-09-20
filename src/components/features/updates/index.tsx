import { Box, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { ARTICLE_MDX_CSS } from '@/components/article/prose';
import ArticleTitle from '@/components/wiki/articleTitle';
import { formatUpdateDate, updateDateLabel } from '@/utils/updateDate';

import type { UpdateSummary } from '@/server/utils/updates/types';

export default function Updates({
  initials,
  updates,
}: {
  initials: string;
  updates: UpdateSummary[];
}) {
  return (
    <>
      <ArticleTitle id="updates-page-title" title="Updates" />

      {updates.length === 0 ? (
        <Text color="fg.subtle" marginBlockStart="16px">
          No updates have been published yet.
        </Text>
      ) : (
        <Box css={ARTICLE_MDX_CSS} marginBlockStart="24px">
          <Box className="article-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Update</th>
                </tr>
              </thead>

              <tbody>
                {updates.map((update) => (
                  <tr key={update.slug}>
                    <td>{formatUpdateDate(update.date)}</td>

                    <td>
                      <NextLink
                        href={`/${initials}/updates/${update.slug}`}
                        prefetch={false}
                      >
                        {updateDateLabel(update)
                          ? update.title
                          : update.summary}
                      </NextLink>

                      {updateDateLabel(update) && update.summary ? (
                        <Text color="fg.muted" fontSize="0.875rem">
                          {update.summary}
                        </Text>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      )}
    </>
  );
}
