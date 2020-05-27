import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Container1, ContentLeft, LeftTitle, LeftContent, ContentRight, RightItem} from './draw.style';
import {throttle} from '../../../utils/normal.utils';

@inject('addStore') @observer
class DrawItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDown: false,
            left: props.left || 50,
            top: props.top || 200,
            positionTop: 0,
            positionLeft: 0,
        };
    }

    componentDidMount() {
        this.draw.onmousedown = this.handleMouseDown;
    }

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
        e.stopPropagation()
        const {clientX, clientY} = e;
        this.setState({
            positionLeft: (clientX - this.startX),
            positionTop: (clientY - this.starY)
        }) 
    }

    handleMouseup = e => {
        e.stopPropagation();
        this.setState(({top, left, positionLeft, positionTop}) => {
            const t = top + positionTop, l =left + positionLeft;
            return {
                isDown: false,
                top: t,
                left: l,
                positionTop: 0,
                positionLeft: 0
            }
        });
        document.onmousemove = null;
        document.onmouseup = null;  
    }

    render() {
        const {title, firstText, mutualType} = this.props;
        const {isDown, left, top, positionLeft, positionTop} = this.state;
        return (
            <Container1 ref={obj => this.draw = obj} isFocus={isDown} left={positionLeft + left} top={top + positionTop}>
                <ContentLeft>
                    <LeftTitle isEmpty={!title}>{title || '请编辑标题'}</LeftTitle>
                    <LeftContent isEmpty={firstText}>{firstText || '请编辑首轮话术'}</LeftContent>
                </ContentLeft>
                {mutualType === '1' && (
                    <ContentRight>
                        <RightItem>肯定</RightItem>
                        <RightItem>否定</RightItem>
                        <RightItem>其他</RightItem>
                    </ContentRight>
                )}
            </Container1>
        );
    }
}

export default DrawItem;
