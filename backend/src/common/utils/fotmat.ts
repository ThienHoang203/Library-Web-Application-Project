export function formatVietnamDateTime(date: Date): string {
  const vietnamOffsetMinutes = 7 * 60;
  const localOffsetMinutes = date.getTimezoneOffset();
  const vietnamTime = new Date(
    date.getTime() + (vietnamOffsetMinutes + localOffsetMinutes) * 60 * 1000,
  );

  const day = String(vietnamTime.getDate()).padStart(2, '0');
  const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
  const year = vietnamTime.getFullYear();
  const hours = String(vietnamTime.getHours()).padStart(2, '0');
  const minutes = String(vietnamTime.getMinutes()).padStart(2, '0');
  const seconds = String(vietnamTime.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
