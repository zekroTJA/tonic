/** @format */

import React, { Component } from 'react';
import { History } from '../../types';
import { ImageData } from '../../api/models';
import RestAPI from '../../api/restapi';
import { Button, Input } from '@material-ui/core';
import Modal from '../../components/modal/modal';
import Header from '../../components/header/header';
import dateFormat from 'dateformat';
import { byteFormatter as byteFormat } from 'byte-formatter';
import ImageCard from '../../components/image-card/image-card';

import './main-route.scss';

const IMGPREFIX =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

const PAGE_SIZE = 100;

export default class MainRoute extends Component<{ history: History }> {
  public state = {
    page: 1,
    imageCount: 0,
    images: [] as ImageData[],
    modalViewOpen: false,
    modalDeleteOpen: false,
    modalRenameOpen: false,
    modalInfoOpen: false,
    target: (null as any) as ImageData,
    renameInput: '',
  };

  public async componentDidMount() {
    const imageCount = (await RestAPI.imagesCount())?.count;
    this.setState({ imageCount });
    await this.fetchImages();

    window.onkeypress = this.closeModals.bind(this);
  }

  public render() {
    const images = this.state.images.map((i) => (
      <ImageCard
        image={i}
        urlPrefix={IMGPREFIX}
        onClick={this.preview.bind(this)}
        onDeleteClick={this.delete.bind(this)}
        onRenameClick={this.rename.bind(this)}
        onInfoClick={this.info.bind(this)}
      />
    ));
    return (
      <div className="images-route-wrapper">
        <Header
          page={this.state.page}
          pageSize={PAGE_SIZE}
          count={this.state.imageCount}
          onPageChange={(page) => this.fetchImages(page)}
          onLogOut={this.onLogout.bind(this)}
        />

        <div className="images-container">{images}</div>

        {this.modalDelete}
        {this.modalRename}
        {this.modalPreview}
        {this.modalInfo}
      </div>
    );
  }

  private get modalDelete(): JSX.Element {
    return (
      <Modal
        open={this.state.modalDeleteOpen}
        onClose={() => this.setState({ modalDeleteOpen: false })}
      >
        <h3 className="modal-heading">
          Do you really want to delete this image?
        </h3>
        <p>Do you really want to delete the image {this.state.target?.name}</p>
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
    );
  }

  private get modalRename(): JSX.Element {
    return (
      <Modal
        open={this.state.modalRenameOpen}
        onClose={() => this.setState({ modalRenameOpen: false })}
      >
        <h3 className="modal-heading">Rename Image</h3>
        <div>
          <Input
            className="modal-rename-input"
            type="text"
            value={this.state.renameInput}
            color="primary"
            onChange={(e) => this.setState({ renameInput: e.target.value })}
          />
        </div>
        <Button
          style={{ marginRight: '10px' }}
          variant="contained"
          color="primary"
          onClick={this.renameImage.bind(this)}
        >
          Rename
        </Button>
        <Button onClick={() => this.setState({ modalRenameOpen: false })}>
          Cancel
        </Button>
      </Modal>
    );
  }

  private get modalPreview(): JSX.Element {
    return (
      <Modal
        open={this.state.modalViewOpen}
        onClose={() => this.setState({ modalViewOpen: false })}
      >
        <img
          className="image-preview"
          alt="preview"
          src={`${IMGPREFIX}/images/${this.state.target?.name}`}
        />
      </Modal>
    );
  }

  private get modalInfo(): JSX.Element {
    return (
      <Modal
        open={this.state.modalInfoOpen}
        onClose={() => this.setState({ modalInfoOpen: false })}
      >
        <div className="info-container">
          <img
            alt="thumbnail"
            src={`${IMGPREFIX}/images/${this.state.target?.name}/thumbnail.jpg?height=150&width=10000`}
          />
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <td>{this.state.target?.name}</td>
              </tr>
              <tr>
                <th>Type</th>
                <td>{this.state.target?.mime_type}</td>
              </tr>
              <tr>
                <th>Size</th>
                <td>{byteFormat(this.state.target?.size)}</td>
              </tr>
              <tr>
                <th>Mod Date</th>
                <td>
                  {dateFormat(this.state.target?.date, 'yyyy/MM/dd, hh:mm:ss')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
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
    this.setState({
      modalRenameOpen: true,
      target: image,
      renameInput: image.name,
    });
  }

  private info(event: React.MouseEvent<Element, MouseEvent>, image: ImageData) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      modalInfoOpen: true,
      target: image,
    });
  }

  private async deleteImage() {
    if (this.state.target) {
      await RestAPI.deleteImage(this.state.target.name);
      this.setState({ modalDeleteOpen: false });
      this.fetchImages();
    }
  }

  private async renameImage() {
    this.setState({ modalRenameOpen: false });

    if (
      this.state.renameInput &&
      this.state.renameInput !== this.state.target.name
    ) {
      await RestAPI.renameImage(this.state.target.name, this.state.renameInput);
      this.fetchImages();
    }
  }

  private closeModals(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.setState({
        modalViewOpen: false,
        modalDeleteOpen: false,
        modalInfoOpen: false,
        modalRenameOpen: false,
      });
    }
  }

  private async onLogout() {
    await RestAPI.authLogout();
    this.props.history.push('/login');
  }
}
