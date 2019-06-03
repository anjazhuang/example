/* global Cesium */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Menu, Icon, Popconfirm, Popover, Switch, Button, Input } from 'antd';
import styles from './Header.less';
import { menuContent } from './MenuContent';
import { message } from 'antd'
// import Menus from '../Menu/Menu';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
export default class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      menuDataArray: ['menu-base-data_show_online_image', 'menu-base-data_show-draw-layer', 'menu-base-data_show_protect_info', 'menu-base-data_show_protect_image', 'menu-base-data_show_base_info', 'menu-base-data_show_small_data', 'menu-base-data_show_human_action', 'menu-base-data_show_humanAct_change', 'menu-base-data_show_fieldAudit', 'menu-base-data_independent_inspection'],
      selectedKeys: [],
      openKeys: [],
      oldpsd: "",//旧密码
      newpsd: "",//新密码
      newpsd2: "",//确认密码
      name: localStorage.getItem('user'),
      visible: false,
      savelayer: []
    }
  }

  componentWillReceiveProps(nextProps) {
    // alert(nextProps.earthData.taskMap);
    this.setState({
      savelayer: nextProps.saveLayer
    }, () => {
      // alert(this.state.taskMapChose)
    });
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }
  //菜单选取（取消选取）调用
  navMenu = (key, selectedKeys, menuSelect) => {
    // console.log(menuSelect);
    const { cesiumControl, dispatch } = this.props;
    if (this.state.menuDataArray.includes(key)) { //站点
      this.setState({
        selectedKeys: selectedKeys,
        openKeys: ['menu-base-data'],
      }, () => {
        switch (key) {
          case 'menu-base-data_show_protect_image': //显示保护地影像
            if (menuSelect[key]) {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  loadingGlobal: true
                }
              });
              dispatch({
                type: "indexPage/getImageLayer",
                payload: {
                  parameterObject: {
                    status: 1,
                    desc: "createdate"
                  }
                },
                callback: (res) => {
                  if (res) {
                    // console.log(res);// 请求完成后返回的结果
                    if (res.code === 0) {
                      dispatch({
                        type: "indexPage/updateState",
                        payload: {
                          layerListImage: res.data,
                          loadingGlobal: false
                        }
                      })
                    }
                  }
                }
              });
            } else {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  layerManagerCheckedKeys: this.props.layerManagerCheckedKeys.splice(this.props.layerManagerCheckedKeys.indexOf("0-0"), 1),
                  layerListImage: []
                }
              })

            }
            break;
          case 'menu-base-data_show_base_info': //显示基础信息
            if (menuSelect[key]) {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  loadingGlobal: true
                }
              });
              dispatch({
                type: "indexPage/getAreaLayer",
                payload: {
                  parameterObject: {
                    status: 1,
                    desc: "createtime"
                  }
                },
                callback: (res) => {
                  if (res) {
                    // console.log(res);// 请求完成后返回的结果
                    if (res.code === 0) {
                      dispatch({
                        type: "indexPage/updateState",
                        payload: {
                          layerListArea: res.data,
                          loadingGlobal: false
                        }
                      })
                    }
                  }
                }
              });
            } else {
              //根据parenttype去删除
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  layerListArea: []
                }
              })
            }
            break;
          case 'menu-base-data_show_protect_info': //显示保护地信息
            if (menuSelect[key]) {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  loadingGlobal: true
                }
              });
              dispatch({
                type: "indexPage/getProtectarea",
                // payload: {
                //   parameterObject: {
                //     status: 1,
                //   }
                // },
                callback: (res) => {
                  if (res) {
                    // console.log(res);// 请求完成后返回的结果
                    if (res.code === 0) {
                      dispatch({
                        type: "indexPage/updateState",
                        payload: {
                          layerListProtectedArea: res.data,
                          loadingGlobal: false
                        }
                      })
                    }
                  }
                }
              });
            } else {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  layerListProtectedArea: []
                }
              })
            }
            break;
          case 'menu-base-data_show_small_data'://显示小班数据
            if (menuSelect[key]) {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  loadingGlobal: true
                }
              });
              dispatch({
                type: "indexPage/getStigmataLayer",
                payload: {
                  parameterObject: {
                    status: 1,
                    desc: "createtime"
                  }
                },
                callback: (res) => {
                  if (res) {
                    // console.log(res);// 请求完成后返回的结果
                    if (res.code === 0) {
                      dispatch({
                        type: "indexPage/updateState",
                        payload: {
                          layerListStigmata: res.data,
                          loadingGlobal: false
                        }
                      })
                    }
                  }
                }
              });
            } else {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  layerListStigmata: []
                }
              })
            }
            break;
          case 'menu-base-data_show_human_action':
            if (menuSelect[key]) {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  loadingGlobal: true
                }
              });
              dispatch({
                type: "indexPage/getHumanActLayer",
                payload: {
                  parameterObject: {
                    status: 1,
                    desc: "createtime"
                  }
                },
                callback: (res) => {
                  if (res) {
                    if (res.code === 0) {
                      dispatch({
                        type: "indexPage/updateState",
                        payload: {
                          layerListHumanActiviy: res.data,
                          loadingGlobal: false
                        }
                      })
                    }
                  }
                }
              });
            } else {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  layerListHumanActiviy: []
                }
              })
            }
            break;
          case 'menu-base-data_show_humanAct_change':
            if (menuSelect[key]) {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  loadingGlobal: true
                }
              });
              dispatch({
                type: "indexPage/getHumanActLayer",
                payload: {
                  parameterObject: {}
                },
                callback: (res) => {
                  if (res) {
                    if (res.code === 0) {
                      dispatch({
                        type: "indexPage/updateState",
                        payload: {
                          layerListHumanActiviy: res.data,
                          loadingGlobal: false
                        }
                      })
                    }
                  }
                }
              });
            } else {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  layerListHumanActiviy: []
                }
              })
            }
            break;
          case 'menu-base-data_show_fieldAudit':
            if (menuSelect[key]) {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  loadingGlobal: true
                }
              });
              dispatch({
                type: "indexPage/getVerificationTasks",
                payload: {
                  "pageIndex": 1,
                  "pageSize": 99,
                  "parameterObject": {
                    desc: "createtime"
                  }
                },
                callback: (res) => {
                  if (res) {
                    if (res.code === 0) {
                      dispatch({
                        type: "indexPage/updateState",
                        payload: {
                          layerListSDHC: res.data,
                          loadingGlobal: false
                        }
                      })
                    }
                  }
                }
              });
            } else {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  layerListSDHC: []
                }
              })
            }
            break;
          case 'menu-base-data_independent_inspection':
            if (menuSelect[key]) {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  loadingGlobal: true
                }
              });
              dispatch({
                type: "indexPage/selfTasks",
                payload: {
                  "pageIndex": 1,
                  "pageSize": 99,
                  "parameterObject": {
                    desc: "createtime"
                  }
                },
                callback: (res) => {
                  if (res) {
                    if (res.code === 0) {
                      dispatch({
                        type: "indexPage/updateState",
                        payload: {
                          layerListZZHC: res.data,
                          loadingGlobal: false
                        }
                      })
                    }
                  }
                }
              });
            } else {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  layerListZZXC: []
                }
              })
            }
            break;
          case 'menu-base-data_show-draw-layer': //绘制图斑
            if (menuSelect[key]) {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  loadingGlobal: true
                }
              });
              dispatch({
                type: "indexPage/drawLayer",
                payload: {
                  "pageIndex": 1,
                  "pageSize": 99,
                  "parameterObject": {
                    status: 1,
                    desc: "createtime"
                  }
                },
                callback: (res) => {
                  if (res) {
                    if (res.code === 0) {
                      dispatch({
                        type: "indexPage/updateState",
                        payload: {
                          layerListHZTB: res.data,
                          loadingGlobal: false
                        }
                      })
                    }
                  }
                }
              });
            } else {
              dispatch({
                type: "indexPage/updateState",
                payload: {
                  layerListHZTB: []
                }
              })
            }
            break;
        }
      });
    }
  }

  newpsd = (e) => {
    this.setState({
      newpsd: e.target.value
    });
  }

  oldpsd = (e) => {
    this.setState({
      oldpsd: e.target.value
    });
  }

  newpsdconfirm = (e) => {
    this.setState({
      newpsd2: e.target.value
    });
  }
  //点击时调用
  handleClickNavMenu = ({ key }) => {
    const { dispatch, menuSelect, saveLayer } = this.props;
    let savelayer = saveLayer;
    switch (key) {
      case 'menu-remote-monitor_humanAct-change':
        let updateMenuSelect = {
          ...menuSelect,
          ["menu-base-data_show_humanAct_change"]: !menuSelect["menu-base-data_show_humanAct_change"]
        };
        if (!menuSelect["menu-base-data_show_humanAct_change"]) {
          dispatch({
            type: "indexPage/updateState",
            payload: {
              loadingGlobal: true
            }
          });
          dispatch({
            type: "indexPage/getHumanActLayer",
            payload: {
              "pageIndex": 1,
              "pageSize": 99,
              "parameterObject": {
                status: 1,
                desc: "createtime"
              }
            },
            callback: (res) => {
              if (res) {
                if (res.code === 0) {
                  dispatch({
                    type: "indexPage/updateState",
                    payload: {
                      layerListHumanActiviy: res.data,
                      menuSelect: updateMenuSelect,
                      shapeid: 1,
                      loadingGlobal: false
                    }
                  })
                }
              }
            }
          });
        } else {
          dispatch({
            type: "indexPage/updateState",
            payload: {
              layerListHumanActiviy: [],
              menuSelect: updateMenuSelect,
              shapeid: 0
            }
          })
        }
        break;
      case 'menu-field-audit_verification-management': //核查管理
        if (savelayer.length > 0) {
          message.warn("避免操作图斑冲突，请关闭当前" + savelayer[0] + "窗口")
        } else {
          savelayer.push("核查管理");
          global.viewer.dataSources.removeAll();
          dispatch({
            type: "indexPage/updateState",
            payload: {
              // loadingGlobal: true
              validmanagentModalShow: true,
              saveLayer: savelayer
            }
          });
          dispatch({
            type: "indexPage/getHumanActLayer",
            payload: {
              "pageIndex": 1,
              "pageSize": 99,
              "parameterObject": {
                status: 1,
              }
            },
            callback: (res) => {
              if (res) {
                if (res.code === 0) {
                  dispatch({
                    type: "indexPage/updateState",
                    payload: {
                      layerListHumanActiviy: res.data,
                      validmanagentModalShow: true,
                      // loadingGlobal: false
                    }
                  })
                }
              }
            }
          });
        }
        break;

      case 'menu-base-data_add_images': //添加影像数据
        dispatch({
          type: 'indexPage/updateState',
          payload: {
            addImageModalShow: true
          }
        });
        break;

      case 'menu-base-data_add_vector_file': //添加矢量文件
        dispatch({
          type: 'indexPage/updateState',
          payload: {
            addVectorModalShow: true
          }
        });
        break;

      case 'menu-remote-sensing-verification_coordinate': //单点坐标
        dispatch({
          type: 'indexPage/updateState',
          payload: {
            addCoordinateModalShow: true
          }
        });
        break;

      case 'menu-remote-sensing_table-import': //表格导入
        dispatch({
          type: 'indexPage/updateState',
          payload: {
            importRSTableModalShow: true
          }
        });
        break;

      case 'menu-remote-sensing-vector-import': //矢量导入
        dispatch({
          type: 'indexPage/updateState',
          payload: {
            importRSVectorModalShow: true
          }
        });
        break;

      case 'menu-remote-sensing-verification': //遥感验证
        // dispatch({
        //   type: "indexPage/updateState",
        //   payload: {
        //     loadingGlobal: true
        //   }
        // });

        if (savelayer.length == 0) {
          savelayer.push("遥感验证");
          global.viewer.dataSources.removeAll();
          dispatch({
            type: 'indexPage/dataCompare',
            callback: (res) => {
              if (res) {
                if (res.code === 0) {
                  // console.log(res.data);
                  dispatch({
                    type: 'indexPage/updateState',
                    payload: {
                      dataCompare: res.data
                    }
                  });
                }
              }
            }
          });
          dispatch({
            type: 'indexPage/getHumanAct',
            payload: {
              "pageIndex": 1,
              "pageSize": 99,
              "parameterObject": {
                status: 1
              }
            },
            callback: (res) => {
              if (res) {
                if (res.code === 0) {
                  // console.log(res.data);
                  dispatch({
                    type: 'indexPage/updateState',
                    payload: {
                      contrastRSDataModalShow: true,
                      // loadingGlobal: false
                      saveLayer: savelayer
                    }
                  });
                }
              }
            }
          });
        } else {
          message.warn("避免冲突，请关闭当前" + savelayer[0] + "窗口方可继续操作")
        }


        break;

      case 'menu-remote-monitor_image-contrast': //影像对比
        // dispatch({
        //   type: "indexPage/updateState",
        //   payload: {
        //     loadingGlobal: true
        //   }
        // });
        this.props.cesiumControl.removeImage()
        dispatch({
          type: "indexPage/getImageLayer",
          payload: {
            "pageIndex": 1,
            "pageSize": 99,
            "parameterObject": {}
          },
          callback: (res) => {
            if (res) {
              // console.log(res);// 请求完成后返回的结果
              if (res.code === 0) {
                dispatch({
                  type: "indexPage/updateState",
                  payload: {
                    contrastImage: res.data,
                    loadingGlobal: false,
                    contrastImageModalShow: true,
                    layermanagerhidden: true
                  }
                })
              }
            }
          }
        });
        break;

      case 'menu-field-audit_create-task': //创建任务
        if (savelayer.length > 0) {
          message.warn("避免操作图斑冲突，请关闭当前" + savelayer[0] + "窗口")
        } else {
          savelayer.push("创建任务");
          global.viewer.dataSources.removeAll();
          dispatch({
            type: "indexPage/updateState",
            payload: {
              // loadingGlobal: true
              addTaskModalShow: true,
              layermanagerhidden: true
            }
          });

          dispatch({
            type: "indexPage/getHumanActLayer",
            payload: {
              "pageIndex": 1,
              "pageSize": 99,
              "parameterObject": {
                status: 1
              }
            },
            callback: (res) => {
              if (res) {
                if (res.code === 0) {
                  dispatch({
                    type: "indexPage/updateState",
                    payload: {
                      layerListHumanActiviy: res.data,
                      saveLayer: savelayer
                      // loadingGlobal: false,
                    }
                  })
                }
              }
            }
          });
        }
        break;

      case 'menu-field-audit_task-query': //任务查询
        if (savelayer.length > 0) {
          message.warn("避免操作图斑冲突，请关闭当前" + savelayer[0] + "窗口")
        } else {
          savelayer.push("任务查询");
          global.viewer.dataSources.removeAll();
          dispatch({
            type: 'indexPage/queryTask',
            payload: {
              pageSize: 5,
              pageIndex: 1,
              parameterObject: {
                Name: "",
                CreateTime: new Date().Format("yyyy-MM-dd") + " 00:00:00||" + new Date().Format("yyyy-MM-dd") + " 23:59:59",
                CreatorId: "",
                TeamId: ""
              }
            },
            callback: (res) => {
              if (res) {
                if (res.code === 0) {
                  dispatch({
                    type: 'indexPage/updateState',
                    payload: {
                      taskQueryModalShow: true,
                      queryTask: res.data,
                      saveLayer: savelayer
                    }
                  });
                }
              }
            }
          });
        }
        break;

      case 'menu-field-audit_device-monitor': //设备监控
        let fun = setInterval(() => {
          dispatch({
            type: "indexPage/ServiceCheck",
            payload: {
              parameterObject: {
                enabled: 1
              }
            },
            callback: (res) => {
              if (res) {
                if (res.code == 0) {
                  // console.log(res.data);
                  dispatch({
                    type: 'indexPage/updateState',
                    payload: {
                      watchService: res.data
                    }
                  });
                }
              }
            }
          })
        }, 2000);
        dispatch({
          type: "indexPage/ServiceCheck",
          payload: {
            parameterObject: {
              enabled: 1
            }
          },
          callback: (res) => {
            if (res) {
              if (res.code == 0) {
                // console.log(res.data);
                dispatch({
                  type: 'indexPage/updateState',
                  payload: {
                    serviceCheckModalShow: true,
                    watchService: res.data,
                    fun: fun
                  }
                });
              }
            }
          }
        })


        break;

      case 'menu-field-audit_data-upload': //数据上传
        dispatch({
          type: 'indexPage/updateState',
          payload: {
            dataUploadModalShow: true
          }
        });
        break;

      case 'menu-dispose-opinion': //处置意见
        if (savelayer.length > 0) {
          message.warn("避免操作图斑冲突，请关闭当前" + savelayer[0] + "窗口")
        } else {
          savelayer.push("处置意见");
          global.viewer.dataSources.removeAll();
          dispatch({
            type: "indexPage/getHumanActLayer",
            payload: {
              parameterObject: {
                status: 1
              }
            },
            callback: (res) => {
              if (res) {
                if (res.code === 0) {
                  dispatch({
                    type: "indexPage/updateState",
                    payload: {
                      layerListHumanActiviy: res.data,
                      setAdviceModalShow: true,
                      layermanagerhidden: true,
                      // loadingGlobal: false
                      layerMap2: true,
                      layerMap: false,
                      savelayer:saveLayer
                    }
                  })
                }
              }
            }
          });
        }
        break;

      case 'menu-statistical-analysis': //统计分析
        dispatch({
          type: 'indexPage/updateState',
          payload: {
            statisticalAnalysisModalShow: true
          }
        });
        break;

      case 'menu-report_build': //报告生成
        dispatch({
          type: 'indexPage/updateState',
          payload: {
            addReportModalShow: true
          }
        });
        break;

      case 'menu-report_upload': //报告上传
        dispatch({
          type: 'indexPage/updateState',
          payload: {
            uploadReportModalShow: true
          }
        });
        break;

      case 'menu-report_list': //报告列表
        dispatch({
          type: 'indexPage/updateState',
          payload: {
            reportListModalShow: true
          }
        });
        // dispatch({
        //   type: 'indexPage/reportList',
        //   payload: {
        //     title: this.state.searchValue !== "" ? this.state.searchValue : ""
        //   }
        // })
        break;

      case 'menu-independent-inspection': //自主巡查
        if (savelayer.length > 0) {
          message.warn("避免操作图斑冲突，请关闭当前" + savelayer[0] + "窗口")
        } else {
          savelayer.push("自主巡查");
          global.viewer.dataSources.removeAll();
          dispatch({
            type: 'indexPage/updateState',
            payload: {
              selfCheckModalShow: true,
              saveLayer: savelayer
            }
          });
          dispatch({ type: 'indexPage/SelfCheck', payload: { pageIndex: 1, pageSize: 99999 } });
        }
        break;
    }
  }
  ;

  //被选中时调用
  handleSelectNavMenu = ({ key, selectedKeys }) => {
    const { dispatch, menuSelect } = this.props;
    // console.log(selectedKeys);
    if (key === 'menu-remote-monitor_humanAct-change') {
      return false
    } else {
      let updateMenuSelect = { ...menuSelect, [key]: true };
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          menuSelect: updateMenuSelect
        }
      });
      this.navMenu(key, selectedKeys, updateMenuSelect);
    }


    //console.log('选中key:'+key);
    //console.log('选中后行为:'+selectedKeys+'  '+this.state.multiple)
  };

  //取消选中时调用
  handleonDeselectNavMenu = ({ key, selectedKeys }) => {
    const { dispatch, menuSelect } = this.props;
    if (key === 'menu-remote-monitor_humanAct-change') {
      return false
    } else {
      let updateMenuSelect = { ...menuSelect, [key]: false };
      dispatch({
        type: 'indexPage/updateState',
        payload: {
          menuSelect: updateMenuSelect
        }
      });
      this.navMenu(key, selectedKeys, updateMenuSelect);
      //this.setState({
      //  menuSelect: menuSelect
      //} ,()=>{
      //
      //});
      //console.log('取消key:'+key);
      //console.log('取消后行为:'+selectedKeys+'  '+this.state.multiple)
    }
  };

  //SubMenu 展开/关闭的回调
  handleOpenChangeNavMenu = (keys) => {
    // console.log(keys);
    let openKeys = keys;
    // if (openKeys[openKeys.length - 1] == 'menu-earth-coverage') { //图层
    //   if (openKeys[0] == 'menu-station') {
    //     openKeys = ['menu-earth', 'menu-earth-coverage'];
    //   }
    //   this.setState({
    //     openKeys: openKeys,
    //     // selectedKeys: (this.state.coverageselectedKeys.length > 0) ? this.state.coverageselectedKeys : []
    //   });
    // }  else {
    //   let openKeysArray = []
    //   openKeys.forEach((item) => {
    //     if (this.state.menuClickArray.includes(item)) {
    //       openKeysArray.push(item)
    //     }
    //   })
    //   this.setState({
    //     openKeys: openKeysArray,
    //   });
    // }
    //console.log('Change:' + openKeys)
    this.setState({
      openKeys: openKeys,
      // selectedKeys: (this.state.coverageselectedKeys.length > 0) ? this.state.coverageselectedKeys : []
    });
  }

  modifty = () => {
    const { dispatch } = this.props;
    // console.log(this.state.newpsd);
    if (this.state.newpsd === this.state.newpsd2) {
      dispatch({
        type: 'loginPage/modify',
        payload: { newPassword: this.state.newpsd, oldPassword: this.state.oldpsd },
        callback: (res) => {
          if (res) {
            if (res.code === 0) {
              message.success("修改成功")
            }
          }
        }
      })
    } else {
      message.warn("请再次确认密码！")
    }
  }

  render() {
    const { dispatch, menuSelect, powerMenu } = this.props;
    const levelMap = {};
    const getMenus = menuTreeN => menuTreeN.map((item) => {
      if (item.children) {
        if (item.parentid) {
          levelMap[item.id] = item.parentid
        }
        if (!item.hidden) {
          return (
            <Menu.SubMenu
              key={item.selector}
              title={
                <span>
                   {item.name}
                 </span>
              }
            >
              {getMenus(item.children)}
            </Menu.SubMenu>
          )
        }
      }
      if (!item.hidden) {
        if (item.style == 'select') { //出现选择框
          return (
            <Menu.Item key={item.selector}>
              {menuSelect[item.selector] ?
                <Icon type="check"
                      style={{
                        color: '#13c2c2',
                        marginTop: 13,
                        marginLeft: 1,
                        marginRight: 1,
                        float: "left",
                      }}/> : <i style={{ marginLeft: 1, marginRight: 1 }}></i>
              }
              {menuSelect[item.selector] ?
                <span style={{ marginRight: 5, color: '#13c2c2' }}>{item.name}</span> :
                <span style={{ marginRight: 5 }}>{item.name}</span>
              }
            </Menu.Item>
          );
        } else {
          return (
            <Menu.Item key={item.selector}>
              <span>{item.name}</span>
            </Menu.Item>
          )
        }
      }
    });
    const menuItems = getMenus(powerMenu);
    const handleClickMenu = () => {
      dispatch({ type: 'loginPage/logout' });
    };

    const menuProps = {
      multiple: true,
      defaultOpenKeys: [],
      openKeys: this.state.openKeys
    };

    const content = (
      <div className={styles.modifypsw}>
        <label>&nbsp;&nbsp;&nbsp;&nbsp;旧密码：<Input style={{ width: 140 }} type={"password"}
                                                  onChange={this.oldpsd}/></label>
        <br/> <br/>
        <label>&nbsp;&nbsp;&nbsp;&nbsp;新密码：<Input style={{ width: 140 }} type={"password"}
                                                  onChange={this.newpsd}/></label>
        <br/> <br/>
        <label>确认密码：<Input style={{ width: 140 }} type={"password"} onChange={this.newpsdconfirm}/></label>
        <br/> <br/>
        <div style={{ textAlign: "center" }}><Button onClick={this.modifty}>确定</Button>&nbsp;<Button
          onClick={this.hide}>关闭</Button></div>
      </div>
    );
    return (
      <header>
        <div className={styles.header + ' ' + styles.clearfix}>
          <div className={styles.header2}>
            {/*<div className={styles.logo + ' ' + styles.pullLeft}>    */}
            {/*</div>*/}
            <div className={styles.pullLeft + ' ' + styles.show}>
              <Menu mode="horizontal"
                    {...menuProps}
                    onClick={this.handleClickNavMenu}
                    onSelect={this.handleSelectNavMenu}
                    onDeselect={this.handleonDeselectNavMenu}
                    onOpenChange={this.handleOpenChangeNavMenu}
              >
                {menuItems}
              </Menu>
            </div>
            <span className={styles.pullRight} style={{ paddingTop: 20, paddingRight: 8 }}>
            <Popconfirm placement="topLeft" okText="确定" cancelText="取消" title="确定退出" onConfirm={handleClickMenu}
                        className={styles.urlPointer}>|<Icon
              type="poweroff"
              style={{ paddingLeft: 8 }}/>&nbsp;
              退出</Popconfirm>
          </span>
            <span className={styles.pullRight} style={{ paddingTop: 20, paddingRight: 2 }}>
               <Icon type="user" style={{ paddingLeft: 8 }}/><span
              style={{ paddingLeft: 5, paddingRight: 2 }}>{this.state.name}</span>
            <Popover title="修改密码" trigger="click" placement="bottomRight" className={styles.urlPointer}
                     visible={this.state.visible}
                     onVisibleChange={this.handleVisibleChange}
                     content={content}>|<Icon type="setting" style={{ paddingLeft: 5 }}/>
              <span style={{ paddingLeft: 5 }}>设置</span>
            </Popover>
          </span>
          </div>
        </div>
      </header>
    )
  }
}

Header
  .propTypes = {
  // cesiumControl: PropTypes.object,
  // menuData: PropTypes.array,
  // account: PropTypes.string,
  // showRainAnalyzeMapLayer: PropTypes.func,
  // showtiltLayer: PropTypes.func
};


