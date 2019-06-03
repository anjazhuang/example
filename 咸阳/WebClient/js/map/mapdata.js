var isFull = false;

//各站点数据
// var map_Waterlevelstation_data = [
//         {
//             "id": 1,
//             "name": "水位站001",
//             "Longitude": 108.77,
//             "Latitude": 34.52,
//             "code": "600001",
//             "level": "中央报汛站",
//             "stationtype": "水位站",
//             "area": "泾阳县",
//             "basin": "渭河",
//             "warnstate": true,
//             "warningtype": "超出河道水位正常范围,超出河道流量正常范围",
//             "content": [
//                 { "time": "00:00", "value": 4.5 },
//                 { "time": "04:00", "value": 4.2 },
//                 { "time": "08:00", "value": 2.8 },
//                 { "time": "12:00", "value": 1.6 },
//                 { "time": "16:00", "value": 4.5 },
//                 { "time": "20:00", "value": 3.7 }
//             ]
//         },
//         {
//             "id": 2,
//             "name": "水位站002",
//             "Longitude": 108.50,
//             "Latitude": 34.75,
//             "code": "600002",
//             "level": "中央报汛站",
//             "stationtype": "水位站",
//             "area": "礼泉县",
//             "basin": "渭河",
//             "warnstate": true,
//             "warningtype": "超出河道流量正常范围",
//             "content": [
//                 { "time": "00:00", "value": 3.5 },
//                 { "time": "04:00", "value": 3.2 },
//                 { "time": "08:00", "value": 3.8 },
//                 { "time": "12:00", "value": 3.6 },
//                 { "time": "16:00", "value": 3.0 },
//                 { "time": "20:00", "value": 3.2 }
//             ]
//         },
//         {
//             "id": 3,
//             "name": "水位站003",
//             "Longitude": 108.27,
//             "Latitude": 34.90,
//             "code": "600003",
//             "level": "省级一般报汛站",
//             "stationtype": "水位站",
//             "area": "永寿县",
//             "basin": "渭河",
//             "warnstate": false,
//             "warningtype": "",
//             "content": [
//                 { "time": "00:00", "value": 4.3 },
//                 { "time": "04:00", "value": 4.2 },
//                 { "time": "08:00", "value": 3.8 },
//                 { "time": "12:00", "value": 2.6 },
//                 { "time": "16:00", "value": 4.0 },
//                 { "time": "20:00", "value": 4.75 }
//             ]
//         },
//         {
//             "id": 4,
//             "name": "水位站004",
//             "Longitude": 108.51,
//             "Latitude": 35.23,
//             "code": "600004",
//             "level": "省级一般报汛站",
//             "stationtype": "水位站",
//             "area": "旬邑县",
//             "basin": "渭河",
//             "warnstate": true,
//             "warningtype": "超出河道水位正常范围",
//             "content": [
//                 { "time": "00:00", "value": 3.3 },
//                 { "time": "04:00", "value": 4.2 },
//                 { "time": "08:00", "value": 5.8 },
//                 { "time": "12:00", "value": 4.6 },
//                 { "time": "16:00", "value": 5.0 },
//                 { "time": "20:00", "value": 4.5 }
//             ]
//         },
//         {
//             "id": 5,
//             "name": "水位站005",
//             "Longitude": 108.05,
//             "Latitude": 35.10,
//             "code": "600005",
//             "level": "中央报汛站",
//             "stationtype": "水位站",
//             "area": "彬县",
//             "basin": "渭河",
//             "warnstate": false,
//             "warningtype": "",
//             "content": [
//                 { "time": "00:00", "value": 2.3 },
//                 { "time": "04:00", "value": 2.2 },
//                 { "time": "08:00", "value": 2.8 },
//                 { "time": "12:00", "value": 2.6 },
//                 { "time": "16:00", "value": 2.0 },
//                 { "time": "20:00", "value": 2.2 }
//             ]
//         }
//     ],
//     map_Rainlstation_data = [
//         {
//             "id": 6,
//             "name": "雨量站001",
//             "Longitude": 108.13,
//             "Latitude": 34.45,
//             "code": "600006",
//             "level": "中央报汛站",
//             "stationtype": "雨量站",
//             "area": "乾县",
//             "basin": "渭河",
//             "content": [
//                 { "time": "00:00", "value": 20 },
//                 { "time": "04:00", "value": 22 },
//                 { "time": "08:00", "value": 24 },
//                 { "time": "12:00", "value": 26 },
//                 { "time": "16:00", "value": 270 },
//                 { "time": "20:00", "value": 21 }
//             ]
//         },
//         {
//             "id": 7,
//             "name": "雨量站002",
//             "Longitude": 108.10,
//             "Latitude": 34.80,
//             "code": "600007",
//             "level": "省级一般报汛站",
//             "stationtype": "雨量站",
//             "area": "永寿县",
//             "basin": "泾河",
//             "warnstate": true,
//             "warningtype": "超出降雨量正常范围",
//             "content": [
//                 { "time": "00:00", "value": 20 },
//                 { "time": "04:00", "value": 100 },
//                 { "time": "08:00", "value": 35 },
//                 { "time": "12:00", "value": 150 },
//                 { "time": "16:00", "value": 300 },
//                 { "time": "20:00", "value": 30 }
//             ]
//         },
//         {
//             "id": 8,
//             "name": "雨量站003",
//             "Longitude": 108.45,
//             "Latitude": 34.60,
//             "code": "600008",
//             "level": "中央报汛站",
//             "stationtype": "雨量站",
//             "area": "礼泉县",
//             "basin": "泾河",
//             "warnstate": true,
//             "warningtype": "超出降雨量正常范围",
//             "content": [
//                 { "time": "00:00", "value": 5 },
//                 { "time": "04:00", "value": 8 },
//                 { "time": "08:00", "value": 20 },
//                 { "time": "12:00", "value": 35 },
//                 { "time": "16:00", "value": 40 },
//                 { "time": "20:00", "value": 45 }
//             ]
//         },
//         {
//             "id": 9,
//             "name": "雨量站004",
//             "Longitude": 108.62,
//             "Latitude": 34.90,
//             "code": "600009",
//             "level": "中央报汛站",
//             "stationtype": "雨量站",
//             "area": "淳化县",
//             "basin": "渭河",
//             "warnstate": false,
//             "warningtype": "",
//             "content": [
//                 { "time": "00:00", "value": 0 },
//                 { "time": "04:00", "value": 30 },
//                 { "time": "08:00", "value": 35 },
//                 { "time": "12:00", "value": 250 },
//                 { "time": "16:00", "value": 400 },
//                 { "time": "20:00", "value": 20 }
//             ]
//         },
//         {
//             "id": 10,
//             "name": "雨量站005",
//             "Longitude": 109.00,
//             "Latitude": 34.70,
//             "code": "600010",
//             "level": "中央报汛站",
//             "stationtype": "雨量站",
//             "area": "三原县",
//             "basin": "渭河",
//             "warnstate": false,
//             "warningtype": "",
//             "content": [
//                 { "time": "00:00", "value": 0 },
//                 { "time": "04:00", "value": 80 },
//                 { "time": "08:00", "value": 70 },
//                 { "time": "12:00", "value": 200 },
//                 { "time": "16:00", "value": 50 },
//                 { "time": "20:00", "value": 80 }
//             ]
//         }
//     ],
//     map_Soilstation_data = [
//         {
//             "id": 11,
//             "name": "墒情站001",
//             "Longitude": 108.40,
//             "Latitude": 34.32,
//             "code": "600011",
//             "level": "中央报汛站",
//             "stationtype": "墒情站",
//             "area": "兴平市",
//             "basin": "渭河",
//             "warnstate": false,
//             "warningtype": "",
//             "content": [
//                 { "time": "00:00", "value": 50 },
//                 { "time": "04:00", "value": 60 },
//                 { "time": "08:00", "value": 70 },
//                 { "time": "12:00", "value": 60 },
//                 { "time": "16:00", "value": 50 },
//                 { "time": "20:00", "value": 40 }
//             ]
//         },
//         {
//             "id": 12,
//             "name": "墒情站002",
//             "Longitude": 108.28,
//             "Latitude": 34.80,
//             "code": "600012",
//             "level": "中央报汛站",
//             "stationtype": "墒情站",
//             "area": "永寿县",
//             "basin": "渭河",
//             "warnstate": false,
//             "warningtype": "",
//             "content": [
//                 { "time": "00:00", "value": 30 },
//                 { "time": "04:00", "value": 40 },
//                 { "time": "08:00", "value": 50 },
//                 { "time": "12:00", "value": 70 },
//                 { "time": "16:00", "value": 80 },
//                 { "time": "20:00", "value": 90 }
//             ]
//         },
//         {
//             "id": 13,
//             "name": "墒情站003",
//             "Longitude": 107.90,
//             "Latitude": 34.98,
//             "code": "600013",
//             "level": "中央报汛站",
//             "stationtype": "墒情站",
//             "area": "彬县",
//             "basin": "泾河",
//             "warnstate": true,
//             "warningtype": "超出降雨量正常范围,超出相对湿度正常范围",
//             "content": [
//                 { "time": "00:00", "value": 20 },
//                 { "time": "04:00", "value": 40 },
//                 { "time": "08:00", "value": 50 },
//                 { "time": "12:00", "value": 80 },
//                 { "time": "16:00", "value": 30 },
//                 { "time": "20:00", "value": 40 }
//             ]
//         },
//         {
//             "id": 14,
//             "name": "墒情站004",
//             "Longitude": 108.51,
//             "Latitude": 35.10,
//             "code": "600014",
//             "level": "中央报汛站",
//             "stationtype": "墒情站",
//             "area": "旬邑县",
//             "basin": "泾河",
//             "warnstate": true,
//             "warningtype": "超出降雨量正常范围",
//             "content": [
//                 { "time": "00:00", "value": 30 },
//                 { "time": "04:00", "value": 40 },
//                 { "time": "08:00", "value": 90 },
//                 { "time": "12:00", "value": 80 },
//                 { "time": "16:00", "value": 70 },
//                 { "time": "20:00", "value": 90 }
//             ]
//         },
//         {
//             "id": 15,
//             "name": "墒情站005",
//             "Longitude": 108.10,
//             "Latitude": 35.25,
//             "code": "600015",
//             "level": "中央报汛站",
//             "stationtype": "墒情站",
//             "area": "彬县",
//             "basin": "泾河",
//             "warnstate": false,
//             "warningtype": "",
//             "content": [
//                 { "time": "00:00", "value": 30 },
//                 { "time": "04:00", "value": 40 },
//                 { "time": "08:00", "value": 50 },
//                 { "time": "12:00", "value": 40 },
//                 { "time": "16:00", "value": 50 },
//                 { "time": "20:00", "value": 40 }
//             ]
//         }
//     ],
//     map_Hydrologystation_data = [
//         {
//             "id": 16,
//             "name": "水文站001",
//             "Longitude": 108.68,
//             "Latitude": 34.35,
//             "code": "600016",
//             "level": "中央报汛站",
//             "stationtype": "水文站",
//             "area": "咸阳市",
//             "basin": "渭河",
//             "warnstate": true,
//             "warningtype": "超出水库水位正常范围",
//             "content": [
//                 { "time": "00:00", "value": 4.05 },
//                 { "time": "04:00", "value": 4.18 },
//                 { "time": "08:00", "value": 4.35 },
//                 { "time": "12:00", "value": 4.55 },
//                 { "time": "16:00", "value": 4.75 },
//                 { "time": "20:00", "value": 4.85 }
//             ]
//         },
//         {
//             "id": 17,
//             "name": "水文站002",
//             "Longitude": 108.68,
//             "Latitude": 34.80,
//             "code": "600017",
//             "level": "中央报汛站",
//             "stationtype": "水文站",
//             "area": "长武县",
//             "basin": "渭河",
//             "warnstate": false,
//             "warningtype": "",
//             "content": [
//                 { "time": "00:00", "value": 4.05 },
//                 { "time": "04:00", "value": 4.18 },
//                 { "time": "08:00", "value": 4.35 },
//                 { "time": "12:00", "value": 4.25 },
//                 { "time": "16:00", "value": 4.55 },
//                 { "time": "20:00", "value": 4.85 }
//             ]
//         },
//         {
//             "id": 18,
//             "name": "水文站003",
//             "Longitude": 107.85,
//             "Latitude": 35.20,
//             "code": "600018",
//             "level": "中央报汛站",
//             "stationtype": "水文站",
//             "area": "旬邑县",
//             "basin": "渭河",
//             "warnstate": false,
//             "warningtype": "",
//             "content": [
//                 { "time": "00:00", "value": 4.85 },
//                 { "time": "04:00", "value": 4.28 },
//                 { "time": "08:00", "value": 4.35 },
//                 { "time": "12:00", "value": 4.35 },
//                 { "time": "16:00", "value": 4.75 },
//                 { "time": "20:00", "value": 4.55 }
//             ]
//         },
//         {
//             "id": 19,
//             "name": "水文站004",
//             "Longitude": 108.31,
//             "Latitude": 35.10,
//             "code": "600019",
//             "level": "中央报汛站",
//             "stationtype": "水文站",
//             "area": "旬邑县",
//             "basin": "泾河",
//             "warnstate": false,
//             "warningtype": "",
//             "content": [
//                 { "time": "00:00", "value": 4.05 },
//                 { "time": "04:00", "value": 4.68 },
//                 { "time": "08:00", "value": 4.35 },
//                 { "time": "12:00", "value": 4.25 },
//                 { "time": "16:00", "value": 4.95 },
//                 { "time": "20:00", "value": 4.85 }
//             ]
//         },
//         {
//             "id": 20,
//             "name": "水文站005",
//             "Longitude": 108.68,
//             "Latitude": 35.38,
//             "code": "600020",
//             "level": "中央报汛站",
//             "stationtype": "水文站",
//             "area": "兴平市",
//             "basin": "泾河",
//             "warnstate": false,
//             "warningtype": "",
//             "content": [
//                 { "time": "00:00", "value": 4.05 },
//                 { "time": "04:00", "value": 4.18 },
//                 { "time": "08:00", "value": 4.11 },
//                 { "time": "12:00", "value": 4.55 },
//                 { "time": "16:00", "value": 4.75 },
//                 { "time": "20:00", "value": 4.85 }
//             ]
//         }
//     ];

// var map_sationData = [];

//报警数据
var warning_data = [
    { Code: 41101000, Longitude: 108.091823, Latitude: 34.234731, Warningcontent: ['超出河道水位正常范围', '超出河道流量正常范围'] },
    { Code: 41106600, Longitude: 108.129336, Latitude: 34.28549, Warningcontent: ['超出河道水位正常范围'] },
    { Code: 41110205, Longitude: 108.907222, Latitude: 34.685, Warningcontent: ['超出河道流量正常范围'] },
    { Code: 41138602, Longitude: 108.591667, Latitude: 34.886389, Warningcontent: ['超出降雨量正常范围'] },
    { Code: 41132060, Longitude: 108.076111, Latitude: 34.654444, Warningcontent: ['超出降雨量正常范围'] },
    { Code: 41233952, Longitude: 108.148333, Latitude: 35.127222, Warningcontent: ['超出水库水位正常范围'] }
];

//数据报表table配置
var stationinfo_table_option = {
    "aaSorting": [[0, "asc"]],
    "searching": false,
    "bDestroy": true,
    columns: [
        { "data": "Time" },
        { "data": "Value" }
    ]
}


//实时雨情数据
var rianfall_regime_data = [
    {
        "id": 1,
        "region": "秦都区",
        "code": "600001",
        "station": "站00001",
        "updatetime": "2018.01.01 15:00",
        "rainfall": "5",
        "basin": "渭河"
    },
    {
        "id": 2,
        "region": "渭城区",
        "code": "600002",
        "station": "站00002",
        "updatetime": "2018.01.01 15:00",
        "rainfall": "9",
        "basin": "渭河"
    },
    {
        "id": 3,
        "region": "兴平市",
        "code": "600003",
        "station": "站00003",
        "updatetime": "2018.01.01 15:00",
        "rainfall": "15",
        "basin": "渭河"
    },
    {
        "id": 4,
        "region": "兴平市",
        "code": "600003",
        "station": "站00003",
        "updatetime": "2018.01.01 15:00",
        "rainfall": "15",
        "basin": "渭河"
    },
    {
        "id": 5,
        "region": "兴平市",
        "code": "600003",
        "station": "站00003",
        "updatetime": "2018.01.01 15:00",
        "rainfall": "15",
        "basin": "渭河"
    },
    {
        "id": 6,
        "region": "兴平市",
        "code": "600003",
        "station": "站00003",
        "updatetime": "2018.01.01 15:00",
        "rainfall": "15",
        "basin": "渭河"
    },
    {
        "id": 7,
        "region": "兴平市",
        "code": "600003",
        "station": "站00003",
        "updatetime": "2018.01.01 15:00",
        "rainfall": "15",
        "basin": "渭河"
    }, {
        "id": 8,
        "region": "兴平市",
        "code": "600003",
        "station": "站00003",
        "updatetime": "2018.01.01 15:00",
        "rainfall": "15",
        "basin": "渭河"
    },
    {
        "id": 9,
        "region": "兴平市",
        "code": "600003",
        "station": "站00003",
        "updatetime": "2018.01.01 15:00",
        "rainfall": "15",
        "basin": "渭河"
    },
    {
        "id": 10,
        "region": "兴平市",
        "code": "600003",
        "station": "站00003",
        "updatetime": "2018.01.01 15:00",
        "rainfall": "15",
        "basin": "渭河"
    },
    {
        "id": 11,
        "region": "兴平市",
        "code": "600003",
        "station": "站00003",
        "updatetime": "2018.01.01 15:00",
        "rainfall": "15",
        "basin": "渭河"
    }
];


//实时水情数据
var river_table, reservoir_table;
var river_table_option = {
    language: reportLanguage1,
    "bDestroy": true,
    "bPaginate": true,
    "bInfo": true,
    "aaSorting": [[1, "asc"]],
    columns: [
        { "data": "river_course" },
        { "data": "code" },
        { "data": "station" },
        { "data": "updatetime" },
        { "data": "water_level" },
        { "data": "flow" }
    ]
};
var reservoir_table_option = {
    language: reportLanguage1,
    "bDestroy": true,
    "bInfo": true,
    "bPaginate": true,
    "aaSorting": [[1, "asc"]],
    columns: [
        { "data": "river_course" },
        { "data": "code" },
        { "data": "station" },
        { "data": "updatetime" },
        { "data": "water_level" },
        { "data": "flow" }
    ]
}
var river_regime_data = [
    {
        "id": 1,
        "river_course": "漆水河东段",
        "code": "601",
        "station": "站1",
        "water_level": "3.2",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 2,
        "river_course": "达溪河西段",
        "code": "602",
        "station": "站2",
        "water_level": "2.1",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 3,
        "river_course": "清峪河北段",
        "code": "603",
        "station": "站3",
        "water_level": "1.8",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 4,
        "river_course": "三水河南段",
        "code": "604",
        "station": "站4",
        "water_level": "1.7",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 5,
        "river_course": "黑河南段",
        "code": "605",
        "station": "站5",
        "water_level": "6.5",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 6,
        "river_course": "黑河南段",
        "code": "605",
        "station": "站5",
        "water_level": "6.5",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 7,
        "river_course": "黑河南段",
        "code": "605",
        "station": "站5",
        "water_level": "6.5",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 8,
        "river_course": "黑河南段",
        "code": "605",
        "station": "站5",
        "water_level": "6.5",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 9,
        "river_course": "黑河南段",
        "code": "605",
        "station": "站5",
        "water_level": "6.5",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 10,
        "river_course": "黑河南段",
        "code": "605",
        "station": "站5",
        "water_level": "6.5",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 11,
        "river_course": "黑河南段",
        "code": "605",
        "station": "站5",
        "water_level": "6.5",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    }
];
var reservoir_regime_data = [
    {
        "id": 1,
        "river_course": "乾陵水库",
        "code": "601",
        "station": "站1",
        "water_level": "2.2",
        "flow": "3",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 2,
        "river_course": "泔河水库",
        "code": "602",
        "station": "站2",
        "water_level": "2.5",
        "flow": "5",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 3,
        "river_course": "羊毛湾水库",
        "code": "603",
        "station": "站3",
        "water_level": "1.9",
        "flow": "5",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 4,
        "river_course": "弓王水库",
        "code": "604",
        "station": "站4",
        "water_level": "2.7",
        "flow": "4",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 5,
        "river_course": "弓王水库",
        "code": "604",
        "station": "站4",
        "water_level": "2.7",
        "flow": "4",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 6,
        "river_course": "弓王水库",
        "code": "604",
        "station": "站4",
        "water_level": "2.7",
        "flow": "4",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 7,
        "river_course": "弓王水库",
        "code": "604",
        "station": "站4",
        "water_level": "2.7",
        "flow": "4",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 8,
        "river_course": "弓王水库",
        "code": "604",
        "station": "站4",
        "water_level": "2.7",
        "flow": "4",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 9,
        "river_course": "弓王水库",
        "code": "604",
        "station": "站4",
        "water_level": "2.7",
        "flow": "4",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 10,
        "river_course": "弓王水库",
        "code": "604",
        "station": "站4",
        "water_level": "2.7",
        "flow": "4",
        "updatetime": "2018.0.1 15:00"
    },
    {
        "id": 11,
        "river_course": "弓王水库",
        "code": "604",
        "station": "站4",
        "water_level": "2.7",
        "flow": "4",
        "updatetime": "2018.0.1 15:00"
    }
];

//实情墒情
var drought_statistics_data = [
    {
        "id": 1,
        "magnitude": "适墒（60以上）",
        "amount": "5",
        "content": [
            { "station": "站00001", "humidity": "60", "humidity1": "60", "humidity2": "60", "humidity3": "60" },
            { "station": "站00002", "humidity": "70", "humidity1": "70", "humidity2": "70", "humidity3": "70" },
            { "station": "站00003", "humidity": "65", "humidity1": "65", "humidity2": "65", "humidity3": "65" },
            { "station": "站00004", "humidity": "63", "humidity1": "63", "humidity2": "63", "humidity3": "63" },
            { "station": "站00005", "humidity": "62", "humidity1": "62", "humidity2": "62", "humidity3": "62" }
        ]
    },
    {
        "id": 2,
        "magnitude": "轻度干旱（50-60）",
        "amount": "4",
        "content": [
            { "station": "站00006", "humidity": "51", "humidity1": "60", "humidity2": "60", "humidity3": "60" },
            { "station": "站00007", "humidity": "52", "humidity1": "60", "humidity2": "60", "humidity3": "60" },
            { "station": "站00008", "humidity": "55", "humidity1": "60", "humidity2": "60", "humidity3": "60" },
            { "station": "站00009", "humidity": "58", "humidity1": "60", "humidity2": "60", "humidity3": "60" },
        ]
    },
    {
        "id": 3,
        "magnitude": "中度干旱（40-50）",
        "amount": "3",
        "content": [
            { "station": "站00010", "humidity": "45", "humidity1": "60", "humidity2": "60", "humidity3": "60" },
            { "station": "站00011", "humidity": "47", "humidity1": "60", "humidity2": "60", "humidity3": "60" },
            { "station": "站00012", "humidity": "48", "humidity1": "60", "humidity2": "60", "humidity3": "60" }
        ]
    },
    {
        "id": 4,
        "magnitude": "严重干旱（30-40）",
        "amount": "2",
        "content": [
            { "station": "站00013", "humidity": "32", "humidity1": "60", "humidity2": "60", "humidity3": "60" },
            { "station": "站00014", "humidity": "38", "humidity1": "60", "humidity2": "60", "humidity3": "60" }
        ]
    },
    {
        "id": 5,
        "magnitude": "特大干旱（0-30）",
        "amount": "1",
        "content": [
            { "station": "站00015", "humidity": "28", "humidity1": "60", "humidity2": "60", "humidity3": "60" }
        ]
    }
];

//监测站点
var detectiondevicetable, stationnetworktable;
var detectiondevicetable_option = {
    language: reportLanguage1,
    "bPaginate": true,
    "bDestroy": true,
    "iDisplayLength": 10,
    "bInfo": true,
    "aaSorting": [[0, "asc"]],
    columns: [
        { "data": "Code" },
        { "data": "Name" },
        { "data": "AreaName" },
        // { "data": "RiverAreaName" },
        { "data": "RiverSystemName" },
        { "data": "RiverName" },
        { "data": "Level" },
        { "data": "Type" }
    ],
    columnDefs: [
        {
            targets: 7,
            render: function (data, type, row) {
                // var array = JSON.stringify(row).replace(/\"/g,"'");
                return '<button type="button" class="btn btn-sm btn-warning" onclick="Mapmove(' + JSON.stringify(row).replace(/\"/g, "'") + ')"><span class="glyphicon glyphicon-map-marker"></span>&nbsp;定位</button>';
            }
        }
    ]
}
stationnetworktable_option = {
    "bDestroy": true,
    "aaSorting": [[0, "desc"]],
    "iDisplayLength": 5,
    searching: false,
    columns: [
        { "data": "name" },
        { "data": "value" }
    ]
};

var stationnetwork_data2 = [
    { "name": "水文站", "value": "16" },
    { "name": "雨量站", "value": "100" },
    { "name": "水位站", "value": "4" },
    { "name": "墒情站", "value": "4" }
];

var stationnetwork_data1 = [
    { "name": "2015", "value": "35" },
    { "name": "2016", "value": "60" },
    { "name": "2017", "value": "90" },
    { "name": "2018", "value": "124" }
];

var stationerror_data = [
    { "name": "三原县", "normal": "59", "error": "9" },
    { "name": "泾阳县", "normal": "71", "error": "11" },
    { "name": "礼泉县", "normal": "65", "error": "16" },
    { "name": "乾县", "normal": "59", "error": "14" },
    { "name": "永寿县", "normal": "56", "error": "13" },
    { "name": "彬县", "normal": "67", "error": "17" },
    { "name": "长武县", "normal": "67", "error": "15" },
    { "name": "旬邑县", "normal": "63", "error": "12" },
    { "name": "淳化县", "normal": "61", "error": "19" },
    { "name": "武功县", "normal": "63", "error": "12" }
];

var stationerror_bar_xAxis = [];
var stationerror_bar_yAxis0 = [];
var stationerror_bar_yAxis1 = [];
// $.each(stationnetwork_data1, function (key, obj) {
//     stationnetwork_bar_xAxis.push(obj.name);
//     stationnetwork_bar_yAxis.push(obj.value);
// });

$.each(stationerror_data, function (key, obj) {
    stationerror_bar_xAxis.push(obj.name);
    stationerror_bar_yAxis0.push(obj.normal);
    stationerror_bar_yAxis1.push(obj.error);
});


//报警信息
var alarmregime_data = [
        {
            "id": 1,
            "code": "600001",
            "station": "站00001",
            "level": "中央报汛站",
            "stationtype": "水位站",
            "alarmntype": "超出河道水位正常范围",
            "errordata": "12.3"
        },
        {
            "id": 2,
            "code": "600002",
            "station": "站00002",
            "level": "中央报汛站",
            "stationtype": "水位站",
            "alarmntype": "超出河道水位正常范围",
            "errordata": "12.3"
        },
        {
            "id": 3,
            "code": "600003",
            "station": "站00003",
            "level": "省级一般报汛站",
            "stationtype": "水位站",
            "alarmntype": "超出河道流量正常范围",
            "errordata": "12.3"
        },
        {
            "id": 4,
            "code": "600004",
            "station": "站00004",
            "level": "中央报汛站",
            "stationtype": "水位站",
            "alarmntype": "超出河道水位正常范围",
            "errordata": "12.3"
        },
        {
            "id": 5,
            "code": "600005",
            "station": "站00005",
            "level": "中央报汛站",
            "stationtype": "水位站",
            "alarmntype": "超出河道流量正常范围",
            "errordata": "12.3"
        },
        {
            "id": 6,
            "code": "600006",
            "station": "站00006",
            "level": "省级一般报汛站",
            "stationtype": "水位站",
            "alarmntype": "超出水库流量正常范围",
            "errordata": "12.3"
        }
    ],
    typestatistics_data = [
        {
            "id": 1,
            "alarmtype": "超出河道水位安全范围",
            "station_total": "1",
            "content": [
                { "station": "站00001", "stationid": 1 }
            ]
        },
        {
            "id": 2,
            "alarmtype": "超出河道流量安全范围",
            "station_total": "2",
            "content": [
                { "station": "站00002", "stationid": 2 },
                { "station": "站00003", "stationid": 3 }
            ]
        },
        {
            "id": 3,
            "alarmtype": "超出水库水位安全范围",
            "station_total": "3",
            "content": [
                { "station": "站00004", "stationid": 4 },
                { "station": "站00005", "stationid": 5 },
                { "station": "站00006", "stationid": 6 }
            ]
        },
        {
            "id": 4,
            "alarmtype": "超出水库雨量安全范围",
            "station_total": "3",
            "content": [
                { "station": "站00010", "stationid": 10 },
                { "station": "站00011", "stationid": 11 },
                { "station": "站00012", "stationid": 12 }
            ]
        },
        {
            "id": 5,
            "alarmtype": "超出降雨量安全范围",
            "station_total": "4",
            "content": [
                { "station": "站00013", "stationid": 13 },
                { "station": "站00014", "stationid": 14 },
                { "station": "站00015", "stationid": 15 },
                { "station": "站00016", "stationid": 16 }
            ]
        }
    ];





