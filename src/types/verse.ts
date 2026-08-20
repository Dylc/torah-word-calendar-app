export interface Verse {
  chapter: number;
  verse: number;
  reference: string;
  verse_in_book_12_dibrot_verses: number;
  verse_in_book_13_dibrot_verses: number;
  verse_in_torah_12_dibrot_verses: number;
  verse_in_torah_13_dibrot_verses: number;
  hebrew_text_with_nikud: string;
  hebrew_text_no_nikud: string;
  gregorian_date_range: {
    from: string;
    to: string;
  };
  hebrew_calendar: {
    year: string;
    year_numeric: number;
  };
}

export interface TorahData {
  metadata: {
    version: string;
    description: string;
  };
  books: {
    Deuteronomy: {
      hebrew_name: string;
      english_name: string;
      total_verses: number;
      verses: Verse[];
    };
  };
}
