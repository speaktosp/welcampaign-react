import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import campaign from './campaign';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    const manager = await campaign.methods.manager().call();
    const players = await campaign.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(campaign.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await campaign.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'Thanks for your contribution to our Campaign.' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await campaign.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A team has been picked!' });
  };

  render() {
    return (
      <div>
        <h2>Well'Campaign'</h2>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to support your team?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a Campaign winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
