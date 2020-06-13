import React, {Component} from 'react';
import styled from 'styled-components';
import {inject, observer} from 'mobx-react';
import {throttle} from '../../../utils/normal.utils';
import {ContextHOC} from '../../../components/context';
import {eventOn} from '../../../lib/event.lib';

@ContextHOC
@inject('addStore') @observer
class EndpointItem extends Component {
    constructor(props) {
        super(props);
        const {left, top} = props;
        this.state = {
            left,
            top,
            positionTop: 0,
            positionLeft: 0,
            isDown: false,
            isDraw: false
        };
    }

    componentDidMount() {
        if (this.props.type === 'start') {
            eventOn('altEvent', () => {
                this.setState({isDraw: true});
                this.draw.onmousedown = this.handleMouseDown;
            });
            document.onkeyup = this.handleKeyUp;
            this.draw.onmousedown = this.handleMouseDownLine;
        } else {
            this.draw.onmousedown = this.handleMouseDown;
            this.draw.onmouseup = this.handleOtherMouseUp;
        }
    }

    componentWillUnmount() {
        this.draw && (this.draw.onmousedown = null);
        this.draw && (this.draw.onmouseup = null);
        document.onkeyup = null;
    }

    handleOtherMouseUp = () => {
        const {lineing} = this.props.addStore;
        if (!lineing || this.props.itemKey === lineing) return;
        this.props.ctx.curr.update({...this.props.ctx.curr.currLine, toId: 'end'});
        this.props.ctx.showRef.clear();
    }

    handleKeyUp = e => {
        if (e && e.keyCode === 18) {
            this.setState({isDraw: false});
            this.draw.onmousedown = this.handleMouseDownLine;
        }
    }

    handleMouseDownLine = e => {
        e.stopPropagation();
        const {x, y} = e;
        this.props.addStore.setState({lineing: 'start'});
        this.startX = x;
        this.startY = y;
        document.onmouseup = this.handleSpotMouseupLine;
        document.onmousemove = throttle(this.handleSpotMouseMoveLine, 100);
    }

    handleSpotMouseupLine = e => {
        document.onmouseup = null;
        document.onmousemove = null;
        this.props.addStore.setState({lineing: false});
        if(!this.props.ctx.curr.currLine) return;
        this.props.ctx.curr.setCurrLine(null);
        this.props.ctx.showRef.clear();
    }
    
    handleSpotMouseMoveLine = e => {
        e.stopPropagation();
        const {x, y} = e;
        const {scale, left, top} = this.props.addStore;
        this.props.ctx.showRef.darw({
            formL: this.startX,
            formT: (this.startY - 100),
            toL: x,
            toT: (y - 100),
        }, scale);
        this.props.ctx.curr.setCurrLine({
            formL: (this.startX - left) / scale,
            formT: (this.startY - top - 100) / scale,
            formId: this.props.type,
            formType: this.props.type,
            toL: (x - left) / scale,
            toT: (y - top - 100) / scale,
        })
    };

    handleMouseDown = e => {
        e.stopPropagation()
        const {clientX, clientY} = e;
        this.startX = clientX;
        this.starY = clientY;
        this.setState({ isDown: true});
        document.onmouseup = this.handleMouseup;
        document.onmousemove = throttle(this.handleMouseMove, 32);
    }

    handleMouseMove = e => {
        e.stopPropagation();
        const {clientX, clientY} = e;
        const {positionLeft, positionTop} = this.state;
        const {scale} = this.props.addStore;
        const pl = (clientX - this.startX) / scale;
        const pt = (clientY - this.starY) / scale;
        if (this.props.ctx.curr.cacheLines.length) {
            this.props.ctx.curr.updatePosition(this.props.type, pl - positionLeft, pt - positionTop);
        }
        this.setState({
            positionLeft: pl ,
            positionTop: pt
        })
    }

    handleMouseup = e => {
        e.stopPropagation();
        this.setState(({top, left, positionLeft, positionTop}) => {
            const t = top + positionTop, l =left + positionLeft;
            this.props.addStore.updateDrawItem({key: this.props.type, left: l, top: t});
            return {
                isDown: false,
                top: t,
                left: l,
                positionTop: 0,
                positionLeft: 0
            }
        });
        this.setState({ isDown: false});
        document.onmousemove = null;
        document.onmouseup = null;  
    }

    handleGetCursor = () => {
        const {isDown, isDraw} = this.state;
        const {type, addStore} = this.props;
        const {lineing} = addStore;
        if (type === 'start' && !isDraw) return 'crosshair';
        if (type === 'end' && lineing) return 'crosshair';
        return isDown ? 'grabbing' : 'grab';
    }

    render() {
        const {type} = this.props;
        const {left, top, positionTop, positionLeft, isDown, isDraw} = this.state;
        const cursor =this.handleGetCursor();
        return (
            <Container 
                ref={obj => this.draw = obj} 
                left={left + positionLeft} 
                top={top + positionTop} 
                cursor={cursor}
            >{type === 'start' ? '开始' : '结束'}</Container>
        );
    }
}

export default EndpointItem;

const Container = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: #f1f1f1;
    border: solid 1px #eee;
    line-height: 50px;
    text-align: center;
    color: #666;
    position: absolute;
    left: ${props => `${props.left}px`};
    top: ${props => `${props.top}px`};
    z-index: 2;
    user-select: none;
    cursor: ${props => props.cursor}
`;
