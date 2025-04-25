// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;

export async function load() {
    try {
        const response = await fetch('http://localhost:3000/api/advertisements/getAll', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.length === 0) {
            return {
                status: 404,
                error: "No advertisements found"
            };
        }

        return {
            status: 200,
            initialData: data
        };
    } catch (error) {
        console.error("Error loading data:", error);
        return {
            status: 500,
            error: "Internal Server Error"
        };
    }
}