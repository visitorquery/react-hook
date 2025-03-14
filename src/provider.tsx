import React, {createContext, useContext, useState, useEffect, useMemo} from 'react';
import {useScript} from "./hooks";

// Define types
declare global {
	interface Window {
		VisitorQuery: any;
	}
}

type VisitorQueryState = {
	started: boolean;
	ended: boolean;
	errored?: boolean;
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
		started: false,
		ended  : false,
	});

	useEffect(() => {
		// Only run if script is loaded and VisitorQuery is available
		if (typeof window.VisitorQuery !== "undefined") {
			window.VisitorQuery.run({
				ApiKey   : apiKey,
				Endpoint : endpoint || defaultEndpoint,
				SessionId: sessionId,
				onOpen   : () => {
					setState({
						started: true,
						ended  : false,
					});
				},
				onClose  : () => {
					setState({
						started: true,
						ended  : true,
					});
				},
				onError  : (err: Event) => {
					setState({
						started: true,
						ended  : true,
						errored: true,
					});
					console.error(err);
				}
			});
		}
	}, [apiKey, endpoint, sessionId, clientScript]);

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
