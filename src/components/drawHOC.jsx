import React, {Component} from 'react';

const drawHOC = option => Com => {
    class C extends Component {
        constructor(props) {
            super(props);
            this.state = {
                positionTop: 0,
                positionLeft: 0,
                left: option.initLeft || 0,
                top: option.initTop || 0,
                isDown: false,
            };
        }

        componentDidMount() {
            const {drawId} = this.props;
            this.drawContent = document.getElementById(drawId);
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
            const {positionLeft, positionTop, isDown, left, top} = this.state;
            return <Com {...this.props} left={positionLeft + left} top={positionTop + top} styled={{cursor: isDown ? 'grabbing' : 'grab'}}/>
        }
    }
}

export default drawHOC;
