import type { Genre } from '../types';

export const GENRES: { value: Genre; label: string }[] = [
  { value: 'strategy', label: '戦略' },
  { value: 'luck', label: '運' },
  { value: 'negotiation', label: '交渉' },
  { value: 'cooperative', label: '協力' },
  { value: 'memory', label: '記憶' },
];

export const GENRE_LABEL: Record<Genre, string> = {
  strategy: '戦略',
  luck: '運',
  negotiation: '交渉',
  cooperative: '協力',
  memory: '記憶',
};
