# Global Night Lights

The global night lights frontend.

## Installation and Usage

The steps below will walk you through setting up a development environment for the frontend.

### Install dependencies

Install the following on your system:

- [Git](https://git-scm.com)
- [nvm](https://github.com/creationix/nvm)

Clone this repository locally and activate required Node.js version:

```
nvm install
```

Install yarn:

```
npm install -g yarn
```

Install Node.js dependencies:

```
yarn install
```

### Development

Start server with live code reload at [http://localhost:9000](http://localhost:9000):

    yarn start

### Deploy

Generate a minified build to `dist` folder:

    yarn build

Deploy to Github Pages:

    yarn deploy
