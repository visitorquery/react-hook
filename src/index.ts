import {useState, useEffect} from 'react';
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

type State = {
	Started: boolean;
	Ended: boolean;
	Errored?: boolean;
}

export function useVisitorQuery(p: Params) {
	const defaultEndpoint = 'main.check.visitorquery.com';
	const clientScript = useScript('https://cdn.visitorquery.com/visitorquery.js', {
		removeOnUnmount: false,
	});

	const [state, setState] = useState<State>({
		Started: false,
		Ended  : false,
	});

	useEffect(() => {
		if (typeof window.VisitorQuery !== "undefined") {
			window.VisitorQuery.run({
				ApiKey   : p.ApiKey,
				Endpoint : p.Endpoint || defaultEndpoint,
				SessionId: p.SessionId,
				onOpen   : () => {
					setState({
						Started: true,
						Ended  : false,
					});
				},
				onClose  : () => {
					setState({
						Started: true,
						Ended  : true,
					});
				},
				onError  : (err: Event) => {
					setState({
						Started: true,
						Ended  : true,
						Errored: true,
					});
					console.error(err);
				}
			});
		}
	}, [p, clientScript]);

	return state;
}
