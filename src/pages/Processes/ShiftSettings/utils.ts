// material-hu's TimePicker works with `Date`, but ShiftSchedule persists times as
// "HH:mm" strings — convert at the boundary, never inside the form component.
export const timeStringToDate = (time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/** Formats a `Date`'s local hours/minutes as an `"HH:mm"` string. */
export const dateToTimeString = (date: Date): string =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
