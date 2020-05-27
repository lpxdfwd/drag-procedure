import styled, {css} from 'styled-components';

export const Container = styled.div`
    display: flex;
    border: ${({isFocus}) => isFocus ? 'dashed 2px #666' : 'solid 1px #eee'};
    border-radius: 8px;
    overflow: hidden;
    user-select:none;
    cursor: ${({isFocus}) => isFocus ? 'grabbing' : 'grab'};
    ${({left, top, isFocus, isFixed}) => (isFocus || isFixed) ? css`
        position: fixed;
        left: ${left}px;
        top: ${top}px;
        z-index: 99999
    ` : ''}
`;

export const Container1 = styled.div`
    display: flex;
    border: ${({isFocus}) => isFocus ? 'dashed 2px #666' : 'solid 1px #eee'};
    border-radius: 8px;
    overflow: hidden;
    user-select:none;
    cursor: ${({isFocus}) => isFocus ? 'grabbing' : 'grab'};
    position: absolute;
    top: ${props => `${props.top}px`};
    left: ${props => `${props.left}px`};
    z-index: 2;
`;

export const ContentLeft = styled.div`
    width: 150px;
    font-size: 0;
`;

export const LeftTitle = styled.div`
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

export const LeftContent = styled.div`
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

export const ContentRight = styled.div`
    width: 50px;
    display: flex;
    flex-direction: column;
    border-left: solid 1px #eee;
`;

export const RightItem = styled.div`
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