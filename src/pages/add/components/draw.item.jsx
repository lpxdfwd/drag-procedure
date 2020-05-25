import React, {Component} from 'react';
import styled from 'styled-components';

class DrawItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {title, firstText, mutualType} = this.props;
        console.log()
        return (
            <Container>
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

export default DrawItem;

const Container = styled.div`
    display: flex;
    border: solid 1px #eee;
    border-radius: 8px;
    overflow: hidden;
`;

const ContentLeft = styled.div`
    width: 150px;
    font-size: 0;
`;

const LeftTitle = styled.div`
    background: #1B90FF;
    color: #fff;
    min-height: 30px;
    text-align: center;
    padding-left: 20px;
    padding-right: 10px;
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 24px;
    word-break: break-all;
`;

const LeftContent = styled.div`
    background: #fff;
    color: #333;
    padding: 8px;
    min-height: 60px;
    font-size: 14px;
    line-height: 24px;
    display: flex;
    align-items: center;
    word-break: break-all;
`;

const ContentRight = styled.div`
    width: 50px;
    display: flex;
    flex-direction: column;
    border-left: solid 1px #eee;
`;

const RightItem = styled.div`
    flex: 1;
    width: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    & + & {
        border-top: solid 1px #eee;
    }
`;
