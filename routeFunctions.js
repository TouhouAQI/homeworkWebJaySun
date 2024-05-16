//构造路线导航类
var driving = new AMap.Driving({
    map: map,
    policy: AMap.DrivingPolicy.LEAST_TIME, 
    panel: 'panel',
    ferry: 1, // 是否可以使用轮渡
    province: '新',
}) 

var transfer = new AMap.Transfer({
    map: map,
    nightflag: true, // 是否计算夜班车
    city: '新疆',
    panel: 'panel',
    outlineColor: 'bule',
    autoFitView: true,
    policy: AMap.TransferPolicy.LEAST_TIME
})

var walking = new AMap.Walking({
    map: map,
    panel: "panel",
    hideMarkers: false,
    isOutline: true,
    outlineColor: 'green',
    autoFitView: true
})

var riding = new AMap.Riding({
    map: map,
    panel: "panel",
    policy: 1,
    hideMarkers: false,
    isOutline: true,
    outlineColor: 'yellow',
    autoFitView: true
})

var msgPanel = document.getElementById('panel');
var routeButton = document.getElementById('routeButton');

routeButton.addEventListener('click', ()=>{Route()});


function Route() {
    var type = document.getElementById('routeType').value;
    var startText = document.getElementById('startInput').value;
    var endText = document.getElementById('endInput').value;
    geoCode(startText)
        .then(position => {
            startPoint = position;
    geoCode(endText)
        .then(position => {
            endPoint = position;
            route(type,new AMap.LngLat(startPoint.lng,startPoint.lat),new AMap.LngLat(endPoint.lng, endPoint.lat))
        })
    })
}

function geoCode(address) {
    return new Promise((resolve, reject) => {
        geocoder.getLocation(address, function(status, result) {
            if (status === 'complete'&&result.geocodes.length) {
                var position = result.geocodes[0].location
                resolve(position);
            }else{reject(new Error('错误'));}
        });
    });
}

function route(type,startPoint,endPoint) {
    if (type === 'driving'){
        driving.search(startPoint, endPoint, function(status, result) {
            if (status === 'complete') {
                    return
            } else {
                alert('获取驾车数据失败：' + result)
            }
        });
    } else if (type === 'transfer') {
        transfer.search(startPoint, endPoint, function (status, result) {
            if (status === 'complete') {
                return;
            } else {
                alert('公交路线查询失败：' + result)
            }
        });        
    } else if (type === 'walking') {
        walking.search(startPoint, endPoint, function (status, result) {
            if (status === 'complete') {
                return;
            } else {
                alert('步行路线查询失败：' + result)
            }
        }); 
    } else if (type === 'riding') {
        riding.search(startPoint, endPoint, function (status, result) {
            if (status === 'complete') {
                return;
            } else {
                alert('步行路线查询失败：' + result)
            }
        })
    }
}

var panelCloseButton = document.getElementById('panelCloseButton')
panelCloseButton.addEventListener('click', ()=>{
    driving.clear();
    transfer.clear();
    walking.clear();
    riding.clear();
})

//使用关键词进行搜索的方式
// function defaultRoute() {
//     var type = document.getElementById('routeType').value;
//     var startPoint = document.getElementById('startInput').value;
//     var endPoint = document.getElementById('endInput').value;
//     if (!startPoint || !endPoint) {
//         alert('请输入正确地点信息')
//         return
//     }
//     if (type === 'driving') {
//         driving.search([
//             {keyword: startPoint ,city: '新疆'},
//             {keyword: endPoint ,city: '新疆'}
//         ], function(status, result) {
//             if (status === 'complete') {
//                 return
//             } else {
//                 console.log('今日关键字查询接口配额已耗尽，使用地理编码关键字转坐标查询')
//                 simpleRoute();
//             }
//         });
//     }
//     else if (type === 'transfer') {
//         transfer.search([
//             { keyword: startPoint},
//             { keyword: endPoint}
//             ], function (status, result) {
//             if (status === 'complete') {
//                 return
//             } else {
//                 console.log('今日关键字查询接口配额已耗尽，使用地理编码关键字转坐标查询')
//                 simpleRoute();
//             }
//         });
//     }
//     else if (type === 'walking') {
//         walking.search([
//             { keyword: startPoint},
//             { keyword: endPoint}
//             ], function (status, result) {
//             if (status === 'complete') {
//                 return
//             } else {
//                 console.log('今日关键字查询接口配额已耗尽，使用地理编码关键字转坐标查询')
//                 simpleRoute();
//             }
//         });  
//     }
//     else if (type === 'riding') {
//         riding.search([
//             { keyword: startPoint},
//             { keyword: endPoint}
//             ], function (status, result) {
//             if (status === 'complete') {
//                 return
//             } else {
//                 console.log('今日关键字查询接口配额已耗尽，使用地理编码关键字转坐标查询')
//                 simpleRoute();
//             }
//         });        
//     }
// }

//可拖拽增加途经点
// function route(type,startPoint,endPoint) {
//     if (type === 'driving'){
//         var path = [];
//         path.push(startPoint);
//         path.push(endPoint);
//         map.plugin("AMap.DragRoute", function() {
//             route = new AMap.DragRoute(map, path);
//             route.search();
//         });
//     }
// }

//自定义路径以及marker
// function drawRoute (route) {
//     var path = parseRouteToPath(route)

//     var startMarker = new AMap.Marker({
//         position: path[0],
//         icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
//         map: map
//     })

//     var endMarker = new AMap.Marker({
//         position: path[path.length - 1],
//         icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
//         map: map
//     })

//     var routeLine = new AMap.Polyline({
//         path: path,
//         isOutline: true,
//         outlineColor: '#ffeeee',
//         borderWeight: 0,
//         strokeWeight: 5,
//         strokeOpacity: 0.9,
//         strokeColor: '#0091ff',
//         lineJoin: 'round'
//     })

//     map.add(routeLine);
//     map.setFitView([ startMarker, endMarker, routeLine ])
// }

// function parseRouteToPath(route) {
//     var path = []
//     for (var i = 0, l = route.steps.length; i < l; i++) {
//         var step = route.steps[i]

//         for (var j = 0, n = step.path.length; j < n; j++) {
//           path.push(step.path[j])
//         }
//     }
//     return path
// }