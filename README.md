A frontend part of https://github.com/petr7555/pb138-auction, in separate repository to be able to run on Heroku.
`static.json` file tells Heroku to redirect /api calls to ${API_URL}, which is set on Heroku to https://pb138-auction-api.herokuapp.com/api.
There, the [backend](https://github.com/petr7555/auction-api/) is running.
