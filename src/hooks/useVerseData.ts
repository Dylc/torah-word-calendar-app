import { useState, useEffect } from 'react';
import { Verse, TorahData } from '../types/verse';

export const useVerseData = () => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/torah-verses.json')
      .then(res => res.json())
      .then((data: TorahData) => {
        setVerses(data.books.Deuteronomy.verses);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { verses, isLoading, error };
};
