const approvedAcronyms = ['FOTM', 'PB&J', ];

/**
 * Formats a camelCase string into a human-readable format.
 * @param str - The string to format.
 * @returns The formatted string.
 */
export function formatCamelCase(str: string): string {
    if (approvedAcronyms.includes(str)) {
        return str;
    }
    const result = str.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    return result.trim().charAt(0).toUpperCase() + result.trim().slice(1);
}

const approvedSizes = ['Snack', 'Regular', 'Plus', 'One', 'Two', 'Three', 'Large', 'Single', 'Double', 'Single', 'Carafe', 'Lavender', 'Raspberry', 'Original'];

/**
 * Drops the last word from a string if it is an approved size.
 * @param str - The string to process.
 * @returns The processed string.
 */
export function dropLastWord(str: string): string {
    const words = str.match(/[a-z]+|[A-Z][a-z]*/g);
    if (words && words.length > 1 && approvedSizes.includes(words[words.length - 1])) {
        words.pop();
        return words.join('');
    }
    return str;
}

/**
 * Gets the size from a string if it is an approved size.
 * @param str - The string to process.
 * @returns The size if it is an approved size, or an empty string otherwise.
 */
export function getSize(str: string): string {
    const words = str.split(/(?=[A-Z])/);
    if (words.length > 1 && approvedSizes.includes(words[words.length - 1])) {
        return words[words.length - 1];
    }
    return ''; // Return an empty string if the last word is not an approved size
}