import { readFilePromise } from './file';

export async function getQueryByName(filePath: string, queryName: string): Promise<string> {
    const regex = new RegExp(`-- name: ${queryName}\\s+([\\s\\S]*?)(?=-- name:|$)`, 'i');
    try {
        const data = await readFilePromise(filePath);
        const match = data.match(regex);
        if (match) {
            // Return the matched query, trimming any extra whitespace
            return match[1].trim();
        }
        throw new Error(`Query "${queryName}" not found in file.`);
    } catch (error: any) {
        console.error('Error reading file -', error.message);
        throw new Error(`Failed to read query from file: ${filePath}`);
    }
}
