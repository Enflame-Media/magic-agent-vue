export type Suggestion = {
    label: string;
    insertText: string;
};

export function getSuggestions(_text: string): Suggestion[] {
    return [];
}
