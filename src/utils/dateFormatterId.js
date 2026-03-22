/**
 * Formats a date string into a human-readable Indonesian date format.
 *
 * @param {string} dateString - The date string to format.
 * @param {'full' | 'year' | 'month' | 'day'} [format='full'] - The desired output format.
 * @returns {string} The formatted date (e.g., '11 September 2024').
 * @throws {Error} If the provided dateString is invalid.
 */
export default function dateFormatterID(dateString, format = 'full') {
  if (!dateString) {
    throw new Error('Date string is required');
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();

  switch (format) {
    case 'year':
      return year.toString();
    case 'month':
      return month;
    case 'day':
      return String(day).padStart(2, '0');
    case 'full':
    default:
      return `${day} ${month} ${year}`;
  }
}
