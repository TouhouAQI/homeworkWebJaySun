
var POIsearchButton = document.getElementById('POIsearchButton');
var POIdeleteButton = document.getElementById('POIdeleteButton');
var POImsgBox = document.getElementById('panelPOI');

POIsearchButton.addEventListener('click', ()=>{
    var addressMsg = document.getElementById('POImsgInput').value;    
    console.log(addressMsg)
    POIsearch(addressMsg)
});

POIdeleteButton.addEventListener('click', ()=>{
    var allMarkers = map.getAllOverlays('marker');
    allMarkers.forEach(marker => {
        map.remove(marker);
    });
    POImsgBox.style.top = '-200px';
    POImsgBox.innerHTML = ''
});


AMap.plugin('AMap.AutoComplete', function() {
    var auto = new AMap.AutoComplete({
        input: "POImsgInput"
    });    
    auto.on("select", (e)=>{
        POIsearch (e.poi.name)
        POImsgBox.style.top = '20px';
    });
})

function POIsearch (POImsgInput) {
    AMap.plugin(["AMap.PlaceSearch",'AMap.AutoComplete'], function() {
    var placeSearch = new AMap.PlaceSearch({
        pageSize: 6, 
        pageIndex: 1, 
        map: map, 
        panel: "panelPOI", 
        autoFitView: true
    });        
        placeSearch.search(POImsgInput);
        POImsgBox.style.top = '20px';
    });

}

//另一种方法
// function POIsearch(addressMsg) {
//     const apiUrl = `https://restapi.amap.com/v3/place/text?key=6107793208cdb5d776c4cdf0aae18e80&keywords=${addressMsg}&children=1&offset=5&page=1&extensions=all`;
//     // 使用 fetch 发送 GET 请求获取数据
//     fetch(apiUrl)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log(data)
//             // 遍历 POI 数据，添加标记到地图上
//             for (var i of data.pois) {
//                 var marker = new AMap.Marker({
//                     map: map,
//                     position: [i.location.split(',')[0], i.location.split(',')[1]], // 将位置字符串转换为数组格式
//                 });
//                 // 绑定标记的点击事件
//                 marker.on('click', function(e) {
//                     // 构建信息窗口的内容
//                     var str = [];
//                     str.push('<h4 >' + i.name + '</h4>');
//                     str.push('<p>地址：' + i.address + '</p>');
//                     str.push('<p>电话：' + i.tel + '</p>');
//                     str.push('<p>类型：' + i.type + '</p>');
//                     var infoWin = new AMap.InfoWindow({
//                         content: '<div>' + str.join(''),
//                         isCustom: false,
//                         offset: new AMap.Pixel(0, -37)
//                     });
//                     window.marker = marker;
//                     map.add(marker);
//                     infoWin.open(map, e.target.getPosition());
//                 });  
//             }
            
//         })
//         .catch(error => {
//             console.error(error);
//         });
// }
