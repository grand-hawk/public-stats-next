import NextLink from 'next/link';
import React from 'react';
import slugify from 'slug';

import { useArticle } from '@/components/article/context';
import ShellInlineLink from '@/components/article/shellInlineLink';
import { findVehicleClassCategory } from '@/components/features/vehicles/classCategories';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

interface LinkProps {
  children?: React.ReactNode;
}

function InternalLink({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) {
  const initials = usePlaceInitials();

  return (
    <NextLink href={`/${initials}${path}`} prefetch={false}>
      {children}
    </NextLink>
  );
}

export function VehicleLink({ children, id }: LinkProps & { id: string }) {
  const vehicle = useArticle().refs.vehicles[id];
  if (!vehicle) return <>{children ?? id}</>;

  return (
    <InternalLink path={`/vehicles/${vehicle.slug}`}>
      {children ?? vehicle.name}
    </InternalLink>
  );
}

export function shellKey(name: string, weapon?: string) {
  return weapon ? `${weapon}::${name}` : name;
}

export function ShellLink({
  children,
  name,
  weapon,
}: LinkProps & { name: string; weapon?: string }) {
  const shell = useArticle().refs.shells[shellKey(name, weapon)];
  if (!shell) return <>{children ?? name}</>;

  return (
    <ShellInlineLink displayType={shell.displayType} slug={shell.slug}>
      {children ?? shell.name}
    </ShellInlineLink>
  );
}

export function TeamLink({ children, name }: LinkProps & { name: string }) {
  return (
    <InternalLink path={`/teams/${slugify(name)}`}>
      {children ?? name}
    </InternalLink>
  );
}

export function ClassLink({ children, name }: LinkProps & { name: string }) {
  const category = findVehicleClassCategory(name);
  if (!category) return <>{children ?? name}</>;

  return (
    <InternalLink path={`/vehicles/class/${category.slug}`}>
      {children ?? category.label}
    </InternalLink>
  );
}

export function WikiLink({ children, to }: LinkProps & { to: string }) {
  const [slug, anchor] = to.split('#');
  const article = useArticle().refs.articles[slug];
  if (!article) return <>{children ?? slug}</>;

  return (
    <InternalLink path={`/${slug}${anchor ? `#${anchor}` : ''}`}>
      {children ?? article.title}
    </InternalLink>
  );
}
