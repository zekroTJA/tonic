/** @format */

import React, { Component } from 'react';
import { History } from '../../types';
import { ImageData } from '../../api/models';
import RestAPI from '../../api/restapi';
import { IconButton, Button } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import Modal from '../../components/modal/modal';

import './main-route.scss';
import Header from '../../components/header/header';

const IMGPREFIX =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

const PAGE_SIZE = 100;

export default class MainRoute extends Component<{ history: History }> {
  public state = {
    page: 1,
    imageCount: 0,
    images: [] as ImageData[],
    modalDeleteOpen: false,
    modalViewOpen: false,
    target: (null as any) as ImageData,
  };

  public async componentDidMount() {
    const imageCount = (await RestAPI.imagesCount())?.count;
    this.setState({ imageCount });
    await this.fetchImages();

    window.onkeypress = this.closeModals.bind(this);
  }

  public render() {
    const images = this.state.images.map(this.imageCard.bind(this));
    return (
      <div>
        <Header
          page={this.state.page}
          pageSize={PAGE_SIZE}
          count={this.state.imageCount}
          onPageChange={(page) => this.fetchImages(page)}
        />
        <div className="flex">
          <div className="images-container">{images}</div>
        </div>
        <Modal
          open={this.state.modalDeleteOpen}
          onClose={() => this.setState({ modalDeleteOpen: false })}
        >
          <h3 className="modal-heading">
            Do you really want to delete this image?
          </h3>

          <Button
            style={{ marginRight: '10px' }}
            onClick={this.deleteImage.bind(this)}
          >
            Yes
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ modalDeleteOpen: false })}
          >
            No
          </Button>
        </Modal>
        <Modal
          open={this.state.modalViewOpen}
          onClose={() => this.setState({ modalViewOpen: false })}
        >
          <img
            className="image-preview"
            src={`${IMGPREFIX}/images/${this.state.target?.name}`}
          />
        </Modal>
      </div>
    );
  }

  private async fetchImages(page?: number) {
    if (page !== undefined && page !== this.state.page) {
      await this.setState({ page });
    }
    try {
      const offset = (this.state.page - 1) * PAGE_SIZE;
      console.log(this.state.page);
      const images = (await RestAPI.images(offset, PAGE_SIZE))?.data;
      this.setState({ images });
    } catch (err) {
      console.error(err);
    }
  }

  private imageCard(image: ImageData): JSX.Element {
    return (
      <div
        className="image-card"
        key={image.name}
        onClick={(e) => this.preview(e, image)}
      >
        <div
          className="image"
          style={{
            backgroundImage: `url("${IMGPREFIX}/images/${image.name}/thumbnail.jpg?height=150&width=10000")`,
          }}
        />
        <div className="body">
          <p>{image.name}</p>
          <div className="controls">
            <IconButton name="btn" onClick={(e) => this.delete(e, image)}>
              <Delete fontSize="small" />
            </IconButton>
            <IconButton name="btn" onClick={(e) => this.rename(e, image)}>
              <Edit fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }

  private preview(
    event: React.MouseEvent<Element, MouseEvent>,
    image: ImageData
  ) {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      modalViewOpen: true,
      target: image,
    });
  }

  private delete(
    event: React.MouseEvent<Element, MouseEvent>,
    image: ImageData
  ) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      modalDeleteOpen: true,
      target: image,
    });
  }

  private rename(
    event: React.MouseEvent<Element, MouseEvent>,
    image: ImageData
  ) {
    event.preventDefault();
    event.stopPropagation();
  }

  private async deleteImage() {
    if (this.state.target) {
      await RestAPI.deleteImage(this.state.target.name);
      this.setState({ modalDeleteOpen: false });
      this.fetchImages();
    }
  }

  private closeModals() {
    this.setState({
      modalViewOpen: false,
      modalDeleteOpen: false,
    });
  }
}
