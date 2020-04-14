/** @format */

import React, { Component } from 'react';
import { History } from '../../types';
import { ImageData } from '../../api/models';
import RestAPI from '../../api/restapi';
import { IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';

import './main-route.scss';

const IMGPREFIX =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

export default class MainRoute extends Component<{ history: History }> {
  public state = {
    images: [] as ImageData[],
  };

  public async componentDidMount() {
    await this.fetchImages();
  }

  public render() {
    const images = this.state.images.map(this.imageCard);
    return <div className="images-container">{images}</div>;
  }

  private async fetchImages() {
    try {
      const images = (await RestAPI.images())?.data;
      this.setState({ images });
    } catch (err) {
      console.error(err);
    }
  }

  private imageCard(image: ImageData): JSX.Element {
    return (
      <div className="image-card">
        <div
          className="image"
          style={{
            backgroundImage: `url("${IMGPREFIX}/images/${image.name}/thumbnail.jpg?height=150&width=10000")`,
          }}
        />
        <div className="body">
          <p>{image.name}</p>
          <div className="controls">
            <IconButton onClick={() => this.delete(image)}>
              <Delete fontSize="small" />
            </IconButton>
            <IconButton onClick={() => this.rename(image)}>
              <Edit fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }

  private delete(image: ImageData) {}

  private rename(image: ImageData) {}
}
