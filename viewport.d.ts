export as namespace viewport;
export = viewport;

/**
 * Initialization method that takes an array of `ViewportConfig` objects and returns an `ViewportInstance` with the full API.
 */
declare function viewport(config: ViewportConfig[]): Subscriber & ViewportInstance;

/**
 * Initialize with a single `MediaQuery` string. Returns an `ViewportInstance` with a limited API. If `handler` is provided, it is immediately executed against the current viewport conditions.
 */
declare function viewport(query: MediaQuery, handler?: SubscriptionHandler): Pick<ViewportInstance, 'matches' | 'remove'>;

declare namespace viewport {
    export { MediaQuery, SubscriptionHandler, ViewportConfig, ViewportName, ViewportState, ViewportInstance };
}

type Subscriber = (name: ViewportName | SubscriptionHandler, handler?: SubscriptionHandler) => () => number;

/**
 * The viewport's unique nickname.
 */
type ViewportName = string;

/**
 * A valid `MediaQueryList#media` string.
 */
type MediaQuery = string;

/**
 * A function executed when viewport state changes occur.
 */
type SubscriptionHandler = (state: ViewportState, instance: ViewportInstance) => void;

type ViewportConfig = {
    /**
     * The viewport's nickname. Must be unique.
     */
    name: ViewportName;
    /**
     * A valid {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/media `MediaQueryList` `media`} string.
     */
    query: string;
};

type ViewportState = {
    /**
     * The configured viewport's name.
     */
    name: ViewportName | undefined;
    /**
     * If the viewport's media query matches.
     */
    matches: boolean;
    /**
     * If the viewport is the current viewport.
     */
    current: boolean;
};

type BooleanOrViewportState<T extends ViewportName | undefined> = T extends ViewportName
    ? boolean
    : ViewportState;

type BooleanOrViewportStateArray<T extends ViewportName | undefined> = T extends ViewportName
    ? boolean
    : ViewportState[];

type ViewportStateOrViewportStateArray<T extends ViewportName | undefined> = T extends ViewportName
    ? ViewportState
    : ViewportState[];

type ViewportInstance = {

    /**
     * When called with the `name` argument, returns the named viewport's state object. Otherwise, it returns an array of state objects for all viewports.
     */
    state: <T extends ViewportName | undefined>(name?: T) => ( ViewportStateOrViewportStateArray<T> );

    /**
     * When called with the `name` argument, checks if `name` is the current viewport and returns a boolean. Otherwise, it returns the current viewport's state object.
     */
    current: <T extends ViewportName | undefined>(name?: T) => ( BooleanOrViewportState<T> );

    /**
     * When called with the `name` argument, checks if the name viewport's media query matches. Otherwise, it returns an array of all matching viewports.
     */
    matches: <T extends ViewportName | undefined>(name?: T) => ( BooleanOrViewportStateArray<T> );


    /**
     * When called with the `name` argument, checks if `name` is the previous viewport and returns a boolean. Otherwise, it returns the previous viewport's state object.
     */
    previous: <T extends ViewportName | undefined>(name?: T) => ( BooleanOrViewportState<T> );

    /**
     * Removes all the `ViewportInstance`'s configured viewports and subscribers at once.
     */
    remove: () => null;

}