
/**
 * Created by Administrator on 2018/10/23.
 */
var we = (function () {
    var viewer = null
    var baseThis = null
    var webEarthEle = null

    function we(element, options) {
        // 默认参数设置
        var defalutOptions = {
            baseUrl: 'http://183.232.33.177:9080/webearth'     // 插件网络请求基础地址(默认)
        }
        webEarthEle = element
        options = copyOptions(options, defalutOptions)    // 合并参数默认值和自定义值
        this.host = options.baseUrl     // 插件网络请求基础地址
        baseThis = this
        if (options.token) {
            this.token = options.token      // 用户token，用于获取用户权限
            this.getPermissions(function () {
                viewer = baseThis.initEarth(element, options)
                if (options.navigation) {
                    baseThis.viewNavigation()
                }
            })
        }
    }

    we.prototype = {
        // 获取插件权限
        getPermissions: function (callback) {
            if (getCookie('sessionId') === '' || getCookie('permissionsList') === '') {
                console.log(getCookie('sessionId'))
                request(this.host, {
                    url: '/user/validate?token=' + this.token,
                    type: 'GET',
                    async: false,   // 此处获取权限的操作中async设置为false，以确保获取权限之后其他的操作才被执行
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        var permissionsList = []
                        for (var item of data.list) {
                            permissionsList.push(item.name)
                        }
                        setCookie('permissionsList', permissionsList, 7);
                        setCookie('sessionId', data.sessionid, 7);
                        if (typeof callback === 'function')
                            callback()
                    },
                    error: function (data, type, err) {
                        alert('权限获取接口出错，所有功能将不能使用，请联系后台人员')
                    }
                })
            } else {
                if (typeof callback === 'function')
                    callback()
            }
        },
        // 初始化地球
        initEarth: function (element, options) {
            var terrainProvider = new Cesium.CesiumTerrainProvider({
                url: 'https://assets.agi.com/stk-terrain/world',
                requestVertexNormals: true,
            })
            var defaults = {
                initialPoi: {lat: 114, lng: 23, stadia:150000000},
                imageryProvider: new Cesium.UrlTemplateImageryProvider({url: "http://183.232.33.177:9080/webearth/tiles/world/{z}/{x}/{reverseY}.jpg"}),
                terrainProvider: terrainProvider
            }
            options = copyOptions(options, defaults)
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YTgyNDg3My04NTA5LTQ4ZmEtOTMyNS1mMTUzZDdlOTk1ZWMiLCJpZCI6NDcxMSwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MTQ2ODc1MH0.dhnEDkhy9hUegKNRdQZJ6D0GBC_aOGHZDj_wS8TWYVg'
            var viewer = new Cesium.Viewer(element, {
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                fullscreenButton: false,
                vrButton: false,
                baseLayerPicker: false,
                animation: false,
                infoBox: false,
                selectionIndicator: false,
                timeline: false,
                navigationHelpButton: false,
                navigationInstructionsInitiallyVisible: false,
                mapProjection: new Cesium.WebMercatorProjection(),
                imageryProvider: options.imageryProvider,
                // terrainProvider: new Cesium.createWorldTerrain()
                // terrainProvider: options.terrainProvider  //有时候访问不了高程数据，可暂时注释掉或者访问离线数据
            })

            // 初始化视角
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(options.initialPoi.lat, options.initialPoi.lng, options.initialPoi.stadia),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: Cesium.Math.toRadians(0)
                }
            })
            // 点击重置后摄影机跳转位置
            // viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function () {
            //     Cesium.requestAnimationFrame(function () {
            //         viewer.camera.flyTo({
            //             destination: Cesium.Cartesian3.fromDegrees(114, 23, 30000000)
            //         })
            //     })
            // })
            viewer.scene.globe.enableLighting = false; //太阳光
            // viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            //     url: baseThis.host + '/tiles/mapinfo/{z}/{x}/{reverseY}.png'
            // }))
            viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
              url: 'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg',
              layer: 'tdtAnnoLayer',
              style: 'default',
              format: 'image/jpeg',
              tileMatrixSetID: 'GoogleMapsCompatible',
              show: false,
              maximumLevel: 16,
              minimumLevel: 0
            }));
            viewer.terrainProvider = Cesium.createWorldTerrain({
                requestWaterMask : true, // required for water effects
                requestVertexNormals : true // required for terrain lighting
            });
            // 现在我们有了地形，我们只需要多一行来确保地形后面的物体被正确遮挡。只有最前面的物体是可见的
            // viewer.scene.globe.depthTestAgainstTerrain = true;
            return viewer;
        },
        // 初始化鼠标点击事件
        setHandlerEvent: function (callback, mouseEvent) {
            if (this.handler === undefined || (this.handler !== undefined && this.handler.isDestroyed()))
                this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
            switch (mouseEvent) {
                case 'leftClick':
                    // 鼠标左键单击事件
                    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
                    this.handler.setInputAction(function (movement) {
                        callback(movement)
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
                    break;
                case 'rightClick':
                    // 鼠标右键单击事件
                    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
                    this.handler.setInputAction(function (movement) {
                        callback(movement)
                    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
                    break;
                case 'leftDoubleClick':
                    // 鼠标双击事件
                    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
                    this.handler.setInputAction(function (movement) {
                        callback(movement)
                    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
                    break;
                case 'mouseMove':
                    // 鼠标移动事件
                    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
                    this.handler.setInputAction(function (movement) {
                        callback(movement)
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
                    break;
                case 'leftUp':
                    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
                    this.handler.setInputAction(function (movement) {
                        callback(movement)
                    }, Cesium.ScreenSpaceEventType.LEFT_UP)
                    break;
                case 'leftDown':
                    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
                    this.handler.setInputAction(function (movement) {
                        callback(movement)
                    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
                    break;
                default:
                    break;
            }
        },
        // 销毁鼠标点击事件
        destroyHandlerEvent: function () {
            if (this.handler === null || !this.handler.isDestroyed()) {
                this.handler.destroy()
            }
        },
        // 地图缩放、指北针
        viewNavigation: function () {
            if (isArrContain('navigation', getCookie('permissionsList').split(','))) {
                viewer.extend(Cesium.viewerCesiumNavigationMixin);
            }
            else {
                console.warn('没有navigation这项功能')
            }
        },
        // 测量工具
        measureHelper: function () {
            if (isArrContain('measureTool', getCookie('permissionsList').split(','))) {
                return new we.measureHelper()
            } else {
                console.warn('没有measure这项功能')
                return
            }
        },
        // 标绘工具
        drawHelper: function () {
            if (isArrContain('drawHelper', getCookie('permissionsList').split(','))) {
                return new we.drawHelper(viewer)
            } else {
                console.warn('没有drawHelper这项功能')
                return
            }
        },
        // 图层管理
        layerManager: function () {
            if (isArrContain('layerMgt', getCookie('permissionsList').split(','))) {
                return new we.layerManager()
            } else {
                console.warn('没有layerManager这项功能')
                return
            }
        },
        // 数据驱动制图
        dataDrivenDrawer: function () {
            if (isArrContain('levelMgt', getCookie('permissionsList').split(','))) {
                return new we.dataDrivenDrawer()
            } else {
                console.warn('没有dataDrivenDrawer这项功能')
            }
        },
        // 搜索
        searchManager: function () {
            if (isArrContain('searchAnyThing', getCookie('permissionsList').split(','))) {
                return new we.searchManager()
            } else {
                console.warn('没有searchManager这项功能')
            }
        },
        // 镜头管理
        cameraManager: function () {
            return new we.cameraManager()
        },
        // 气泡
        popperManager: function (position, message) {
            var label = new Cesium.LabelCollection();
            label.add({
                position: Cesium.Cartesian3.fromDegrees(position.lng, position.lat),
                text: message,
                font : '18px sans-serif',
                backgroundColor: new Cesium.Color(0, 0, 0, 1),
                showBackground: true,
                horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
                verticalOrigin : Cesium.VerticalOrigin.BASELINE
            })
            viewer.scene.primitives.add(label)
        },
        // 获取资源库
        getImageSourcesLib: function (callback) {
            request(baseThis.host, {
                url: '/main/getImageList',
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", getCookie('sessionId'));
                },
                success: function (res, statusTest, xhr) {
                    for (var i in res.result) {
                        res.result[i].path = baseThis.host + '/' + res.result[i].path
                    }
                    if (typeof callback === 'function')
                        callback(res.result)
                },
                error: function (xhr, err, obj) {
                    if (xhr.status === 401) {
                        setCookie('sessionId', '', 7)
                        baseThis.getPermissions(function() {
                            baseThis.getImageSourcesLib(callback)
                        })
                    }
                }
            })
        },
        // 截图
        dataURLtoBlob: function (dataUrl) {
            var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type: mime});
        },
        screenShots: function () {
            viewer.render();
            var base64 = viewer.canvas.toDataURL("image/png");
            var imgInfo,
                downloadImgArr = [];
            var blob_ = this.dataURLtoBlob(base64);
            imgInfo = {
                name: new Date().getTime() + "_Earth",
                src: blob_
            };
            downloadImgArr.push(imgInfo);
            $(downloadImgArr).multiDownload({"source": "local"});
        },
        // 打印地图快照
        printEarth: function () {
            viewer.render();
            var contentWidth = viewer.canvas.width;
            var contentHeight = viewer.canvas.height;
            //一页pdf显示html页面生成的canvas高度;
            var pageHeight = contentWidth / 592.28 * 841.89;
            //未生成pdf的html页面高度
            var leftHeight = contentHeight;
            //页面偏移
            var position = 0;
            //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
            var imgWidth = 595.28;
            var imgHeight = 592.28 / contentWidth * contentHeight;
            var pageData = viewer.canvas.toDataURL('image/jpeg', 1.0);
            var pdf = new jsPDF('', 'pt', 'a4');
            //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
            //当内容未超过pdf一页显示的范围，无需分页
            if(leftHeight < pageHeight) {
                pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth,imgHeight);
            } else {
                while(leftHeight > 0) {
                    //arg3-->距离左边距;arg4-->距离上边距;arg5-->宽度;arg6-->高度
                    pdf.addImage(pageData, 'JPEG', 0, position,imgWidth, imgHeight)
                    leftHeight -= pageHeight;
                    position -= 841.89;
                    //避免添加空白页
                    if(leftHeight > 0) {
                        pdf.addPage();
                    }
                }
            }
            pdf.save('WebEarth' + new Date().getTime() + '.pdf');
        },
        // 研判功能
        judgeRead: function () {
            return new we.judgeRead()
        },
        // 图层加载
        ImageryProviderManager: function (type) {
            switch (type) {
                case 'water':
                    viewer.imageryLayers.addImageryProvider(water)
                    break
                case 'road':
                    viewer.imageryLayers.addImageryProvider(road)
                    break
                case 'water_remove':
                    viewer.imageryLayers.remove(water)
                    break
                case 'road_remove':
                    viewer.imageryLayers.remove(road)
                    break
                default:
                    break
            }
        },
        layerSourcesManager: function (type) {
            switch (type) {
                // 天地图影像
                case 'img_w':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: "http://{s}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}",
                        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: 18
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 天地图矢量
                case 'vec_w':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: "http://{s}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}",
                        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: 18
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 天地图地形
                case 'ter_w':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: "http://{s}.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}",
                        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: 18
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 天地图影像中文标注
                case 'cia_w':
                    for (var i = 0; i < viewer.imageryLayers._layers.length; i++) {
                        if (viewer.imageryLayers._layers[i].name === "天地图全球矢量中文标注服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        } else if (viewer.imageryLayers._layers[i].name === "天地图全球地形中文标注服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        } else if (viewer.imageryLayers._layers[i].name === "天地图全球影像中文标注服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        }
                    }
                    var layerServer = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: "http://{s}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}",
                        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: 18
                    }));
                    layerServer.name = "天地图全球影像中文标注服务";
                    viewer.imageryLayers.raiseToTop(layerServer);
                    break;
                // 天地图矢量中文标注
                case 'cva_w':
                    for (var i = 0; i < viewer.imageryLayers._layers.length; i++) {
                        if (viewer.imageryLayers._layers[i].name === "天地图全球矢量中文标注服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        } else if (viewer.imageryLayers._layers[i].name === "天地图全球地形中文标注服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        } else if (viewer.imageryLayers._layers[i].name === "天地图全球影像中文标注服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        }
                    }
                    var layerServer = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: "http://{s}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}",
                        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: 18
                    }));
                    layerServer.name = "天地图全球矢量中文标注服务";
                    viewer.imageryLayers.raiseToTop(layerServer);
                    break;
                // 天地图地形中文标注
                case 'cta_w':
                    for (var i = 0; i < viewer.imageryLayers._layers.length; i++) {
                        if (viewer.imageryLayers._layers[i].name === "天地图全球矢量中文标注服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        } else if (viewer.imageryLayers._layers[i].name === "天地图全球地形中文标注服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        } else if (viewer.imageryLayers._layers[i].name === "天地图全球影像中文标注服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        }
                    }
                    var layerServer = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: "http://{s}.tianditu.com/DataServer?T=cta_w&x={x}&y={y}&l={z}",
                        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: 18
                    }));
                    layerServer.name = "天地图全球地形中文标注服务";
                    viewer.imageryLayers.raiseToTop(layerServer);
                    break;
                // 高德卫星影像图
                case 'gaoDe_wei':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: 'http://{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&L={z}&Z={z}&Y={y}&X={x}',
                        subdomains: ['webst01', 'webst02', 'webst03', 'webst04'],
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: 18
                    }));
                    imageryProvider.type = "gcj-02";
                    break;
                // 高德街道
                case 'gaoDe_streets':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: 'http://{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&L={z}&Z={z}&Y={y}&X={x}',
                        subdomains: ['webrd01', 'webrd02', 'webrd03', 'webrd04'],
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: 18
                    }));
                    imageryProvider.type = "gcj-02";
                    break;
                // 谷歌地形
                case 'google_dixing':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: "http://www.google.cn/maps/vt?lyrs=t@198&gl=en&x={x}&y={y}&z={z}"}));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 谷歌卫星
                case 'google_wei':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: "http://www.google.cn/maps/vt?lyrs=s@198&gl=en&x={x}&y={y}&z={z}"
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 谷歌默认
                case 'google_default':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: "http://www.google.cn/maps/vt?lyrs=m@198&gl=en&x={x}&y={y}&z={z}"}));
                    imageryProvider.type = "gcj-02";
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 谷歌卫星标注
                case 'google_label_wei':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: "http://www.google.cn/maps/vt?lyrs=y@198&gl=en&x={x}&y={y}&z={z}"}));
                    imageryProvider.type = "gcj-02";
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 谷歌地形标注
                case 'google_label_dixing':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: "http://www.google.cn/maps/vt?lyrs=p@198&gl=en&x={x}&y={y}&z={z}"}));
                    imageryProvider.type = "gcj-02";
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arc街道
                case 'arc_Street_Map':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcWorld
                case 'arc_World_Imagery':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcNatGeoWorld
                case 'arc_World_Imagery':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcWorldPhysical
                case 'arc_World_Physical_Map':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcWorldShadedRelief
                case 'arc_World_Physical_Map':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcWorldTerrainBase
                case 'arc_World_Terrain_Base':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcWorldTopoMap
                case 'arc_World_Topo_Map':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcUSATopoMaps
                case 'arc_USA_Topo_Maps':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcNGSTopoUS2D
                case 'arc_NGS_Topo_US_2D':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/NGS_Topo_US_2D/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcESRIStreetMapWorld2D
                case 'arc_ESRI_StreetMap_World_2D':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcESRIImageryWorld2D
                case 'arc_ESRI_Imagery_World_2D':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcDeLormeWorldBaseMap
                case 'arc_DeLorme_World_Base_Map':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/arcgis/rest/services/Specialty/DeLorme_World_Base_Map/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcWorldOceanBase
                case 'arc_World_Ocean_Base':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcWorldDarkGrayBase
                case 'arc_World_Dark_Gray_Base':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcWorldLightGrayBase
                case 'arc_World_Light_Gray_Base':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // arcOceanBasemapss
                case 'arc_Ocean_Basemapss':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer",
                        enablePickFeatures: false
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxStreetsBasic
                case 'mapbox_streets_basic':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.streets-basic'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxSatellite
                case 'mapbox_satellite':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.satellite'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxStreets
                case 'mapbox_streets':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.streets'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxStreets
                case 'mapbox_streets_satellite':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.streets-satellite'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxWheatpaste
                case 'mapbox_wheatpaste':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.wheatpaste'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxComic
                case 'mapbox_comic':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.comic'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxComic
                case 'mapbox_outdoors':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.outdoors'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxRunBikeHike
                case 'mapbox_run_bike_hike':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.run-bike-hike'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxPencil
                case 'mapbox_pencil':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.pencil'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxPirates
                case 'mapbox_pirates':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.pirates'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxEmerald
                case 'mapbox_emerald':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.emerald'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxHighContrast
                case 'mapbox_high_contrast':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.high-contrast'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxLight
                case 'mapbox_light':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.light'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // mapboxDark
                case 'mapbox_dark':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
                        url: "https://api.mapbox.com/v4/",
                        mapId: 'mapbox.dark'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // stamenWatercolor
                case 'stamen_watercolor':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
                        url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/',
                        fileExtension: 'jpg'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // stamenToner
                case 'stamen_toner':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({url: 'https://stamen-tiles.a.ssl.fastly.net/toner/'}));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // otherNaturalEarthII
                case 'other_NaturalEarthII':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({url: 'Build/Cesium/Assets/Textures/NaturalEarthII'}));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // otherOpenStreetMap
                case 'other_OpenStreetMap':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // otherOpenStreetMapCycle
                case 'other_OpenStreetMapCycle':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'}));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // otherOpenStreetMapTransport
                case 'other_OpenStreetMapTransport':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: 'http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png'}));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // otherOpenStreetMapIntl
                case 'other_OpenStreetMapIntl':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'}));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // otherOpenStreetMapHot
                case 'other_OpenStreetMapIntl':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'}));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // otherOpenStreetMapLandscape
                case 'other_OpenStreetMapIntl':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'}));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // otherOpenStreetMapOutdoors
                case 'other_OpenStreetMapOutdoors':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png'}));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // otherCartoMap
                case 'other_cartoMap':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'}));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // otherCartoMapDark
                case 'other_cartoMap_dark':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 必应卫星
                case 'bing_aerial':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
                        url: 'https://dev.virtualearth.net', mapStyle: Cesium.BingMapsStyle.AERIAL
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 必应矢量
                case 'bing_collins_Bbart':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
                        url: 'https://dev.virtualearth.net',
                        mapStyle: Cesium.BingMapsStyle.COLLINS_BART
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 必应街道
                case 'bing_road':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
                        url: 'https://dev.virtualearth.net',
                        mapStyle: Cesium.BingMapsStyle.ROAD
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 必应卫星与标注
                case 'bing_aerial_with_labels':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
                        url: 'https://dev.virtualearth.net',
                        mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS
                    }));
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                // 网格服务
                case 'gridImagesLyaer':
                    for (var i = 0; i < viewer.imageryLayers._layers.length; i++) {
                        if (viewer.imageryLayers._layers[i].name === "网格服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        }
                    }
                    var layerServer = viewer.imageryLayers.addImageryProvider(new Cesium.GridImageryProvider());
                    layerServer.name = "网格服务";
                    viewer.imageryLayers.raiseToTop(layerServer);
                    break;
                // 瓦片服务
                case 'tileImagesLyaer':
                    for (var i = 0; i < viewer.imageryLayers._layers.length; i++) {
                        if (viewer.imageryLayers._layers[i].name === "瓦片服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        }
                    }
                    var layerServer = viewer.imageryLayers.addImageryProvider(new Cesium.TileCoordinatesImageryProvider());
                    layerServer.name = "瓦片服务";
                    viewer.imageryLayers.raiseToTop(layerServer);
                    break;
                case 'country_lineadd':
                    for (var i = 0; i < viewer.imageryLayers._layers.length; i++) {
                        if (viewer.imageryLayers._layers[i].name === "国界线切片服务") {
                            viewer.imageryLayers.remove(viewer.imageryLayers._layers[i]);
                        }
                    }
                    var layerServer = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({url: 'http://183.232.33.177:6080/arcgis/rest/services/webearth/world/MapServer/WMTS'}));// var layerServer = viewer.imageryLayers.addImageryProvider(new WMTSImageryProvider('http://mt1.google.cn/vt/lyrs=h&hl=zh-CN&x={x}&y={y}&z={z}', true, { alpha: 1 }));
                    layerServer.name = "国界线切片服务";
                    viewer.imageryLayers.raiseToTop(layerServer);
                    break;
                // 路网
                case 'roadImagesLayer':
                    var road = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: baseThis.host + '/tiles/road/{z}/{x}/{reverseY}.png'
                    }))
                    // viewer.imageryLayers.lowerToBottom(road);
                    break;
                // 水网
                case 'waterImagesLayer':
                    var water = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: baseThis.host + '/tiles/water/{z}/{x}/{reverseY}.png'
                    }))
                    // viewer.imageryLayers.lowerToBottom(water);
                    break;
                case 'clean':
                    viewer.imageryLayers.removeAll();
                    var imageryProvider = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: "http://www.google.cn/maps/vt?lyrs=s@198&gl=en&x={x}&y={y}&z={z}"
                    }))
                    viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                        url: "http://{s}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}",
                        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        maximumLevel: 18
                    }))
                    viewer.imageryLayers.lowerToBottom(imageryProvider);
                    break;
                default :

                    break;
            }
        },
        sceneManage: function () {
          var sceneManage = new Object
          sceneManage.pick = function(position) {
            return viewer.scene.pick(position)
          }

          return sceneManage
        },
        dataSourcesManager: function (method, callback) {
          switch (method) {
            case 'removeAll':
              viewer.dataSources.removeAll()
              if (typeof callback === 'function') {
                callback()
              }
              break;
            default:
              break;
          }
        },
        addImageProvider: function (entity) {
          // viewer.imageryLayers.removeAll();
          var imageryProvider = viewer.imageryLayers.addImageryProvider(entity)
          viewer.imageryLayers.lowerToBottom(imageryProvider);
        }
    }

    // 测量工具类
    we.measureHelper = function () {
        function _() {

        }
        var tempPoints = [];
        var tempEntities = [];
        function drawPoint(point) {
            var entity =
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
                    label: {
                        text: '',
                        font: '11px Helvetica'
                    },
                    point: {
                        pixelSize: 10,
                        color: Cesium.Color.WHITE
                    }
                });
            tempEntities.push(entity);
        }
        function drawLine(point1, point2, showDistance, mode) {
            var entity =
                viewer.entities.add({
                    polyline: {
                        positions: [Cesium.Cartesian3.fromDegrees(point1.lon, point1.lat), Cesium.Cartesian3.fromDegrees(point2.lon, point2.lat)],
                        width: 10.0,
                        material: new Cesium.PolylineGlowMaterialProperty({
                            color: Cesium.Color.GREEN.withAlpha(.5)
                        })
                    }
                });
            tempEntities.push(entity);
            if (showDistance) {
                var w = Math.abs(point1.lon - point2.lon)
                var h = Math.abs(point1.lat - point2.lat)
                var offsetV = w >= h ? 0.0005 : 0
                var offsetH = w < h ? 0.001 : 0
                var distance = getFlatternDistance(point1.lat, point1.lon, point2.lat, point2.lon)
                var label = {}
                entity =
                    viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(((point1.lon + point2.lon) / 2),
                            ((point1.lat + point2.lat) / 2)),
                        label: ('drawLine' == mode ? {
                            text: distance.toFixed(1) + 'm',
                            font: '22px Helvetica',
                            fillColor: Cesium.Color.WHITE
                        } : '')
                    });
                tempEntities.push(entity)
            }
        }
        function drawPoly(points) {
            var pArray = []
            for (var i = 0; i < points.length; i++) {
                pArray.push(points[i].lon)
                pArray.push(points[i].lat)
            }
            var entity = viewer.entities.add({
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(pArray)),
                    material: Cesium.Color.GREEN.withAlpha(.5)
                }
            });
            tempEntities.push(entity)
        }
        //计算两点间距离
        function getFlatternDistance(lat1, lng1, lat2, lng2) {
            var EARTH_RADIUS = 6378137.0    //单位M
            var PI = Math.PI

            function getRad(d) {
                return d * PI / 180.0
            }

            var f = getRad((lat1 + lat2) / 2)
            var g = getRad((lat1 - lat2) / 2)
            var l = getRad((lng1 - lng2) / 2)

            var sg = Math.sin(g)
            var sl = Math.sin(l)
            var sf = Math.sin(f)

            var s, c, w, r, d, h1, h2
            var a = EARTH_RADIUS
            var fl = 1 / 298.257

            sg = sg * sg
            sl = sl * sl
            sf = sf * sf

            s = sg * (1 - sl) + (1 - sf) * sl
            c = (1 - sg) * (1 - sl) + sf * sl

            w = Math.atan(Math.sqrt(s / c))
            r = Math.sqrt(s * c) / w
            d = 2 * w * a
            h1 = (3 * r - 1) / 2 / c
            h2 = (3 * r + 1) / 2 / s

            return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
        }
        //计算多边形面积
        var earthRadiusMeters = 6371000.0
        var radiansPerDegree = Math.PI / 180.0
        var degreesPerRadian = 180.0 / Math.PI
        function SphericalPolygonAreaMeters(points) {
            var totalAngle = 0;
            for (var i = 0; i < points.length; i++) {
                var j = (i + 1) % points.length
                var k = (i + 2) % points.length
                totalAngle += Angle(points[i], points[j], points[k])
            }
            var planarTotalAngle = (points.length - 2) * 180.0
            var sphericalExcess = totalAngle - planarTotalAngle
            if (sphericalExcess > 420.0) {
                totalAngle = points.length * 360.0 - totalAngle
                sphericalExcess = totalAngle - planarTotalAngle
            } else if (sphericalExcess > 300.0 && sphericalExcess < 420.0) {
                sphericalExcess = Math.abs(360.0 - sphericalExcess)
            }
            return sphericalExcess * radiansPerDegree * earthRadiusMeters * earthRadiusMeters;
        }
        /*角度*/
        function Angle(p1, p2, p3) {
            var bearing21 = Bearing(p2, p1)
            var bearing23 = Bearing(p2, p3)
            var angle = bearing21 - bearing23
            if (angle < 0) {
                angle += 360
            }
            return angle;
        }
        /*方向*/
        function Bearing(from, to) {
            var lat1 = from.lat * radiansPerDegree
            var lon1 = from.lon * radiansPerDegree
            var lat2 = to.lat * radiansPerDegree
            var lon2 = to.lon * radiansPerDegree
            var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2))
            if (angle < 0) {
                angle += Math.PI * 2.0
            }
            angle = angle * degreesPerRadian
            return angle
        }
        _.prototype.setMode = function (mode, callback) {
            if (mode === 'drawPloy') {
                tempPoints = []
                baseThis.setHandlerEvent(function (click) {
                    var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid)
                    if (cartesian) {
                        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                        tempPoints.push({ lon: longitudeString, lat: latitudeString });
                        var tempLength = tempPoints.length;
                        drawPoint(tempPoints[tempPoints.length - 1]);
                        if (tempLength > 1) {
                            drawLine(tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1], true, mode)
                        }
                    }
                }, 'leftClick')
                baseThis.setHandlerEvent(function (click) {
                    var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
                    if (cartesian) {
                        var tempLength = tempPoints.length;
                        if (tempLength < 3) {
                            alert('请选择3个以上的点再执行闭合操作命令');
                        } else {
                            drawLine(tempPoints[0], tempPoints[tempPoints.length - 1], true, mode);
                            drawPoly(tempPoints);

                            var ent = viewer.entities.add({
                                position: Cesium.Cartesian3.fromDegrees(((tempPoints[0].lon +(tempPoints[tempPoints.length-1].lon+ tempPoints[tempPoints.length-2].lon)/2)/2 ),
                                    ((tempPoints[0].lat +(tempPoints[tempPoints.length-1].lat+tempPoints[tempPoints.length -2].lat)/2 )/2)),
                                label: {
                                    text: SphericalPolygonAreaMeters(tempPoints) .toFixed(1) + '㎡',
                                    font: '22px Helvetica',
                                    fillColor: Cesium.Color.BLACK
                                }
                            })
                            tempEntities.push(ent);
                            tempPoints = [];
                            baseThis.destroyHandlerEvent();
                            callback()
                        }
                    }
                }, 'rightClick')
            } else if (mode === 'drawLine') {
                tempPoints = []
                baseThis.setHandlerEvent(function (click) {
                    var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
                    if (cartesian) {
                        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                        tempPoints.push({ lon: longitudeString, lat: latitudeString });
                        var tempLength = tempPoints.length;
                        drawPoint(tempPoints[tempPoints.length - 1]);
                        if (tempLength > 1) {
                            drawLine(tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1], true, mode);
                        }
                    }
                }, 'leftClick')
                baseThis.setHandlerEvent(function (click) {
                    tempPoints = []
                    baseThis.destroyHandlerEvent()
                    callback()
                }, 'rightClick')
            } else if (mode === 'cleanUp') {
                var primitives = viewer.entities;
                for (var i = 0; i < tempEntities.length; i++) {
                    primitives.remove(tempEntities[i]);
                }
                tempEntities=[];
                baseThis.destroyHandlerEvent()
            }
        }

        return _
    }()

    // 标绘工具类
    we.drawHelper = function () {
        const ellipsoid = Cesium.Ellipsoid.WGS84;
        let scene = null;
        let canvas = null;
        const billboardCollection = []
        const polylineCollection = []
        const polygonCollection = []

        // constructor
        function _() {
            this._viewer = viewer;
            this._scene = viewer.scene;
            this._tooltip = createTooltip(viewer.container);
            // this._surfaces = [];
            scene = viewer.scene;

            canvas = viewer.canvas

            this.initialiseHandlers();
            this.enhancePrimitives();
        }
        _.prototype.editEvent = null
        _.prototype.initialiseHandlers = function () {
            let scene = this._scene;
            let _self = this;
            // scene events
            let handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

            function callPrimitiveCallback(name, position) {
                if (_self._handlersMuted == true) return;
                let pickedObject = scene.pick(position);
                let billboardEntities = [];
                let pickedEntities = scene.drillPick(position);
                for (var i = 0; i < pickedEntities.length; i++) {
                    var obj = pickedEntities[i];
                    if (obj.primitive instanceof Cesium.Billboard) {
                        billboardEntities.push(obj);
                        // obj.primitive.image = 'dist/img/glyphicons_242_google_maps.png'
                    }
                }
                if (pickedObject && pickedObject.primitive && pickedObject.primitive[name]) {
                    pickedObject.primitive[name](position);
                }
            }

            handler.setInputAction(
                function (movement) {
                    callPrimitiveCallback('leftClick', movement.position);
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler.setInputAction(
                function (movement) {
                    callPrimitiveCallback('leftDoubleClick', movement.position);
                }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            let mouseOutObject;
            handler.setInputAction(
                function (movement) {
                    if (_self._handlersMuted == true) return;
                    let pickedObject = scene.pick(movement.endPosition);
                    if (mouseOutObject && (!pickedObject || mouseOutObject != pickedObject.primitive)) {
                        !(mouseOutObject.isDestroyed && mouseOutObject.isDestroyed()) && mouseOutObject.mouseOut(movement.endPosition);
                        mouseOutObject = null;
                    }
                    if (pickedObject && pickedObject.primitive) {
                        pickedObject = pickedObject.primitive;
                        if (pickedObject.mouseOut) {
                            mouseOutObject = pickedObject;
                        }
                        if (pickedObject.mouseMove) {
                            pickedObject.mouseMove(movement.endPosition);
                        }
                    }
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler.setInputAction(
                function (movement) {
                    callPrimitiveCallback('leftUp', movement.position);
                }, Cesium.ScreenSpaceEventType.LEFT_UP);
            handler.setInputAction(
                function (movement) {
                    callPrimitiveCallback('leftDown', movement.position);
                }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        }

        _.prototype.setListener = function (primitive, type, callback) {
            primitive[type] = callback;
        }

        _.prototype.muteHandlers = function (muted) {
            this._handlersMuted = muted;
        }

        // register event handling for an editable shape
        // shape should implement setEditMode and setHighlighted
        _.prototype.registerEditableShape = function (surface) {
            let _self = this;

            // handlers for interactions
            // highlight polygon when mouse is entering
            setListener(surface, 'mouseMove', function (position) {
                surface.setHighlighted(true);
                if (!surface._editMode) {
                    _self._tooltip.showAt(position, "点击编辑图形");
                }
            });
            // hide the highlighting when mouse is leaving the polygon
            setListener(surface, 'mouseOut', function (position) {
                surface.setHighlighted(false);
                _self._tooltip.setVisible(false);
            });
            setListener(surface, 'leftClick', function(position) {
                surface.setEditMode(true);
            });
            setListener(surface, 'leftDoubleClick', function (position) {
                if (typeof _self.editEvent === 'function') {
                    _self.editEvent(surface.primitiveType, function (options) {
                        surface.material = new Cesium.Material({
                            fabric: {
                                type: 'Color',
                                uniforms: {
                                    color: new Cesium.Color.fromCssColorString(options.color)
                                }
                            }
                        })
                    })
                }
            });
        }

        _.prototype.startDrawing = function (cleanUp) {
            // undo any current edit of shapes
            this.disableAllEditMode();
            // check for cleanUp first
            if (this.editCleanUp) {
                this.editCleanUp();
            }
            this.editCleanUp = cleanUp;
            this.muteHandlers(true);
        }

        _.prototype.stopDrawing = function () {
            // check for cleanUp first
            if (this.editCleanUp) {
                this.editCleanUp();
                this.editCleanUp = null;
            }
            this.muteHandlers(false);
        }

        // make sure only one shape is highlighted at a time
        _.prototype.disableAllHighlights = function () {
            this.setHighlighted(undefined);
        }

        _.prototype.setHighlighted = function (surface) {
            if (this._highlightedSurface && !this._highlightedSurface.isDestroyed() && this._highlightedSurface != surface) {
                this._highlightedSurface.setHighlighted(false);
            }
            this._highlightedSurface = surface;
        }

        _.prototype.disableAllEditMode = function () {
            this.setEdited(undefined);
        }

        _.prototype.setEdited = function (surface) {
            if (this._editedSurface && !this._editedSurface.isDestroyed()) {
                this._editedSurface.setEditMode(false);
            }
            this._editedSurface = surface;
        }

        let material = Cesium.Material.fromType(Cesium.Material.ColorType);
        material.uniforms.color = new Cesium.Color(1.0, 1.0, 0.0, 0.5);

        let defaultShapeOptions = {
            ellipsoid: Cesium.Ellipsoid.WGS84,
            textureRotationAngle: 0.0,
            height: 0.0,
            asynchronous: true,
            show: true,
            debugShowBoundingVolume: false
        }

        let defaultSurfaceOptions = copyOptions(defaultShapeOptions, {
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                aboveGround: false
            }),
            material: material,
            granularity: Math.PI / 180.0
        });

        let defaultPolygonOptions = copyOptions(defaultShapeOptions, {});
        let defaultExtentOptions = copyOptions(defaultShapeOptions, {});
        let defaultCircleOptions = copyOptions(defaultShapeOptions, {});
        let defaultEllipseOptions = copyOptions(defaultSurfaceOptions, {rotation: 0});

        let defaultPolylineOptions = copyOptions(defaultShapeOptions, {
            width: 5,
            geodesic: true,
            granularity: 10000,
            appearance: new Cesium.PolylineMaterialAppearance({
                aboveGround: false
            }),
            material: material
        });

        let ChangeablePrimitive = (function () {
            function _() {
            }

            _.prototype.initialiseOptions = function (options) {

                fillOptions(this, options);

                this._ellipsoid = undefined;
                this._granularity = undefined;
                this._height = undefined;
                this._textureRotationAngle = undefined;
                this._id = undefined;

                // set the flags to initiate a first drawing
                this._createPrimitive = true;
                this._primitive = undefined;
                this._outlinePolygon = undefined;

            }

            _.prototype.setAttribute = function (name, value) {
                this[name] = value;
                this._createPrimitive = true;
            };

            _.prototype.getAttribute = function (name) {
                return this[name];
            };

            /**
             * @private
             */
            _.prototype.update = function (context, frameState, commandList) {

                if (!Cesium.defined(this.ellipsoid)) {
                    throw new Cesium.DeveloperError('this.ellipsoid must be defined.');
                }

                if (!Cesium.defined(this.appearance)) {
                    throw new Cesium.DeveloperError('this.material must be defined.');
                }

                if (this.granularity < 0.0) {
                    throw new Cesium.DeveloperError('this.granularity and scene2D/scene3D overrides must be greater than zero.');
                }

                if (!this.show) {
                    return;
                }

                if (!this._createPrimitive && (!Cesium.defined(this._primitive))) {
                    // No positions/hierarchy to draw
                    return;
                }

                if (this._createPrimitive ||
                    (this._ellipsoid !== this.ellipsoid) ||
                    (this._granularity !== this.granularity) ||
                    (this._height !== this.height) ||
                    (this._textureRotationAngle !== this.textureRotationAngle) ||
                    (this._id !== this.id)) {

                    let geometry = this.getGeometry();
                    if (!geometry) {
                        return;
                    }

                    this._createPrimitive = false;
                    this._ellipsoid = this.ellipsoid;
                    this._granularity = this.granularity;
                    this._height = this.height;
                    this._textureRotationAngle = this.textureRotationAngle;
                    this._id = this.id;

                    this._primitive = this._primitive && this._primitive.destroy();

                    this._primitive = new Cesium.Primitive({
                        geometryInstances: new Cesium.GeometryInstance({
                            geometry: geometry,
                            id: this.id,
                            pickPrimitive: this
                        }),
                        appearance: this.appearance,
                        asynchronous: this.asynchronous
                    });

                    this._outlinePolygon = this._outlinePolygon && this._outlinePolygon.destroy();
                    if (this.strokeColor && this.getOutlineGeometry) {
                        // create the highlighting frame
                        this._outlinePolygon = new Cesium.Primitive({
                            geometryInstances: new Cesium.GeometryInstance({
                                geometry: this.getOutlineGeometry(),
                                attributes: {
                                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(this.strokeColor)
                                }
                            }),
                            appearance: new Cesium.PerInstanceColorAppearance({
                                flat: true,
                                renderState: {
                                    depthTest: {
                                        enabled: true
                                    },
                                    //lineWidth : Math.min(this.strokeWidth || 4.0, context._aliasedLineWidthRange[1])
                                    lineWidth: Math.min(this.strokeWidth)
                                }
                            })
                        });
                    }
                }

                let primitive = this._primitive;
                primitive.appearance.material = this.material;
                primitive.debugShowBoundingVolume = this.debugShowBoundingVolume;
                primitive.update(context, frameState, commandList);
                this._outlinePolygon && this._outlinePolygon.update(context, frameState, commandList);

            };

            _.prototype.isDestroyed = function () {
                return false;
            };

            _.prototype.destroy = function () {
                this._primitive = this._primitive && this._primitive.destroy();
                return Cesium.destroyObject(this);
            };

            _.prototype.setStrokeStyle = function (strokeColor, strokeWidth) {
                if (!this.strokeColor || !this.strokeColor.equals(strokeColor) || this.strokeWidth != strokeWidth) {
                    this._createPrimitive = true;
                    this.strokeColor = strokeColor;
                    this.strokeWidth = strokeWidth;
                }
            }

            return _;
        })();

        _.ExtentPrimitive = (function () {
            function _(options) {

                if (!Cesium.defined(options.extent)) {
                    throw new Cesium.DeveloperError('Extent is required');
                }

                options = copyOptions(options, defaultSurfaceOptions);

                this.initialiseOptions(options);

                this.setExtent(options.extent);

            }

            _.prototype = new ChangeablePrimitive();

            _.prototype.setExtent = function (extent) {
                this.setAttribute('extent', extent);
            };

            _.prototype.getExtent = function () {
                return this.getAttribute('extent');
            };

            _.prototype.getGeometry = function () {

                if (!Cesium.defined(this.extent)) {
                    return;
                }

                return new Cesium.RectangleGeometry({
                    rectangle: this.extent,
                    height: this.height,
                    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                    stRotation: this.textureRotationAngle,
                    ellipsoid: this.ellipsoid,
                    granularity: this.granularity
                });
            };

            _.prototype.getOutlineGeometry = function () {
                return new Cesium.RectangleOutlineGeometry({
                    rectangle: this.extent
                });
            }

            return _;
        })();

        _.PolygonPrimitive = (function () {

            function _(options) {

                options = copyOptions(options, defaultSurfaceOptions);

                this.initialiseOptions(options);

                this.isPolygon = true;

            }

            _.prototype = new ChangeablePrimitive();

            _.prototype.setPositions = function (positions) {
                this.setAttribute('positions', positions);
            };

            _.prototype.getPositions = function () {
                return this.getAttribute('positions');
            };

            _.prototype.getGeometry = function () {

                if (!Cesium.defined(this.positions) || this.positions.length < 3) {
                    return;
                }

                return Cesium.PolygonGeometry.fromPositions({
                    positions: this.positions,
                    height: this.height,
                    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                    stRotation: this.textureRotationAngle,
                    ellipsoid: this.ellipsoid,
                    granularity: this.granularity
                });
            };

            _.prototype.getOutlineGeometry = function () {
                return Cesium.PolygonOutlineGeometry.fromPositions({
                    positions: this.getPositions()
                });
            }

            return _;
        })();

        _.CirclePrimitive = (function () {

            function _(options) {

                if (!(Cesium.defined(options.center) && Cesium.defined(options.radius))) {
                    throw new Cesium.DeveloperError('Center and radius are required');
                }

                options = copyOptions(options, defaultSurfaceOptions);

                this.initialiseOptions(options);

                this.setRadius(options.radius);

            }

            _.prototype = new ChangeablePrimitive();

            _.prototype.setCenter = function (center) {
                this.setAttribute('center', center);
            };

            _.prototype.setRadius = function (radius) {
                this.setAttribute('radius', Math.max(0.1, radius));
            };

            _.prototype.getCenter = function () {
                return this.getAttribute('center');
            };

            _.prototype.getRadius = function () {
                return this.getAttribute('radius');
            };

            _.prototype.getGeometry = function () {

                if (!(Cesium.defined(this.center) && Cesium.defined(this.radius))) {
                    return;
                }

                return new Cesium.CircleGeometry({
                    center: this.center,
                    radius: this.radius,
                    height: this.height,
                    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                    stRotation: this.textureRotationAngle,
                    ellipsoid: this.ellipsoid,
                    granularity: this.granularity
                });
            };

            _.prototype.getOutlineGeometry = function () {
                return new Cesium.CircleOutlineGeometry({
                    center: this.getCenter(),
                    radius: this.getRadius()
                });
            }

            return _;
        })();

        _.EllipsePrimitive = (function () {
            function _(options) {

                if (!(Cesium.defined(options.center) && Cesium.defined(options.semiMajorAxis) && Cesium.defined(options.semiMinorAxis))) {
                    throw new Cesium.DeveloperError('Center and semi major and semi minor axis are required');
                }

                options = copyOptions(options, defaultEllipseOptions);

                this.initialiseOptions(options);

            }

            _.prototype = new ChangeablePrimitive();

            _.prototype.setCenter = function (center) {
                this.setAttribute('center', center);
            };

            _.prototype.setSemiMajorAxis = function (semiMajorAxis) {
                if (semiMajorAxis < this.getSemiMinorAxis()) return;
                this.setAttribute('semiMajorAxis', semiMajorAxis);
            };

            _.prototype.setSemiMinorAxis = function (semiMinorAxis) {
                if (semiMinorAxis > this.getSemiMajorAxis()) return;
                this.setAttribute('semiMinorAxis', semiMinorAxis);
            };

            _.prototype.setRotation = function (rotation) {
                return this.setAttribute('rotation', rotation);
            };

            _.prototype.getCenter = function () {
                return this.getAttribute('center');
            };

            _.prototype.getSemiMajorAxis = function () {
                return this.getAttribute('semiMajorAxis');
            };

            _.prototype.getSemiMinorAxis = function () {
                return this.getAttribute('semiMinorAxis');
            };

            _.prototype.getRotation = function () {
                return this.getAttribute('rotation');
            };

            _.prototype.getGeometry = function () {

                if (!(Cesium.defined(this.center) && Cesium.defined(this.semiMajorAxis) && Cesium.defined(this.semiMinorAxis))) {
                    return;
                }

                return new Cesium.EllipseGeometry({
                    ellipsoid: this.ellipsoid,
                    center: this.center,
                    semiMajorAxis: this.semiMajorAxis,
                    semiMinorAxis: this.semiMinorAxis,
                    rotation: this.rotation,
                    height: this.height,
                    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                    stRotation: this.textureRotationAngle,
                    ellipsoid: this.ellipsoid,
                    granularity: this.granularity
                });
            };

            _.prototype.getOutlineGeometry = function () {
                return new Cesium.EllipseOutlineGeometry({
                    center: this.getCenter(),
                    semiMajorAxis: this.getSemiMajorAxis(),
                    semiMinorAxis: this.getSemiMinorAxis(),
                    rotation: this.getRotation()
                });
            }

            return _;
        })();

        _.PolylinePrimitive = (function () {

            function _(options) {

                options = copyOptions(options, defaultPolylineOptions);

                this.initialiseOptions(options);

            }

            _.prototype = new ChangeablePrimitive();

            _.prototype.setPositions = function (positions) {
                this.setAttribute('positions', positions);
            };

            _.prototype.setWidth = function (width) {
                this.setAttribute('width', width);
            };

            _.prototype.setGeodesic = function (geodesic) {
                this.setAttribute('geodesic', geodesic);
            };

            _.prototype.getPositions = function () {
                return this.getAttribute('positions');
            };

            _.prototype.getWidth = function () {
                return this.getAttribute('width');
            };

            _.prototype.getGeodesic = function (geodesic) {
                return this.getAttribute('geodesic');
            };

            _.prototype.getGeometry = function () {

                if (!Cesium.defined(this.positions) || this.positions.length < 2) {
                    return;
                }

                return new Cesium.PolylineGeometry({
                    positions: this.positions,
                    height: this.height,
                    width: this.width < 1 ? 1 : this.width,
                    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                    ellipsoid: this.ellipsoid
                });
            }

            return _;
        })();

        let defaultBillboard = {
            iconUrl: "./images/drawhelper/dragIcon.png",
            shiftX: 0,
            shiftY: 0
        }

        let dragBillboard = {
            iconUrl: "./images/drawhelper/dragIcon.png",
            shiftX: 0,
            shiftY: 0
        }

        let dragHalfBillboard = {
            iconUrl: "./images/drawhelper/dragIconLight.png",
            shiftX: 0,
            shiftY: 0
        }

        _.prototype.createBillboardGroup = function (points, options, callbacks) {
            let markers = new _.BillboardGroup(this, options);
            markers.addBillboards(points, callbacks);
            return markers;
        }

        _.BillboardGroup = function (drawHelper, options) {

            this._drawHelper = drawHelper;
            this._scene = drawHelper._scene;

            this._options = copyOptions(options, defaultBillboard);

            // create one common billboard collection for all billboards
            var b = new Cesium.BillboardCollection();
            billboardCollection.push(b)
            scene.primitives.add(b);
            this._billboards = b;
            // keep an ordered list of billboards
            this._orderedBillboards = [];
        }

        _.BillboardGroup.prototype.createBillboard = function (position, callbacks) {

            let billboard = this._billboards.add({
                show: true,
                position: position,
                pixelOffset: new Cesium.Cartesian2(this._options.shiftX, this._options.shiftY),
                eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                scale: 1.0,
                image: this._options.iconUrl,
                color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            });

            // if editable
            if (callbacks) {
                let _self = this;
                let screenSpaceCameraController = this._scene.screenSpaceCameraController;

                function enableRotation(enable) {
                    screenSpaceCameraController.enableRotate = enable;
                }

                function getIndex() {
                    // find index
                    for (var i = 0,
                             I = _self._orderedBillboards.length; i < I && _self._orderedBillboards[i] != billboard; ++i);
                    return i;
                }

                if (callbacks.dragHandlers) {
                    let _self = this;
                    setListener(billboard, 'leftDown', function (position) {
                        // TODO - start the drag handlers here
                        // create handlers for mouseOut and leftUp for the billboard and a mouseMove
                        function onDrag(position) {
                            billboard.position = position;
                            // find index
                            for (let i = 0,
                                     I = _self._orderedBillboards.length; i < I && _self._orderedBillboards[i] != billboard; ++i);
                            callbacks.dragHandlers.onDrag && callbacks.dragHandlers.onDrag(getIndex(), position);
                        }

                        function onDragEnd(position) {
                            handler.destroy()
                            enableRotation(true)
                            callbacks.dragHandlers.onDragEnd && callbacks.dragHandlers.onDragEnd(getIndex(), position);
                        }

                        let handler = new Cesium.ScreenSpaceEventHandler(_self._scene.canvas);

                        handler.setInputAction(function (movement) {
                            let cartesian = _self._scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                            if (cartesian) {
                                onDrag(cartesian)
                            } else {
                                onDragEnd(cartesian)
                            }
                        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

                        handler.setInputAction(function (movement) {
                            onDragEnd(_self._scene.camera.pickEllipsoid(movement.position, ellipsoid))
                        }, Cesium.ScreenSpaceEventType.LEFT_UP);

                        enableRotation(false);

                        callbacks.dragHandlers.onDragStart && callbacks.dragHandlers.onDragStart(getIndex(), _self._scene.camera.pickEllipsoid(position, ellipsoid));
                    });
                }
                if (callbacks.onDoubleClick) {
                    setListener(billboard, 'leftDoubleClick', function (position) {
                        callbacks.onDoubleClick(getIndex())
                    });
                }
                if (callbacks.onClick) {
                    setListener(billboard, 'leftClick', function (position) {
                        callbacks.onClick(getIndex())
                    });
                }
                if (callbacks.tooltip) {
                    setListener(billboard, 'mouseMove', function (position) {
                        _self._drawHelper._tooltip.showAt(position, callbacks.tooltip());
                    });
                    setListener(billboard, 'mouseOut', function (position) {
                        _self._drawHelper._tooltip.setVisible(false)
                    });
                }
            }

            return billboard;
        }
        //
        _.BillboardGroup.prototype.insertBillboard = function (index, position, callbacks) {
            this._orderedBillboards.splice(index, 0, this.createBillboard(position, callbacks));
        }

        _.BillboardGroup.prototype.addBillboard = function (position, callbacks) {
            this._orderedBillboards.push(this.createBillboard(position, callbacks));
        }

        _.BillboardGroup.prototype.addBillboards = function (positions, callbacks) {
            let index = 0;
            for (; index < positions.length; index++) {
                this.addBillboard(positions[index], callbacks);
            }
        }

        _.BillboardGroup.prototype.updateBillboardsPositions = function (positions) {
            let index = 0;
            for (; index < positions.length; index++) {
                this.getBillboard(index).position = positions[index];
            }
        }

        _.BillboardGroup.prototype.countBillboards = function () {
            return this._orderedBillboards.length;
        }

        _.BillboardGroup.prototype.getBillboard = function (index) {
            return this._orderedBillboards[index];
        }

        _.BillboardGroup.prototype.removeBillboard = function (index) {
            this._billboards.remove(this.getBillboard(index));
            this._orderedBillboards.splice(index, 1);
        }

        _.BillboardGroup.prototype.remove = function () {
            this._billboards = this._billboards && this._billboards.removeAll() && this._billboards.destroy();
        }

        _.BillboardGroup.prototype.setOnTop = function () {
            this._scene.primitives.raiseToTop(this._billboards);
        }

        _.prototype.startDrawingMarker = function (options) {

            let opts = copyOptions(options, defaultBillboard);

            this.startDrawing(
                function () {
                    markers.remove();
                    mouseHandler.destroy();
                    tooltip.setVisible(false);
                }
            );

            let _self = this;
            let scene = this._scene;
            let primitives = scene.primitives;
            let tooltip = this._tooltip;

            let markers = new _.BillboardGroup(this, opts);

            let mouseHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

            // Now wait for start
            mouseHandler.setInputAction(function (movement) {
                if (movement.position != null) {
                    let cartesian = scene.camera.pickEllipsoid(movement.position, ellipsoid);
                    if (cartesian) {
                        markers.addBillboard(cartesian);
                        _self.stopDrawing();
                        opts.callback(cartesian);
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            mouseHandler.setInputAction(function (movement) {
                let position = movement.endPosition;
                if (position != null) {
                    let cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
                    if (cartesian) {
                        tooltip.showAt(position, "<p>点击添加标记 位置是: </p>" + getDisplayLatLngString(ellipsoid.cartesianToCartographic(cartesian)));
                    } else {
                        tooltip.showAt(position, "<p>点击添加标记</p>");
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        }

        _.prototype.startDrawingPolygon = function (options) {
            let opts = copyOptions(options, defaultSurfaceOptions);
            this.startDrawingPolyshape(true, opts);
        }

        _.prototype.startDrawingPolyline = function (options) {
            let opts = copyOptions(options, defaultPolylineOptions);
            this.startDrawingPolyshape(false, opts);
        }

        _.prototype.startDrawingPolyshape = function (isPolygon, options) {

            this.startDrawing(
                function () {
                    primitives.remove(poly);
                    markers.remove();
                    mouseHandler.destroy();
                    tooltip.setVisible(false);
                }
            );

            let _self = this;
            let scene = this._scene;
            let primitives = scene.primitives;
            let tooltip = this._tooltip;

            let minPoints = isPolygon ? 3 : 2;
            let poly;
            if (isPolygon) {
                poly = new we.drawHelper.PolygonPrimitive(options);
            } else {
                poly = new we.drawHelper.PolylinePrimitive(options);
            }
            poly.asynchronous = false;
            primitives.add(poly);

            let positions = [];
            let markers = new _.BillboardGroup(this, defaultBillboard);

            let mouseHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

            // Now wait for start
            mouseHandler.setInputAction(function (movement) {
                if (movement.position != null) {
                    let cartesian = scene.camera.pickEllipsoid(movement.position, ellipsoid);
                    if (cartesian) {
                        // first click
                        if (positions.length == 0) {
                            positions.push(cartesian.clone());
                            markers.addBillboard(positions[0]);
                        }
                        if (positions.length >= minPoints) {
                            poly.positions = positions;
                            poly._createPrimitive = true;
                        }
                        // add new point to polygon
                        // this one will move with the mouse
                        positions.push(cartesian);
                        // add marker at the new position
                        markers.addBillboard(cartesian);
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            mouseHandler.setInputAction(function (movement) {
                let position = movement.endPosition;
                if (position != null) {
                    if (positions.length == 0) {
                        tooltip.showAt(position, "<p>添加第一个点</p>");
                    } else {
                        let cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
                        if (cartesian) {
                            positions.pop();
                            // make sure it is slightly different
                            cartesian.y += (1 + Math.random());
                            positions.push(cartesian);
                            if (positions.length >= minPoints) {
                                poly.positions = positions;
                                poly._createPrimitive = true;
                            }
                            // update marker
                            markers.getBillboard(positions.length - 1).position = cartesian;
                            // show tooltip
                            tooltip.showAt(position, "<p>添加一个新的坐标点 (" + positions.length + ")</p>" + (positions.length > minPoints ? "<p>双击完成多边形绘制</p>" : ""));
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            mouseHandler.setInputAction(function (movement) {
                let position = movement.position;
                if (position != null) {
                    if (positions.length < minPoints + 2) {
                        return;
                    } else {
                        let cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
                        if (cartesian) {
                            _self.stopDrawing();
                            if (typeof options.callback == 'function') {
                                // remove overlapping ones
                                let index = positions.length - 1;
                                options.callback(positions);
                            }
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        }

        function getExtentCorners(value) {
            return ellipsoid.cartographicArrayToCartesianArray([Cesium.Rectangle.northwest(value), Cesium.Rectangle.northeast(value), Cesium.Rectangle.southeast(value), Cesium.Rectangle.southwest(value)]);
        }

        _.prototype.startDrawingExtent = function (options) {

            let opts = copyOptions(options, defaultSurfaceOptions);

            this.startDrawing(
                function () {
                    if (extent != null) {
                        primitives.remove(extent);
                    }
                    markers.remove();
                    mouseHandler.destroy();
                    tooltip.setVisible(false);
                }
            );

            let _self = this;
            let scene = this._scene;
            let primitives = this._scene.primitives;
            let tooltip = this._tooltip;

            let firstPoint = null;
            let extent = null;
            let markers = null;

            let mouseHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

            function updateExtent(value) {
                if (extent == null) {
                    extent = new Cesium.Primitive();
                    extent.asynchronous = false;
                    primitives.add(extent);
                }
                extent.rectangle = value;
                // update the markers
                let corners = getExtentCorners(value);
                // create if they do not yet exist
                if (markers == null) {
                    markers = new _.BillboardGroup(_self, defaultBillboard);
                    markers.addBillboards(corners);
                } else {
                    markers.updateBillboardsPositions(corners);
                }
            }

            // Now wait for start
            mouseHandler.setInputAction(function (movement) {
                if (movement.position != null) {
                    let cartesian = scene.camera.pickEllipsoid(movement.position, ellipsoid);
                    if (cartesian) {
                        if (extent == null) {
                            // create the rectangle
                            firstPoint = ellipsoid.cartesianToCartographic(cartesian);
                            let value = getExtent(firstPoint, firstPoint);
                            updateExtent(value);
                        } else {
                            _self.stopDrawing();
                            if (typeof opts.callback == 'function') {
                                opts.callback(getExtent(firstPoint, ellipsoid.cartesianToCartographic(cartesian)));
                            }
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

            mouseHandler.setInputAction(function (movement) {
                let position = movement.endPosition;
                if (position != null) {
                    if (extent == null) {
                        tooltip.showAt(position, "<p>点击添加矩形坐标点</p>");
                    } else {
                        let cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
                        if (cartesian) {
                            let value = getExtent(firstPoint, ellipsoid.cartesianToCartographic(cartesian));
                            updateExtent(value);
                            tooltip.showAt(position, "<p>拖动改变矩形大小</p><p>点击完成矩形绘制</p>");
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        }

        _.prototype.startDrawingCircle = function (options) {

            let opts = copyOptions(options, defaultSurfaceOptions);

            this.startDrawing(
                function cleanUp() {
                    if (circle != null) {
                        primitives.remove(circle);
                    }
                    markers.remove();
                    mouseHandler.destroy();
                    tooltip.setVisible(false);
                }
            );

            let _self = this;
            let scene = this._scene;
            let primitives = this._scene.primitives;
            let tooltip = this._tooltip;

            let circle = null;
            let markers = null;

            let mouseHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

            // Now wait for start
            mouseHandler.setInputAction(function (movement) {
                if (movement.position != null) {
                    let cartesian = scene.camera.pickEllipsoid(movement.position, ellipsoid);
                    if (cartesian) {
                        if (circle == null) {
                            // create the circle
                            circle = new _.CirclePrimitive({
                                center: cartesian,
                                radius: 0,
                                asynchronous: false,
                                material: opts.material
                            });
                            primitives.add(circle);
                            markers = new _.BillboardGroup(_self, defaultBillboard);
                            markers.addBillboards([cartesian]);
                        } else {
                            if (typeof opts.callback == 'function') {
                                opts.callback(circle.getCenter(), circle.getRadius());
                            }
                            _self.stopDrawing();
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

            mouseHandler.setInputAction(function (movement) {
                let position = movement.endPosition;
                if (position != null) {
                    if (circle == null) {
                        tooltip.showAt(position, "<p>添加圆心点</p>");
                    } else {
                        let cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
                        if (cartesian) {
                            circle.setRadius(Cesium.Cartesian3.distance(circle.getCenter(), cartesian));
                            markers.updateBillboardsPositions(cartesian);
                            tooltip.showAt(position, "<p>移动鼠标改变圆半径</p><p>点击完成绘制圆</p>");
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        }

        _.prototype.enhancePrimitives = function () {

            let drawHelper = this;

            Cesium.Billboard.prototype.setEditable = function () {

                if (this._editable) {
                    return;
                }

                this._editable = true;

                let billboard = this;

                let _self = this;

                function enableRotation(enable) {
                    drawHelper._scene.screenSpaceCameraController.enableRotate = enable;
                }

                setListener(billboard, 'leftDown', function (position) {
                    // TODO - start the drag handlers here
                    // create handlers for mouseOut and leftUp for the billboard and a mouseMove
                    function onDrag(position) {
                        billboard.position = position;
                        _self.executeListeners({name: 'drag', positions: position})
                    }

                    var handler = new Cesium.ScreenSpaceEventHandler(drawHelper._scene.canvas)
                    function onDragEnd(position) {
                        handler.destroy();
                        enableRotation(true);
                        _self.executeListeners({name: 'dragEnd', positions: position})
                    }
                    handler.setInputAction(function (movement) {
                        let cartesian = drawHelper._scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                        if (cartesian) {
                            onDrag(cartesian)
                        } else {
                            onDragEnd(cartesian)
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

                    handler.setInputAction(function (movement) {
                        onDragEnd(drawHelper._scene.camera.pickEllipsoid(movement.position, ellipsoid))
                    }, Cesium.ScreenSpaceEventType.LEFT_UP)

                    enableRotation(false);

                })

                setListener(billboard, 'leftDoubleClick', function (position) {
                    if (typeof drawHelper.editEvent === 'function')
                        drawHelper.editEvent('marker', function (options) {
                            billboard.image = options.image
                            // if (options.markerText) {
                            //     var labels = scene.primitives.add(new Cesium.LabelCollection());
                            //     labels.add({
                            //         position : billboard.position,
                            //         text : options.markerText
                            //     });
                            // }
                        })
                })

                enhanceWithListeners(billboard);

            }

            function setHighlighted(highlighted) {

                let scene = drawHelper._scene;

                // if no change
                // if already highlighted, the outline polygon will be available
                if (this._highlighted && this._highlighted == highlighted) {
                    return;
                }
                // disable if already in edit mode
                if (this._editMode === true) {
                    return;
                }
                this._highlighted = highlighted;
                // highlight by creating an outline polygon matching the polygon points
                if (highlighted) {
                    // make sure all other shapes are not highlighted
                    drawHelper.setHighlighted(this);
                    this._strokeColor = this.strokeColor;
                    this.setStrokeStyle(Cesium.Color.fromCssColorString('white'), this.strokeWidth);
                } else {
                    if (this._strokeColor) {
                        this.setStrokeStyle(this._strokeColor, this.strokeWidth);
                    } else {
                        this.setStrokeStyle(undefined, undefined);
                    }
                }
            }

            function setEditMode(editMode) {
                // if no change
                if (this._editMode == editMode) {
                    return;
                }
                // make sure all other shapes are not in edit mode before starting the editing of this shape
                drawHelper.disableAllHighlights();
                // display markers
                if (editMode) {
                    drawHelper.setEdited(this);
                    let scene = drawHelper._scene;
                    let _self = this;
                    // create the markers and handlers for the editing
                    if (this._markers == null) {
                        let markers = new _.BillboardGroup(drawHelper, dragBillboard);
                        let editMarkers = new _.BillboardGroup(drawHelper, dragHalfBillboard);
                        // function for updating the edit markers around a certain point
                        function updateHalfMarkers(index, positions) {
                            // update the half markers before and after the index
                            let editIndex = index - 1 < 0 ? positions.length - 1 : index - 1;
                            if (editIndex < editMarkers.countBillboards()) {
                                editMarkers.getBillboard(editIndex).position = calculateHalfMarkerPosition(editIndex);
                            }
                            editIndex = index;
                            if (editIndex < editMarkers.countBillboards()) {
                                editMarkers.getBillboard(editIndex).position = calculateHalfMarkerPosition(editIndex);
                            }
                        }

                        function onEdited() {
                            _self.executeListeners({name: 'onEdited', positions: _self.positions});
                        }

                        let handleMarkerChanges = {
                            dragHandlers: {
                                onDrag: function (index, position) {
                                    _self.positions[index] = position;
                                    updateHalfMarkers(index, _self.positions);
                                    _self._createPrimitive = true;
                                },
                                onDragEnd: function (index, position) {
                                    _self._createPrimitive = true;
                                    onEdited();
                                }
                            },
                            onDoubleClick: function (index) {
                                if (_self.positions.length < 4) {
                                    return;
                                }
                                // remove the point and the corresponding markers
                                _self.positions.splice(index, 1);
                                _self._createPrimitive = true;
                                markers.removeBillboard(index);
                                editMarkers.removeBillboard(index);
                                updateHalfMarkers(index, _self.positions);
                                onEdited();
                            },
                            tooltip: function () {
                                if (_self.positions.length > 3) {
                                    return "双击移除该点";
                                }
                            }
                        };
                        // add billboards and keep an ordered list of them for the polygon edges
                        markers.addBillboards(_self.positions, handleMarkerChanges);
                        this._markers = markers;
                        function calculateHalfMarkerPosition(index) {
                            let positions = _self.positions;
                            return ellipsoid.cartographicToCartesian(
                                new Cesium.EllipsoidGeodesic(ellipsoid.cartesianToCartographic(positions[index]),
                                    ellipsoid.cartesianToCartographic(positions[index < positions.length - 1 ? index + 1 : 0])).interpolateUsingFraction(0.5)
                            );
                        }

                        let halfPositions = [];
                        let index = 0;
                        let length = _self.positions.length + (this.isPolygon ? 0 : -1);
                        for (; index < length; index++) {
                            halfPositions.push(calculateHalfMarkerPosition(index));
                        }
                        let handleEditMarkerChanges = {
                            dragHandlers: {
                                onDragStart: function (index, position) {
                                    // add a new position to the polygon but not a new marker yet
                                    this.index = index + 1;
                                    _self.positions.splice(this.index, 0, position);
                                    _self._createPrimitive = true;
                                },
                                onDrag: function (index, position) {
                                    _self.positions[this.index] = position;
                                    _self._createPrimitive = true;
                                },
                                onDragEnd: function (index, position) {
                                    // create new sets of makers for editing
                                    markers.insertBillboard(this.index, position, handleMarkerChanges);
                                    editMarkers.getBillboard(this.index - 1).position = calculateHalfMarkerPosition(this.index - 1);
                                    editMarkers.insertBillboard(this.index, calculateHalfMarkerPosition(this.index), handleEditMarkerChanges);
                                    _self._createPrimitive = true;
                                    onEdited();
                                }
                            },
                            tooltip: function () {
                                return "拖动添加一个新的点";
                            }
                        };
                        editMarkers.addBillboards(halfPositions, handleEditMarkerChanges);
                        this._editMarkers = editMarkers;
                        // add a handler for clicking in the globe
                        this._globeClickhandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
                        this._globeClickhandler.setInputAction(
                            function (movement) {
                                let pickedObject = scene.pick(movement.position);
                                if (!(pickedObject && pickedObject.primitive)) {
                                    _self.setEditMode(false);
                                }
                            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

                        // set on top of the polygon
                        markers.setOnTop();
                        editMarkers.setOnTop();
                    }
                    this._editMode = true;
                } else {
                    if (this._markers != null) {
                        this._markers.remove();
                        this._editMarkers.remove();
                        this._markers = null;
                        this._editMarkers = null;
                        this._globeClickhandler.destroy();
                    }
                    this._editMode = false;
                }

            }

            we.drawHelper.PolylinePrimitive.prototype.setEditable = function () {

                if (this.setEditMode) {
                    return;
                }

                let polyline = this;
                polyline.isPolygon = false;
                polyline.asynchronous = false;

                // 莫缕敏添加
                polyline.primitiveType = 'polyline';

                drawHelper.registerEditableShape(polyline);

                polyline.setEditMode = setEditMode;

                let originalWidth = this.width;

                polyline.setHighlighted = function (highlighted) {
                    // disable if already in edit mode
                    if (this._editMode === true) {
                        return;
                    }
                    if (highlighted) {
                        drawHelper.setHighlighted(this);
                        this.setWidth(originalWidth * 2);
                    } else {
                        this.setWidth(originalWidth);
                    }
                }

                polyline.getExtent = function () {
                    return Cesium.Extent.fromCartographicArray(ellipsoid.cartesianArrayToCartographicArray(this.positions));
                }

                enhanceWithListeners(polyline);

                polyline.setEditMode(false);

            }

            we.drawHelper.PolygonPrimitive.prototype.setEditable = function () {

                let polygon = this;
                polygon.asynchronous = false;

                let scene = drawHelper._scene;

                // 莫缕敏添加
                polygon.primitiveType = 'polygon';

                drawHelper.registerEditableShape(polygon);

                polygon.setEditMode = setEditMode;

                polygon.setHighlighted = setHighlighted;

                enhanceWithListeners(polygon);

                polygon.setEditMode(false);

            }

            we.drawHelper.ExtentPrimitive.prototype.setEditable = function () {

                if (this.setEditMode) {
                    return;
                }

                let extent = this;
                let scene = drawHelper._scene;

                drawHelper.registerEditableShape(extent);
                extent.asynchronous = false;

                // 莫缕敏添加
                extent.primitiveType = 'extent';

                extent.setEditMode = function (editMode) {
                    // if no change
                    if (this._editMode == editMode) {
                        return;
                    }
                    drawHelper.disableAllHighlights();
                    // display markers
                    if (editMode) {
                        // make sure all other shapes are not in edit mode before starting the editing of this shape
                        drawHelper.setEdited(this);
                        // create the markers and handlers for the editing
                        if (this._markers == null) {
                            let markers = new _.BillboardGroup(drawHelper, dragBillboard);

                            function onEdited() {
                                extent.executeListeners({name: 'onEdited', extent: extent.extent});
                            }

                            let handleMarkerChanges = {
                                dragHandlers: {
                                    onDrag: function (index, position) {
                                        let corner = markers.getBillboard((index + 2) % 4).position;
                                        extent.setExtent(getExtent(ellipsoid.cartesianToCartographic(corner), ellipsoid.cartesianToCartographic(position)));
                                        markers.updateBillboardsPositions(getExtentCorners(extent.extent));
                                    },
                                    onDragEnd: function (index, position) {
                                        onEdited();
                                    }
                                },
                                tooltip: function () {
                                    return "拖动改变矩形中心点";
                                }
                            };
                            markers.addBillboards(getExtentCorners(extent.extent), handleMarkerChanges);
                            this._markers = markers;
                            // add a handler for clicking in the globe
                            this._globeClickhandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
                            this._globeClickhandler.setInputAction(
                                function (movement) {
                                    let pickedObject = scene.pick(movement.position);
                                    // disable edit if pickedobject is different or not an object
                                    if (!(pickedObject && !pickedObject.isDestroyed() && pickedObject.primitive)) {
                                        extent.setEditMode(false);
                                    }
                                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

                            // set on top of the polygon
                            markers.setOnTop();
                        }
                        this._editMode = true;
                    } else {
                        if (this._markers != null) {
                            this._markers.remove();
                            this._markers = null;
                            this._globeClickhandler.destroy();
                        }
                        this._editMode = false;
                    }
                }

                extent.setHighlighted = setHighlighted;

                enhanceWithListeners(extent);

                extent.setEditMode(false);

            }

            _.EllipsePrimitive.prototype.setEditable = function () {

                if (this.setEditMode) {
                    return;
                }

                let ellipse = this;
                let scene = drawHelper._scene;

                ellipse.asynchronous = false;

                // 莫缕敏添加
                ellipse.primitiveType = 'ellipse';

                drawHelper.registerEditableShape(ellipse);

                ellipse.setEditMode = function (editMode) {
                    // if no change
                    if (this._editMode == editMode) {
                        return;
                    }
                    drawHelper.disableAllHighlights();
                    // display markers
                    if (editMode) {
                        // make sure all other shapes are not in edit mode before starting the editing of this shape
                        drawHelper.setEdited(this);
                        let _self = this;
                        // create the markers and handlers for the editing
                        if (this._markers == null) {
                            let markers = new _.BillboardGroup(drawHelper, dragBillboard);

                            function getMarkerPositions() {
                                return Cesium.Shapes.computeEllipseBoundary(ellipsoid, ellipse.getCenter(), ellipse.getSemiMajorAxis(), ellipse.getSemiMinorAxis(), ellipse.getRotation() + Math.PI / 2, Math.PI / 2.0).splice(0, 4);
                            }

                            function onEdited() {
                                ellipse.executeListeners({
                                    name: 'onEdited',
                                    center: ellipse.getCenter(),
                                    semiMajorAxis: ellipse.getSemiMajorAxis(),
                                    semiMinorAxis: ellipse.getSemiMinorAxis(),
                                    rotation: 0
                                });
                            }

                            let handleMarkerChanges = {
                                dragHandlers: {
                                    onDrag: function (index, position) {
                                        let distance = Cesium.Cartesian3.distance(ellipse.getCenter(), position);
                                        if (index % 2 == 0) {
                                            ellipse.setSemiMajorAxis(distance);
                                        } else {
                                            ellipse.setSemiMinorAxis(distance);
                                        }
                                        markers.updateBillboardsPositions(getMarkerPositions());
                                    },
                                    onDragEnd: function (index, position) {
                                        onEdited();
                                    }
                                },
                                tooltip: function () {
                                    return "Drag to change the excentricity and radius";
                                }
                            };
                            markers.addBillboards(getMarkerPositions(), handleMarkerChanges);
                            this._markers = markers;
                            // add a handler for clicking in the globe
                            this._globeClickhandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
                            this._globeClickhandler.setInputAction(
                                function (movement) {
                                    let pickedObject = scene.pick(movement.position);
                                    if (!(pickedObject && pickedObject.primitive)) {
                                        _self.setEditMode(false);
                                    }
                                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

                            // set on top of the polygon
                            markers.setOnTop();
                        }
                        this._editMode = true;
                    } else {
                        if (this._markers != null) {
                            this._markers.remove();
                            this._markers = null;
                            this._globeClickhandler.destroy();
                        }
                        this._editMode = false;
                    }
                }

                ellipse.setHighlighted = setHighlighted;

                enhanceWithListeners(ellipse);

                ellipse.setEditMode(false);
            }

            _.CirclePrimitive.prototype.getCircleCartesianCoordinates = function (granularity) {
                let geometry = Cesium.CircleOutlineGeometry.createGeometry(new Cesium.CircleOutlineGeometry({
                    ellipsoid: ellipsoid,
                    center: this.getCenter(),
                    radius: this.getRadius(),
                    granularity: granularity
                }));
                let count = 0, value, values = [];
                for (; count < geometry.attributes.position.values.length; count += 3) {
                    value = geometry.attributes.position.values;
                    values.push(new Cesium.Cartesian3(value[count], value[count + 1], value[count + 2]));
                }
                return values;
            };

            _.CirclePrimitive.prototype.setEditable = function () {

                if (this.setEditMode) {
                    return;
                }

                let circle = this;
                let scene = drawHelper._scene;

                circle.asynchronous = false;

                // 莫缕敏添加
                circle.primitiveType = 'circle';

                drawHelper.registerEditableShape(circle);

                circle.setEditMode = function (editMode) {
                    // if no change
                    if (this._editMode == editMode) {
                        return;
                    }
                    drawHelper.disableAllHighlights();
                    // display markers
                    if (editMode) {
                        // make sure all other shapes are not in edit mode before starting the editing of this shape
                        drawHelper.setEdited(this);
                        let _self = this;
                        // create the markers and handlers for the editing
                        if (this._markers == null) {
                            let markers = new _.BillboardGroup(drawHelper, dragBillboard);

                            function getMarkerPositions() {
                                return _self.getCircleCartesianCoordinates(Cesium.Math.PI_OVER_TWO);
                            }

                            function onEdited() {
                                circle.executeListeners({
                                    name: 'onEdited',
                                    center: circle.getCenter(),
                                    radius: circle.getRadius()
                                });
                            }

                            let handleMarkerChanges = {
                                dragHandlers: {
                                    onDrag: function (index, position) {
                                        circle.setRadius(Cesium.Cartesian3.distance(circle.getCenter(), position));
                                        markers.updateBillboardsPositions(getMarkerPositions());
                                    },
                                    onDragEnd: function (index, position) {
                                        onEdited();
                                    }
                                },
                                tooltip: function () {
                                    return "拖动改变圆半径";
                                }
                            };
                            markers.addBillboards(getMarkerPositions(), handleMarkerChanges);
                            this._markers = markers;
                            // add a handler for clicking in the globe
                            this._globeClickhandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
                            this._globeClickhandler.setInputAction(
                                function (movement) {
                                    let pickedObject = scene.pick(movement.position);
                                    if (!(pickedObject && pickedObject.primitive)) {
                                        _self.setEditMode(false);
                                    }
                                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

                            // set on top of the polygon
                            markers.setOnTop();
                        }
                        this._editMode = true;
                    } else {
                        if (this._markers != null) {
                            this._markers.remove();
                            this._markers = null;
                            this._globeClickhandler.destroy();
                        }
                        this._editMode = false;
                    }
                }

                circle.setHighlighted = setHighlighted;

                enhanceWithListeners(circle);

                circle.setEditMode(false);
            }

        }

        // 生成标绘工具栏
        _.DrawHelperWidget = (function () {

            // constructor
            function _(drawHelper, options) {
                this.drawHelper = drawHelper
                // container must be specified
                if (!(Cesium.defined(options.container))) {
                    throw new Cesium.DeveloperError('Container is required');
                }

                let drawOptions = {
                    polylineDrawingOptions: defaultPolylineOptions,
                    polygonDrawingOptions: defaultPolygonOptions,
                    extentDrawingOptions: defaultExtentOptions,
                    circleDrawingOptions: defaultCircleOptions
                };

                fillOptions(options, drawOptions);
                enhanceWithListeners(this);
            }

            // _.prototype.drawEvent = function (drawHelper, type) {
            //     console.log(drawHelper)
            //     drawHelper.startDrawingPolygon({
            //         callback: function (positions) {
            //             this.executeListeners({name: type, positions: positions});
            //         }
            //     });
            // }

            // _.prototype.addText = function (position, text, options) {
            //     let labels = scene.primitives.add(new Cesium.LabelCollection())
            //     labels.add({
            //         position: position,
            //         text: text,
            //         font : '15px sans-serif',
            //         horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
            //         verticalOrigin : Cesium.VerticalOrigin.BASELINE,
            //         pixelOffset : Cesium.Cartesian2.ZERO
            //     })
            // }

            return _;

        })();

        // 自定义标绘工具栏绑定事件
        _.prototype.createDrawEvent = function (type, callback) {
            var _self = this
            enhanceWithListeners(this)
            if (type === 'marker') {
                _self.startDrawingMarker({
                    callback: function (position) {
                        _self.executeListeners({name: 'markerCreated', position: position});
                    }
                });
                this.addListener('markerCreated', function (event) {
                    var b = new Cesium.BillboardCollection();
                    scene.primitives.add(b);
                    var billboard = b.add({
                        show: true,
                        position: event.position,
                        pixelOffset: new Cesium.Cartesian2(0, 0),
                        eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.CENTER,
                        scale: 1.0,
                        image: './images/drawhelper/glyphicons_242_google_maps.png',
                        color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
                    });
                    billboard.setEditable();
                    billboardCollection.push(b)
                    callback(type, event.position)
                });
            } else if (type === 'polyline'){
                _self.startDrawingPolyline({
                    callback: function (positions) {
                        _self.executeListeners({name: 'polylineCreated', positions: positions});
                    }
                });
                this.addListener('polylineCreated', function (event) {
                    var polyline = new we.drawHelper.PolylinePrimitive({
                        positions: event.positions,
                        width: 5,
                        geodesic: true
                    });
                    scene.primitives.add(polyline);
                    polyline.setEditable();
                    polyline.addListener('onEdited', function (event) {

                    });
                    polylineCollection.push(polyline)
                    callback(type)
                });
            } else if (type === 'polygon') {
                _self.startDrawingPolygon({
                    callback: function (positions) {
                        _self.executeListeners({name: 'polygonCreated', positions: positions});
                    }
                });
                this.addListener('polygonCreated', function (event) {
                    var polygon = new we.drawHelper.PolygonPrimitive({
                        positions: event.positions
                    });
                    console.log(polygon)
                    scene.primitives.add(polygon);
                    polygon.setEditable();
                    polygon.addListener('onEdited', function (event) {

                    });
                    polygonCollection.push(polygon)
                    callback(type)
                });
            } else if (type === 'clean') {
                for (var i in billboardCollection) {
                    viewer.scene.primitives.remove(billboardCollection[i])
                }
                billboardCollection.splice(0, billboardCollection.length)
                for (var i in polylineCollection) {
                    viewer.scene.primitives.remove(polylineCollection[i])
                }
                polylineCollection.splice(0, polylineCollection.length)
                for (var i in polygonCollection) {
                    viewer.scene.primitives.remove(polygonCollection[i])
                }
                polygonCollection.splice(0, polygonCollection.length)
                callback(type)
            }
        }

        function getExtent(mn, mx) {
            var e = new Cesium.Rectangle();

            // Re-order so west < east and south < north
            e.west = Math.min(mn.longitude, mx.longitude);
            e.east = Math.max(mn.longitude, mx.longitude);
            e.south = Math.min(mn.latitude, mx.latitude);
            e.north = Math.max(mn.latitude, mx.latitude);

            // Check for approx equal (shouldn't require abs due to re-order)
            var epsilon = Cesium.Math.EPSILON7;

            if ((e.east - e.west) < epsilon) {
                e.east += epsilon * 2.0;
            }

            if ((e.north - e.south) < epsilon) {
                e.north += epsilon * 2.0;
            }

            return e;
        };

        function createTooltip(frameDiv) {

            var tooltip = function (frameDiv) {

                console.log(frameDiv)
                var div = document.createElement('DIV');
                div.className = "twipsy right";

                var arrow = document.createElement('DIV');
                arrow.className = "twipsy-arrow";
                div.appendChild(arrow);

                var title = document.createElement('DIV');
                title.className = "twipsy-inner";
                div.appendChild(title);

                this._div = div;
                this._title = title;

                // add to frame div and display coordinates
                frameDiv.appendChild(div);
            }

            tooltip.prototype.setVisible = function (visible) {
                this._div.style.display = visible ? 'block' : 'none';
            }

            tooltip.prototype.showAt = function (position, message) {
                if (position && message) {
                    this.setVisible(true);
                    this._title.innerHTML = message;
                    this._div.style.left = position.x + 10 + "px";
                    this._div.style.top = (position.y - this._div.clientHeight / 2) + "px";
                }
            }

            return new tooltip(frameDiv);
        }

        function getDisplayLatLngString(cartographic, precision) {
            return cartographic.longitude.toFixed(precision || 3) + ", " + cartographic.latitude.toFixed(precision || 3);
        }

        function setListener(primitive, type, callback) {
            primitive[type] = callback;
        }

        function enhanceWithListeners(element) {

            element._listeners = {};

            element.addListener = function (name, callback) {
                this._listeners[name] = (this._listeners[name] || []);
                this._listeners[name].push(callback);
                return this._listeners[name].length;
            }

            element.executeListeners = function (event, defaultCallback) {
                if (this._listeners[event.name] && this._listeners[event.name].length > 0) {
                    var index = 0;
                    for (; index < this._listeners[event.name].length; index++) {
                        this._listeners[event.name][index](event);
                    }
                } else {
                    if (defaultCallback) {
                        defaultCallback(event);
                    }
                }
            }
        }

        return _;
    }()

    // 图层管理类
    we.layerManager = function () {
        var dataSourceCollection = null
        function _() {
            dataSourceCollection = []
            createUploadElement()
        }
        // 生成导入导出图层所需的文件上传控件
        function createUploadElement() {
            // 生成图层导出文件上传控件
            var div = document.getElementById(webEarthEle)
            var form_export = document.createElement('FORM');
            div.appendChild(form_export)
            form_export.action = "";
            form_export.id = "exportForm";
            form_export.method = "post";
            form_export.style = "display:none";
            form_export.enctype = "multipart/form-data";
            var input_export = document.createElement('INPUT');
            form_export.appendChild(input_export);
            input_export.type = "input";
            input_export.id = "geojsonData";
            input_export.name = "geojsons";

            // 生成图层导入文件上传控件
            var form_import = document.createElement('FORM');
            div.appendChild(form_import);
            form_import.action = "";
            form_import.id = "importForm";
            form_import.method = "post";
            form_import.style = "display:none";
            form_import.enctype = "multipart/form-data";
            var input_import = document.createElement('INPUT');
            form_import.appendChild(input_import);
            input_import.type = "file";
            input_import.id = 'geojsonFile';
            input_import.name = "shape_file";
        }
        // 导出图层
        _.prototype.exportLayer = function () {
            var ellipsoid = viewer.scene.globe.ellipsoid    //得到当前三维场景的椭球体
            var primitives = viewer.scene.primitives
            var hasPrimitiveType = false
            var jsonObj = []
            var markerArr = []
            var lineArr = []
            var polygonArr = []

            function toGeojson() {
                request(baseThis.host, {
                    url: '/main/toGeojson',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(jsonObj),
                    contentType: 'application/json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", getCookie('sessionId'));
                    },
                    success: function (res, statusTest, xhr) {
                        var url = baseThis.host + '/main/downloadShapFiles';
                        $("#exportForm").attr('action', url);
                        $("#geojsonData").val(JSON.stringify(res));
                        $("#exportForm").submit();
                    },
                    error: function (xhr, err, obj) {
                        if (xhr.status === 401) {
                            setCookie('sessionId', '', 7)
                            baseThis.getPermissions(toGeojson)
                        }
                    }
                })
            }
            for (var i = 0; i < primitives.length; ++i) {
                var p = primitives.get(i)
                // 获取对象名称
                var str = p.constructor + ''
                var start = str.replace("function", "|").indexOf('|')
                var p_type_name = ''
                if (start != -1) {
                    var end = str.replace("function", "|").indexOf("(")
                    if (end != -1) {
                        p_type_name = str.replace("function", "|").slice(start + 2, end);
                    }
                }
                // 当要导出的图层类型是点时
                if (p_type_name == 'BillboardCollection') {
                    if (p._billboards[0] != undefined) {
                        hasPrimitiveType = true
                        var cartographic = ellipsoid.cartesianToCartographic(p._billboards[0]._position);
                        var lat = Cesium.Math.toDegrees(cartographic.latitude);
                        var lng = Cesium.Math.toDegrees(cartographic.longitude);
                        markerArr.push([lng, lat])
                    }
                }
                // 获取地图上的线和面图层信息
                if (p.primitiveType != undefined) {
                    hasPrimitiveType = true
                    var poiArray = [];
                    switch (p.primitiveType) {
                        case 'polyline':
                            poiArray = [];
                            for (var j = 0; j < p.positions.length; j++) {
                                var cartographic = ellipsoid.cartesianToCartographic(p.positions[j]);
                                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                                var lng = Cesium.Math.toDegrees(cartographic.longitude);
                                poiArray.push([lng, lat]);
                            }
                            lineArr.push(poiArray);
                            break;
                        case 'polygon':
                            poiArray = [];
                            for (var j = 0; j < p.positions.length; j++) {
                                var cartographic = ellipsoid.cartesianToCartographic(p.positions[j]);
                                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                                var lng = Cesium.Math.toDegrees(cartographic.longitude);
                                poiArray.push([lng, lat]);
                            }
                            var cartographic_1 = ellipsoid.cartesianToCartographic(p.positions[0]);
                            var lat_1 = Cesium.Math.toDegrees(cartographic_1.latitude);
                            var lng_1 = Cesium.Math.toDegrees(cartographic_1.longitude);
                            poiArray.push([lng_1, lat_1])
                            polygonArr.push([poiArray]);
                            break;
                        // case 'extent':
                        //     break;
                        // case 'ellipse':
                        //     break;
                        // case 'circle':
                        //     break;
                        default:
                            break;
                    }
                }
            }
            // 单点标注图层
            if (markerArr.length == 1) {
                jsonObj.push({"type": "Point", "coordinates": markerArr});
            }
            // 多点标注图层
            if (markerArr.length > 1) {
                jsonObj.push({"type": "MultiPoint", "coordinates": markerArr});
            }
            // 单线标注图层
            if (lineArr.length == 1) {
                jsonObj.push({"type": "LineString", "coordinates": lineArr});
            }
            // 多线标注图层
            if (lineArr.length > 1) {
                jsonObj.push({"type": "MultiLineString", "coordinates": lineArr});
            }
            // 单面标注图层
            if (polygonArr.length == 1) {
                jsonObj.push({"type": "Polygon", "coordinates": polygonArr});
            }
            // 多面标注图层
            if (polygonArr.length > 1) {
                jsonObj.push({"type": "MultiPolygon", "coordinates": polygonArr});
            }
            if (jsonObj.length != 0) {
              return jsonObj
                // toGeojson()
            }
            if (!hasPrimitiveType) {
                alert("请先使用标绘工具生成图层");
            }
        }
        // 导入图层
        _.prototype.importLayer = function () {
            var ie = navigator.appName == "Microsoft Internet Explorer" ? true : false;
            if (ie) {
                document.getElementById("geojsonFile").click();
            } else {
                var a = document.createEvent("MouseEvents");//FF的处理
                a.initEvent("click", true, true);
                document.getElementById("geojsonFile").dispatchEvent(a);
            }
            function uploadShapFiles() {
                var form = new FormData(document.getElementById("importForm"));
                var sessionId = getCookie('sessionId');
                request(baseThis.host, {
                    url: '/main/uploadShapFiles',
                    type: "POST",
                    data: form,
                    cache: false,
                    processData: false,
                    contentType: false,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", getCookie('sessionId'));
                    },
                    success: function (res, statusTest, xhr) {
                        for (var i = 0; i < res.content.length; i++) {

                            var tmpDataSource = Cesium.GeoJsonDataSource.load(baseThis.host + res.content[i])
                            viewer.dataSources.add(tmpDataSource, {
                                stroke: Cesium.Color.HOTPINK,
                                fill: Cesium.Color.PINK,
                                strokeWidth: 3,
                                markerSymbol: '?'
                            })
                            dataSourceCollection.push(tmpDataSource)
                        }
                        $('#geojsonFile').val('')
                    },
                    error: function (xhr, err, obj) {
                        if (xhr.status === 401) {
                            setCookie('sessionId', '', 7)
                            baseThis.getPermissions(uploadShapFiles)
                        }
                    }
                })
            }
            $('#geojsonFile').change(function () {
                if ($('#geojsonFile').val != '')
                    uploadShapFiles()
            });
        }
        // 通过路径加载图层
        _.prototype.geoJsonDataSource = function (path, callback) {
          var promise = Cesium.GeoJsonDataSource.load(path);
          promise.then(function (dataSource) {
            viewer.dataSources.removeAll()
            viewer.dataSources.add(dataSource);
            var entities = dataSource.entities.values
            for (var i = 0; i < entities.length; i++) {
              console.log(entities[i])
              var entity = entities[i]
              if (Cesium.defined(entity.polygon)) {
                // entity.polygon.material = Cesium.Color.GREEN //new Cesium.Color.fromCssColorString('rgba(255, 255, 255, 0.5)')
                // entity.polygon.outline = false;
              }
            }
            if (typeof callback === 'function') {
              let entities = dataSource.entities.values;
              callback(entities)
              viewer.flyTo(promise, {offset: new Cesium.HeadingPitchRange(0.0, -90.0, 0)});
            }
          });
        }
        // 清理图层
        _.prototype.cleanLayer = function () {
            for (var i in dataSourceCollection) {
                console.log(dataSourceCollection[i])
                viewer.dataSources.removeAll()
            }
            dataSourceCollection = []
        }

        // 图层相交判定latCompare, lngCompare, latDraw, lngDraw, radiuDraw, color
        _.prototype.isIntersect = function (latCompare, lngCompare, latDraw, lngDraw, radiuDraw) {
          console.log(latCompare, lngCompare, latDraw, lngDraw, radiuDraw)
          function getFlatternDistance(lat1, lng1, lat2, lng2) {
            var EARTH_RADIUS = 6378137.0    //单位M
            var PI = Math.PI

            function getRad(d) {
              return d * PI / 180.0
            }

            var f = getRad((lat1 + lat2) / 2)
            var g = getRad((lat1 - lat2) / 2)
            var l = getRad((lng1 - lng2) / 2)

            var sg = Math.sin(g)
            var sl = Math.sin(l)
            var sf = Math.sin(f)

            var s, c, w, r, d, h1, h2
            var a = EARTH_RADIUS
            var fl = 1 / 298.257

            sg = sg * sg
            sl = sl * sl
            sf = sf * sf

            s = sg * (1 - sl) + (1 - sf) * sl
            c = (1 - sg) * (1 - sl) + sf * sl

            w = Math.atan(Math.sqrt(s / c))
            r = Math.sqrt(s * c) / w
            d = 2 * w * a
            h1 = (3 * r - 1) / 2 / c
            h2 = (3 * r + 1) / 2 / s

            return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
          }
          var distance = getFlatternDistance(latCompare, lngCompare, latDraw, lngDraw)


          if (distance < radiuDraw) {
            var circleInstance = new Cesium.GeometryInstance({
              geometry : new Cesium.CircleGeometry({
                center : Cesium.Cartesian3.fromDegrees(lngDraw, latDraw),
                radius : radiuDraw,
                vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
              }),
              attributes : {
                color : Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5))
              }
              // id: 'circle'
            });
            var primitive = new Cesium.Primitive({
              geometryInstances : circleInstance,
              appearance : new Cesium.PerInstanceColorAppearance({
                translucent : false,
                closed : true
              })
            });
            viewer.scene.primitives.add(primitive);
          }
        }
        return _
    }()

    // 数据驱动制图
    we.dataDrivenDrawer = function () {
        function _() {}
        _.prototype.getCustomAnalyze = function (drivenData) {
            if (drivenData === null || drivenData === '' || drivenData === undefined) {
                alert('请传入制图数据')
                return
            } else {
                request(baseThis.host, {
                    url: '/main/getCustomAnalyze',
                    type: "POST",
                    async: true,
                    dataType: 'json',
                    contentType: 'application/json',
                    data: drivenData,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", getCookie('sessionId'));
                    },
                    success: function (res) {
                        var promise = Cesium.GeoJsonDataSource.load(baseThis.host + res.result);
                        promise.then(function (dataSource) {
                            var target = viewer.dataSources.add(dataSource);
                            // var entities = dataSource.entities.values;
                            viewer.zoomTo(target)
                        })

                    },
                    error: function (xhr, err, obj) {
                        if (xhr.status === 401) {
                            setCookie('sessionId', '', 7)
                            baseThis.getPermissions(function() {
                                _.prototype.getCustomAnalyze(drivenData)
                            })
                        }
                    }
                })
            }
        }
        return _
    }()

    // 搜索
    we.searchManager = function () {
        var latlng = null
        function _() {

        }
        _.prototype.getHistoryList = function (callback, options) {
            if (!options)
                options = {}
            var defaultOptions = {
                query: ''
            }
            copyOptions(options, defaultOptions)
            request(baseThis.host, {
                url: '/area/history',
                type: "POST",
                data: JSON.stringify({
                    query: options.query
                }),
                contentType: 'application/json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", getCookie('sessionId'));
                },
                success: function (data) {
                    if (typeof callback === 'function')
                        callback(data.list)
                },
                error: function (xhr, type, err) {
                    if (xhr.status === 401) {
                        setCookie('sessionId', '', 7)
                        baseThis.getPermissions(function() {
                            _.prototype.getHistoryList(query)
                        })
                    }
                }
            })
        }
        _.prototype.deleteHistoryItem = function (query, callback) {
            request(baseThis.host, {
                url: '/area/deletehistory?query=' + query,
                type: 'get',
                contentType: 'application/json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", getCookie('sessionId'));
                },
                success: function success(data) {
                    if (typeof callback === 'function')
                        callback()
                },
                error: function (xhr, err, obj) {
                    if (xhr.status === 401) {
                        baseThis.getPermissions(function() {
                            _.prototype.deleteHistoryItem(query, callback)
                        })
                    }
                }
            })
        }
        _.prototype.conditionSearch = function (options, callback) {
            var defaultOptions = {
                output: 'json'
            }
            options = copyOptions(options, defaultOptions)
            function createTooltip(frameDiv) {

                var tooltip = function (frameDiv) {

                    var div = document.createElement('DIV');
                    div.className = "twipsy right";

                    var arrow = document.createElement('DIV');
                    arrow.className = "twipsy-arrow";
                    div.appendChild(arrow);

                    var title = document.createElement('DIV');
                    title.className = "twipsy-inner";
                    div.appendChild(title);

                    this._div = div;
                    this._title = title;

                    // add to frame div and display coordinates
                    frameDiv.appendChild(div);
                }

                tooltip.prototype.setVisible = function (visible) {
                    this._div.style.display = visible ? 'block' : 'none';
                }

                tooltip.prototype.showAt = function (position, message) {
                    if (position && message) {
                        this.setVisible(true);
                        this._title.innerHTML = message;
                        this._div.style.left = position.x + 10 + "px";
                        this._div.style.top = (position.y - this._div.clientHeight / 2) + "px";
                    }
                }

                return new tooltip(frameDiv);
            }

            if (options.searchtype === 'area') {
                request(baseThis.host, {
                    url: '/area/search',
                    type: 'POST',
                    data: JSON.stringify(options),
                    contentType: 'application/json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", getCookie('sessionId'));
                    },
                    success: function success(data) {
                        viewer.scene.primitives.removeAll()
                        for (var i in data.results) {
                            let b = new Cesium.BillboardCollection();
                            viewer.scene.primitives.add(b);
                            b.add({
                                show: true,
                                position: Cesium.Cartesian3.fromDegrees(data.results[i].location.lng, data.results[i].location.lat),
                                pixelOffset: new Cesium.Cartesian2(0, 0),
                                eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                scale: 1.0,
                                image: './images/drawhelper/icon-location.png',
                                color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
                            });

                            baseThis.popperManager({
                                lng: data.results[i].location.lng,
                                lat: data.results[i].location.lat
                            }, data.results[i].name)
                            // b_tooltip.setVisible(true)
                            // li.onclick = function () {
                            //     viewer.camera.flyTo({
                            //         destination: Cesium.Cartesian3.fromDegrees(item.location.lng, item.location.lat, 300),
                            //         duration: 5
                            //     })
                            //     // 给搜索结果坐标点位添加点位名称信息
                            //     let label = new Cesium.LabelCollection();
                            //     label.add({
                            //         position: Cesium.Cartesian3.fromDegrees(item.location.lng + 0.00005, item.location.lat - 0.00002),
                            //         text: item.name
                            //     })
                            //     viewer.scene.primitives.add(label);
                            // }
                        }
                        if (typeof callback === 'function')
                            if (data)
                                callback(data)
                            else
                                callback([])
                    },
                    error: function (xhr, err, obj) {
                        if (xhr.status === 401) {
                            setCookie('sessionId', '', 7)
                            baseThis.getPermissions(function () {
                                _.prototype.conditionSearch(options)
                            })
                        }
                    }
                })
            } else if (options.searchtype === 'latlng' && options.query.split(',').length === 2) {
                if (viewer.scene.primitives.contains(latlng))
                    viewer.scene.primitives.remove(latlng)
                latlng = new Cesium.BillboardCollection();
                viewer.scene.primitives.add(latlng);
                latlng.add({
                    show: true,
                    position: Cesium.Cartesian3.fromDegrees(options.query.split(',')[0], options.query.split(',')[1]),
                    pixelOffset: new Cesium.Cartesian2(0, 0),
                    eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    scale: 1.0,
                    image: './images/drawhelper/icon-location.png',
                    color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
                });
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(options.query.split(',')[0], options.query.split(',')[1], 300),
                    duration: 5
                })
            }
        }
        return _
    }()

    // 相机
    we.cameraManager = function () {
        function _() {

        }
        // 将镜头定位到以某个坐标为中心点的视野范围内
        _.prototype.flyTo = function (position) {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, 300),
                duration: 5
            })
        }
        return _
    }()

    // 研判
    we.judgeRead = function (options) {
        function _(options) {
            var defaultOptions = {}
            options = copyOptions(options, defaultOptions)
            this.initjudgeRead()
        }
        _.prototype.initjudgeRead = function () {
            var div = document.createElement('DIV')
            div.id = 'slider'
            viewer.container.appendChild(div)
            var splitLeft = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                layer: "tdtVecBasicLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
                show: false
            }))
            splitLeft.splitDirection = Cesium.ImagerySplitDirection.LEFT
            var slider = document.getElementById('slider');
            viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;

            var handler = new Cesium.ScreenSpaceEventHandler(slider);

            var moveActive = false;

            function move(movement) {
                if(!moveActive) {
                    return;
                }

                var relativeOffset = movement.endPosition.x ;
                var splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
                slider.style.left = 100.0 * splitPosition + '%';
                viewer.scene.imagerySplitPosition = splitPosition;
            }

            handler.setInputAction(function() {
                moveActive = true;
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
            handler.setInputAction(function() {
                moveActive = true;
            }, Cesium.ScreenSpaceEventType.PINCH_START);

            handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

            handler.setInputAction(function() {
                moveActive = false;
            }, Cesium.ScreenSpaceEventType.LEFT_UP);
            handler.setInputAction(function() {
                moveActive = false;
            }, Cesium.ScreenSpaceEventType.PINCH_END);
        }
        return _
    }()

    // 创建工具栏菜单按钮
    function addToolBar(title, imgUrl, callback) {
        var div = document.createElement('DIV');
        div.className = 'button';
        div.title = title;
        div.onclick = callback;
        var span = document.createElement('SPAN');
        div.appendChild(span);
        var image = document.createElement('IMG');
        image.src = imgUrl;
        span.appendChild(image);
        return div;
    }

    // 设置Cookie
    function setCookie(key, value, expireDays) {
        var exDate = new Date()
        exDate.setDate(exDate.getDate() + expireDays)
        document.cookie = key + "=" + escape(value) +
            ((expireDays == null) ? "" : ";expires=" + exDate.toGMTString())
    }

    // 获取cookie
    function getCookie(key) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(key + "=")
            if (c_start != -1) {
                c_start = c_start + key.length + 1
                var c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    }

    function clone(from, to) {
        if (from == null || typeof from != "object") return from;
        if (from.constructor != Object && from.constructor != Array) return from;
        if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function || from.constructor == String || from.constructor == Number || from.constructor == Boolean) return new from.constructor(from);
        to = to || new from.constructor();
        for (var name in from) {
            to[name] = typeof to[name] == "undefined" ? clone(from[name], null) : to[name];
        }
        return to;
    }

    function fillOptions(options, defaultOptions) {
        options = options || {};
        var option = void 0;
        for (option in defaultOptions) {
            if (options[option] === undefined) {
                options[option] = clone(defaultOptions[option]);
            }
        }
        return options;
    }

    // 合并Json
    function copyOptions(options, defaultOptions) {
        var newOptions = clone(options),
            option = void 0;
        for (option in defaultOptions) {
            if (newOptions[option] === undefined) {
                newOptions[option] = clone(defaultOptions[option]);
            }
        }
        return newOptions;
    }

    // 检测数组中是否包含某个指定元素
    function isArrContain(key, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === key) {
                return true
            }
        }
        return false
    }

    // url地址栏去参数
    function parseQueryString(url) {
        var str = url.split("?")[1];
        var result = {};
        if (str) {
            var items = str.split("&");
            var arr = [];
            for (var i = 0; i < items.length; i++) {
                arr = items[i].split('=');
                result[arr[0]] = arr[1];
            }
        }
        return result;
    }

    // ajax请求封装
    function request(host, params) {
        if (params && params['url']) {
            if (params.url.indexOf('https') < 0) {
                params['url'] = host + params['url']
            }
        }
        if (!params['data']) {
            params['data'] = {}
        }
        $.ajax(params)
    }

    return we
})()
