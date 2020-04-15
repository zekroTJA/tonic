/** @format */

import React, { Component, ChangeEvent } from 'react';
import RestAPI from '../../api/restapi';
import { History } from '../../types';
import {
  TextField,
  FormControl,
  FormHelperText,
  Button,
} from '@material-ui/core';

import './login-route.scss';

export default class LoginRoute extends Component<{ history: History }> {
  public state = {
    password: '',
    valid: null,
  };

  public render() {
    return (
      <div className="flex">
        <div className="login-wrapper">
          <h1>LOGIN</h1>
          <FormControl
            error={this.state.valid === false}
            className="form-control"
          >
            <TextField
              type="password"
              label="Password"
              color="primary"
              value={this.state.password}
              onChange={this.passwordChange.bind(this)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') this.login();
              }}
            />
            {this.state.valid === false && (
              <FormHelperText>Invalid password.</FormHelperText>
            )}
            <Button
              onClick={this.login.bind(this)}
              variant="contained"
              color="primary"
            >
              Login
            </Button>
          </FormControl>
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
      await RestAPI.authLogin(this.state.password);
      this.props.history.push('/');
    } catch (err) {
      this.setState({ valid: false });
    }
  }
}
