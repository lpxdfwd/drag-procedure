import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Drawer, Input, Select, message} from 'antd';
import styled from 'styled-components';
import DrawPreItem from './draw.preitem';
import DrawItem from './draw.item';
import {throttle, fromatSearch} from '../../../utils/normal.utils';
import {MyProvider} from '../../../components/context';
import ActionButtons from './action.buttons';
import {CanvasMethod, CanvasTowMethod} from './canvas.method';
import EndpointItem from './endpoint.item';
import {eventEmit, eventOn} from '../../../lib/event.lib';
import {queryDetail} from '../../../http/service.api';

class Content extends Component {
  constructor(props) {
    super(props);
    const {type, topicId} = fromatSearch(location.search);
    this.isAdd = type !== 'edit';
    this.topicId = topicId ?? '';
    this.state = {
      isDown: false,
      title: '',
      firstText: '',
      repeatText: '',
      mutualType: '1',
      positionTop: 0,
      positionLeft: 0,
      loading: !this.isAdd
    };
  }

  componentDidMount() {
    this.drawContent = document.getElementById('draw-content');
    this.drawContent.onmousedown = this.handleMouseDown;
    document.onkeydown = this.handleKeyDown;
    this.canvasCtx = new CanvasMethod(this.canvas);
    this.canvasTowCtx = new CanvasTowMethod(this.canvasTwo);
    this.initParentSize();
    window.onresize = throttle(this.initParentSize, 50);
    !this.isAdd && this.initData();
    eventOn('clearPreForm', this.handleClearForm);
  }

  initData = async() => {
    try {
      const data = await queryDetail({topic_id: this.topicId});
      this.props.addStore.setState({
        topicHead: {
          ename: data.ename,
          tag: data.tag || [],
          name: data.name
        }
      })
    } catch (err) {
      message.error(err.message || '查询话题出错');
    }
  }

  componentWillUnmount() {
    this.drawContent.onmousedown = null;
    document.onkeydown = null;
    window.onresize = null;
  }

  initParentSize = () => {
    this.canvasTowCtx.setSize();
    this.props.addStore.setState({
      windowW: document.body.clientWidth,
      windowH: document.body.clientHeight
    })
  }

  handleKeyDown = e => {
    if (e) {
      if (e.keyCode === 27) this.handleEscEvent();
      if (e.keyCode === 8) this.handleDeleteSelect();
      if (e.keyCode === 18) eventEmit('altEvent');
    }
  }

  handleClearForm = () => {
    this.setState({
      title: '',
      firstText: '',
      repeatText: '',
      mutualType: '1',
    })
  }

  handleDeleteSelect = () => {
    const {setState, drawList, selectItem} = this.props.addStore;
    this.canvasCtx.delectCacheItem(selectItem)
    setState({
      selectItem: null,
      drawList: drawList.filter(({key}) => key !== selectItem)
    });
  }

  handleEscEvent = () => {
    this.handleHideDrawer();
    this.handleHideSelectItem();
  }

  handleHideSelectItem = () => {
    const {selectItem, setState} = this.props.addStore;
    if (!selectItem) return;
    setState && setState({
      selectItem: null
    });
  }

  handleHideDrawer = () => {
    const {addVisible, setState} = this.props.addStore;
    if (!addVisible) return;
    setState && setState({
      addVisible: false,
    });
    this.handleClearForm();
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
    const {title, firstText, mutualType, repeatText} = this.state;
    return (
      <PreviewContent>
        <PreviewTitle>
          <div className='text1'>预览节点</div>
          <div className='text2'>(编辑完成拖入左侧画布)</div>
        </PreviewTitle>
        <PreviewBox>{this.props.addStore.addVisible && <DrawPreItem title={title} repeatText={repeatText} firstText={firstText} mutualType={mutualType}/>}</PreviewBox>
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
    const {positionLeft, positionTop, isDown, loading} = this.state;
    return (
      <MyProvider value={{curr: this.canvasCtx, showRef: this.canvasTowCtx}}>
        <Container id='draw'>
          <CanvasContent left={left + positionLeft} lineing={lineing} top={top + positionTop} isDown={isDown} id='draw-content' scale={scale}>
            {
              !loading && drawList.map(({left: itemLeft, top: itemTop, ...args}, index) => (
                args.key === 'start' || args.key === 'end' 
                ? <EndpointItem type={args.key} key={args.key} left={itemLeft} top={itemTop}/>
                : <DrawItem item={args} left={itemLeft} top={itemTop} key={args.key}/>
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
          <ActionButtons topicId={this.topicId}/>
        </Container>
        <CanvasTwo ref={obj => this.canvasTwo = obj}/>
      </MyProvider>
    );
  }
};

export default inject('addStore')(observer(Content));

const Container = styled.div`
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 100px;
  left: 0;
  bottom: 0;
  z-index: 2;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
`;

const CanvasContent = styled.div`
  width: 8000px;
  height: 8000px;
  position: absolute;
  left: ${props => `${props.left}px`};
  top: ${props => `${props.top}px`};
  transform: ${props => `scale(${props.scale},${props.scale})`};
  transform-origin: 0 0;
  cursor: ${props => props.lineing ? 'crosshair' : (props.isDown ? 'grabbing' : 'grab')};
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

export const CanvasTwo = styled.canvas`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1;
`;

