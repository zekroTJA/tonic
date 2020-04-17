/** @format */

import React, { Component } from 'react';
import { Pagination } from '@material-ui/lab';
import { Button } from '@material-ui/core';

import './header.scss';

export interface HeaderProps {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onLogOut: () => void;
  onSettings: () => void;
}

export default class Header extends Component<HeaderProps> {
  public static defaultProps = {
    page: 1,
    onPageChange: () => {},
    onLogOut: () => {},
  };

  public render() {
    const count = this.props.count;
    const pageSize = this.props.pageSize;
    const pages = Math.floor(count / pageSize) + (count % pageSize > 0 ? 1 : 0);
    return (
      <div className="header-wrapper">
        <Pagination
          page={this.props.page}
          count={pages}
          showFirstButton
          showLastButton
          onChange={(_, p) => this.props.onPageChange(p)}
        />
        <div className="header-left-wrapper">
          <p className="no-margin">Image Count: {this.props.count}</p>
          <Button
            onClick={this.props.onSettings}
            style={{ marginRight: '20px' }}
          >
            Settings
          </Button>
          <Button onClick={this.props.onLogOut}>Logout</Button>
        </div>
      </div>
    );
  }
}
