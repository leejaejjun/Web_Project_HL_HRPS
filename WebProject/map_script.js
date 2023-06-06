// "marker" 변수를 전역 범위로 선언합니다.
var marker = null;
var map;

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
	mapOption = {
		center: new kakao.maps.LatLng(36.566826, 127.3786567), // 지도의 중심좌표
		level: 12, // 지도의 확대 레벨
	};

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);
(customOverlay = new kakao.maps.CustomOverlay({})),
	(infowindow = new kakao.maps.InfoWindow({ removable: true }));

// 지도 타입 변경 컨트롤을 생성한다
var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도의 상단 우측에 지도 타입 변경 컨트롤을 추가한다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도에 확대 축소 컨트롤을 생성한다
var zoomControl = new kakao.maps.ZoomControl();

// 지도의 우측에 확대 축소 컨트롤을 추가한다
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 지도에 교통정보를 표시하도록 지도타입을 추가합니다
// map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

// "현재 위치로 이동" 버튼 클릭 이벤트 핸들러
document.getElementById('locationBtn').addEventListener('click', function () {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			var locPosition = new kakao.maps.LatLng(lat, lon);

			displayMarker(locPosition); // 마커와 인포윈도우를 표시하는 함수 호출
			map.setCenter(locPosition); // 지도 중심 위치 변경
			map.setLevel(7); // 지도의 확대 레벨 변경
		});
	} else {
		alert('현재 위치를 가져올 수 없습니다.');
	}
});

var markers = []; // 모든 마커를 저장할 배열

// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition, message) {
	// 마커를 생성합니다
	marker = new kakao.maps.Marker({
		map: map,
		position: locPosition,
	});

	markers.push(marker); // 새로운 마커를 배열에 추가
}

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();
// 주소 입력 폼
var searchButton = document.getElementById('searchButton');
var addressInput = document.getElementById('addressInput');
// 결과값으로 받은 위치를 마커로 표시합니다
var marker = null;

// 엔터키 입력 체크 함수
function checkEnterKey(event) {
	if (event.keyCode === 13) {
		searchAddress();
	}
}

// 검색 버튼 클릭 이벤트 핸들러
function toggleSearchButton() {
	if (searchButton.innerHTML === '검색') {
		searchAddress();
	} else {
		resetSearchButton();
	}
}

searchButton.addEventListener('click', toggleSearchButton);

// 주소 검색 function
var searchAddress = function () {
	// 주소 입력 필드가 비어있지 않을 때만 주소 검색을 시도
	if (addressInput.value) {
		// 주소로 좌표를 검색합니다
		geocoder.addressSearch(addressInput.value, function (result, status) {
			// 정상적으로 검색이 완료됐으면
			if (status === kakao.maps.services.Status.OK) {
				var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

				// 기존 마커가 있다면 제거합니다
				if (marker) {
					marker.setMap(null);
				}

				// 결과값으로 받은 위치를 마커로 표시합니다
				marker = new kakao.maps.Marker({
					map: map,
					position: coords,
				});

				markers.push(marker); // 새로운 마커를 배열에 추가

				// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
				map.setCenter(coords);
				map.setLevel(7); // 지도의 확대 레벨 변경

				// 버튼 텍스트 변경
				searchButton.innerHTML = 'X';
			} else {
				alert('주소를 찾을 수 없습니다.');
				resetSearchButton();
			}
		});
	}
};

// 주소 입력창 엔터키 이벤트
var checkEnterKey = function (event) {
	if (event.keyCode == 13) {
		toggleSearchButton();
	}
};

// 'Enter' 키 입력 체크 function
addressInput.addEventListener('keydown', function (event) {
	if (event.keyCode === 13) {
		searchAddress();
	}
});

// 검색 버튼 초기화 function
var resetSearchButton = function () {
	searchButton.innerHTML = '<img src="media/search.png" class="search-Icon"/>';
	addressInput.value = '';

	// 마커 모두 제거
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = []; // 마커 배열 초기화
};

// 검색 버튼 상태 토글 function
searchButton.addEventListener('click', function () {
	// 주소 검색 실행
	searchAddress();

	// 버튼 텍스트 변경
	if (searchButton.innerHTML === '<img src="media/search.png" class="search-Icon"/>') {
		searchButton.innerHTML = 'X';

		searchButton.addEventListener('click', function () {
			if (searchButton.innerHTML === 'X') {
				resetSearchButton();
			}
		});
	} else {
		resetSearchButton();
	}
});

// 새 창으로 링크 열기
function openURL(url) {
	window.open(url, '_blank');
}

// area-image 요소 선택
var areaImage = document.querySelector('.area-image');

// area-image 요소에 클릭 이벤트 리스너 등록
areaImage.addEventListener('click', function () {
	var url = 'https://www.kosha.or.kr/kosha/popup/jurisdiction_popup.do';
	openURL(url);
});

// main 박스 클릭 시 index.html로 이동
function goToIndexHtml() {
	window.location.href = 'index.html';
}

// main 박스 요소 선택
var mainBox = document.querySelector('.main-box');

// main 박스에 클릭 이벤트 리스너 등록
mainBox.addEventListener('click', goToIndexHtml);

// 위험도 표시 버튼 클릭 했을 때
var dangerButton = document.querySelector('.button');
var upperbox = document.querySelector('.up_box');
var underbox = document.querySelector('.down_box');
var sidebutton = document.querySelector('.backbutton');

dangerButton.addEventListener('click', function () {
	dangerButton.style.display = 'none';
	upperbox.style.display = 'block';
	underbox.style.display = 'block';
	sidebutton.style.display = 'block';
});

function toggleDangerButton() {
	dangerButton.style.display = 'block';
	upperbox.style.display = 'none';
	underbox.style.display = 'none';
	sidebutton.style.display = 'none';
}

sidebutton.addEventListener('click', toggleDangerButton);


//지도 중심 이동 함수
function setCenter(lat, lng) {
	var moveLatLon = new kakao.maps.LatLng(lat, lng);

	map.setCenter(moveLatLon);
}

// 고객센터 버튼 클릭 이벤트 핸들러
document.querySelector('.contact-box').addEventListener('click', function () {
	showCallnumber();
});

// 고객센터 버튼 클릭시 경고창에 정보 제공 (alert)
function showCallnumber() {
	var text = '1644-4544';

	alert(text);
}

// 물음표 버튼 클릭시 경고창에 데이터 분류 정보 제공 (alert)
function showRiskLevel() {
	var message =
		'위험도 산출 :\n' +
		'당해 재해자수 / 사망자수 - 29\n\n' +
		'위험도 분류 :\n' +
		'빨강 : 60이상\n' +
		'주황 : 40이상 60미만\n' +
		'노랑 : 20이상 40미만\n' +
		'초록 : 0이상 20미만\n' +
		'하늘 : 0미만';

	alert(message);
}

// questionBox 버튼 클릭 이벤트 리스너 등록
var questionBox = document.querySelector('.questionBox');
questionBox.addEventListener('click', showRiskLevel);










// 다각형 객체를 저장할 배열을 선언합니다.
let polygons = [];


async function showAreaByYear(year) {
	console.log(`Before clearing: ${polygons.length}`);
	polygons.forEach(polygon => polygon.setMap(null));
	polygons = [];
	console.log(`After clearing: ${polygons.length}`);
	polygons.forEach(polygon => polygon.setMap(null));
	
    polygons = [];
	year = parseInt(year);
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

    const data = await calData();

    let yearIndex = year - 2013;
    let values = [];
    for (let i = 0; i < data.length; i++) {
        values.push({ city: data[i][0], color: data[i][yearIndex], coordinates: area[i] });
    }

    // 값이 높은 순서대로 정렬
    values.sort((a, b) => b.value - a.value);

	
    // 기존에 그려져 있던 모든 다각형을 지웁니다.
    for (let i = 0; i < polygons.length; i++) {
        polygons[i].setMap(null);
    }
    // 배열을 비웁니다.
    polygons = [];

    // 전체 지역의 다각형을 그립니다.
    values.forEach(val => {
		let opacity = 0.6;
        let polygon = displayArea(val.coordinates, val.color);
        polygons.push(polygon); // 생성된 다각형 객체를 배열에 저장합니다.
    });
	
}



			// "지역 1" 버튼 클릭 이벤트 핸들러 (안산)
			document.querySelector('.location1').addEventListener('click', function() {
				setCenter(37.3178, 126.8286);
			});
			
			// "지역 2" 버튼 클릭 이벤트 핸들러 (대구)
			document.querySelector('.location2').addEventListener('click', function() {
				setCenter(35.8508, 128.6245);
			});
			
			// "지역 3" 버튼 클릭 이벤트 핸들러 (대전)
			document.querySelector('.location3').addEventListener('click', function() {
				setCenter(36.3543, 127.3841);
			});


