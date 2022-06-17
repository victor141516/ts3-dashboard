# ts3-dashboard

A simple web that shows who is connected to a TeamSpeak 3 server.

<p align="center"><img width="200" src="https://i.imgur.com/qU63fTA.png"></img></p>

## Installation

It has a backend and a frontend.


### Backend

Backend is a Docker image you can build or you can use this pre-built image: `victor141516/ts3-dashboard-backend`

It requires 3 env vars `TS3_HOST`, `BOT_USERNAME`, and `BOT_PASSWORD`

### Frontend

It's a Vue application. It requires an env var for the backend url: `VITE_API_HOST`

Backend uses a totally permissive CORS policy so you can use it in any domain.