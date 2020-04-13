/** @format */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import './App.scss';
import LoginRoute from './routes/login/login-route';
import RestAPI, { APIEvent } from './api/restapi';
import MainRoute from './routes/main/main-route';

export default class App extends Component {
  public state = {
    redirect: '',
  };

  public async componentDidMount() {
    RestAPI.events.on(APIEvent.AUTH_ERROR, () => {
      this.setState({ redirect: '/login' });
    });
    RestAPI.authValidate().catch(() => {});
  }

  public render() {
    return (
      <Router>
        <Route
          exact
          path="/login"
          render={({ history }) => <LoginRoute history={history} />}
        />
        <Route
          exact
          path="/"
          render={({ history }) => <MainRoute history={history} />}
        />
        {this.state.redirect && <Redirect to={this.state.redirect} />}
      </Router>
    );
  }
}
