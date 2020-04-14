/** @format */

import React, { Component } from 'react';
import { Modal as ModalContainer } from '@material-ui/core';

import './modal.scss';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export default class Modal extends Component<ModalProps> {
  public static defaultProps = {
    open: false,
    onClose: () => {},
  };

  public componentDidMount() {
    this.setState({ open: this.props.open });
  }

  public render() {
    return (
      <ModalContainer
        style={{
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
        }}
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <div className="modal-container">{this.props.children}</div>
      </ModalContainer>
    );
  }
}
