import React from 'react';

export interface FakeDescriptionProps {
  children: React.ReactNode;
  name: string;
}

export default function FakeDescription({
  children,
  name,
}: FakeDescriptionProps) {
  return (
    <dl>
      <dt style={{ display: 'none' }}>{name}</dt>
      <dd>{children}</dd>
    </dl>
  );
}
