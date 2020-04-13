/** @format */

import React, { Component } from 'react';
import { History } from '../../types';

import './main-route.scss';
import { ImageData } from '../../api/models';
import RestAPI from '../../api/restapi';

export default class MainRoute extends Component<{ history: History }> {
  public state = {
    images: [] as ImageData[],
  };

  public async componentDidMount() {
    await this.fetchImages();
  }

  public render() {
    const images = this.state.images.map((i) => <p key={i.name}>{i.name}</p>);
    return <div>{images}</div>;
  }

  private async fetchImages() {
    try {
      const images = (await RestAPI.images())?.data;
      this.setState({ images });
    } catch (err) {
      console.error(err);
    }
  }
}
