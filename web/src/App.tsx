/** @format */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import LoginRoute from './routes/login/login-route';
import RestAPI, { APIEvent } from './api/restapi';
import MainRoute from './routes/main/main-route';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

import './App.scss';
import SettingsRoute from './routes/settings/settings-route';

export default class App extends Component {
  public state = {
    redirect: '',
  };

  private theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#03A9F4',
        dark: '#0288D1',
      },
    },
  });

  public async componentDidMount() {
    RestAPI.events.on(APIEvent.AUTH_ERROR, () => {
      this.setState({ redirect: '/login' });
    });
    RestAPI.authValidate().catch(() => {});
  }

  public render() {
    return (
      <ThemeProvider theme={this.theme}>
        <Router>
          <Route
            exact
            path="/login"
            render={({ history }) => <LoginRoute history={history} />}
          />
          <Route
            exact
            path="/settings"
            render={({ history }) => <SettingsRoute history={history} />}
          />
          <Route
            exact
            path="/"
            render={({ history }) => <MainRoute history={history} />}
          />
          {this.state.redirect && <Redirect to={this.state.redirect} />}
        </Router>
      </ThemeProvider>
    );
  }
}
