import { useState, useEffect } from 'react';

export type TResponse = {
    is: boolean;
}

export function useVisitorQuery(
    publicApiKey: string,
    endpoint: string = 'https://main.check.visitorquery.com/'
) {
    const [visitorQuery, setVisitorQuery] = useState<TResponse>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(endpoint, {
                    headers: { 'X-Api-Key': publicApiKey },
                });
                const data: TResponse = await response.json();
                setVisitorQuery(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData().catch(console.error);
    }, [publicApiKey, endpoint]);

    return visitorQuery;
}
