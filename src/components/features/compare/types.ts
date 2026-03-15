import type React from 'react';

export interface StatDef<T> {
  label: string;
  getter: (item: T) => React.ReactNode;
}

export interface SectionDef<T> {
  title: string;
  titleGetter?: (item: T) => React.ReactNode;
  stats: StatDef<T>[];
}
