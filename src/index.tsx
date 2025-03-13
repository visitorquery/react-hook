import React, {createContext, useContext, useState, useEffect, useMemo} from 'react';
import {useScript} from "./hooks";

// Define types
declare global {
	interface Window {
		VisitorQuery: any;
	}
}

type VisitorQueryParams = {
	ApiKey: string;
	SessionId: string;
	Endpoint?: string;
}

type VisitorQueryState = {
	Started: boolean;
	Ended: boolean;
	Errored?: boolean;
}

// Create context
type VisitorQueryContextType = VisitorQueryState & {
	isLoading: boolean;
};

const VisitorQueryContext = createContext<VisitorQueryContextType | null>(null);

// Provider props
type VisitorQueryProviderProps = {
	apiKey: string;
	sessionId: string;
	endpoint?: string;
	children: React.ReactNode;
};

export function VisitorQueryProvider(
	{
		apiKey,
		sessionId,
		endpoint,
		children
	}: VisitorQueryProviderProps
) {
	const defaultEndpoint = 'main.check.visitorquery.com';

	// Load the client script
	const clientScript = useScript('https://cdn.visitorquery.com/visitorquery.js', {
		removeOnUnmount: false,
	});

	const [state, setState] = useState<VisitorQueryState>({
		Started: false,
		Ended  : false,
	});

	// Memoize params to prevent unnecessary re-renders
	const params = useMemo(() => ({
		ApiKey   : apiKey,
		SessionId: sessionId,
		Endpoint : endpoint || defaultEndpoint,
	}), [apiKey, sessionId, endpoint, defaultEndpoint]);

	useEffect(() => {
		// Only run if script is loaded and VisitorQuery is available
		if (typeof window.VisitorQuery !== "undefined") {
			window.VisitorQuery.run({
				ApiKey   : params.ApiKey,
				Endpoint : params.Endpoint,
				SessionId: params.SessionId,
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
	}, [params, clientScript]);

	// Create context value with memoization to prevent unnecessary renders
	const contextValue = useMemo(() => ({
		...state,
		isLoading: clientScript === "loading",
	}), [state, clientScript]);

	return (
		<VisitorQueryContext.Provider value={contextValue}>
			{children}
		</VisitorQueryContext.Provider>
	);
}

// Custom hook to use the context
export function useVisitorQuery() {
	const context = useContext(VisitorQueryContext);
	if (!context) {
		throw new Error("useVisitorQuery must be used within a VisitorQueryProvider");
	}
	return context;
}
