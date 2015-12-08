import React from 'react';
import {RouteHandler} from 'react-router';

import Login from './Login';

export default class App extends React.Component {
  state = {user: USER} // USER comes from index template

  setUser = (user) => this.setState({user: user})

  render () {
    return (
      <div>
        <div className="row">
          <div className="three columns">
            <h1>Wicker</h1>
            <Login user={this.state.user} setUser={this.setUser} />

            PageList
          </div>

          <div className="nine columns">
            <RouteHandler user={this.state.user} />
          </div>
        </div>
      </div>
    );
  }
};
