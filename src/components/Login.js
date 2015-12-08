import React from 'react';
import * as API from '../api';

export default class Login extends React.Component {

  sign = (name, ev) => {
    let username = React.findDOMNode(this.refs.username).value;
    let password = React.findDOMNode(this.refs.password).value;

    API[`sign${name}`](username, password)
      .then((data) => this.props.setUser(data.user));
  }

  signin = (ev) => this.sign('in', ev);

  signup = (ev) => this.sign('up', ev);

  signout = (ev) => API.signout()
    .then((data) => this.props.setUser(null));

  render() {
    if (this.props.user) {
      return (
        <div className="row">
          <p>Hi {this.props.user.username}!</p>
          <p>
            <button onClick={this.signout}>Sign Out</button>
          </p>
        </div>
      );
    }

    return (
      <div className="row">
        <p>
          <input className="u-full-width" placeholder="Username"
            ref="username" type="text" />
        </p>
        <p>
          <input className="u-full-width" placeholder="Password"
            ref="password" type="password" />
        </p>
        <p>
          <button onClick={this.signin}>Sign In</button>
        </p>
        <p>
          <button onClick={this.signup}>Sign Up</button>
        </p>
      </div>
    );
  }
};
