import { Verse } from '../types/verse';

export function findVerseByYear(verses: Verse[], year: number): Verse | null {
  if (!verses || verses.length === 0) return null;

  // Handle edge cases
  if (year < 1130) return verses[0];
  if (year > 2084) return verses[verses.length - 1];

  // Find matching verse
  const verse = verses.find(v => {
    const from = parseInt(v.gregorian_date_range.from);
    const to = parseInt(v.gregorian_date_range.to);
    return year >= from && year < to;
  });

  return verse || verses[0];
}
