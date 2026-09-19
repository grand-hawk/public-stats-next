import React from 'react';

import { ArticleTable } from '@/components/article/elements';
import ShellInlineLink from '@/components/article/shellInlineLink';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

interface ShellQueryProps {
  displayType?: string | string[];
  eraTip?: number;
  typeIncludes?: string;
}

function useShellQuery({
  displayType,
  eraTip,
  typeIncludes,
}: ShellQueryProps) {
  const place = usePlace()!;
  const displayTypes =
    displayType === undefined
      ? undefined
      : Array.isArray(displayType)
        ? displayType
        : [displayType];

  const [shells] = trpc.articles.shells.useSuspenseQuery({
    placeId: place.placeId,
    displayTypes,
    eraTip,
    typeIncludes,
  });

  return shells;
}

export function ShellList(props: ShellQueryProps) {
  const shells = useShellQuery(props);
  if (shells.length === 0) return <>None</>;

  return (
    <>
      {shells.map((shell, index) => (
        <React.Fragment key={shell.slug}>
          {index > 0 && ', '}
          <ShellInlineLink displayType={shell.displayType} slug={shell.slug}>
            {shell.name}
          </ShellInlineLink>
        </React.Fragment>
      ))}
    </>
  );
}

export function ShellTable(props: ShellQueryProps) {
  const shells = useShellQuery(props);
  if (shells.length === 0) return null;

  return (
    <ArticleTable>
      <thead>
        <tr>
          <th>Round</th>
          <th>Type</th>
          <th>Penetration</th>
          <th>Fired from</th>
        </tr>
      </thead>
      <tbody>
        {shells.map((shell) => (
          <tr key={shell.slug}>
            <td>
              <ShellInlineLink
                displayType={shell.displayType}
                slug={shell.slug}
              >
                {shell.name}
              </ShellInlineLink>
            </td>
            <td>{shell.displayType}</td>
            <td>{Math.round(shell.maxPenetration).toLocaleString('en')} mm</td>
            <td>{shell.weapons.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </ArticleTable>
  );
}
