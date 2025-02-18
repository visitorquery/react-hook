import { useState, useEffect } from 'react';

export type TResponse = {
    is: boolean;
    confidence: number;
}

export function useVisitorQuery(
    publicApiKey: string,
    endpoint: string = 'https://main.check.visitorquery.com/'
) {
    const [visitorQuery, setVisitorQuery] = useState<TResponse>({
        is: false,
        confidence: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(endpoint, {
                    headers: { 'X-Api-Key': publicApiKey },
                });
                const data = await response.json();
                setVisitorQuery(data as TResponse);
            } catch (error) {
                console.error(`Error fetching visitorquery data: ${error}`);
            }
        };

        fetchData().catch(console.error);
    }, [publicApiKey, endpoint]);

    return visitorQuery;
}
