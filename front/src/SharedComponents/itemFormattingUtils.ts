const approvedAcronyms = ['FOTM', 'PB&J', ];

export function formatCamelCase(str: string): string {
    if (approvedAcronyms.includes(str)) {
        return str;
    }
    const result = str.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    return result.charAt(0).toUpperCase() + result.slice(1);
}

const approvedSizes = ['Snack', 'Regular', 'Plus', 'One', 'Two', 'Three', 'Large', 'Single', 'Double', 'Single', 'Carafe'];

export function dropLastWord(str: string): string {
    const words = str.match(/[a-z]+|[A-Z][a-z]*/g);
    if (words && words.length > 1 && approvedSizes.includes(words[words.length - 1])) {
        words.pop();
        return words.join('');
    }
    return str;
}

export function getSize(str: string): string {
    const words = str.split(/(?=[A-Z])/);
    if (words.length > 1 && approvedSizes.includes(words[words.length - 1])) {
        return words[words.length - 1];
    }
    return ''; // Return an empty string if the last word is not an approved size
}