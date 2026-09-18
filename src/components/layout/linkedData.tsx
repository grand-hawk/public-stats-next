import React from 'react';

export function linkedDataScripts(linkedData: Record<string, unknown>) {
  return Object.entries(linkedData).map(([key, value]) => (
    <script
      key={key}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replace(/</g, '\\u003c'),
      }}
      data-linked-data={key}
      type="application/ld+json"
    />
  ));
}
