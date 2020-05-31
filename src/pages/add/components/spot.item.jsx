import React, {Component} from 'react';
import styled, {css} from 'styled-components';
import {inject, observer} from 'mobx-react';
import {throttle} from '../../../utils/normal.utils';
import {ContextHOC} from '../../../components/context';
import {eventOn, removeEvent} from '../../../lib/event.lib';

@ContextHOC
@inject('addStore') @observer
class SpotItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionTop: 0,
      positionLeft: 0,
      isLeftLine: false
    };
  }

  componentDidMount() {
    eventOn('setLineArrow', this.handleSetLineArrow);
    if (this.props.type === 'left') {
      this.spot.onmouseup = this.handleOtherMouseUp;
    } else {
      this.spot.onmousedown = this.handleSpotMouseDown;
    }
  }

  handleSetLineArrow = () => {
    const {itemKey} = this.props;
    console.log(itemKey)
    const isLeftLine = this.handleIsLeftLine(itemKey);
    this.setState({isLeftLine});
  }

  handleOtherMouseUp = () => {
    const {lineing} = this.props.addStore;
    if (!lineing || this.props.itemKey === lineing) return;
    this.props.ctx.update({...this.props.ctx.currLine, toId: this.props.itemKey});
  }

  handleSpotMouseDown = e => {
    e.stopPropagation();
    const {x, y} = e;
    this.props.addStore.setState({lineing: this.props.itemKey});
    this.startX = x;
    this.startY = y;
    document.onmouseup = this.handleSpotMouseup;
    document.onmousemove = throttle(this.handleSpotMouseMove, 100);
  }

  handleSpotMouseup = e => {
    document.onmouseup = null;
    document.onmousemove = null;
    this.props.addStore.setState({lineing: false});
    if(!this.props.ctx.currLine) return;
    this.props.ctx.setCurrLine(null);
  }

  handleSpotMouseMove = e => {
    const {x, y} = e;
    const {scale, left, top} = this.props.addStore;
    this.props.ctx.setCurrLine({
      formL: (this.startX - left) / scale,
      formT: (this.startY - top - 100) / scale,
      formId: this.props.itemKey,
      toL: (x - left) / scale,
      toT: (y - top - 100) / scale,
    })
  };

  handleIsLeftLine = itemKey => this.props.ctx.cacheLines.some(({toId}) => toId === itemKey);

  render() {
    const {type, itemKey} = this.props;
    const {isLeftLine} = this.state;
    return (
      <Container ref={obj => this.spot = obj} type={type}>
        {type === 'left' && isLeftLine && <Arrow />}
      </Container>
    );
  }
}

export default SpotItem;

const Container = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 100%;
  position: absolute;
  top: 50%;
  ${props => props.type === 'left' ? css`
    left: -8px;
  ` : css`
    right: -8px;
  `}
  margin-top: -8px;
  background: #f1f1f1;
  border: solid 1px #eee;
  cursor: crosshair;
`;

const Arrow = styled.div`
  border-style: dashed dashed dashed solid;
  border-color: transparent transparent transparent #666;
  border-width: 7px;
  width: 0;
  height: 0;
`;
