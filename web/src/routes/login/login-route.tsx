/** @format */

import React, { Component, ChangeEvent } from 'react';
import RestAPI from '../../api/restapi';
import { History } from 'history';

import './login-route.scss';

export default class LoginRoute extends Component<{
  history: History<History.PoorMansUnknown>;
}> {
  public state = {
    password: '',
    valid: null,
  };

  public render() {
    return (
      <div className="flex">
        <div className="login-wrapper">
          <h1>LOGIN</h1>
          <input
            type="password"
            value={this.state.password}
            onChange={this.passwordChange.bind(this)}
            style={{ borderColor: this.state.valid === false ? 'red' : '' }}
          />
          <div className="login-button">
            <button onClick={this.login.bind(this)}>LOGIN</button>
          </div>
        </div>
      </div>
    );
  }

  private passwordChange(e: ChangeEvent<HTMLInputElement>) {
    const password = e.target.value;
    let valid = this.state.valid;
    if (password.length === 0) {
      valid = null;
    }
    this.setState({ password, valid });
  }

  private async login() {
    try {
      if (this.state.password.length === 0) {
        return;
      }
      await RestAPI.login(this.state.password);
      this.props.history.push('/');
    } catch (err) {
      this.setState({ valid: false });
    }
  }
}
