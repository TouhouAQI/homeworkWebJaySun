var loca = new Loca.Container({
    map,
});

var pl = window.pl = new Loca.PointLayer({
    blend: 'normal',
});

pl.addAnimate({
    key: 'radius',
    value: [0, 1],
    duration: 2000,
    easing: 'ElasticOut',
});


var geo = new Loca.GeoBufferSource({
    url: 'https://restapi.amap.com/rest/lbs/geohub/geobuf?key=6107793208cdb5d776c4cdf0aae18e80&id=33f3d1a0-501e-4b16-b4b2-ce3defae8a41',
});
pl.setSource(geo);

var geoline = new Loca.GeoJSONSource({
    url: './datas/travelLine.geojson'
})

var lineLayer = new Loca.PulseLineLayer({
    zIndex: 10,
    opacity: 1,
    visible: true,
    zooms: [2, 22],
});

var color = {
    '5A': '#DC143C',
    '4A': '#F0E68C',
    '3A': '#90EE90',
    '2A': '#87CEFA',
    '1A': '#EE82EE'
};

lineLayer.setSource(geoline)
lineLayer.setStyle({
    altitude: 0,
    lineWidth: 4,
    headColor: 'blue',
    trailColor: 'rgba(128, 128, 128, 0.5)',
    interval: 0.25,
    duration: 5000,
})

pl.setStyle({
    radius: 4,
    color: (index, feature) => {
        let type = feature.properties['景区等级'];
        return color[type]
    },
    borderWidth: 2,
    borderColor: 'white',
})

loca.add(pl)
loca.animate.start();

var legend = new Loca.Legend({
    loca: loca,
    title: {
        label: '景区级别',
        fontColor: 'white',
        fonSize: '16px'
    },
    style: {
        borderRadius: '5px',
        backgroundColor: 'rgb(65, 105, 225)',
        fontColor: 'white',
        left: '10px',
        bottom: '50px',
        fontSize: '13px'
    },
    dataMap: [
        { label: `5A级`, color: color['5A'] },
        { label: `4A级`, color: color['4A'] },
        { label: `3A级`, color: color['3A'] },
        { label: `2A级`, color: color['2A'] },
        { label: `1A级`, color: color['1A'] }
    ]
})
window.legend = legend

// 创建纯文本标记
var text = new AMap.Text({
    text: '纯文本标记',
    anchor: 'center',
    draggable: true,
    angle: 0,
    visible: false,
    offset: [0, -40],
    style: {
        'padding': '5px 10px',
        'margin-bottom': '1rem',
        'border-radius': '.25rem',
        'background-color': 'rgba(65, 105, 225,0.8)',
        'border-width': 0,
        'box-shadow': '0 2px 6px 0 rgba(255, 255, 255, .3)',
        'text-align': 'center',
        'font-size': '16px',
        'color': '#fff',
    },
});
text.setMap(map);

const checkBoxes = document.querySelectorAll('#checkboxDiv input[type="checkbox"]');
const travelRoutesButton = document.getElementById('travelRoutes')
var lineLayerOn = false;

map.on('complete', () => {
    checkBoxes.forEach((checkBox) => {
        checkBox.addEventListener('change', () => {
            var checksCheckBoxes = Array.from(checkBoxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.name);
            updataPoints(checksCheckBoxes)
        });
    });

    travelRoutesButton.addEventListener('click', () => {
        if (!lineLayerOn) {
            loca.add(lineLayer)
        }
        else {
            loca.remove(lineLayer)
        }
        lineLayerOn = !lineLayerOn
    })
})

map.on('mousemove', (e) => {
    var feat = pl.queryFeature(e.pixel.toArray());
    if (feat) {
        text.show();
        var name = feat.properties['景区名称'];
        var type = feat.properties['景区等级']
        text.setText(name + '<br>' + type + '级景区');
        text.setPosition(e.lnglat);
    } else {
        text.hide()
    }
})

map.on('click', (e) => {
    text.hide()
    var feat = pl.queryFeature(e.pixel.toArray());
    if (feat) {
        var name = feat.properties['景区名称'];
        showInfoMsg(name, feat.coordinates)
    }
})

var chartShowing = false;
setChart()
var pieChart = document.getElementById('pieChart')
var barChart = document.getElementById('barChart')
var showChart = document.getElementById('showChart')
showChart.addEventListener('click', () => {
    if (!chartShowing) {
        pieChart.style.bottom = '390px'
        barChart.style.bottom = '0px'
        showChart.style.backgroundColor = '#005555'
    } else {
        pieChart.style.bottom = '-600px'
        barChart.style.bottom = '-600px'
        showChart.style.backgroundColor = '#008B8B'
    }
    chartShowing = !chartShowing
})

function updataPoints(typeList) {
    legend.remove();
    var testList = [];
    for (var i of typeList) {
        testList.push({ label: `${i}级`, color: color[i] })
    }
    pl.setStyle({
        radius: (index, feature) => {
            let type = feature.properties['景区等级'];
            if (!typeList.includes(type)) { return 0 }
            else { return 4 }
        },
        color: (index, feature) => {
            let type = feature.properties['景区等级'];
            if (!typeList.includes(type)) { return 'rgba(255,255,255,1)' }
            else { return color[type] }
        },
        borderWidth: (index, feature) => {
            let type = feature.properties['景区等级'];
            if (!typeList.includes(type)) { return 0 }
            else { return 2 }
        },
        borderColor: 'white',
    })

    pl.addAnimate({
        key: 'radius',
        value: [0, 1],
        duration: 2000,
        easing: 'ElasticOut',
    });
    pl.show(300);

    if (testList.length === 0) { return }
    legend = new Loca.Legend({
        loca: loca,
        title: {
            label: '景区级别',
            fontColor: 'white',
            fonSize: '16px'
        },
        style: {
            borderRadius: '5px',
            backgroundColor: 'rgb(65, 105, 225)',
            fontColor: 'white',
            left: '10px',
            bottom: '50px',
            fontSize: '13px',
        },
        dataMap: testList
    })
}


function showInfoMsg(addressMsg, position) {
    const apiUrl = `https://restapi.amap.com/v3/place/text?key=6107793208cdb5d776c4cdf0aae18e80&keywords=${addressMsg}&children=1&offset=5&page=1&extensions=all`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            var i = data.pois[0]
            var str = [];
            str.push('<h3 style="font-weight: bold;">' + addressMsg + '</h4>');
            str.push('<h4>地址：' + i.address + '</p>');
            str.push('<h4>电话：' + i.tel + '</p>');
            str.push('<h4>所属地：' + i.cityname + ' ' + i.adname + '</p>');
            if (i.photos && i.photos.length > 0) {
                str.push('<div style="width:300px; display: flex; overflow-x: auto; white-space: nowrap>');
                i.photos.forEach(photo => {
                    str.push('<img src="' + photo.url + '" style="height: 200px; margin: 5px;">');
                });
                str.push('</div>');
            }
            var infoWin = new AMap.InfoWindow({
                content: '<div style="width:300px; margin:10px; backgroundColor:"blue"">' + str.join('') + '</div>',
                isCustom: false,
                offset: new AMap.Pixel(0, -3)
            });
            infoWin.open(map, position);
        })
        .catch(error => {
            console.error(error);
        });
}


function setChart() {
    fetch('./datas/ALL.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('error');
            }
            return response.text();
        })
        .then(csvText => {
            // 将 CSV 数据转换为二维数组
            var csvArray = csvText.split('\n').map(row => row.trim().split(','));

            // 统计不同地区的景点数量并按级别分色
            var countByRegionAndLevel = {};
            csvArray.slice(1).forEach(row => {
                var region = row[0];
                var level = row[3];
                if (!countByRegionAndLevel[region]) {
                    countByRegionAndLevel[region] = { '1A': 0, '2A': 0, '3A': 0, '4A': 0, '5A': 0 };
                }
                countByRegionAndLevel[region][level]++;
            });

            // 将统计结果转换为数组并按景区数量从高到低排序
            var sortedData = Object.entries(countByRegionAndLevel)
                .map(([region, counts]) => ({ region, counts }))
                .sort((a, b) => {
                    const sumA = Object.values(a.counts).reduce((acc, val) => acc + val, 0);
                    const sumB = Object.values(b.counts).reduce((acc, val) => acc + val, 0);
                    return sumB - sumA;
                });

            // 根据排序后的结果生成柱状图
            var barChart = echarts.init(document.getElementById('barChart'));
            var barOption = {
                title: { text: '不同地区景点数量统计', left: 'center' },
                tooltip: { trigger: 'axis' },
                legend: { data: ['1A', '2A', '3A', '4A', '5A'], top: 30 },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: sortedData.map(item => item.region),
                    axisLabel: { interval: 0, rotate: 25 }
                },
                yAxis: { type: 'value' },
                series: [
                    { name: '1A', type: 'bar', stack: '总量', data: [] },
                    { name: '2A', type: 'bar', stack: '总量', data: [] },
                    { name: '3A', type: 'bar', stack: '总量', data: [] },
                    { name: '4A', type: 'bar', stack: '总量', data: [] },
                    { name: '5A', type: 'bar', stack: '总量', data: [] }
                ]
            };

            sortedData.forEach(item => {
                var counts = item.counts;
                barOption.series[0].data.push(counts['1A']);
                barOption.series[1].data.push(counts['2A']);
                barOption.series[2].data.push(counts['3A']);
                barOption.series[3].data.push(counts['4A']);
                barOption.series[4].data.push(counts['5A']);
            });

            barChart.setOption(barOption);

            // 统计各个等级的景区数量并生成饼图
            var pieData = Object.values(countByRegionAndLevel).reduce((acc, val) => {
                Object.entries(val).forEach(([level, count]) => {
                    if (acc[level]) {
                        acc[level] += count;
                    } else {
                        acc[level] = count;
                    }
                });
                return acc;
            }, {});

            var pieChart = echarts.init(document.getElementById('pieChart'));
            var pieOption = {
                title: { text: '各等级景区数量统计', left: 'center' },
                tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
                legend: { orient: 'vertical', left: 10, data: Object.keys(pieData) },
                series: [{
                    name: '景区等级',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: Object.entries(pieData).map(([level, count]) => ({ value: count, name: level })),
                    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
                    label: { show: true, formatter: '{b} : {c} ({d}%)' }
                }]
            };

            pieChart.setOption(pieOption);
        })
        .catch(error => console.error(error));
}

// var mvtLayer = new AMap.MapboxVectorTileLayer({
//     zIndex: 9,
//     opacity: 1,
//     url: 'amap://mvt/61cb2bf1-09f2-4afd-8a6a-9af1c240300f',
//     dataZooms: [1, 18],
//     tileSize: 256,
//     styles: {
//         point: {
//             radius: 3,
//             color:  'red',
//             borderColor: 'white',
//             borderWidth: 2,
//             visible: 1
//         }
//     },
// });

// map.add(mvtLayer);


