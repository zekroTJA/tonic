/** @format */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import './App.scss';
import LoginRoute from './routes/login/login-route';
import RestAPI from './api/restapi';

export default class App extends Component {
  public state = {
    redirect: '',
  };

  public async componentDidMount() {
    RestAPI.events.on('auth-error', () => {
      this.setState({ redirect: '/login' });
    });
    RestAPI.validate().catch(() => {});
  }

  public render() {
    return (
      <Router>
        <Route
          exact
          path="/login"
          render={({ history }) => <LoginRoute history={history} />}
        />
        {this.state.redirect && <Redirect to={this.state.redirect} />}
      </Router>
    );
  }
}
