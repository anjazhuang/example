// var params = {
    // type: "river",
    // startTime: "",
    // endTime: ""
// }

// var html = "";
// var myChart = "";
// var option = "";
// var table = "";
// var resizeWorldMapContainer = "";
// var unit = "水位(m)";
// var title = '河道水情';
// var title1 = "水位(m)"
// var subtitle = "2017.11.01-2017.11.02";
// var riverdata = [
    // {
        // "id": 1,
        // "code": "5A81921110",
        // "name": "渭河测站1",
        // "areaName": "武功县",
        // "riverName": "渭河",
        // "waterLevel": "59.1",
        // "waterFlow": "20",
        // "flux": "200",
        // "waterWarn": "2568",
        // "waterMWarn": "4000",
        // "waterPLevel": "1500",
        // "waterMLevel": "1800",
        // "content": [
            // { "id": "1", "time": "00:00" },
            // { "id": "1", "time": "02:00" },
            // { "id": "1", "time": "04:00" },
            // { "id": "1", "time": "06:00" },
            // { "id": "1", "time": "08:00" },
            // { "id": "1", "time": "10:00" },
            // { "id": "1", "time": "12:00" },
            // { "id": "1", "time": "14:00" },
            // { "id": "1", "time": "16:00" },
            // { "id": "1", "time": "18:00" },
            // { "id": "1", "time": "20:00" },
            // { "id": "1", "time": "22:00" },
        // ]
    // }
// ];
// var time = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
// var data = [Math.random() * 300];
// var data1 = [Math.random() * 300];
// for (var i = 1; i < 12; i++) {
    // data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
    // data1.push(Math.round((Math.random() - 0.9) * 22 + data1[i - 1]));
// }
// var timeData = [
    // '2017/10/1 0:30', '2017/10/1 1:00', '2017/10/1 1:30', '2017/10/1 2:00', '2017/10/1 2:30', '2017/10/1 3:00',
    // '2017/10/1 3:30', '2017/10/1 4:00', '2017/10/1 4:30', '2017/10/1 5:00', '2017/10/1 5:30', '2017/10/1 6:00',
    // '2017/10/1 6:30', '2017/10/1 7:00', '2017/10/1 7:30', '2017/10/1 8:00', '2017/10/1 8:30', '2017/10/1 9:00',
    // '2017/10/1 9:30', '2017/10/1 10:00', '2017/10/1 10:30', '2017/10/1 11:00', '2017/10/1 11:30', '2017/10/1 12:00',
// ];

// var tabhtml = "";

// var data_river = [
    // {
        // "id": 1,
        // "time": "2017-11-01 00:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 2,
        // "time": "2017-11-01 02:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 3,
        // "time": "2017-11-01 04:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 4,
        // "time": "2017-11-01 06:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 5,
        // "time": "2017-11-01 08:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 6,
        // "time": "2017-11-01 10:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 7,
        // "time": "2017-11-01 12:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 8,
        // "time": "2017-11-01 14:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }, {
        // "id": 9,
        // "time": "2017-11-01 16:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }, {
        // "id": 10,
        // "time": "2017-11-01 18:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }, {
        // "id": 11,
        // "time": "2017-11-01 20:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }, {
        // "id": 12,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 13,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 14,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 15,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }, {
        // "id": 16,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }
// ];
// var data_reservoir = [
    // {
        // "id": 1,
        // "time": "2017-11-01 00:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 2,
        // "time": "2017-11-01 02:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 3,
        // "time": "2017-11-01 04:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 4,
        // "time": "2017-11-01 06:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 5,
        // "time": "2017-11-01 08:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 6,
        // "time": "2017-11-01 10:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 7,
        // "time": "2017-11-01 12:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 8,
        // "time": "2017-11-01 14:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 9,
        // "time": "2017-11-01 16:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 10,
        // "time": "2017-11-01 18:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 11,
        // "time": "2017-11-01 20:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 12,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 13,
        // "time": "2017-11-01 18:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 14,
        // "time": "2017-11-01 20:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 15,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 16,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }

// ];
// var data_rain = [
    // {
        // "id": 1,
        // "time": "2017-11-01 00:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 2,
        // "time": "2017-11-01 01:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 3,
        // "time": "2017-11-01 01:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 4,
        // "time": "2017-11-01 02:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 5,
        // "time": "2017-11-01 02:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 6,
        // "time": "2017-11-01 03:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 7,
        // "time": "2017-11-01 03:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 8,
        // "time": "2017-11-01 04:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 9,
        // "time": "2017-11-01 04:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 10,
        // "time": "2017-11-01 05:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 11,
        // "time": "2017-11-01 06:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 12,
        // "time": "2017-11-01 06:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 13,
        // "time": "2017-11-01 05:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 14,
        // "time": "2017-11-01 06:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 15,
        // "time": "2017-11-01 06:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": "...",
        // "time": "...",
        // "code": "...",
        // "name": "...",
        // "adminArea": "...",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }
// ];
// var data_soil = [
    // {
        // "id": 1,
        // "time": "2017-11-01 00:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "25%"
    // },
    // {
        // "id": 2,
        // "time": "2017-11-02 02:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 3,
        // "time": "2017-11-01 04:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 4,
        // "time": "2017-11-01 06:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 5,
        // "time": "2017-11-01 08:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 6,
        // "time": "2017-11-01 10:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 7,
        // "time": "2017-11-01 12:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 8,
        // "time": "2017-11-01 14:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 9,
        // "time": "2017-11-01 16:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 10,
        // "time": "2017-11-01 18:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 12,
        // "time": "2017-11-01 20:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 13,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 14,
        // "time": "2017-11-01 18:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 15,
        // "time": "2017-11-01 20:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 16,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }
// ];


// $(function () {
    // init();
    // initTree();
    // $("#selType").on("change", function () {
        // // params.type = $(this).val();
        // // alert(params.type);
        // if ($(this).val() == 0) {
            // params.type = "river";
        // } else if ($(this).val() == 1) {
            // params.type = "reservoir";
        // } else if ($(this).val() == 2) {
            // params.type = "rain";
        // } else if ($(this).val() == 3) {
            // params.type = "soil";
        // }
    // });

    // resizeWorldMapContainer = function () {
        // document.getElementById('chart').style.width = (window.innerWidth - 253) + 'px';
        // document.getElementById('chart').style.height = (window.innerHeight - 130) + 'px';
    // };
    // resizeWorldMapContainer();
    // myChart = echarts.init(document.getElementById('chart'));
    // option = {
        // title: {
            // text: title + title1 + "过程曲线",
            // subtext: subtitle,
            // left: 'center',
            // textStyle: {
                // fontSize: 16
            // },
            // itemGap: 6
        // },
        // tooltip: {
            // // trigger: 'item',
            // // //formatter: ['站点1', '站点2'] +": {c}  ( 时间：{b} )"
            // // formatter: '{a}: {c}/' + unit + ' ( 时间：{b} )'
        // },

        // grid: {
            // left: '5%',
            // right: '5%',
            // top: "80",
            // bottom: "80"
        // },
        // dataZoom: [
            // {
                // show: true,
                // realtime: true,
                // start: 65,
                // end: 85
            // },
            // {
                // type: 'inside',
                // realtime: true,
                // start: 65,
                // end: 85
            // }
        // ],
        // toolbox: {
            // right: 100,
            // feature: {
                // saveAsImage: {
                    // title: "保存为图片",
                    // iconStyle: {
                        // normal: {
                            // textAlign: "left"
                        // }
                    // },
                    // excludeComponents: ["dataZoom", "toolbox"]
                // }
            // }
        // },
        // legend: {
            // type: 'scroll',
            // top: 40,
            // //data: ['站点1', '站点2']
        // },
        // xAxis: {
            // name: '时间/h',
            // type: 'category',
            // boundaryGap: false,
            // //data: time,
        // },
        // yAxis: {
            // type: 'value',
            // name: unit,
            // nameLocation: "end"
        // },
        // series: []
    // };

    // myChart.setOption(option);
    // window.onresize = function () {
        // //重置容器高宽
        // resizeWorldMapContainer();
        // myChart.resize();
    // };

    // $("body").on("change", "#dataType", function () {
        // data = [Math.random() * 3];
        // data1 = [Math.random() * 2];
        // for (var i = 1; i < 12; i++) {
            // data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
            // data1.push(Math.round((Math.random() - 0.9) * 22 + data1[i - 1]));
        // }
        // unit = $(this).val();
        // title1 = $(this).val();
        // myChart.setOption({
            // tooltip: {
                // trigger: 'item',
                // //formatter: ['站点1', '站点2'] +": {c}  ( 时间：{b} )"
                // formatter: '{a}: {c}/' + unit + ' ( 时间：{b} )'
            // },
            // title: {
                // text: title + title1 + "过程曲线",
            // },
            // yAxis: {
                // name: unit
            // },
            // series: [
                // {
                    // name: '站点1',
                    // symbolSize: 10,
                    // data: data
                // },
                // {
                    // name: '站点2',
                    // symbolSize: 10,
                    // data: data1
                // }
            // ]
        // });
    // });

    // //导出事件
    // $("#exportFile").click(function () {
        // if (params.type === "soil") {
            // var startime = $("#s-date").find("input").val();
            // var endtime = $("#e-date").find("input").val();
            // if ($(".tab0:first ").hasClass("active")) {
                // var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
                // console.log(powers);
            // } else if ($(".tab0:last").hasClass("active")) {
                // var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
                // console.log(powers);
            // }
            // var obj = {
                // Type: 'post',
                // Uri: '/data/exportsoildata',
                // SessionId: $.cookie("sessionid"),
                // Parameter: {
                    // Codes: powers,
                    // StartTime: startime + " 00:00:00",
                    // EndTime: endtime + " 23:59:59"
                // }
            // };
            // DownLoadFile({
                // url: serverConfig.soilExportApi,
                // data: obj
            // });
        // }
    // });

    // $("#tongji").click(function () {
        // var startime = $("#s-date").find("input").val();
        // var endtime = $("#e-date").find("input").val();
        // if ($(".tab0:first ").hasClass("active")) {
            // var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
            // console.log(powers);
        // } else if ($(".tab0:last").hasClass("active")) {
            // var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
            // console.log(powers);
        // }

        // if (startime !== "" && endtime !== "" && powers.length !== 0) {
            // $(".tab-pane").eq(0).addClass("active in").siblings().removeClass("in active");
            // $(".navtab li").eq(0).addClass("active").siblings().removeClass("active");
            // if (params.type === "river") {
                // $("#rivertab").removeClass("hidden").siblings().addClass("hidden");
                // html = "<option value='水位(m)'>水位</option><option value='流量(mm)'>流量</option><option value='水容势(g/m)'>水容势</option>"
                // unit = "水位(m)";
                // title = "河道水情";
                // $("#dataType").html(html);
                // data = [Math.random() * 3];
                // data1 = [Math.random() * 2];
                // for (var i = 1; i < 12; i++) {
                    // data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
                    // data1.push(Math.round((Math.random() - 0.9) * 22 + data1[i - 1]));
                // }
                // myChart.setOption({
                    // title: {
                        // text: title + title1 + "过程曲线",
                        // subtext: subtitle,
                        // left: 'center',
                        // textStyle: {
                            // fontSize: 16
                        // },
                        // itemGap: 6
                    // },
                    // grid: {
                        // left: '5%',
                        // right: '5%',
                        // top: "80",
                        // bottom: "80"
                    // },
                    // dataZoom: [
                        // {
                            // show: true,
                            // realtime: true,
                            // start: 65,
                            // end: 85
                        // },
                        // {
                            // type: 'inside',
                            // realtime: true,
                            // start: 65,
                            // end: 85
                        // }
                    // ],
                    // toolbox: {
                        // right: 100,
                        // feature: {
                            // saveAsImage: {
                                // title: "保存为图片",
                                // iconStyle: {
                                    // normal: {
                                        // textAlign: "left"
                                    // }
                                // },
                                // excludeComponents: ["dataZoom", "toolbox"]
                            // }
                        // }
                    // },
                    // legend: {
                        // type: 'scroll',
                        // top: 40,
                        // data: ['站点1', '站点2']
                    // },
                    // xAxis: {
                        // name: '时间/h',
                        // type: 'category',
                        // boundaryGap: false,
                        // data: time,
                    // },
                    // yAxis: {
                        // name: unit
                    // },
                    // series: [
                        // {
                            // name: '站点1',
                            // type: 'line',
                            // stack: '总量',
                            // symbolSize: 10,
                            // data: data
                        // },
                        // {
                            // name: '站点2',
                            // type: 'line',
                            // stack: '总量',
                            // symbolSize: 10,
                            // data: data1
                        // }
                    // ]
                // }, true);
                // table = $('#river-tab').DataTable({
                    // aaData: data_river,
                    // lengthChange: false,
                    // searching: false,
                    // "iDisplayLength": 15,
                    // destroy: true,
                    // language: reportLanguage,
                    // ordering: false,
                    // columns: [
                        // { "data": "id" },
                        // { "data": "time" },
                        // { "data": "code" },
                        // { "data": "name" },
                        // { "data": "riverArea" },
                        // { "data": "riverHigh" },
                        // { "data": "riverWeight" },
                        // { "data": "riverFlow" },
                        // { "data": "warnLine" },
                        // { "data": "overWarnLine" },
                        // { "data": "saveLine" },
                        // { "data": "overSaveLine" }
                    // ]
                // });
            // } else if (params.type === "reservoir") {
                // $("#reservoirtab").removeClass("hidden").siblings().addClass("hidden");
                // html = "<option value='水位(m)'>水位</option><option value='入库流量(mm)'>入库流量</option><option value='出库流量(mm)'>出库流量</option><option  value='水势(g)'>水势</option>";
                // unit = "水位(m)";
                // title = "水库水情";
                // $("#dataType").html(html);
                // data = [Math.random() * 3];
                // data1 = [Math.random() * 2];
                // for (var i = 1; i < 12; i++) {
                    // data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
                    // data1.push(Math.round((Math.random() - 0.9) * 22 + data1[i - 1]));
                // }
                // myChart.setOption({
                    // title: {
                        // text: title + title1 + "过程曲线",
                        // subtext: subtitle,
                        // left: 'center',
                        // textStyle: {
                            // fontSize: 16
                        // },
                        // itemGap: 6
                    // },
                    // grid: {
                        // left: '5%',
                        // right: '5%',
                        // top: "80",
                        // bottom: "80"
                    // },
                    // dataZoom: [
                        // {
                            // show: true,
                            // realtime: true,
                            // start: 65,
                            // end: 85
                        // },
                        // {
                            // type: 'inside',
                            // realtime: true,
                            // start: 65,
                            // end: 85
                        // }
                    // ],
                    // toolbox: {
                        // right: 100,
                        // feature: {
                            // saveAsImage: {
                                // title: "保存为图片",
                                // iconStyle: {
                                    // normal: {
                                        // textAlign: "left"
                                    // }
                                // },
                                // excludeComponents: ["dataZoom", "toolbox"]
                            // }
                        // }
                    // },
                    // legend: {
                        // type: 'scroll',
                        // top: 40,
                        // data: ['站点1', '站点2']
                    // },
                    // xAxis: {
                        // name: '时间/h',
                        // type: 'category',
                        // boundaryGap: false,
                        // data: time,
                    // },
                    // yAxis: {
                        // name: unit
                    // },
                    // series: [
                        // {
                            // name: '站点1',
                            // data: data,
                            // symbolSize: 10,
                            // type: "line"
                        // },
                        // {
                            // name: '站点2',
                            // data: data1,
                            // symbolSize: 10,
                            // type: "line"
                        // }
                    // ]
                // }, true);
                // table = $('#reservoir-tab').DataTable({
                    // aaData: data_reservoir,
                    // lengthChange: false,
                    // searching: false,
                    // destroy: true,
                    // "iDisplayLength": 15,
                    // language: reportLanguage,
                    // ordering: false,
                    // columns: [
                        // { "data": "id" },
                        // { "data": "time" },
                        // { "data": "code" },
                        // { "data": "name" },
                        // { "data": "riverArea" },
                        // { "data": "riverHigh" },
                        // { "data": "riverWeight" },
                        // { "data": "inFlow" },
                        // { "data": "outFlow" },
                        // { "data": "reservoirs" },
                        // { "data": "limited" }
                    // ]
                // });
            // } else if (params.type === "rain") {
                // var loading = "";
                // $("#raintab").removeClass("hidden").siblings().addClass("hidden");
                // console.log(powers.join(","));
                // var obj = {
                    // Type: 'get',
                    // Uri: '/aControl/RainControl/countRainData',
                    // Parameter: {
                        // "rainCount.stcd": powers.join(","),
                        // "rainCount.startTm": startime + " 00:00:00",
                        // "rainCount.endTm": endtime + " 23:59:59"
                    // }
                // };
                // $.ajax({
                    // url: serverConfig.rainfallfloodApi,
                    // data: JSON.stringify(obj),
                    // beforeSend: function (request) {
                        // loading = layer.load(2, {
                            // shade: [0.5, '#fff']
                        // });
                        // // myChart.showLoading({
                        // //     text: '数据加载中...',
                        // //     zlevel: 2
                        // // });
                    // }
                // }).done(function (data) {
                    // console.log(data);
                    // layer.close(loading);
                    // html = "<option value='降雨量(m^3/s)'>降雨量</option>";
                    // unit = "降雨量(mm)";
                    // title = "降雨量(mm)";
                    // $("#dataType").html(html);
                    // if (data.success) {
                        // table = $('#rain-tab').DataTable({
                            // aaData: data.data,
                            // lengthChange: false,
                            // searching: false,
                            // destroy: true,
                            // language: reportLanguage,
                            // "iDisplayLength": 15,
                            // ordering: false,
                            // columns: [
                                // {
                                    // "data": null,
                                    // "render": function (data, type, row, meta) {
                                        // var startIndex = meta.settings._iDisplayStart;
                                        // return meta.row + 1;
                                    // }
                                // },
                                // { "data": "tm" },
                                // { "data": "addvcd" },
                                // { "data": "stnm" },
                                // { "data": "addvnm" },
                                // { "data": "bsnm" },
                                // { "data": "rvnm" },
                                // { "data": "hnnm" },
                                // {
                                    // "data": "drp",
                                    // "render": function (data, type, row, meta) {
                                        // if (data.length > 0) {
                                            // return data
                                        // } else {
                                            // return 0
                                        // }
                                    // }
                                // }
                            // ]
                        // });
                        // // myChart.hideLoading();
                        // var x_soil_data = [], stationame = [], chartsData = [];
                        // $.each(data.data, function (key, obj) {
                            // x_soil_data.push(obj.tm)
                        // });
                        // for (var i = 0; i < powers.length; i++) {
                            // var tt = $.grep(data.data, function (d) {
                                // return d.addvcd == powers[i];
                            // });
                            // if (tt.length !== 0) {
                                // var stationdata = [];
                                // console.log("找到的站点编码:" + powers[i]);
                                // $.each(tt, function (key, obj) {
                                    // var aa = {
                                        // name: obj.tm,
                                        // value: [obj.tm, obj.drp]
                                    // }
                                    // stationdata.push(aa);
                                // });
                                // var chartsobj = {
                                    // name: tt[0].stnm,
                                    // type: 'bar',
                                    // barGap: '-100%',
                                    // barCategoryGap: '40%',
                                    // barWidth: "15px",
                                    // data: stationdata
                                // };
                                // chartsData.push(chartsobj);
                                // stationame.push(tt[0].stnm)
                            // }
                        // }
                        // console.log(chartsData);
                        // myChart.setOption({
                            // tooltip: {
                                // trigger: 'axis',
                                // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                    // type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                // }
                            // },
                            // title: {
                                // text: title + "过程曲线",
                                // subtext: startime + " 00:00:00 -" + endtime + " 23:59:59",
                                // left: 'center',
                                // textStyle: {
                                    // fontSize: 16
                                // },
                                // itemGap: 6
                            // },
                            // grid: {
                                // left: '5%',
                                // right: '5%',
                                // top: "80",
                                // bottom: "80"
                            // },
                            // dataZoom: [
                                // {
                                    // show: true,
                                    // realtime: true,
                                    // start: 65,
                                    // end: 85
                                // },
                                // {
                                    // type: 'inside',
                                    // realtime: true,
                                    // start: 65,
                                    // end: 85
                                // }
                            // ],
                            // toolbox: {
                                // right: 100,
                                // feature: {
                                    // saveAsImage: {
                                        // title: "保存为图片",
                                        // iconStyle: {
                                            // normal: {
                                                // textAlign: "left"
                                            // }
                                        // },
                                        // excludeComponents: ["dataZoom", "toolbox"]
                                    // }
                                // }
                            // },
                            // legend: {
                                // type: 'scroll',
                                // top: 40,
                                // data: stationame
                            // },
                            // xAxis: {
                                // name: '时间/h',
                                // type: 'time',
                                // splitLine: {
                                    // show: false
                                // }
                            // },
                            // yAxis: {
                                // name: unit,
                                // inverse: true,
                                // nameLocation: "start"
                            // },
                            // series: chartsData
                        // }, true);
                    // } else {
                        // layer.msg(data.message);
                        // myChart.hideLoading();
                    // }
                // });

            // } else if (params.type === "soil") {
                // //alert($("#s-date").find("input").val());
                // // myChart.showLoading({
                // //     text: '数据加载中...'
                // // });
                // var loading = "";
                // var obj = {
                    // Type: 'post',
                    // Uri: '/data/getsoildata',
                    // Parameter: {
                        // Codes: powers,
                        // StartTime: startime + " 00:00:00",
                        // EndTime: endtime + " 23:59:59"
                    // }
                // };
                // //console.log(obj);
                // $.ajax({
                    // url: serverConfig.soilApi,
                    // data: JSON.stringify(obj),
                    // beforeSend: function (request) {
                        // loading = layer.load(2, {
                            // shade: [0.5, '#fff'] //0.1透明度的白色背景
                        // });
                    // }
                // }).done(function (data) {
                    // if (data.success) {
                        // layer.close(loading);
                        // var x_soil_data = [], stationame = [], chartsData = [];
                        // console.log(data.data);
                        // $("#soiltab").removeClass("hidden").siblings().addClass("hidden");
                        // html = "<option value='重量含水量（%）'>重量含水量</option>";
                        // $("#dataType").html(html);
                        // title = "墒情";
                        // title1 = "重量含水量（%）";
                        // unit = "重量含水量（%）";
                        // $.each(data.data, function (key, obj) {
                            // x_soil_data.push(obj.Time.replace("T", " "))
                        // });
                        // for (var i = 0; i < powers.length; i++) {
                            // var tt = $.grep(data.data, function (d) {
                                // return d.Code == powers[i];
                            // });
                            // if (tt.length !== 0) {
                                // var stationdata = [];
                                // console.log("找到的站点编码:" + powers[i]);
                                // $.each(tt, function (key, obj) {
                                    // var aa = {
                                        // name: obj.Time,
                                        // value: [obj.Time, obj.MA]
                                    // }
                                    // stationdata.push(aa);
                                // });
                                // var chartsobj = {
                                    // name: tt[0].Name,
                                    // type: 'line',
                                    // symbolSize: 10,
                                    // data: stationdata
                                // };
                                // chartsData.push(chartsobj);
                                // stationame.push(tt[0].Name)
                            // }
                        // }
                        // console.log(chartsData);
                        // // console.log("找到的所有站点编码名组合:" + stationname);
                        // // myChart.refresh;
                        // myChart.setOption({
                            // title: {
                                // text: title + title1 + "过程曲线",
                                // subtext: startime + " 00:00:00 -" + endtime + " 23:59:59",
                                // left: 'center',
                                // textStyle: {
                                    // fontSize: 16
                                // },
                                // itemGap: 6
                            // },
                            // grid: {
                                // left: '5%',
                                // right: '5%',
                                // top: "80",
                                // bottom: "80"
                            // },
                            // dataZoom: [
                                // {
                                    // show: true,
                                    // realtime: true,
                                    // start: 65,
                                    // end: 85
                                // },
                                // {
                                    // type: 'inside',
                                    // realtime: true,
                                    // start: 65,
                                    // end: 85
                                // }
                            // ],
                            // toolbox: {
                                // right: 100,
                                // feature: {
                                    // saveAsImage: {
                                        // title: "保存为图片",
                                        // iconStyle: {
                                            // normal: {
                                                // textAlign: "left"
                                            // }
                                        // },
                                        // excludeComponents: ["dataZoom", "toolbox"]
                                    // }
                                // }
                            // },
                            // legend: {
                                // data: stationame,
                                // type: 'scroll',
                                // top: 40
                            // },
                            // tooltip: {
                                // trigger: 'axis',
                                // axisPointer: {
                                    // type: 'cross',
                                    // animation: false,
                                    // label: {
                                        // backgroundColor: '#505765'
                                    // }
                                // }
                            // },
                            // xAxis: {
                                // name: '时间/h',
                                // type: 'time',
                                // splitLine: {
                                    // show: false
                                // }
                            // },
                            // yAxis: {
                                // name: unit,
                                // type: 'value',
                                // inverse: false
                            // },
                            // series: chartsData
                        // }, true);
                        // table = $('#soil-tab').DataTable({
                            // aaData: data.data,
                            // lengthChange: false,
                            // searching: false,
                            // destroy: true,
                            // "iDisplayLength": 15,
                            // language: reportLanguage,
                            // ordering: false,
                            // columns: [
                                // { "data": null, "targets": 0 },
                                // { "data": "Time" },
                                // { "data": "Code" },
                                // { "data": "Name" },
                                // { "data": "AreaName" },
                                // { "data": "RiverAreaName" },
                                // { "data": "RiverSystemName" },
                                // { "data": "RiverName" },
                                // { "data": "M10" },
                                // { "data": "M20" },
                                // { "data": "M40" },
                                // { "data": "MA" }
                            // ],
                            // fnDrawCallback: function () { //解决序号列没法生成的问题
                                // var api = this.api();
                                // var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数(适用于后台分页)
                                // api.column(0).nodes().each(function (cell, i) {
                                    // cell.innerHTML = 1 + i;
                                    // //适用于后台分页 cell.innerHTML =  1 + i+startIndex;
                                // });
                                // api.column(1).nodes().each(function (cell, i) {
                                    // cell.innerHTML = cell.innerHTML.replace("T", " ");
                                // });
                            // }
                        // });
                    // } else {
                        // layer.msg(data.message);
                        // layer.close(loading);
                    // }
                // });
            // }
        // } else {
            // layer.msg("请选择站点以及开始和结束时间!")
        // }
    // });
    // $("#s-date,#e-date").datetimepicker({
        // format: "yyyy-mm-dd",
        // language: 'zh-CN',
        // weekStart: 1,
        // todayBtn: true,
        // autoclose: true,
        // todayHighlight: 1,
        // startView: 2,
        // minView: 2,
        // forceParse: 0,
        // pickerPosition: "top-left",
        // endDate: new Date()
    // });
    // $("#s-date,#e-date").datetimepicker('update', new Date());

    // table = $('#river-tab').DataTable({
        // aaData: data_river,
        // lengthChange: false,
        // "iDisplayLength": 15,
        // searching: false,
        // destroy: true,
        // language: reportLanguage,
        // ordering: false,
        // columns: [
            // { "data": "id" },
            // { "data": "time" },
            // { "data": "code" },
            // { "data": "name" },
            // { "data": "riverArea" },
            // { "data": "riverHigh" },
            // { "data": "riverWeight" },
            // { "data": "riverFlow" },
            // { "data": "warnLine" },
            // { "data": "overWarnLine" },
            // { "data": "saveLine" },
            // { "data": "overSaveLine" }
        // ]
    // });
    // $("#searchAction").click(function () {
        // zTree = $.fn.zTree.getZTreeObj("treeDemoCity");
        // nodes = zTree.getNodes();
        // zTree.cancelSelectedNode();
        // if ($("#searchTxt").val() != "") {
            // searchNodes = zTree.getNodesByParamFuzzy("name", $("#searchTxt").val(), null);
            // if (searchNodes != null && searchNodes != undefined) {
                // for (var i = 0; i < searchNodes.length; i++) {
                    // zTree.selectNode(searchNodes[i], true, false);
                // }
            // }
        // }
    // });

    // $("#searchAction1").click(function () {
        // zTree = $.fn.zTree.getZTreeObj("treeDemoRiver");
        // nodes = zTree.getNodes();
        // zTree.cancelSelectedNode();
        // if ($("#searchTxt1").val() != "") {
            // searchNodes = zTree.getNodesByParamFuzzy("name", $("#searchTxt1").val(), null);
            // if (searchNodes != null && searchNodes != undefined) {
                // for (var i = 0; i < searchNodes.length; i++) {
                    // zTree.selectNode(searchNodes[i], true, false);
                // }
            // }
        // }
    // });

    // var selectData = [{ id: 0, text: '河道水情' }, { id: 1, text: '水库水情' }, { id: 2, text: '雨情' }, { id: 3, text: '墒情' }];
    // $("#selType").select2({
        // data: selectData
    // })
// });

// function getDate(datestr) {
    // var temp = datestr.split("-");
    // var date = new Date(temp[0], temp[1], temp[2]);
    // return date;
// }

// function daysBetween(sDate1, sDate2) {
// //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
    // var time1 = Date.parse(new Date(sDate1));
    // var time2 = Date.parse(new Date(sDate2));
    // var nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24));
    // return nDays;
// };

// //搜索站点
// function keydownSearch() {
    // $("#searchAction").click();
// };

// function keydownSearch1() {
    // $("#searchAction1").click();
// };

// //初始化站点树
// function initTree() {
    // var setting = {
        // check: {
            // enable: true,
            // chkboxType: { "Y": "ps", "N": "ps" }
            // //chkboxType: { "Y": "ps", "N": "ps" },
        // },
        // data: {
            // simpleData: {
                // enable: true,
                // idKey: "id", // id编号命名
                // pIdKey: "pId", // 父id编号命名
                // rootPId: 0
            // }
        // },
        // view: {
            // showIcon: true
        // }
    // };
    // $.fn.zTree.init($("#treeDemoCity"), setting, JSON.parse(localStorage.getItem("treearea")));
    // $.fn.zTree.init($("#treeDemoRiver"), setting, JSON.parse(localStorage.getItem("treeriver")));
    // var treeObj = $.fn.zTree.getZTreeObj("treeDemoCity");
    // treeObj.expandAll(true);
    // var treeObjr = $.fn.zTree.getZTreeObj("treeDemoRiver");
    // treeObjr.expandAll(true);
// }

// function GetNodeIds(zTree, nodes, ids) {
    // for (var i = 0; i < nodes.length; i++) {
        // if (nodes[i].checked && !nodes[i].getCheckStatus().half) {
            // if (nodes[i].id.length === 8) {
                // ids.push(nodes[i].id)
            // }
        // }
        // if (nodes[i].children != null) {
            // GetNodeIds(zTree, nodes[i].children, ids);
        // }
    // }
    // return ids;
// }
// var params = {
    // type: "river",
    // startTime: "",
    // endTime: ""
// }

// var html = "";
// var myChart = "";
// var option = "";
// var table = "";
// var resizeWorldMapContainer = "";
// var unit = "水位(m)";
// var title = '河道水情';
// var title1 = "水位(m)"
// var subtitle = "2017.11.01-2017.11.02";
// var riverdata = [
    // {
        // "id": 1,
        // "code": "5A81921110",
        // "name": "渭河测站1",
        // "areaName": "武功县",
        // "riverName": "渭河",
        // "waterLevel": "59.1",
        // "waterFlow": "20",
        // "flux": "200",
        // "waterWarn": "2568",
        // "waterMWarn": "4000",
        // "waterPLevel": "1500",
        // "waterMLevel": "1800",
        // "content": [
            // { "id": "1", "time": "00:00" },
            // { "id": "1", "time": "02:00" },
            // { "id": "1", "time": "04:00" },
            // { "id": "1", "time": "06:00" },
            // { "id": "1", "time": "08:00" },
            // { "id": "1", "time": "10:00" },
            // { "id": "1", "time": "12:00" },
            // { "id": "1", "time": "14:00" },
            // { "id": "1", "time": "16:00" },
            // { "id": "1", "time": "18:00" },
            // { "id": "1", "time": "20:00" },
            // { "id": "1", "time": "22:00" },
        // ]
    // }
// ];
// var time = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
// var data = [Math.random() * 300];
// var data1 = [Math.random() * 300];
// for (var i = 1; i < 12; i++) {
    // data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
    // data1.push(Math.round((Math.random() - 0.9) * 22 + data1[i - 1]));
// }
// var timeData = [
    // '2017/10/1 0:30', '2017/10/1 1:00', '2017/10/1 1:30', '2017/10/1 2:00', '2017/10/1 2:30', '2017/10/1 3:00',
    // '2017/10/1 3:30', '2017/10/1 4:00', '2017/10/1 4:30', '2017/10/1 5:00', '2017/10/1 5:30', '2017/10/1 6:00',
    // '2017/10/1 6:30', '2017/10/1 7:00', '2017/10/1 7:30', '2017/10/1 8:00', '2017/10/1 8:30', '2017/10/1 9:00',
    // '2017/10/1 9:30', '2017/10/1 10:00', '2017/10/1 10:30', '2017/10/1 11:00', '2017/10/1 11:30', '2017/10/1 12:00',
// ];

// var tabhtml = "";

// var data_river = [
    // {
        // "id": 1,
        // "time": "2017-11-01 00:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 2,
        // "time": "2017-11-01 02:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 3,
        // "time": "2017-11-01 04:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 4,
        // "time": "2017-11-01 06:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 5,
        // "time": "2017-11-01 08:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 6,
        // "time": "2017-11-01 10:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 7,
        // "time": "2017-11-01 12:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 8,
        // "time": "2017-11-01 14:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }, {
        // "id": 9,
        // "time": "2017-11-01 16:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }, {
        // "id": 10,
        // "time": "2017-11-01 18:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }, {
        // "id": 11,
        // "time": "2017-11-01 20:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }, {
        // "id": 12,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 13,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 14,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // },
    // {
        // "id": 15,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }, {
        // "id": 16,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "riverFlow": "150",
        // "warnLine": "300",
        // "overWarnLine": "400",
        // "saveLine": "280",
        // "overSaveLine": "260"
    // }
// ];
// var data_reservoir = [
    // {
        // "id": 1,
        // "time": "2017-11-01 00:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 2,
        // "time": "2017-11-01 02:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 3,
        // "time": "2017-11-01 04:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 4,
        // "time": "2017-11-01 06:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 5,
        // "time": "2017-11-01 08:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 6,
        // "time": "2017-11-01 10:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 7,
        // "time": "2017-11-01 12:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 8,
        // "time": "2017-11-01 14:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 9,
        // "time": "2017-11-01 16:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 10,
        // "time": "2017-11-01 18:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 11,
        // "time": "2017-11-01 20:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 12,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // },
    // {
        // "id": 13,
        // "time": "2017-11-01 18:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 14,
        // "time": "2017-11-01 20:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 15,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }, {
        // "id": 16,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "riverArea": "渭河",
        // "riverHigh": "200",
        // "riverWeight": "20",
        // "inFlow": "150",
        // "outFlow": "300",
        // "reservoirs": "400",
        // "limited": "280"
    // }

// ];
// var data_rain = [
    // {
        // "id": 1,
        // "time": "2017-11-01 00:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 2,
        // "time": "2017-11-01 01:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 3,
        // "time": "2017-11-01 01:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 4,
        // "time": "2017-11-01 02:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 5,
        // "time": "2017-11-01 02:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 6,
        // "time": "2017-11-01 03:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 7,
        // "time": "2017-11-01 03:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 8,
        // "time": "2017-11-01 04:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 9,
        // "time": "2017-11-01 04:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 10,
        // "time": "2017-11-01 05:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 11,
        // "time": "2017-11-01 06:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 12,
        // "time": "2017-11-01 06:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": 13,
        // "time": "2017-11-01 05:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 14,
        // "time": "2017-11-01 06:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }, {
        // "id": 15,
        // "time": "2017-11-01 06:30",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // },
    // {
        // "id": "...",
        // "time": "...",
        // "code": "...",
        // "name": "...",
        // "adminArea": "...",
        // "RiverAreaName": "渭河",
        // "RiverName": "渭河",
        // "RiverSystemName": "渭河",
        // "dyp": "0.25"
    // }
// ];
// var data_soil = [
    // {
        // "id": 1,
        // "time": "2017-11-01 00:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "25%"
    // },
    // {
        // "id": 2,
        // "time": "2017-11-02 02:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 3,
        // "time": "2017-11-01 04:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 4,
        // "time": "2017-11-01 06:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 5,
        // "time": "2017-11-01 08:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 6,
        // "time": "2017-11-01 10:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 7,
        // "time": "2017-11-01 12:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 8,
        // "time": "2017-11-01 14:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 9,
        // "time": "2017-11-01 16:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 10,
        // "time": "2017-11-01 18:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 12,
        // "time": "2017-11-01 20:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 13,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // },
    // {
        // "id": 14,
        // "time": "2017-11-01 18:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 15,
        // "time": "2017-11-01 20:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }, {
        // "id": 16,
        // "time": "2017-11-01 22:00",
        // "code": "001",
        // "name": "测试站点一",
        // "adminArea": "市辖区",
        // "river": "渭河",
        // "rainfall": "20%"
    // }
// ];


// $(function () {
    // init();
    // initTree();
    // $("#selType").on("change", function () {
        // // params.type = $(this).val();
        // // alert(params.type);
        // if ($(this).val() == 0) {
            // params.type = "river";
        // } else if ($(this).val() == 1) {
            // params.type = "reservoir";
        // } else if ($(this).val() == 2) {
            // params.type = "rain";
        // } else if ($(this).val() == 3) {
            // params.type = "soil";
        // }
    // });

    // resizeWorldMapContainer = function () {
        // document.getElementById('chart').style.width = (window.innerWidth - 253) + 'px';
        // document.getElementById('chart').style.height = (window.innerHeight - 130) + 'px';
    // };
    // resizeWorldMapContainer();
    // myChart = echarts.init(document.getElementById('chart'));
    // option = {
        // title: {
            // text: title + title1 + "过程曲线",
            // subtext: subtitle,
            // left: 'center',
            // textStyle: {
                // fontSize: 16
            // },
            // itemGap: 6
        // },
        // tooltip: {
            // // trigger: 'item',
            // // //formatter: ['站点1', '站点2'] +": {c}  ( 时间：{b} )"
            // // formatter: '{a}: {c}/' + unit + ' ( 时间：{b} )'
        // },

        // grid: {
            // left: '5%',
            // right: '5%',
            // top: "80",
            // bottom: "80"
        // },
        // dataZoom: [
            // {
                // show: true,
                // realtime: true,
                // start: 65,
                // end: 85
            // },
            // {
                // type: 'inside',
                // realtime: true,
                // start: 65,
                // end: 85
            // }
        // ],
        // toolbox: {
            // right: 100,
            // feature: {
                // saveAsImage: {
                    // title: "保存为图片",
                    // iconStyle: {
                        // normal: {
                            // textAlign: "left"
                        // }
                    // },
                    // excludeComponents: ["dataZoom", "toolbox"]
                // }
            // }
        // },
        // legend: {
            // type: 'scroll',
            // top: 40,
            // //data: ['站点1', '站点2']
        // },
        // xAxis: {
            // name: '时间/h',
            // type: 'category',
            // boundaryGap: false,
            // //data: time,
        // },
        // yAxis: {
            // type: 'value',
            // name: unit,
            // nameLocation: "end"
        // },
        // series: []
    // };

    // myChart.setOption(option);
    // window.onresize = function () {
        // //重置容器高宽
        // resizeWorldMapContainer();
        // myChart.resize();
    // };

    // $("body").on("change", "#dataType", function () {
        // data = [Math.random() * 3];
        // data1 = [Math.random() * 2];
        // for (var i = 1; i < 12; i++) {
            // data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
            // data1.push(Math.round((Math.random() - 0.9) * 22 + data1[i - 1]));
        // }
        // unit = $(this).val();
        // title1 = $(this).val();
        // myChart.setOption({
            // tooltip: {
                // trigger: 'item',
                // //formatter: ['站点1', '站点2'] +": {c}  ( 时间：{b} )"
                // formatter: '{a}: {c}/' + unit + ' ( 时间：{b} )'
            // },
            // title: {
                // text: title + title1 + "过程曲线",
            // },
            // yAxis: {
                // name: unit
            // },
            // series: [
                // {
                    // name: '站点1',
                    // symbolSize: 10,
                    // data: data
                // },
                // {
                    // name: '站点2',
                    // symbolSize: 10,
                    // data: data1
                // }
            // ]
        // });
    // });

    // //导出事件
    // $("#exportFile").click(function () {
        // if (params.type === "soil") {
            // var startime = $("#s-date").find("input").val();
            // var endtime = $("#e-date").find("input").val();
            // if ($(".tab0:first ").hasClass("active")) {
                // var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
                // console.log(powers);
            // } else if ($(".tab0:last").hasClass("active")) {
                // var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
                // console.log(powers);
            // }
            // var obj = {
                // Type: 'post',
                // Uri: '/data/exportsoildata',
                // SessionId: $.cookie("sessionid"),
                // Parameter: {
                    // Codes: powers,
                    // StartTime: startime + " 00:00:00",
                    // EndTime: endtime + " 23:59:59"
                // }
            // };
            // DownLoadFile({
                // url: serverConfig.soilExportApi,
                // data: obj
            // });
        // }
    // });

    // $("#tongji").click(function () {
        // var startime = $("#s-date").find("input").val();
        // var endtime = $("#e-date").find("input").val();
        // if ($(".tab0:first ").hasClass("active")) {
            // var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
            // console.log(powers);
        // } else if ($(".tab0:last").hasClass("active")) {
            // var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
            // console.log(powers);
        // }

        // if (startime !== "" && endtime !== "" && powers.length !== 0) {
            // $(".tab-pane").eq(0).addClass("active in").siblings().removeClass("in active");
            // $(".navtab li").eq(0).addClass("active").siblings().removeClass("active");
            // if (params.type === "river") {
                // $("#rivertab").removeClass("hidden").siblings().addClass("hidden");
                // html = "<option value='水位(m)'>水位</option><option value='流量(mm)'>流量</option><option value='水容势(g/m)'>水容势</option>"
                // unit = "水位(m)";
                // title = "河道水情";
                // $("#dataType").html(html);
                // data = [Math.random() * 3];
                // data1 = [Math.random() * 2];
                // for (var i = 1; i < 12; i++) {
                    // data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
                    // data1.push(Math.round((Math.random() - 0.9) * 22 + data1[i - 1]));
                // }
                // myChart.setOption({
                    // title: {
                        // text: title + title1 + "过程曲线",
                        // subtext: subtitle,
                        // left: 'center',
                        // textStyle: {
                            // fontSize: 16
                        // },
                        // itemGap: 6
                    // },
                    // grid: {
                        // left: '5%',
                        // right: '5%',
                        // top: "80",
                        // bottom: "80"
                    // },
                    // dataZoom: [
                        // {
                            // show: true,
                            // realtime: true,
                            // start: 65,
                            // end: 85
                        // },
                        // {
                            // type: 'inside',
                            // realtime: true,
                            // start: 65,
                            // end: 85
                        // }
                    // ],
                    // toolbox: {
                        // right: 100,
                        // feature: {
                            // saveAsImage: {
                                // title: "保存为图片",
                                // iconStyle: {
                                    // normal: {
                                        // textAlign: "left"
                                    // }
                                // },
                                // excludeComponents: ["dataZoom", "toolbox"]
                            // }
                        // }
                    // },
                    // legend: {
                        // type: 'scroll',
                        // top: 40,
                        // data: ['站点1', '站点2']
                    // },
                    // xAxis: {
                        // name: '时间/h',
                        // type: 'category',
                        // boundaryGap: false,
                        // data: time,
                    // },
                    // yAxis: {
                        // name: unit
                    // },
                    // series: [
                        // {
                            // name: '站点1',
                            // type: 'line',
                            // stack: '总量',
                            // symbolSize: 10,
                            // data: data
                        // },
                        // {
                            // name: '站点2',
                            // type: 'line',
                            // stack: '总量',
                            // symbolSize: 10,
                            // data: data1
                        // }
                    // ]
                // }, true);
                // table = $('#river-tab').DataTable({
                    // aaData: data_river,
                    // lengthChange: false,
                    // searching: false,
                    // "iDisplayLength": 15,
                    // destroy: true,
                    // language: reportLanguage,
                    // ordering: false,
                    // columns: [
                        // { "data": "id" },
                        // { "data": "time" },
                        // { "data": "code" },
                        // { "data": "name" },
                        // { "data": "riverArea" },
                        // { "data": "riverHigh" },
                        // { "data": "riverWeight" },
                        // { "data": "riverFlow" },
                        // { "data": "warnLine" },
                        // { "data": "overWarnLine" },
                        // { "data": "saveLine" },
                        // { "data": "overSaveLine" }
                    // ]
                // });
            // } else if (params.type === "reservoir") {
                // $("#reservoirtab").removeClass("hidden").siblings().addClass("hidden");
                // html = "<option value='水位(m)'>水位</option><option value='入库流量(mm)'>入库流量</option><option value='出库流量(mm)'>出库流量</option><option  value='水势(g)'>水势</option>";
                // unit = "水位(m)";
                // title = "水库水情";
                // $("#dataType").html(html);
                // data = [Math.random() * 3];
                // data1 = [Math.random() * 2];
                // for (var i = 1; i < 12; i++) {
                    // data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
                    // data1.push(Math.round((Math.random() - 0.9) * 22 + data1[i - 1]));
                // }
                // myChart.setOption({
                    // title: {
                        // text: title + title1 + "过程曲线",
                        // subtext: subtitle,
                        // left: 'center',
                        // textStyle: {
                            // fontSize: 16
                        // },
                        // itemGap: 6
                    // },
                    // grid: {
                        // left: '5%',
                        // right: '5%',
                        // top: "80",
                        // bottom: "80"
                    // },
                    // dataZoom: [
                        // {
                            // show: true,
                            // realtime: true,
                            // start: 65,
                            // end: 85
                        // },
                        // {
                            // type: 'inside',
                            // realtime: true,
                            // start: 65,
                            // end: 85
                        // }
                    // ],
                    // toolbox: {
                        // right: 100,
                        // feature: {
                            // saveAsImage: {
                                // title: "保存为图片",
                                // iconStyle: {
                                    // normal: {
                                        // textAlign: "left"
                                    // }
                                // },
                                // excludeComponents: ["dataZoom", "toolbox"]
                            // }
                        // }
                    // },
                    // legend: {
                        // type: 'scroll',
                        // top: 40,
                        // data: ['站点1', '站点2']
                    // },
                    // xAxis: {
                        // name: '时间/h',
                        // type: 'category',
                        // boundaryGap: false,
                        // data: time,
                    // },
                    // yAxis: {
                        // name: unit
                    // },
                    // series: [
                        // {
                            // name: '站点1',
                            // data: data,
                            // symbolSize: 10,
                            // type: "line"
                        // },
                        // {
                            // name: '站点2',
                            // data: data1,
                            // symbolSize: 10,
                            // type: "line"
                        // }
                    // ]
                // }, true);
                // table = $('#reservoir-tab').DataTable({
                    // aaData: data_reservoir,
                    // lengthChange: false,
                    // searching: false,
                    // destroy: true,
                    // "iDisplayLength": 15,
                    // language: reportLanguage,
                    // ordering: false,
                    // columns: [
                        // { "data": "id" },
                        // { "data": "time" },
                        // { "data": "code" },
                        // { "data": "name" },
                        // { "data": "riverArea" },
                        // { "data": "riverHigh" },
                        // { "data": "riverWeight" },
                        // { "data": "inFlow" },
                        // { "data": "outFlow" },
                        // { "data": "reservoirs" },
                        // { "data": "limited" }
                    // ]
                // });
            // } else if (params.type === "rain") {
                // var loading = "";
                // $("#raintab").removeClass("hidden").siblings().addClass("hidden");
                // console.log(powers.join(","));
                // var obj = {
                    // Type: 'get',
                    // Uri: '/aControl/RainControl/countRainData',
                    // Parameter: {
                        // "rainCount.stcd": powers.join(","),
                        // "rainCount.startTm": startime + " 00:00:00",
                        // "rainCount.endTm": endtime + " 23:59:59"
                    // }
                // };
                // $.ajax({
                    // url: serverConfig.rainfallfloodApi,
                    // data: JSON.stringify(obj),
                    // beforeSend: function (request) {
                        // loading = layer.load(2, {
                            // shade: [0.5, '#fff']
                        // });
                        // // myChart.showLoading({
                        // //     text: '数据加载中...',
                        // //     zlevel: 2
                        // // });
                    // }
                // }).done(function (data) {
                    // console.log(data);
                    // layer.close(loading);
                    // html = "<option value='降雨量(m^3/s)'>降雨量</option>";
                    // unit = "降雨量(mm)";
                    // title = "降雨量(mm)";
                    // $("#dataType").html(html);
                    // if (data.success) {
                        // table = $('#rain-tab').DataTable({
                            // aaData: data.data,
                            // lengthChange: false,
                            // searching: false,
                            // destroy: true,
                            // language: reportLanguage,
                            // "iDisplayLength": 15,
                            // ordering: false,
                            // columns: [
                                // {
                                    // "data": null,
                                    // "render": function (data, type, row, meta) {
                                        // var startIndex = meta.settings._iDisplayStart;
                                        // return meta.row + 1;
                                    // }
                                // },
                                // { "data": "tm" },
                                // { "data": "addvcd" },
                                // { "data": "stnm" },
                                // { "data": "addvnm" },
                                // { "data": "bsnm" },
                                // { "data": "rvnm" },
                                // { "data": "hnnm" },
                                // {
                                    // "data": "drp",
                                    // "render": function (data, type, row, meta) {
                                        // if (data.length > 0) {
                                            // return data
                                        // } else {
                                            // return 0
                                        // }
                                    // }
                                // }
                            // ]
                        // });
                        // // myChart.hideLoading();
                        // var x_soil_data = [], stationame = [], chartsData = [];
                        // $.each(data.data, function (key, obj) {
                            // x_soil_data.push(obj.tm)
                        // });
                        // for (var i = 0; i < powers.length; i++) {
                            // var tt = $.grep(data.data, function (d) {
                                // return d.addvcd == powers[i];
                            // });
                            // if (tt.length !== 0) {
                                // var stationdata = [];
                                // console.log("找到的站点编码:" + powers[i]);
                                // $.each(tt, function (key, obj) {
                                    // var aa = {
                                        // name: obj.tm,
                                        // value: [obj.tm, obj.drp]
                                    // }
                                    // stationdata.push(aa);
                                // });
                                // var chartsobj = {
                                    // name: tt[0].stnm,
                                    // type: 'bar',
                                    // barGap: '-100%',
                                    // barCategoryGap: '40%',
                                    // barWidth: "15px",
                                    // data: stationdata
                                // };
                                // chartsData.push(chartsobj);
                                // stationame.push(tt[0].stnm)
                            // }
                        // }
                        // console.log(chartsData);
                        // myChart.setOption({
                            // tooltip: {
                                // trigger: 'axis',
                                // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                    // type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                // }
                            // },
                            // title: {
                                // text: title + "过程曲线",
                                // subtext: startime + " 00:00:00 -" + endtime + " 23:59:59",
                                // left: 'center',
                                // textStyle: {
                                    // fontSize: 16
                                // },
                                // itemGap: 6
                            // },
                            // grid: {
                                // left: '5%',
                                // right: '5%',
                                // top: "80",
                                // bottom: "80"
                            // },
                            // dataZoom: [
                                // {
                                    // show: true,
                                    // realtime: true,
                                    // start: 65,
                                    // end: 85
                                // },
                                // {
                                    // type: 'inside',
                                    // realtime: true,
                                    // start: 65,
                                    // end: 85
                                // }
                            // ],
                            // toolbox: {
                                // right: 100,
                                // feature: {
                                    // saveAsImage: {
                                        // title: "保存为图片",
                                        // iconStyle: {
                                            // normal: {
                                                // textAlign: "left"
                                            // }
                                        // },
                                        // excludeComponents: ["dataZoom", "toolbox"]
                                    // }
                                // }
                            // },
                            // legend: {
                                // type: 'scroll',
                                // top: 40,
                                // data: stationame
                            // },
                            // xAxis: {
                                // name: '时间/h',
                                // type: 'time',
                                // splitLine: {
                                    // show: false
                                // }
                            // },
                            // yAxis: {
                                // name: unit,
                                // inverse: true,
                                // nameLocation: "start"
                            // },
                            // series: chartsData
                        // }, true);
                    // } else {
                        // layer.msg(data.message);
                        // myChart.hideLoading();
                    // }
                // });

            // } else if (params.type === "soil") {
                // //alert($("#s-date").find("input").val());
                // // myChart.showLoading({
                // //     text: '数据加载中...'
                // // });
                // var loading = "";
                // var obj = {
                    // Type: 'post',
                    // Uri: '/data/getsoildata',
                    // Parameter: {
                        // Codes: powers,
                        // StartTime: startime + " 00:00:00",
                        // EndTime: endtime + " 23:59:59"
                    // }
                // };
                // //console.log(obj);
                // $.ajax({
                    // url: serverConfig.soilApi,
                    // data: JSON.stringify(obj),
                    // beforeSend: function (request) {
                        // loading = layer.load(2, {
                            // shade: [0.5, '#fff'] //0.1透明度的白色背景
                        // });
                    // }
                // }).done(function (data) {
                    // if (data.success) {
                        // layer.close(loading);
                        // var x_soil_data = [], stationame = [], chartsData = [];
                        // console.log(data.data);
                        // $("#soiltab").removeClass("hidden").siblings().addClass("hidden");
                        // html = "<option value='重量含水量（%）'>重量含水量</option>";
                        // $("#dataType").html(html);
                        // title = "墒情";
                        // title1 = "重量含水量（%）";
                        // unit = "重量含水量（%）";
                        // $.each(data.data, function (key, obj) {
                            // x_soil_data.push(obj.Time.replace("T", " "))
                        // });
                        // for (var i = 0; i < powers.length; i++) {
                            // var tt = $.grep(data.data, function (d) {
                                // return d.Code == powers[i];
                            // });
                            // if (tt.length !== 0) {
                                // var stationdata = [];
                                // console.log("找到的站点编码:" + powers[i]);
                                // $.each(tt, function (key, obj) {
                                    // var aa = {
                                        // name: obj.Time,
                                        // value: [obj.Time, obj.MA]
                                    // }
                                    // stationdata.push(aa);
                                // });
                                // var chartsobj = {
                                    // name: tt[0].Name,
                                    // type: 'line',
                                    // symbolSize: 10,
                                    // data: stationdata
                                // };
                                // chartsData.push(chartsobj);
                                // stationame.push(tt[0].Name)
                            // }
                        // }
                        // console.log(chartsData);
                        // // console.log("找到的所有站点编码名组合:" + stationname);
                        // // myChart.refresh;
                        // myChart.setOption({
                            // title: {
                                // text: title + title1 + "过程曲线",
                                // subtext: startime + " 00:00:00 -" + endtime + " 23:59:59",
                                // left: 'center',
                                // textStyle: {
                                    // fontSize: 16
                                // },
                                // itemGap: 6
                            // },
                            // grid: {
                                // left: '5%',
                                // right: '5%',
                                // top: "80",
                                // bottom: "80"
                            // },
                            // dataZoom: [
                                // {
                                    // show: true,
                                    // realtime: true,
                                    // start: 65,
                                    // end: 85
                                // },
                                // {
                                    // type: 'inside',
                                    // realtime: true,
                                    // start: 65,
                                    // end: 85
                                // }
                            // ],
                            // toolbox: {
                                // right: 100,
                                // feature: {
                                    // saveAsImage: {
                                        // title: "保存为图片",
                                        // iconStyle: {
                                            // normal: {
                                                // textAlign: "left"
                                            // }
                                        // },
                                        // excludeComponents: ["dataZoom", "toolbox"]
                                    // }
                                // }
                            // },
                            // legend: {
                                // data: stationame,
                                // type: 'scroll',
                                // top: 40
                            // },
                            // tooltip: {
                                // trigger: 'axis',
                                // axisPointer: {
                                    // type: 'cross',
                                    // animation: false,
                                    // label: {
                                        // backgroundColor: '#505765'
                                    // }
                                // }
                            // },
                            // xAxis: {
                                // name: '时间/h',
                                // type: 'time',
                                // splitLine: {
                                    // show: false
                                // }
                            // },
                            // yAxis: {
                                // name: unit,
                                // type: 'value',
                                // inverse: false
                            // },
                            // series: chartsData
                        // }, true);
                        // table = $('#soil-tab').DataTable({
                            // aaData: data.data,
                            // lengthChange: false,
                            // searching: false,
                            // destroy: true,
                            // "iDisplayLength": 15,
                            // language: reportLanguage,
                            // ordering: false,
                            // columns: [
                                // { "data": null, "targets": 0 },
                                // { "data": "Time" },
                                // { "data": "Code" },
                                // { "data": "Name" },
                                // { "data": "AreaName" },
                                // { "data": "RiverAreaName" },
                                // { "data": "RiverSystemName" },
                                // { "data": "RiverName" },
                                // { "data": "M10" },
                                // { "data": "M20" },
                                // { "data": "M40" },
                                // { "data": "MA" }
                            // ],
                            // fnDrawCallback: function () { //解决序号列没法生成的问题
                                // var api = this.api();
                                // var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数(适用于后台分页)
                                // api.column(0).nodes().each(function (cell, i) {
                                    // cell.innerHTML = 1 + i;
                                    // //适用于后台分页 cell.innerHTML =  1 + i+startIndex;
                                // });
                                // api.column(1).nodes().each(function (cell, i) {
                                    // cell.innerHTML = cell.innerHTML.replace("T", " ");
                                // });
                            // }
                        // });
                    // } else {
                        // layer.msg(data.message);
                        // layer.close(loading);
                    // }
                // });
            // }
        // } else {
            // layer.msg("请选择站点以及开始和结束时间!")
        // }
    // });
    // $("#s-date,#e-date").datetimepicker({
        // format: "yyyy-mm-dd",
        // language: 'zh-CN',
        // weekStart: 1,
        // todayBtn: true,
        // autoclose: true,
        // todayHighlight: 1,
        // startView: 2,
        // minView: 2,
        // forceParse: 0,
        // pickerPosition: "top-left",
        // endDate: new Date()
    // });
    // $("#s-date,#e-date").datetimepicker('update', new Date());

    // table = $('#river-tab').DataTable({
        // aaData: data_river,
        // lengthChange: false,
        // "iDisplayLength": 15,
        // searching: false,
        // destroy: true,
        // language: reportLanguage,
        // ordering: false,
        // columns: [
            // { "data": "id" },
            // { "data": "time" },
            // { "data": "code" },
            // { "data": "name" },
            // { "data": "riverArea" },
            // { "data": "riverHigh" },
            // { "data": "riverWeight" },
            // { "data": "riverFlow" },
            // { "data": "warnLine" },
            // { "data": "overWarnLine" },
            // { "data": "saveLine" },
            // { "data": "overSaveLine" }
        // ]
    // });
    // $("#searchAction").click(function () {
        // zTree = $.fn.zTree.getZTreeObj("treeDemoCity");
        // nodes = zTree.getNodes();
        // zTree.cancelSelectedNode();
        // if ($("#searchTxt").val() != "") {
            // searchNodes = zTree.getNodesByParamFuzzy("name", $("#searchTxt").val(), null);
            // if (searchNodes != null && searchNodes != undefined) {
                // for (var i = 0; i < searchNodes.length; i++) {
                    // zTree.selectNode(searchNodes[i], true, false);
                // }
            // }
        // }
    // });

    // $("#searchAction1").click(function () {
        // zTree = $.fn.zTree.getZTreeObj("treeDemoRiver");
        // nodes = zTree.getNodes();
        // zTree.cancelSelectedNode();
        // if ($("#searchTxt1").val() != "") {
            // searchNodes = zTree.getNodesByParamFuzzy("name", $("#searchTxt1").val(), null);
            // if (searchNodes != null && searchNodes != undefined) {
                // for (var i = 0; i < searchNodes.length; i++) {
                    // zTree.selectNode(searchNodes[i], true, false);
                // }
            // }
        // }
    // });

    // var selectData = [{ id: 0, text: '河道水情' }, { id: 1, text: '水库水情' }, { id: 2, text: '雨情' }, { id: 3, text: '墒情' }];
    // $("#selType").select2({
        // data: selectData
    // })
// });

// function getDate(datestr) {
    // var temp = datestr.split("-");
    // var date = new Date(temp[0], temp[1], temp[2]);
    // return date;
// }

// function daysBetween(sDate1, sDate2) {
// //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
    // var time1 = Date.parse(new Date(sDate1));
    // var time2 = Date.parse(new Date(sDate2));
    // var nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24));
    // return nDays;
// };

// //搜索站点
// function keydownSearch() {
    // $("#searchAction").click();
// };

// function keydownSearch1() {
    // $("#searchAction1").click();
// };

// //初始化站点树
// function initTree() {
    // var setting = {
        // check: {
            // enable: true,
            // chkboxType: { "Y": "ps", "N": "ps" }
            // //chkboxType: { "Y": "ps", "N": "ps" },
        // },
        // data: {
            // simpleData: {
                // enable: true,
                // idKey: "id", // id编号命名
                // pIdKey: "pId", // 父id编号命名
                // rootPId: 0
            // }
        // },
        // view: {
            // showIcon: true
        // }
    // };
    // $.fn.zTree.init($("#treeDemoCity"), setting, JSON.parse(localStorage.getItem("treearea")));
    // $.fn.zTree.init($("#treeDemoRiver"), setting, JSON.parse(localStorage.getItem("treeriver")));
    // var treeObj = $.fn.zTree.getZTreeObj("treeDemoCity");
    // treeObj.expandAll(true);
    // var treeObjr = $.fn.zTree.getZTreeObj("treeDemoRiver");
    // treeObjr.expandAll(true);
// }

// function GetNodeIds(zTree, nodes, ids) {
    // for (var i = 0; i < nodes.length; i++) {
        // if (nodes[i].checked && !nodes[i].getCheckStatus().half) {
            // if (nodes[i].id.length === 8) {
                // ids.push(nodes[i].id)
            // }
        // }
        // if (nodes[i].children != null) {
            // GetNodeIds(zTree, nodes[i].children, ids);
        // }
    // }
    // return ids;
// }