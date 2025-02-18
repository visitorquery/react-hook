# @visitorquery/react

Use this package to prevent fraud and abuse by visitors hiding behind proxies and VPNs. With a simple call to `useVisitorQuery`  your website or app will be making a request to our servers which will respond with a boolean value indicating wether the current user is behind a proxy or VPN. 99.999% of the fraud online is done by individuals hiding behind proxies and VPNs.

Our checks are not list based like other services who iterate over a database of known proxy IP addresses. We are using deep packet inspection to detect, in real time, such traffic which is why the api call must be originating from the client's device/browser.

This plugin requires a valid api key (Public api key). To obtain one please visit our website at [visitorquery.com](https://visitorquery.com) and pick a suitable plan.

Example usage on our own website (nextjs), on the checkout page, before openning the payment dialog:

```typescript
import {useVisitorQuery} from "@visitorquery/react";

export default function CheckoutComponent() {
    const visitorQuery = useVisitorQuery(
        // use your project's PUBLIC api key here
        process.env.NEXT_PUBLIC_VISITOR_QUERY_API_KEY!,
    );

    useEffect(() => {
        if (visitorQuery.is === true && visitorQuery.confidence > 0.6) {
            // decide what to do with the visitor
            return;
        }
    }, [visitorQuery]);

    return (
        <div>
            {visitorQuery.is &&(
                <p>You are behind a proxy</p>
            )}
        </div>
    )
}
```