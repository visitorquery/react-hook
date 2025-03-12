import * as React from "react";

interface UseScriptOptions {
	removeOnUnmount?: boolean;

	[key: string]: any;
}

type ScriptStatus = "loading" | "ready" | "error" | "unknown";

export function useScript(src: string, options: UseScriptOptions = {}): ScriptStatus {
	const [status, setStatus] = React.useState<ScriptStatus>("loading");
	const optionsRef = React.useRef<UseScriptOptions>(options);

	React.useEffect(() => {
		let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`);

		const domStatus = script?.getAttribute("data-status") as ScriptStatus | null;
		if (domStatus) {
			setStatus(domStatus);
			return;
		}

		if (script === null) {
			script = document.createElement("script");
			script.src = src;
			script.async = true;
			script.setAttribute("data-status", "loading");
			document.body.appendChild(script);

			const handleScriptLoad = () => {
				script?.setAttribute("data-status", "ready");
				setStatus("ready");
				removeEventListeners();
			};

			const handleScriptError = () => {
				script?.setAttribute("data-status", "error");
				setStatus("error");
				removeEventListeners();
			};

			const removeEventListeners = () => {
				script?.removeEventListener("load", handleScriptLoad);
				script?.removeEventListener("error", handleScriptError);
			};

			script.addEventListener("load", handleScriptLoad);
			script.addEventListener("error", handleScriptError);

			const removeOnUnmount = optionsRef.current.removeOnUnmount;

			return () => {
				if (removeOnUnmount === true) {
					script?.remove();
					removeEventListeners();
				}
			};
		} else {
			setStatus("unknown");
		}
	}, [src]);

	return status;
}
