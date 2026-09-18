import { Flex } from '@chakra-ui/react';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import { EmptyState } from '@/components/ui/empty-state';

export default function ArticleNotFound({ title }: { title: string }) {
  return (
    <Flex alignItems="center" height="100%">
      <EmptyState icon={<GrDocumentMissing />} title={title} />
    </Flex>
  );
}
