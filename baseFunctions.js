var map = new AMap.Map('container', {
    viewMode: '3D',
    zoom: 5.5,
    center: [85.432000, 42.026000],
    immediately: true,
});

var scale = new AMap.Scale(),

    overView = new AMap.HawkEye({
        opened: false,
    }),

    controlBar = new AMap.ControlBar({
        position: {
            right: '10px',
            top: '10px'
        }
    }),

    toolBar = new AMap.ToolBar({
        position: {
            right: '40px',
            top: '110px'
        }
    });

scale.addTo(map);
overView.addTo(map);
controlBar.addTo(map);
toolBar.addTo(map);

var msgPanel = document.getElementById('panel');
var defaultArea = '新疆'
var district = null;
var boundShow = false;
var bounds;
var cityBounds;
var cityPolygon;
var lnglat;
var opts = {
    subdistrict: 0,
    extensions: 'all',
    level: 'district',
    immediately: false,
};


district = new AMap.DistrictSearch(opts);
function getBoundary(areaName) {
    return new Promise((resolve, reject) => {
        let bounds = null;
        district.search(areaName, (status, result) => {
            if (status === 'complete' && result.districtList.length > 0) {
                bounds = result.districtList[0].boundaries;
                for (let i = 0; i < bounds.length; i += 1) {
                    bounds[i] = [bounds[i]];
                }
                resolve(bounds);
            } else { reject(new Error('错误')); }
        });
    });
};

var geocoder = new AMap.Geocoder()
function getCoordinate(areaName) {
    geocoder.getLocation(areaName, (status, result) => {
        if (status === 'complete' && result.geocodes.length) {
            lnglat = result.geocodes[0].location
        }
    });
    return lnglat;
};

function getWeather() {
    removeWeatherMsg();
    var cityname = document.getElementById('weatherInput').value;
    lnglat = getCoordinate(cityname);
    getBoundary(cityname)
        .then(bounds => {
            cityBounds = bounds
            cityPolygon = new AMap.Polygon({
                strokeWeight: 3,
                path: cityBounds,
                fillOpacity: 0.5,
                fillColor: '#40E0D0',
                strokeColor: '#40E0D0',
            });
            map.add(cityPolygon);
            map.setFitView(cityPolygon)
        })
        .catch(error => {
            console.error('Error:', error);
        });

    AMap.plugin('AMap.Weather', function () {
        var weather = new AMap.Weather();
        weather.getLive(cityname, function (err, data) {
            if (!err) {
                var str = [];
                str.push('<h4 >' + data.city + '实时天气</h4>' + '<button class="info-close" onclick="removeWeatherMsg()">x</button>');
                str.push('<p>天气：' + data.weather + '</p>');
                str.push('<p>温度：' + data.temperature + '℃</p>');
                str.push('<p>风向：' + data.windDirection + '</p>');
                str.push('<p>风力：' + data.windPower + ' 级</p>');
                str.push('<p>空气湿度：' + data.humidity + '</p>');
                str.push('<p>发布时间：' + data.reportTime + '</p>');
                var infoWin = new AMap.InfoWindow({
                    content: '<div class="InfoBox" id="weatherInfoBox">' + str.join(''),
                    isCustom: true,
                    offset: new AMap.Pixel(0, -37)
                });
                infoWin.open(map, lnglat);
                var marker = new AMap.Marker({
                    map: map,
                    position: lnglat,
                    // content:'<div class="markerClass"></div>'
                });
                window.infoWin = infoWin;
                window.marker = marker;
            } else { alert('wrong') }
        })
        //未来4天天气预报
        weather.getForecast(cityname, function (err, data) {
            if (err) { return; }
            var str = [];
            for (var i = 0, dayWeather; i < data.forecasts.length; i++) {
                dayWeather = data.forecasts[i];
                str.push(dayWeather.date + ' <span class="weather">' + dayWeather.dayWeather + '</span> ' + dayWeather.nightTemp + '~' + dayWeather.dayTemp + '℃');
            }
            document.getElementById('forecast').innerHTML = str.join('<br>');
            document.getElementById('weatherForecastsBox').style.top = '10px';
        });
    });
};

function removeWeatherMsg() {
    if (window.infoWin) {
        window.infoWin.close();
        map.remove(window.marker);
        document.getElementById('weatherForecastsBox').style.top = '-200px';
    }
    if (cityPolygon) {
        map.remove(cityPolygon)
        cityPolygon = null;
    }
}

// 显示或隐藏新疆的行政边界
getBoundary(defaultArea)
    .then(bounds => {
        provinceBounds = bounds
    })
    .catch(error => {
        console.error('Error:', error);
    });
function drawBound() {
    if (!boundShow) {
        provincePolygon = new AMap.Polygon({
            strokeWeight: 5,
            path: provinceBounds,
            fillOpacity: 0,
            strokeColor: '#008B8B',
        });
        map.add(provincePolygon);
        map.setFitView(provincePolygon);
        document.getElementById('boundButton').style.backgroundColor = '#005555'
    } else {
        map.remove(provincePolygon);
        document.getElementById('boundButton').style.backgroundColor = '#008B8B'
    }
    boundShow = !boundShow
}

function logMapinfo() {
    var zoom = map.getZoom();
    var center = map.getCenter();
    document.querySelector("#map-zoom").innerText = zoom;
    document.querySelector("#map-center").innerText = center.toString();
};

logMapinfo();
map.on('moveend', logMapinfo);
map.on('zoomend', logMapinfo);
map.on('complete', () => {
    var boundButton = document.getElementById('boundButton')
    boundButton.addEventListener('click', () => {
        drawBound()
    })
})

var weatherButton = document.getElementById('weatherButton')
weatherButton.addEventListener('click', () => {
    getWeather();
    document.getElementById('weatherInput').value = '';
})
