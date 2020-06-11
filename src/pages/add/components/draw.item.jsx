import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Container1, ContentLeft, LeftTitle, LeftContent, ContentRight, RightItem} from './draw.style';
import {throttle} from '../../../utils/normal.utils';
import StopItem from './spot.item';
import {ContextHOC} from '../../../components/context';

@ContextHOC
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

    componentWillUnmount() {
        this.draw.onmousedown = null;
    }

    handleSelectItem = () => {
        this.props.addStore.setState({selectItem: this.props.item.key});
    }

    handleMouseDown = e => {
        e.stopPropagation()
        const {clientX, clientY} = e;
        this.startX = clientX;
        this.starY = clientY;
        this.setState({ isDown: true});
        document.onmouseup = this.handleMouseup;
        document.onmousemove = throttle(this.handleMouseMove, 60);
    }

    handleMouseMove = e => {
        e.stopPropagation()
        const {clientX, clientY} = e;
        const {positionLeft, positionTop} = this.state;
        const {scale} = this.props.addStore;
        const pl = (clientX - this.startX) / scale;
        const pt = (clientY - this.starY) / scale;
        if (this.props.ctx.curr.cacheLines.length) {
            this.props.ctx.curr.updatePosition(this.props.item.key, pl - positionLeft, pt - positionTop);
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
        const {title, firstText, mutualType, key} = this.props.item;
        const {isDown, left, top, positionLeft, positionTop} = this.state;
        const {selectItem} = this.props.addStore;
        return (
            <Container1 onClick={this.handleSelectItem} ref={obj => this.draw = obj} isFocus={isDown || selectItem === key} left={positionLeft + left} top={top + positionTop}>
                <ContentLeft>
                    <LeftTitle isEmpty={!title}>{title || '请编辑标题'}<StopItem itemKey={key} type='left'/></LeftTitle>
                    <LeftContent isEmpty={firstText}>{firstText || '请编辑首轮话术'}</LeftContent>
                </ContentLeft>
                {mutualType === '1' && (
                    <ContentRight>
                        <RightItem>肯定<StopItem itemKey={key} type='right'/></RightItem>
                        <RightItem>否定<StopItem itemKey={key} type='right'/></RightItem>
                        <RightItem>其他<StopItem itemKey={key} type='right'/></RightItem>
                    </ContentRight>
                )}
            </Container1>
        );
    }
}

export default DrawItem;
