
function showConfirmationDialog(event) {
    event.preventDefault();


    var confirmation = confirm("파일을 다운로드하시겠습니까?");

    if (confirmation) {
        var downloadLink = event.target.parentElement.href;
        window.location.href = downloadLink;
    }
}

function openURL(url) {

	window.open(url, '_blank');
}

function showCallnumber() {
    var text = '고객센터 전화번호 : 1644-4544';

    alert(text);
}


async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function occupational_Data() {
    const selectedYear = document.getElementById('year').value;
    const url = 'https://api.odcloud.kr/api/15002274/v1/uddi:8fe7208d-60b3-46ed-bad1-84540998125f?page=1&perPage=49&serviceKey=sGj%2B7BjClemXaiQuW6MoTRSA%2FEloyA0cwuitUq4XO4NE30Oc8YE9vfcagAvpMYdkSwzibu%2BOAuLQlWs06VGK8g%3D%3D';
    const data = await fetchData(url);
    const dataArray = data.data;

    let yearSum = [];
    for (let i = 0; i < 8; i++) {
        yearSum[i] = [0, 0, 0];
    }

    for (let j = 0; j < dataArray.length; j++) {
        for (let i = 0; i < yearSum.length - 1; i++) {
            yearSum[i][0] += dataArray[j]["20" + (i + 14) + "년 재해자수"];
            yearSum[i][1] += dataArray[j]["20" + (i + 14) + "년 사망자수"];
            yearSum[i][2] = 2014 + i;
        }
        yearSum[7][0] += parseInt(dataArray[j]["2021년 재해자수"].replace(',', ''));
        yearSum[7][1] += dataArray[j]["2021년 사망자수"];
        yearSum[7][2] = 2021;
    }

    return yearSum;
}

async function print_occupational_Data() {
    const selectedYear = document.getElementById('year').value;
    const data = await occupational_Data();
    let result = '';
    for (let i = 0; i < data.length; i++) {
        if (data[i][2] === parseInt(selectedYear)) {
            result = `<p>${data[i][2]}년 재해자수: ${data[i][0]}</p><p>${data[i][2]}년 사망자수: ${data[i][1]}</p>`;
            break;
        }
    }

    document.getElementById('occupational-accident').innerHTML = result;

}

async function areaRisk() {
    const url = 'https://api.odcloud.kr/api/15002274/v1/uddi:8fe7208d-60b3-46ed-bad1-84540998125f?page=1&perPage=49&serviceKey=sGj%2B7BjClemXaiQuW6MoTRSA%2FEloyA0cwuitUq4XO4NE30Oc8YE9vfcagAvpMYdkSwzibu%2BOAuLQlWs06VGK8g%3D%3D';
    const data = await fetchData(url);
    const dataArray = data.data;

    return dataArray;
}

async function createTable() {
    const dataArray = await areaRisk();

    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const years = Object.keys(dataArray[0]).filter(key => key.includes('년'));
    const divisions = dataArray.map(data => data.구분);

    const divisionHeader = document.createElement('th');
    divisionHeader.textContent = '구분';
    headerRow.appendChild(divisionHeader);

    for (const year of years) {
        const th = document.createElement('th');
        th.textContent = year;
        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    for (const division of divisions) {
        const dataRow = document.createElement('tr');
        const divisionCell = document.createElement('th');
        divisionCell.textContent = division;
        dataRow.appendChild(divisionCell);

        for (const year of years) {
            const dataCell = document.createElement('td');
            const data = dataArray.find(item => item.구분 === division);
            dataCell.textContent = data[year];
            dataRow.appendChild(dataCell);
        }

        tbody.appendChild(dataRow);
    }

    table.appendChild(tbody);

    return table;
}


async function printTable() {
    const table = await createTable();
    const areaAccidentDiv = document.getElementById('area-accident');
    areaAccidentDiv.appendChild(table);
}

//표 출력하는 함수
printTable();

function setCenter(lat, lng, zoom) {
    var moveLatLon = new kakao.maps.LatLng(lat, lng);

    map.setCenter(moveLatLon);
    map.setZoom(zoom);
}

function moveMap() {
    var locationSelect = document.getElementById('locationSelect');
    var selectedLocation = locationSelect.value

    switch (selectedLocation) {
        case 'Seoul':
            setCenter(37.5665, 126.9780, 5);
            break;
        case 'Gyeonggi':
            setCenter(37.4138, 127.5183, 5);
            break;
        case 'Gangwon':
            setCenter(37.5550, 128.2090, 5);
            break;
        case 'Cheongchung':
            setCenter(36.6358, 127.4916, 5);
            break;
        case 'Gyeongsang':
            setCenter(35.5372, 129.3114, 5);
            break;
        case 'Jeolla':
            setCenter(35.8204, 127.1089, 5);
            break;
        default:
            setCenter(37.5665, 126.9780, 13);
    }
}







/*
자료확인용 함수
async function displayData() {
    //data1 = await occupational_Data();
    data2 = await areaRisk();

    // const occupationalAccidentElement = document.getElementById('occupational-accident');
    const areaRiskElement = document.getElementById('area-accident');
    //occupationalAccidentElement.textContent = JSON.stringify(data1);
    areaRiskElement.textContent = JSON.stringify(data2)

};

displayData();
*/