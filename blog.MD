# Node Knockout 2017 

## A blog 

Here is a collection of thoughts as I work through the hackathon. 

## Redux

#### T+5 hours

I started trying to figure out how to pass state between routes when using React-Router. Quickly discovered a compelling reason to use Redux, and started reading through the docs. 

Eventually decided that my app was simple enough to do something hacky instead, and got something roughed in. It worked once and I went to sleep.

## Gremlins

#### T+13 hours

Woke up and nothing works as well as it did when I went to sleep. Login works, sometimes, really only if the page is refreshed. Logout might just not work. Gotta squash those bugs before moving on and figuring out the next big step, probably setting up the real tables in the PostgreSQL database.

## React-Router, Redirect, State

#### T+15 hours

Found the bug, which was really just a flaw in the way I was reasoning about react router. I had a route pull information from sessionStorage, and didn't realize that route was stateless and so never updated even when sessionStorage changed. That was causing very strange behavior, but it's sorted, and now I think my extremely hacky login and routing can work for hacking everything else together.

I'll report back later on if that remains true or not.