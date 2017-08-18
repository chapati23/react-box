# React Truffle Box

This box comes with everything you need to start using smart contracts from a react app. This is as barebones as it gets, so nothing stands in your way.

## Prerequisites

1. Install testrpc
There's a dependency-related [issue](https://github.com/raineorshine/solidity-repl/issues/8) with the locally installed testrpc.
Unfortunately, until [this PR](https://github.com/raineorshine/solidity-repl/pull/10) gets merged and released, the only way around it is to install testrpc globally:
  ```
  npm -g ethereumjs-testrpc
  ```

After the mentioned issue is fixed there shouldn't be a need anymore to install testrpc globally.

2. Install truffle
    ```
    npm install -g truffle
    ```

3. Download this box.
    ```javascript
    truffle unbox https://github.com/chapati23/react-box
    ```

4. Compile and migrate the contracts.
    ```javascript
    truffle compile
    truffle migrate
    ```

4. Run the webpack server for front-end hot reloading. For now, smart contract changes must be manually recompiled and migrated.
    ```javascript
    npm run start
    ```

5. Jest is included for testing React components and Truffle's own suite is incldued for smart contracts. Be sure you've compile your contracts before running jest, or you'll receive some file not found errors.
    ```javascript
    // Runs Jest for component tests.
    npm run test

    // Runs Truffle's test suite for smart contract tests.
    truffle test
    ```

6. To build the application for production, use the build command. A production build will be in the build_webpack folder.
    ```javascript
    npm run build
    ```

## FAQ

* __Why is there both a truffle.js file and a truffle-config.js file?__

    Truffle requires the truffle.js file be named truffle-config on Windows machines. Feel free to delete the file that doesn't correspond to your platform.

* __Where is my production build?__

    The production build will be in the build_webpack folder. This is because Truffle outputs contract compilations to the build folder.

* __Where can I find more documentation?__

    All truffle boxes are a marriage of [Truffle](http://truffleframework.com/) and a React setup created with [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md). Either one would be a great place to start!
