import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Drawer, Input, Select} from 'antd';
import styled from 'styled-components';
import DrawPreItem from './draw.preitem';
import DrawItem from './draw.item';
import {throttle} from '../../../utils/normal.utils';
import {MyProvider} from '../../../components/context';
import ActionButtons from './action.buttons';
import CanvasMethod from './canvas.method';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDown: false,
      title: '',
      firstText: '',
      repeatText: '',
      mutualType: '1',
      positionTop: 0,
      positionLeft: 0
    };
  }

  componentDidMount() {
    this.drawContent = document.getElementById('draw-content');
    this.drawContent.onmousedown = this.handleMouseDown;
    document.onkeydown = this.handleKeyDown;
    this.initParentSize();
    window.onresize = throttle(this.initParentSize, 50);
    this.canvasCtx = new CanvasMethod(this.canvas);
  }

  initParentSize = () => {
    this.parentW = this.drawContent?.parentNode?.clientWidth ?? 0;
    this.parentH = this.drawContent?.parentNode?.clientHeight ?? 0;
    this.props.addStore.setState({
      parentW: this.parentW,
      parentH: this.parentH,
      windowW: document.body.clientWidth,
      windowH: document.body.clientHeight
    })
  }

  handleKeyDown = e => {
    if (e && e.keyCode === 27) this.handleHideDrawer();
  }

  handleHideDrawer = () => {
    const {addVisible, setState} = this.props.addStore;
    if (!addVisible) return;
    setState && setState({
      addVisible: false
    })
  }

  handleMouseDown = (e) => {
    const {x, y} = e;
    this.startX = x;
    this.startY = y;
    this.setState({ isDown: true });
    this.drawContent.onmousemove = throttle(this.handleMouseMove, 32);
    this.drawContent.onmouseup = this.handleMouseUp;
  }

  handleMouseMove = (e) => {
    const {scale, windowW, windowH, left, top} = this.props.addStore;
    const {x, y} = e;
    const pl = (x - this.startX), pt = (y - this.startY);
    if ((top + pt) >= -50 && y > this.startY) return;
    if (y < this.startY && (top + pt - windowH + 100) <= -7950 * scale) return;
    if (x > this.startX && (left + pl) >= -50) return;
    if (x < this.startX && (left + pl - windowW) <= -7950 * scale) return;
    // console.log(left, left + pl - windowW, -8050 * scale)
    this.setState({
      positionLeft: pl,
      positionTop: pt
    }) 
  }

  handleMouseUp = () => {
    this.drawContent.onmousemove = null;
    this.drawContent.onmouseup = null;  
    const {positionTop, positionLeft} = this.state;
    const {top, left, setState} = this.props.addStore;
    this.setState({
      isDown: false,
      positionTop: 0,
      positionLeft: 0,
    });
    setState({
      top: top + positionTop,
      left: left + positionLeft,
    })
  }

  handleChange = (value, type) => {
    this.setState({
      [type]: value
    })
  };

  renderPreview = () => {
    const {title, firstText, mutualType} = this.state;
    return (
      <PreviewContent>
        <PreviewTitle>
          <div className='text1'>预览节点</div>
          <div className='text2'>(编辑完成拖入左侧画布)</div>
        </PreviewTitle>
        <PreviewBox>{this.props.addStore.addVisible && <DrawPreItem title={title} firstText={firstText} mutualType={mutualType}/>}</PreviewBox>
      </PreviewContent>
    );
  };

  renderForm = () => {
    const {title, firstText, repeatText, mutualType} = this.state;
    return (
      <FormContent>
        <EditItem>
          <EditItemLabel>标题</EditItemLabel>
          <Input value={title} style={{width: 300}} onChange={e => this.handleChange(e.currentTarget.value, 'title')} placeholder="请输入标题" />
        </EditItem>
        <EditItem>
          <EditItemLabel>首轮话术</EditItemLabel>
          <Input value={firstText} style={{width: 300}} onChange={e => this.handleChange(e.currentTarget.value, 'firstText')} placeholder="请输入首轮话术" />
        </EditItem>
        <EditItem>
          <EditItemLabel>重复话术</EditItemLabel>
          <Input value={repeatText} style={{width: 300}} onChange={e => this.handleChange(e.currentTarget.value, 'repeatText')} placeholder="请输入重复话术" />
        </EditItem>
        <EditItem>
          <EditItemLabel>交互</EditItemLabel>
          <Select value={mutualType} style={{width: 300}} defaultValue={mutualType} onChange={val => this.handleChange(val, 'mutualType')}>
            <Option value="1">肯定/否定 意图识别</Option>
            <Option value="2">无需识别</Option>
          </Select>
        </EditItem>
      </FormContent>
    );
  }
  
  render() {
    const {scale, addVisible, setState, drawList, left, top, lineing} = this.props.addStore;
    const {positionLeft, positionTop, isDown} = this.state;
    return (
      <MyProvider value={this.canvasCtx}>
        <Container id='draw'>
          <CanvasContent left={left + positionLeft} lineing={lineing} top={top + positionTop} isDown={isDown} id='draw-content' scale={scale}>
            {
              drawList.map(({left: itemLeft, top: itemTop, ...args}, index) => (
                <DrawItem item={args} left={itemLeft} top={itemTop} key={args.key}/>
              ))
            }
            <Canvas ref={obj => this.canvas = obj}></Canvas>
          </CanvasContent>
          <Drawer
            id='drawer'
            title="新增节点"
            placement="right"
            closable={false}
            onClose={() => setState({addVisible: false})}
            visible={addVisible}
            mask={false}
            width={400}
          >
            {this.renderForm()}
            {this.renderPreview()}
          </Drawer>
          <ActionButtons />
        </Container>
      </MyProvider>
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
  width: 8000px;
  height: 8000px;
  position: absolute;
  background: #fff;
  left: ${props => `${props.left}px`};
  top: ${props => `${props.top}px`};
  transform: ${props => `scale(${props.scale},${props.scale})`};
  transform-origin: 0 0;
  cursor: ${props => props.lineing ? 'crosshair' : (props.isDown ? 'grabbing' : 'grab')};
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

const Text1 = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -1250px;
  margin-left: -1250px;
  width: 600px;
  height: 600px;
  background: yellow;
  text-align: center;
  line-height: 500px;
  color: #fff;
  font-size: 30px;
`;

const FormContent = styled.div`
  padding-bottom: 20px;
  border-bottom: solid #eee 1px;
`;

const EditItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const EditItemLabel = styled.div`
  font-size: 14px;
  color: #333;
  width: 80px;
  text-align: right;
  margin-right: 10px;
`;

const PreviewContent = styled.div`
  margin-top: 20px;
`;

const PreviewTitle = styled.div`
  text-align: center;
  color: #333;
  .text1 {
    font-size: 16px;
    line-height: 24px;
  }
  .text2 {
    font-size: 12px;
    line-height: 16px;
  }
`;

const PreviewBox = styled.div`
  width: 250px;
  height: 250px;
  margin: 20px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: dashed 2px #eee;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;
