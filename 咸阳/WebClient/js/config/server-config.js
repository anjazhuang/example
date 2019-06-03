//后台获取数据接口链接
 var baseServiceUrl = 'http://172.16.5.91:9992/api';
// var baseServiceUrl = 'http://117.35.99.22:8801/api';
var baseGisUrl = 'http://183.234.133.102:6081/geoserver';
var gisAnalyzeMapUrl="http://172.16.5.45:9081/webearth";
var serverConfig = {
    apiBase: baseServiceUrl + '/',
    //gis地图数据接口
    gisMapUrl: baseGisUrl + "/xianyangmap/wms",
    // gisAnalyzeMapUrl: baseGisUrl + "/rest/services/shanxisheng/xianyangmodel/GPServer",
    // gisResultMapUrl: baseGisUrl + "/rest/services/shanxisheng/xianyangmodel/MapServer",
    // //墒情接口
    soilApi: baseServiceUrl + '/soil',
    //数据导出接口
    soilExportApi: baseServiceUrl + '/soilexport',
    //运维接口
    operationApi: baseServiceUrl + '/operation',
    //水雨情接口
    rainfallfloodApi: baseServiceUrl + '/rainfallflood'
    // rainfallApi:'http://124.193.197.194/Sunking_Rain'
};


