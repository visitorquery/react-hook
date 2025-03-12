# @visitorquery/react

Use this package to prevent fraud and abuse by visitors hiding behind proxies and VPNs. With a simple call
to `useVisitorQuery`  your website or app will be making a request to our servers which will store a value indicating
wether the current user is behind a proxy or VPN. To see the response, you will need to issue a GET request to
our [official API](https://visitorquery.com/apidocs#tag/checks/GET/results/{projectId}/{sessionId}).

Our checks are not list based like other services who iterate over a database of known proxy IP addresses. We are using
deep packet inspection to detect, in real time, such traffic which is why the api call must be originating from the
client's device/browser. This tool will catch most if not all proxies, VPNs, and Tor traffic - including residential
ones.

This plugin requires a valid api key (Public api key) and that you provision a session id to each visitor. To obtain one
please visit our website
at [visitorquery.com](https://visitorquery.com) and pick a suitable plan.

Example usage on our own website (nextjs), on the checkout page, before openning the payment dialog:

```typescript
import {useVisitorQuery} from "@visitorquery/react";

export default function LayoutComponent() {
	// visitorquery should be loaded and your visitor assessed
	// to check the result, issue a GET request from your backend
	const visitorQuery = useVisitorQuery({
		// use your project's !!PUBLIC!! api key here
		ApiKey   : process.env.NEXT_PUBLIC_VISITOR_QUERY_API_KEY!,
		SessionId: "unique-session-id-to-later-identify-the-visitor",
	});
}
```

For more info and up to date documentation, please visit our [official page](https://visitorquery.com/docs).
