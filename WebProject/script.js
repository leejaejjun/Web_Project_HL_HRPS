
var map; // map 객체를 전역으로 선언

window.onload = function () {
    var mapContainer = document.getElementById('map'),
        mapOption = {
            center: new kakao.maps.LatLng(36.62897, 127.59354),
            level: 12,
            mapTypeId: kakao.maps.MapTypeId.ROADMAP
        };

    // 지도를 생성한다 
    map = new kakao.maps.Map(mapContainer, mapOption);
    showArea(); // map 객체 초기화 후에 showArea() 함수 호출
}
var map; // map 객체를 전역으로 선언

window.onload = function () {
    var mapContainer = document.getElementById('map'),
        mapOption = {
            center: new kakao.maps.LatLng(36.62897, 127.59354),
            level: 12,
            mapTypeId: kakao.maps.MapTypeId.ROADMAP
        };

    // 지도를 생성한다 
    map = new kakao.maps.Map(mapContainer, mapOption);
    showArea(); // map 객체 초기화 후에 showArea() 함수 호출
}
//여기서부터 지도에 지역별 표시
async function fetch_geo() {
    const response = await fetch('./geo.json');
    const data = await response.json();
    return data;
}

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function calData() {
    const url =
        'https://api.odcloud.kr/api/15002274/v1/uddi:8fe7208d-60b3-46ed-bad1-84540998125f?page=1&perPage=49&serviceKey=sGj%2B7BjClemXaiQuW6MoTRSA%2FEloyA0cwuitUq4XO4NE30Oc8YE9vfcagAvpMYdkSwzibu%2BOAuLQlWs06VGK8g%3D%3D';
    const data = await fetchData(url);

    const dataArray = data.data;

    //원하는 값으로 데이터 설정
    //노동지청명, 연도별 재해자수/사망자수 -29의 값들의 배열 생성해서 set_Data에 저장
    let set_Data = [];
    for (let i = 0; i < dataArray.length; i++) {
        set_Data.push([
            dataArray[i]['구분'],
            dataArray[i]['2014년 재해자수'] / dataArray[i]['2014년 사망자수'] - 29,
            dataArray[i]['2015년 재해자수'] / dataArray[i]['2015년 사망자수'] - 29,
            dataArray[i]['2016년 재해자수'] / dataArray[i]['2016년 사망자수'] - 29,
            dataArray[i]['2017년 재해자수'] / dataArray[i]['2017년 사망자수'] - 29,
            dataArray[i]['2018년 재해자수'] / dataArray[i]['2018년 사망자수'] - 29,
            dataArray[i]['2019년 재해자수'] / dataArray[i]['2019년 사망자수'] - 29,
            dataArray[i]['2020년 재해자수'] / dataArray[i]['2020년 사망자수'] - 29,
            parseInt(dataArray[i]['2021년 재해자수'].replace(',', '')) /
            dataArray[i]['2021년 사망자수'] -
            29,
        ]);
    }

	// set_Data를 다른 이름의 배열에 복사
    let new_Set_Data = [...set_Data];
	
    //위에서 설정한 set_Data의 계산값(연도별 재해자수/사망자수 -29의 값)을 색으로 변경
    let color = new Array(set_Data.length);
    for (let i = 0; i < set_Data.length; i++) {
        color[i] = new Array(set_Data[i].length);
    }

    for (let i = 0; i < set_Data.length; i++) {
        color[i][0] = set_Data[i][0];
        for (let j = 1; j < set_Data[i].length; j++) {
            if (Math.abs(set_Data[i][j]) <= 0) {
                color[i][j] = '#36FDCD';
            } else if (Math.abs(set_Data[i][j]) <= 20) {
                color[i][j] = '#66EB27';
            } else if (Math.abs(set_Data[i][j]) <= 40) {
                color[i][j] = '#F8E00A';
            } else if (Math.abs(set_Data[i][j]) < 60) {
                color[i][j] = '#ED7D31';
            } else {
                color[i][j] = '#FF0000';
            }
        }
    }
    return color;
}

async function showArea() {
    const geo = await fetch_geo();
    let geoData = geo.features;


    let area = new Array(geoData.length);
    for (let i = 0; i < area.length; i++) {
        if (geoData[i].geometry.type === 'Polygon') {
            area[i] = new Array(geoData[i].geometry.coordinates[0].length);
        } else if (geoData[i].geometry.type === 'MultiPolygon') {
            area[i] = new Array(geoData[i].geometry.coordinates.length);
            for (let j = 0; j < area[i].length; j++) {
                area[i][j] = new Array(geoData[i].geometry.coordinates[j][0].length);
            }
        }
    }

    for (let city = 0; city < geoData.length; city++) {
        for (let city = 0; city < geoData.length; city++) {
            if (geoData[city].geometry.type === 'Polygon') {
                geoData[city].geometry.coordinates[0].forEach((coord, i) => {
                    area[city][i] = new kakao.maps.LatLng(coord[1], coord[0]);
                });
            } else if (geoData[city].geometry.type === 'MultiPolygon') {
                geoData[city].geometry.coordinates.forEach((polygon, i) => {
                    polygon[0].forEach((coord, j) => {
                        area[city][i][j] = new kakao.maps.LatLng(coord[1], coord[0]);
                    });
                });
            }
        }
    }
    const color = await calData();
    for (let i = 0; i < area.length; i++) {
        displayArea(area[i], color[i][2]);
    }

}

function displayArea(path, color) {
    var polygon = new kakao.maps.Polygon({
        map: map,
        path: path, // 그려질 다각형의 좌표 배열입니다
        strokeWeight: 2, // 선의 두께입니다
        strokeColor: '#000000', // 선의 색깔입니다
        strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid', // 선의 스타일입니다
        fillColor: color, // 채우기 색깔입니다
        fillOpacity: 0.7, // 채우기 불투명도 입니다
    });
	

	// 생성된 다각형 객체를 반환합니다.
    return polygon;
}


showArea();









