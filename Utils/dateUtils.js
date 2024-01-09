/**
 * Formats the given birthday string to the format DD/MM/YYYY.
 * @param {string} birthday - The birthday string to be formatted.
 * @returns {string} The formatted birthday string.
 */
export function formatBirthday(birthday) {
    const date = new Date(birthday);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}