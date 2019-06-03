import React, { Component } from 'react';
import styles from './Measure.less'
import { Card, Icon } from 'antd';
import './../../common.less';

export default class Measure extends Component {
  Measure  = (type) => {
    const { cesiumControl,dispatch } = this.props;
    cesiumControl.measure(type);
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        measureToolShow: false,
        layerMap: false,
        handlerAction: type,
      }
    });
  }

  draw = (type) => {
    const { cesiumControl,dispatch } = this.props;
    cesiumControl.drawEvent(type);
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        drawToolShow: false,
        layerMap: false,
        handlerAction: type,
      }
    });
  }

  render() {
    const { measureToolShow,drawToolShow } = this.props;
    return (
      <div>
        {measureToolShow?<div className={styles.mearsuretool+" "+styles.show}>
          <Card>
            <Icon type="edit-line" onClick={this.Measure.bind(this, "drawLine")} title={"直线测量"}/>
            <Icon type="duobianxing" onClick={this.Measure.bind(this, "drawPloy")} title={"面积测量"}/>
            <Icon type="close" onClick={this.Measure.bind(this, "clean")} title={"清除测量"}/>
          </Card>
        </div>:""}
        {drawToolShow?<div className={styles.drawtool+" "+styles.show}>
          <Card>
            <Icon type="Pointer2" onClick={this.draw.bind(this, "marker")} title={"点绘制"}/>
            <Icon type="huizhi1"  onClick={this.draw.bind(this, "polyline")} title={"线绘制"}/>
            <Icon type="huizhijieshu" onClick={this.draw.bind(this, "polygon")} title={"面绘制"}/>
            <Icon type="delete" onClick={this.draw.bind(this, "cleanAll")} title={"清除绘制"}/>
          </Card>
        </div>:""}
      </div>
    );
  };
}


