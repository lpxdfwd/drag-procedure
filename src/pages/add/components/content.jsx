import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Drawer, Input, Select} from 'antd';
import styled from 'styled-components';
import DrawPreItem from './draw.preitem';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positionTop: 0,
      positionLeft: 0,
      left: -8000,
      top: -8000,
      isDown: false,
      title: '',
      firstText: '',
      repeatText: '',
      mutualType: '1'
    };
  }

  componentDidMount() {
    this.drawContent = document.getElementById('draw-content');
    this.drawContent.onmousedown = this.handleMouseDown;
    // this.drawContent.onmouseenter = () => console.log(123);
    document.onkeydown = this.handleKeyDown
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
        <PreviewBox><DrawPreItem title={title} firstText={firstText} mutualType={mutualType}/></PreviewBox>
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
    const {scale, addVisible, setState} = this.props.addStore;
    const {positionLeft, positionTop, isDown, left, top} = this.state;
    return (
      <Container id='draw'>
        <CanvasContent left={left + positionLeft} top={top + positionTop} isDown={isDown} id='draw-content' scale={scale}>
          <Text>asdasdasdasd</Text>
          <Text1>asdasdasdasd</Text1>
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
  margin: ${({left, top}) =>  `${top}px 0 0 ${left}px`};
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
