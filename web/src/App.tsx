/** @format */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import LoginRoute from './routes/login/login-route';
import RestAPI, { APIEvent } from './api/restapi';
import MainRoute from './routes/main/main-route';
import { createMuiTheme, ThemeProvider, Snackbar } from '@material-ui/core';
import SettingsRoute from './routes/settings/settings-route';
import { Alert } from '@material-ui/lab';
import SnackBarService, { SnackBarEvent } from './services/snackabr';

import './App.scss';

export default class App extends Component {
  public state = {
    redirect: '',
    sbOpen: false,
    sbCont: {} as SnackBarEvent,
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

  private snackBarService = new SnackBarService();

  public async componentDidMount() {
    RestAPI.events.on(APIEvent.AUTH_ERROR, () => {
      this.setState({ redirect: '/login' });
    });

    RestAPI.events.on(APIEvent.ERROR, (err) => {
      if (err.code !== 401) {
        this.snackBarService.show({
          severity: 'error',
          content: (
            <span>
              API Error: {err?.error} [{err?.code}]
            </span>
          ),
        });
      }
    });

    RestAPI.authValidate().catch(() => {});

    this.snackBarService.onShow((e) => {
      if (!e) return;
      this.setState({
        sbOpen: true,
        sbCont: e,
      });
    });
  }

  public render() {
    let snackBarContent = this.state.sbCont?.content;
    if (snackBarContent && typeof snackBarContent === 'string') {
      snackBarContent = <span>{snackBarContent}</span>;
    }

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
            render={({ history }) => (
              <SettingsRoute
                history={history}
                snackBarService={this.snackBarService}
              />
            )}
          />
          <Route
            exact
            path="/"
            render={({ history }) => (
              <MainRoute
                history={history}
                snackBarService={this.snackBarService}
              />
            )}
          />
          {this.state.redirect && <Redirect to={this.state.redirect} />}
        </Router>
        <Snackbar
          open={this.state.sbOpen}
          autoHideDuration={this.state.sbCont?.autoHideDuration ?? 5000}
          onClose={() => this.setState({ sbOpen: false })}
        >
          <Alert severity={this.state.sbCont?.severity}>
            {snackBarContent}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    );
  }
}
