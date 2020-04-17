/** @format */

import React, { Component } from 'react';
import { History } from '../../types';
import { Button, FormControl, TextField } from '@material-ui/core';
import { ArrowBack, Save } from '@material-ui/icons';
import LocalStorageAPI from '../../api/localstorage';
import SnackBarService from '../../services/snackabr';

import './settings-route.scss';

export default class SettingsRoute extends Component<{
  history: History;
  snackBarService: SnackBarService;
}> {
  public state = {
    itemsPerPage: 0,
  };

  public componentDidMount() {
    const itemsPerPage = LocalStorageAPI.itemsPerPage ?? 50;
    this.setState({ itemsPerPage });
  }

  public render() {
    return (
      <div className="settings-wrapper">
        <div className="settings-header-controls">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => this.props.history.goBack()}
          >
            Back
          </Button>
          <Button
            startIcon={<Save />}
            variant="contained"
            color="primary"
            onClick={this.saveSettings.bind(this)}
          >
            Save
          </Button>
        </div>
        <div>
          <FormControl className="form-control">
            <TextField
              type="number"
              label="Password"
              color="primary"
              value={this.state.itemsPerPage}
              onChange={(e) => this.setItemsPerPage(e.target.value)}
            />
          </FormControl>
        </div>
      </div>
    );
  }

  private setItemsPerPage(v: string) {
    let itemsPerPage = parseInt(v) ?? 50;
    if (itemsPerPage < 1) {
      itemsPerPage = 1;
    }
    this.setState({ itemsPerPage });
  }

  private saveSettings() {
    LocalStorageAPI.itemsPerPage = this.state.itemsPerPage;
    this.props.snackBarService.show({
      severity: 'success',
      content: 'Settings saved.',
    });
  }
}
