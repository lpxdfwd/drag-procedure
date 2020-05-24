import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import styled from 'styled-components';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionTop: 0,
      positionLeft: 0,
      left: -8000,
      top: -8000,
      isDown: false
    };
  }

  componentDidMount() {
    this.drawContent = document.getElementById('draw-content');
    
    this.drawContent.onmousedown = this.handleMouseDown;
  }

  handleMouseDown = (e) => {
    const {x, y} = e;
    this.startX = x;
    this.starY = y;
    this.setState({ isDown: true });
    this.drawContent.onmousemove = this.handleMouseMove;
    this.drawContent.onmouseup = this.handleMouseUp;
  }

  handleMouseMove = (e) => {
    const {positionTop, positionLeft, left, top} = this.state;
    const {x, y} = e;
    if ((top + positionTop) >= -100 && y > this.starY) return;
    if (y < this.startY && (top + positionTop) <= -12000) return;
    if (x > this.startX && (left + positionLeft) >= -100) return;
    if (x < this.startX && (left + positionLeft) <= -12000) return;
    
    this.setState({
      positionLeft: (x - this.startX),
      positionTop: (y - this.starY)
    }) 
  }

  handleMouseUp = () => {
    this.drawContent.onmousemove = null;
    this.drawContent.onmouseup = null;  
    this.setState(({top, left, positionLeft, positionTop}) => ({
      isDown: false,
      top: top + positionTop,
      left: left + positionLeft,
      positionTop: 0,
      positionLeft: 0
    }));
  }
  
  render() {
    const {scale} = this.props.addStore;
    const {positionLeft, positionTop, isDown, left, top} = this.state;
    return (
      <Container>
        <CanvasContent positionLeft={positionLeft} left={left} top={top} isDown={isDown} positionTop={positionTop} id='draw-content' scale={scale}>
          <Text>asdasdasdasd</Text>
        </CanvasContent>
      </Container>
    );
  }
};

export default inject('addStore')(observer(Content));

const Container = styled.div`
  width: 100vw;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const CanvasContent = styled.div`
  width: 16000px;
  height: 16000px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: ${({positionLeft, positionTop, left, top}) =>  `${top + positionTop}px 0 0 ${left + positionLeft}px`};
  transform: ${props => `scale(${props.scale},${props.scale})`};
  cursor: ${props => props.isDown ? 'grabbing' : 'grab'};
`;

const Text = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -250px;
  margin-left: -250px;
  width: 500px;
  height: 500px;
  background: yellow;
  text-align: center;
  line-height: 500px;
  color: #fff;
  font-size: 30px;
`;
