
# Path optimizer

This is a small server with only one endpoint to generate a schedule from a set of tasks with location details.

It is my implementation for [this technical assignment](https://gist.github.com/Esya/bcdbe6bba687ef59ad7b76ac35ca8200).

# How does it work?

1. You send a set of coordinates to the server.
1. The server fetches a distances matrix from google maps.
1. The server solves the associated [TSP problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem)
1. The server returns a schedule with the optimized itinerary (least time to complete).

Remark: The TSP problem is a rather complicated one, and solving algorithms tend to produce sub-optimal results sometimes (still quite optimal). Don't expect pitch perfect results.

# Requirements

You will need:
- [Yarn](https://yarnpkg.com)
- [Node.Js 10](https://nodejs.org)

Additionally you will need to satisfy [node-gyp's requirements](https://github.com/nodejs/node-gyp#installation):
- Python 2.7 recommended (3.x versions are incompatible)
- [A gcc compiler](https://gcc.gnu.org/)

Easy GCC install on linux:
```sh
sudo apt install build-essential
```

If you are having trouble with your Python version, do read node-gyp's installation procedure.

Finally you will need a [google-maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
which you will store in an environment variable like so:

```sh
export GOOGLE_MAPS_API_KEY='your_key';
```

# Installation


```sh
yarn install-deps
```
This is **required** at least once. To compile the TSP solving library which is a C library (Hence the need for the compiler).

# Usage

## Start the server

This will start a development server:

```sh
yarn start
```

This will build the project for a production deployment:

```sh
yarn build
```

This will start a server from the buid:

```sh
yarn serve
```

## Call the server

The server has only one enpoint:
- POST /routeOptimizer

No authentication of any sort is required.

Sample request: 
```json
{
  "departureTime": "1508756400",
  "home": {
    "lat": 48.83310530000001,
    "lng": 2.333563799999979
  },
  "tasks":[
    {
       "id":1,
       "lat":48.8623348,
       "lng":2.3447356000000354,
       "duration":45
    },
    {
      "id":2,
      "lat":48.879251,
      "lng":2.282264899999973,
      "duration": 60
    },
    ...
  ]
}
```

- `departureTime` is an UNIX timestamp.
- `duration`s are expressed in minutes.


Sample response:
```json
{
  "totalTime": 333,
  "schedule": [
    {
      "id": 3,
      "startsAt": 1508757805,
      "endsAt": 1508759605,
      "lat": 48.7251521,
      "lng": 2.259899799999971
    },
    {
      "id": 2,
      "startsAt": 1508761511,
      "endsAt": 1508765111,
      "lat": 48.879251,
      "lng": 2.282264899999973
    },
    ...
  ]
}

```

- `startsAt` and `endsAt` both are UNIX timestamps.
- `totalTime` is expressed in minutes.

I suggest you get [Postman](https://www.getpostman.com/) to 'play' with the server. You can import the sample collection from:
```
test/integrationTests/routeOptimizer.postman_collection.json
```

## Recommendations

Your API Key is subject to [billing](https://developers.google.com/maps/documentation/javascript/usage-and-billing) according to your usage. If you want to make a schedule for 200 locations:
1. I might cost _some_ money (200^2 distances will be calculated), or google could simply refuse to process your request.
2. The server might take a lot of time to respond, solving the TSP problem is _ressource intensive_. e.g. Solving the problem for 5 locations takes about 8 seconds on my machine.

## Remarks

Yes, I know, the current TSP solving algorithm is slow. This is the next improvement on my list, I swear.
