import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import { EmptyState } from '@/components/ui/empty-state';

import type { EmptyStateProps } from '@/components/ui/empty-state';

export default function PlaceEmptyState({
  ...props
}: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      description="Start by selecting the place you want to see the vehicle KDR for"
      icon={<GrDocumentMissing />}
      title="Select a place"
      {...props}
    />
  );
}
