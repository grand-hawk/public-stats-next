import React from 'react';

import type { PropsWithChildren } from 'react';

export default function FakeDescription({
  children,
  name,
}: PropsWithChildren<{ name: string }>) {
  return (
    <dl>
      <dt style={{ display: 'none' }}>{name}</dt>
      <dd>{children}</dd>
    </dl>
  );
}
