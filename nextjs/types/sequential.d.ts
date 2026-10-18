// Types for window.sequential, the Sequential browser SDK
// (https://cdn.usesequential.com/sdk/sequential/v1/sequential.js).
//
// The inline stub creates window.sequential before the SDK loads. Calls made
// before the SDK arrives are queued and replayed in order when it does.

type SequentialProperties = Record<string, unknown>;

interface SequentialApi {
  /** Send a custom event. Event names that start with "$" are reserved for Sequential's own events. */
  capture(event: string, properties?: SequentialProperties): void;
  /** Link this visitor to your own user id. Optional traits go on the $identify event. */
  identify(distinctId: string, traits?: SequentialProperties): void;
  /** Link this visitor to an account (a company, team or workspace) by its id. */
  account(accountId: string | number, traits?: SequentialProperties): void;
  /** Add properties to every later event, until the page is reloaded. */
  register(properties: SequentialProperties): void;
  /** Remove one property that register() added. */
  unregister(propertyKey: string): void;
  /** Forget the identified user and start a new anonymous visitor (call this on sign-out). */
  reset(): void;
  /** Stop sending events for this visitor. The browser keeps the choice; an opted-out visitor is not recorded on later page loads. */
  optOut(): void;
  /** Start sending again after optOut(). */
  optIn(): void;
  /** Send an error as an $exception event. */
  captureException(error: unknown, properties?: SequentialProperties): void;
  /** Send the queued events now. */
  flush(): Promise<void>;
}

interface Window {
  sequential?: SequentialApi;
}
