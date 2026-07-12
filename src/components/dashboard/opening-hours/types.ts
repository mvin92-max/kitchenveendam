export type OpeningHourRowData = {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  closed: boolean;
};

export type ExceptionData = {
  id: string;
  date: string; // yyyy-mm-dd
  label: string;
  closed: boolean;
  openTime: string | null;
  closeTime: string | null;
};
