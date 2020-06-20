import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import { message } from 'antd';
import {Container, ContentLeft, LeftTitle, LeftContent, ContentRight, RightItem} from './draw.style';
import {throttle} from '../../../utils/normal.utils';
import {eventEmit} from '../../../lib/event.lib';

@inject('addStore') @observer
class DrawPreItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDown: false,
            left: null,
            top: null,
            positionTop: 0,
            positionLeft: 0,
        };
        this.isFixed = false;
    }

    componentDidMount() {
        this.draw.onmousedown = this.handleMouseDown;
    }

    componentWillUnmount() {
        this.draw.onmousedown = null;
    }

    handleMouseDown = e => {
        const err = this.checkValue();
        if (err) return message.error(err);
        const {layerX, layerY, clientX, clientY} = e;
        const origX = clientX - layerX;
        const origY = clientY - layerY;
        this.startX = clientX;
        this.starY = clientY;
        this.setState({
            isDown: true,
            left: origX,
            top: origY,
        });
        document.onmouseup = this.handleMouseup;
        document.onmousemove = throttle(this.handleMouseMove, 32);;
    }

    checkValue = () => {
        const {title, firstText, repeatText} = this.props;
        if (!title) return '请填写标题';
        if (!firstText) return '请填写首轮话术';
        if (!repeatText) return '请填写重复话术';
    }

    handleMouseMove = e => {
        const {clientX, clientY} = e;
        if (!this.isFixed && (clientX - this.startX) < -250) {
            this.isFixed = true;
        }
        this.setState({
            positionLeft: (clientX - this.startX),
            positionTop: (clientY - this.starY)
        }) 
    }

    handleMouseup = () => {
        const {title, firstText, mutualType, repeatText} = this.props;
        this.setState(({top, left, positionLeft, positionTop}) => {
            const t = top + positionTop, l =left + positionLeft;
            if (this.isFixed) {
                this.props.addStore.setState({addVisible: false});
                eventEmit('clearPreForm');
                this.props.addStore.addDrawItem({left: l, top: t, title, firstText, mutualType, repeatText, key: +new Date()})
            }
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
            <Container ref={obj => this.draw = obj} isFixed={this.isFixed} isFocus={isDown} left={positionLeft + left} top={top + positionTop}>
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
            </Container>
        );
    }
}

export default DrawPreItem;
