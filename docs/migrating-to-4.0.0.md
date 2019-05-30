# Migrating to v4.0.0 #



## New Features ##

None.


## Enhancements ##

- When a subscriber is added, it is now immediately executed. This is done to support use-cases that require defaults to be overwritten once a subscriber has been added. For example: Setting an application's default viewport in a server-side environment. Once the application is rendered in the browser, that viewport may not be the current viewport. All dependents will need to be updated to the current viewport.

## Breaking Changes ##

- When a subscriber is added, the subscriber handler is immediately executed regardless to the viewport's state (`matches` or `current`).


