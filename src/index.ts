import {useEffect} from 'react';
import {useScript} from "./hooks.ts";

declare global {
	interface Window {
		VisitorQuery: any;
	}
}

type Params = {
	ApiKey: string;
	SessionId: string;
	Endpoint?: string;
}

export function useVisitorQuery(p: Params) {
	const defaultEndpoint = 'main.check.visitorquery.com';
	const clientScript = useScript('https://cdn.visitorquery.com/visitorquery.js', {
		removeOnUnmount: false,
	});

	useEffect(() => {
		if (typeof window.VisitorQuery !== "undefined") {
			window.VisitorQuery.run({
				ApiKey   : p.ApiKey,
				Endpoint : p.Endpoint || defaultEndpoint,
				SessionId: p.SessionId
			});
		}
	}, [p, clientScript]);
}
