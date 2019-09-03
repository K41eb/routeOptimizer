# Contributing

This guide will assume that you know how to install the project, which is explained in detail in the [README.md](README.md#installation) file.

# Project details

Some details in no particular order:
- The project uses ES6 syntax, which means that the js code is _compiled_ to es2015 syntax (with Babel) and stored in the `dist` directory.
- Server input is vavlidated with [JSON schemas](https://json-schema.org/understanding-json-schema/) and [Ajv](https://www.npmjs.com/package/ajv).


# Project structure


## Main code

The code is stored in the `src` directory.

```
src
├── getOptimizedRoute.js
├── libs
│   ├── errors.js
│   ├── getDataFromGoogle.js
│   ├── getDistanceMatrix.js
│   ├── getSchedule.js
│   ├── solveTsp.js
│   └── validation.js
└── server.js

```

- `server.js` is the "main" function, the entry point of our program, inside are the server routes definitions.
- `getOptimizedRoute` is called by `server.js` to process the request and return the response.
- `libs` contains the various libraries that accomplish the different subtasks needed to produce a schedule from geographic coordinates.

## Tests

```
test
├── integrationTests
│   └── routeOptimizer.postman_collection.json
└── unitTests
    ├── getOptimizedRoute.test.js
    ├── libs
    │   ├── errors.test.js
    │   ├── getDataFromGoogle.test.js
    │   ├── getDistanceMatrix.test.js
    │   ├── getSchedule.test.js
    │   ├── solveTsp.test.js
    │   └── validation.test.js
    └── samples
        ├── googleApiSamples/...
        └── serverSamples/...
```

The `test` directory contains the unit and integrations tests:
- Unit tests with the [Mocha](https://mochajs.org/) framework.
- Integration tests with [Postman](https://www.getpostman.com/).
- `test/unitTests/samples` is a collection of request and responses used for testing purposes.

The tree architecture in `test/unitTests` mimics the architecture in `src`.

### Running unit tests

First:
```sh
export NODE_ENV='development'
```
**This is required** so that mocking is done porperly.

And then:
```sh
yarn test
```

This command will also output coverage thanks to [Istambul](https://istanbul.js.org/) and their [nyc](https://www.npmjs.com/package/nyc) CLI tool.

### Test package tools

This is a short list of recommended packages for unit testing:
- [babel-plugin-mockable-imports](https://www.npmjs.com/package/babel-plugin-mockable-imports): This is a Babel plugin that allows you to mock the imports of the file you are currently testing (Read: you can isolate the file from any of its dependencies). Hands down the best package in this list.
- [Chai](https://www.chaijs.com/): an assertion library among others.
  - [drty-chai](https://www.npmjs.com/package/dirty-chai): this is one of many chai plugins for more expressive syntax.
- [Nock](https://www.npmjs.com/package/nock): an Http requests interceptor.
- [Sinon](https://sinonjs.org/): a mocking library (for project-localized imports).

Remark: In the current tests, all `$imports` syntax and the like with a leading `$` come from babel-plugin-mockable-imports. It's not magic (almost though).

### Running integration tests

You can either use the [Postman](https://www.getpostman.com/) GUI or use their CLI called [newman](https://www.npmjs.com/package/newman).

To use the CLI, first start a dev server:
```sh
yarn start
```

And then run the tests in another tab (notice the `i`):
```sh
yarn itest
```

## Resources

```
resources
└── schemas
    ├── route-optimizer-request.schema.json
    └── route-optimizer-response.schema.json
```
- `resources` stores various "permanent resources" such as images, icons, schemas ...
  - `resources/schemas` holds the [JSON schemas](https://json-schema.org/understanding-json-schema/) responsible for validating the input and output.


## Side scripts

The `scripts` directory contains various scripts that are called from the packages.json scripts. For now it contains:
- `install-deps` which installs the node packages and compiles `node-tspsolver`, our C library.

# Remarks

## Issues to be addressed

This projects use a TSP solving library based on the simulated annealing algorithm. I didn't come up
with the algorithm and I do not understand how to tweak it for better results. In short, there is
room for improvement. Tests consistently take around 8 seconds for 3 points and 5 locations matrix, I know
that the TSP problem isn't particularly easy to solve but that is some terrible performance in my
humble opinion.

The library also assumes that the matrix is symetric, which is not the case because google returns
an asymetric distances matrix. Which means that there may be sub-optimal results sometimes.

## Possible solutions

I haven't found any NPM packages that implemented the
[branch and bound algorithm](https://en.wikipedia.org/wiki/Branch_and_bound) which seems better
suited and more efficient for our task.

# Useful API & Packages references

[Google maps matrix API](https://developers.google.com/maps/documentation/distance-matrix/intro)   
[node-tspsolver](https://www.npmjs.com/package/node-tspsolver)   
[JSON schemas](https://json-schema.org/understanding-json-schema/)   
[Online JSON schemas validator](https://www.jsonschemavalidator.net/)   

