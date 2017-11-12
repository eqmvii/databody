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

## Front-end Architecture

#### T+16.5 hours

Roughed in the front-end structure and am ready to set up the basics of the database and actual authentication routes

## Success!

#### T+20 hours

Got my horribly hacked together user registration and login working. It's simlpe, but in means the database exists, works locally, works in production, and can talk to the frontend over various routes.

Lots of shortcuts taken and details punted for later, but the framework exists, which means the actual features can be developed now. Or I can take a nap.

Time will tell.

## Sessions: 1 Eric: 0

#### T+23 hours

Had some nasty issues sorting out cookies and sessions. A tangle of related issues, including secure cookies (or not), fetch sending cookies (or not, by default), and other express security settings. As is always the case, from the beginning the only truly broken thing was my mental model of the app and my technical assumptions.

Amusingly, I got the clue I needed to get things working when I realized sessions/cookies were working on Heroku (with https) but not locally. That lightbulb refined my google searches, and now I feel comfortable plowing ahead securing some of my API routes with sessions.

Learning is such a step function. For 2 hours you chase leads, chase your own tail, chase shadows, and feel like things make less and less sense. Then bam! All of the sudden it works and you're moving full speed ahead, and you actually feel like you've Learned Something(TM).

Anyway, enough learning. Now I'm going to get dinner!

## Back on track!

#### T+27 hours

Back in the groove after dinner and a bit of rest. Added the add-weight route without any drama, and the session code worked as expected, the first time I tried. Learning! Knock on wood!

ALSO MORE CAFFEINE IS HELPING.

## Midnight, again.

#### T+30.5 hours

It's getting late but things are starting to come together! I'll try to code for a few more hours so I can dedicate as much of the final day to tweaks and style as possible.

My main database interfacing routes are complete and I've got something visible for all of my views. "All" that's left is the main business logic and the resulting dashboard, plus updating the register form, plus graphics works, plus...

Maybe I need more coffee...


## DEATH OR GLORY

#### T+38 hours

Wish I had a counter of bugs created vs. bugs caused.

Also another morning of waking up to discover bugs I missed in the final sprint before going to sleep, which makes me excited for day-after-the-hackathon bugs!

Things are coming together, I may actually be on schedule for getting the core of my project up and running on schedule!

- - - - - - - - 