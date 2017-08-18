// @flow

import React from 'react'
import contract from 'truffle-contract'

import Header from './layout/Header'
import Switcher from './layout/Switcher'
import Footer from './layout/Footer'
import getWeb3 from './utils/getWeb3'
import isServer from './utils/isServer'

import './App.css'

type Props = {}

type State = {
  storageValue: number,
  web3?: any
}

class App extends React.Component<Props, State> {
  state: State = {
    storageValue: 0
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    if (!isServer) {
      getWeb3()
        .then(web3 => {
          if (web3) {
            this.setState({ web3 })
            this.instantiateContract()
          } else {
            console.error('No web3 available') // eslint-disable-line no-console
          }
        })
        .catch(error => {
          console.log(error) // eslint-disable-line no-console
        })
    } else {
      // eslint-disable-next-line no-console
      console.log(
        'INFO: Skipping getWeb3() — No web3 available during server rendering'
      )
    }
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    const { web3 } = this.state

    const SimpleStorageContract = require('./contracts/SimpleStorage.json')
    const simpleStorage = contract(SimpleStorageContract)
    window.simpleStorageContract = simpleStorage

    if (web3 && web3.currentProvider) {
      simpleStorage.setProvider(web3.currentProvider)
    } else {
      throw new Error(
        "Couldn't set simpleStorage provider: web3.currentProvider is not available"
      )
    }

    /*
     * Declaring this for later so we can chain functions on SimpleStorage.
     * let simpleStorageInstance
     * Get accounts.
     */

    // Declaring this for later so we can chain functions on SimpleStorage.
    let simpleStorageInstance

    if (web3 && web3.eth && web3.eth.getAccounts) {
      web3.eth.getAccounts((error, accounts) => {
        simpleStorage
          .deployed()
          .then(instance => {
            simpleStorageInstance = instance

            // Stores a given value, 5 by default.
            return simpleStorageInstance.set(5, { from: accounts[0] })
          })
          .then(() => {
            // Get the value from the contract to prove it worked.
            return simpleStorageInstance.get.call()
          })
          .then(result => {
            console.log('The stored value is:', result) // eslint-disable-line no-console
            // Update state with the result.
            return this.setState({ storageValue: result.c[0] })
          })
      })
    } else {
      throw new Error(
        "Couldn't get ETH Accounts: web3.eth.getAccounts() is not available"
      )
    }
  }

  render() {
    return (
      <main>
        <Header />
        <Switcher />
        <Footer />
      </main>
    )
  }
}

export default App
