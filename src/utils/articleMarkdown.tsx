import React from 'react';
import slugify from 'slug';

import type { Components } from 'react-markdown';

function headingText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(headingText).join('');
  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return headingText(children.props.children);
  }
  return '';
}

function isFirstLine(
  node: { position?: { start: { line: number } } } | undefined,
) {
  return node?.position?.start.line === 1;
}

export const articleMarkdownComponents: Components = {
  h1: ({ children, node, ...props }) => {
    if (isFirstLine(node)) return null;
    return <h1 {...props}>{children}</h1>;
  },
  h2: ({ children, node, ...props }) => (
    <h2
      id={slugify(headingText(children))}
      style={isFirstLine(node) ? { marginTop: 0 } : undefined}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, node, ...props }) => (
    <h3
      id={slugify(headingText(children))}
      style={isFirstLine(node) ? { marginTop: 0 } : undefined}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, node, ...props }) => (
    <p style={isFirstLine(node) ? { marginTop: 0 } : undefined} {...props}>
      {children}
    </p>
  ),
};
