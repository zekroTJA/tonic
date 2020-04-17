/** @format */

import React, { Component } from 'react';
import { ImageData } from '../../api/models';
import { ClickEvent } from '../../types';
import { IconButton } from '@material-ui/core';
import { Delete, Edit, Info } from '@material-ui/icons';

import './image-card.scss';

export type ClickHandler = (e: ClickEvent, img: ImageData) => void;

export interface ImageCardProps {
  image: ImageData;
  urlPrefix: string;
  onClick: ClickHandler;
  onDeleteClick: ClickHandler;
  onRenameClick: ClickHandler;
  onInfoClick: ClickHandler;
}

export default class ImageCard extends Component<ImageCardProps> {
  public static defaultProps = {
    urlPrefix: '',
    onClick: () => {},
    onDeleteClick: () => {},
    onRenameClick: () => {},
    onInfoClick: () => {},
  };

  public render() {
    const image = this.props.image;
    return (
      <div
        className="image-card"
        key={image.name}
        onClick={(e) => this.props.onClick(e, image)}
      >
        <div
          className="image"
          style={{
            backgroundImage: `url("${this.props.urlPrefix}/images/${image.name}/thumbnail.jpg?height=150&width=10000")`,
          }}
        />
        <div className="body">
          <p>{image.name}</p>
          <div className="controls">
            <IconButton onClick={(e) => this.props.onDeleteClick(e, image)}>
              <Delete fontSize="small" />
            </IconButton>
            <IconButton onClick={(e) => this.props.onRenameClick(e, image)}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton onClick={(e) => this.props.onInfoClick(e, image)}>
              <Info fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}
