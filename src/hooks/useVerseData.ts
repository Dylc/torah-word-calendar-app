import { useState, useEffect } from 'react';
import { Verse, TorahData } from '../types/verse';

export const useVerseData = () => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}torah-verses.json`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: TorahData) => {
        setVerses(data.books.Deuteronomy.verses);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading verses:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { verses, isLoading, error };
};
