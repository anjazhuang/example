import styles from './AddCoordinateModal.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, LocaleProvider, Button, Select, InputNumber, Input } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
import { config } from '../../utils';

const { apiUrl } = config;

const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

export default class AddCoordinateModal extends Component {
  state = {
    visible: false,
    lon: 0,//经度
    lat: 0,//纬度
    radius: 0,//缓冲
    timephaseid: 0,
    geoJson: [],//geojson
    tubanShape:[]
  };

  addCoordinateModalClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/updateState',
      payload: {
        addCoordinateModalShow: false
      }
    });
  }

  componentDidMount() {
    const { visible,tubanShape } = this.props;
    this.setState({
      visible: visible,
      tubanShape:tubanShape
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  }

  //加载预览
  viewTuban = () => {
    const { cesiumControl, tubanShape } = this.props;
    let yy = [];
    yy.push(this.state.timephaseid.toString());
    cesiumControl.showLayer(yy);
    //latCompare, lngCompare, latDraw, lngDraw, radiuDraw
    this.state.geoJson.map((v, i) => {
      // console.log(v.lont.split("\'")[0].replace("°",".").replace("\'","").replace(/\s+/g,""));
      cesiumControl.createCircle(parseFloat(v.lat.split("\'")[0].replace("°",".").replace("\'","").replace(/\s+/g,"")), parseFloat(v.lont.split("\'")[0].replace("°",".").replace("\'","").replace(/\s+/g,"")), this.state.lat, this.state.lon, this.state.radius);
    });
    // cesiumControl.createCircle(36.274509,111.14443,36.2745096, 111.14443,this.state.radius);
  }

  lonChange = (e) => {
    this.setState({
      lon: e
    })
  }

  latChnage = (e) => {
    this.setState({
      lat: e
    })
  }

  radiusChange = (e) => {
    this.setState({
      radius: e
    })
  }

  tubanChange = (v, e) => {
    let array=[];
    this.setState({
      timephaseid: e.props.value
    }, () => {
      fetch(apiUrl + e.props.title)
        .then((res) => res.json())
        .then((data) => {
          // console.log('data:', data.features);
          data.features.map((v,i)=>{
            array.push({lont:v.properties.LONGITUDE,lat:v.properties.LATITUDE})
          })
          this.setState({
            geoJson: array
          })
        })
    })
  }


  render() {
    const { layerListHumanActiviy,layerList } = this.props;
    let pp="";
    if(layerListHumanActiviy.length>0){
      let tubanImage = layerListHumanActiviy.filter(function (v) {
        return v.type=== 1
      });
      pp = tubanImage.map((v, i) => {
        return (
          <Option value={v.layers[0].id} key={v.layers[0].id} title={v.layers[0].filepath}>{v.layers[0].name}</Option>
        )
      });
    }
    return (
      <LocaleProvider locale={zh_CN}>
        <div>
          <Modal
            title="单点坐标"
            visible={this.state.visible}
            onCancel={this.addCoordinateModalClose}
            style={{ top: 200 }}
            footer={[<Button className={styles.bigbtn} onClick={this.viewTuban}>加载预览</Button>,
              <Button className={styles.bigbtn}>导入数据库</Button>]}
            maxable={false}
            minable={false}
            width={500}>
            <div>
              <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;经度：</label>
              <InputNumber style={{ width: 200 }} onChange={this.lonChange}/>
              <br/><br/>
              <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;纬度：</label>
              <InputNumber style={{ width: 200 }} onChange={this.latChnage}/>
              <br/><br/>
              <label>&nbsp;&nbsp;&nbsp;&nbsp;选择时相：</label>
              <Select
                showSearch
                style={{ width: 250 }}
                placeholder="请选择"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={this.tubanChange}
              >
                {pp}
              </Select>
              <br/><br/>
              <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;缓冲区：</label>
              <InputNumber min={0} max={10000} defaultValue={0} onChange={this.radiusChange}/>&nbsp;m
            </div>
          </Modal>
          <Modal
            title={""}
            visible={false}
            width={206}
            style={{ left: 10, top: 450 }}
            maxable={false}
            minable={false}
            closable={false}
            footer={null}
          >
            <ul className="legendUI">
              <li className="legendLi">
                <span style={{width:50,height:50,backgroundColor:"pink"}}></span>
                验证重叠点位
              </li>
              <li className="legendLi">未相交对比点位</li>
              <li className="legendLi">未相交验证点位</li>
            </ul>
          </Modal>
        </div>
      </LocaleProvider>
    );
  };
}

AddCoordinateModal.propTypes = {
  visible: PropTypes.bool,
  cesiumControl: PropTypes.object,
};

