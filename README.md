TOGETHER

DEMO:https://youtu.be/pJoKZXWbO9U


DESCRIPTION:
TOGETHER is a social app that helps friends more easily brainstorm and schedule events.  It combines the social planning aspect of Facebook Events, with the availability mechanism of Doodle, and the 'pinboard' concept of Pinterest.

This repository is the FRONT end.  The BACK end can be found here: https://github.com/misslesliehsu/TogetherBackEnd

FUNCTIONALITY:
The following are the core functionality components of TOGETHER -- users can:
- Login/Signup, protected with jwt authentication
- Create ideas, invite friends, and offer multiple date suggestions
- "Vote" on date suggestions of ideas
- Turn ideas into scheduled events, with final dates
- RSVP to events
- Track invitees and their RSVPs
- Export events to Google Calendar

DEVELOPMENT / FRAMEWORKS:

Front-end:
The front end was developed using Javascript, using the React and Redux frameworks.

Outside modules include:
- react-datetime -- to facilitate more user-friendly selection of dates
- Moment.js -- a react-datetime dependency
- very minimal use of semantic ui for visual organization

Additionally, TOGETHER hooks into the Google Calendar API, loading a client-side library (see the GoogleOAuth component)

Back-end:
The back end was built on Ruby on Rails, linking to a postgres database.
Outside gems include:
- bcrypt, for password authentication
- jwt, for user authentication
- serializer, for cleaner data delivery to the front-end
- faker, for dummy seed data

ORGANIZATION:

Front-end:
- Index.js loads the App.js, which, if a user is logged in, loads data from the backend.  
- App.js loads Main.js, which manages most of the application's routing to various components.
- The styling is held across two css files, one main file (App.css) and one within the react-datetime library (DateTime.css).
- There is only one reducer (rootReducer.js)
- Aside from login actions held within the actions folder, all other actions are defined within components.
- GoogleOAuth is a non-visual component rendered within EventCard.js

Back-end:

The backend uses a RESTful structure.  The auth and application controllers manage jwt authentication; the rest are namespaced controllers based on model. There are two serializers for date_suggestions and ideas.


TO RUN THE APPLICATION:

Front-end:
- Run npm install
- Run npm start

Back-end:
- Run bundle install
- Run rails db:migrate
- Run rails db:seed (if you want to start with dummy data friends and ideas)
- Run rails s -p 3001







Copyright 2018 Leslie Hsu

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
