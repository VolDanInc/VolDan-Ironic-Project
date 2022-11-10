# Project 2

## Find your favorite entertainment. 

## Introduction

Website to choose your favorite form of entertainment (books, music albums, podcasts, movies, tv series etc) and keep track of them all in one place. Potentially share with your friends. 

  
## How does it work?

- To start adding favorites, you have signup or login. Then you can access different books or music albums and add them with one click to your favorites list. Additionally, you can create your own entries, that will appear in your favorites. 

- When it comes to the music albums, what you see is the Spotify API fetching the latest albums. So you get to choose from the coolest albums released. 

## How to install

- Copy the code
- Go into "voldanironicproject" folder
- install dependencies with npm install:
  - "axios": "^1.1.2",
    "bcrypt": "^5.1.0",
    "bootstrap": "^5.2.2",
    "connect-mongo": "^4.6.0",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.0.3",
    "express": "^4.18.1",
    "express-session": "^1.17.3",
    "hbs": "^4.2.0",
    "mongoose": "^6.6.5",
    "morgan": "^1.10.0",
    "serve-favicon": "^2.5.0",
    "spotify-web-api-node": "^5.0.2"
  - launch npm run dev from the terminal
  - open localhost:3000 in your browser
- set parameters in the environment file .env :
    - SESSION_SECRET='keyboard cat'
    for Spotify credentials
    - CLIENT_ID = XXXXXXXXXXX
    - CLIENT_SECRET = XXXXXXXXXXX
    for database
    - MONGODB_URI = "link"
- to launch in the internet https://voldan.herokuapp.com/
