
let has_car_members = [
    "Jason", "Bert", "Charlie", "Harry", "Michael", "Luke", 
    "Jay", "Bob", "Han", "Jackey", "Kevin",
];
let members = [
    "Chole", "Edan", "Eddy", "Hyde", "Jack", "Junny", 
    "Luna",  "Russell", "Sup", "Tony", "Will", "Xia"
].concat(has_car_members);

let cars = [
    // { driver: "Jason", passenger_count: 3, passengers: [] },
    // { driver: "Bert", passenger_count: 3, passengers: [] },
    // { driver: "Michael", passenger_count: 3, passengers: [] },
    // { driver: "Harry", passenger_count: 3, passengers: [] },
    // { driver: "Luke", passenger_count: 3, passengers: [] },
    // { driver: "Charlie", passenger_count: 3, passengers: [] },
];

window.onload = function() {
    update_member_list();
    update_driver_select();
    update_car_list();
};

function addMember() {
    const new_member = document.getElementById('newMember').value.trim();
    if (new_member && !members.includes(new_member)) {
        members.push(new_member);
        update_member_list();
        update_driver_select();
        document.getElementById('newMember').value = '';
    }
}

function deleteMember(index, event) {
    // 이벤트 버블링 중지
    event.stopPropagation();
    
    const memberToDelete = members[index];
    
    // 삭제 확인 메시지
    if (!confirm(`정말 ${memberToDelete} 멤버를 삭제하시겠습니까?`)) {
        return; // 취소 시 함수 종료
    }
    
    // 삭제할 멤버가 운전자인 차량도 함께 삭제
    cars = cars.filter(car => car.driver !== memberToDelete);
    
    // 멤버 배열에서 삭제
    members.splice(index, 1);
    
    // has_car_members 배열에서도 삭제
    const carMemberIndex = has_car_members.indexOf(memberToDelete);
    if (carMemberIndex > -1) {
        has_car_members.splice(carMemberIndex, 1);
    }
    
    update_member_list();
    update_driver_select();
    update_car_list();
}

function update_member_list() {
    // 멤버 리스트를 운전자, 자동차 소유자, 일반 멤버로 분리하여 정렬
    const activeDrivers = []; // 실제 운전자 (차량에 배정된 멤버)
    const carOwners = [];     // 자동차를 소유한 멤버 (has_car_members)
    const normalMembers = []; // 그 외 일반 멤버
    
    members.forEach(member => {
        const isDriver = cars.some(car => car.driver === member);
        const hasCar = has_car_members.includes(member);
        
        if (isDriver) {
            activeDrivers.push(member);
        } else if (hasCar) {
            carOwners.push(member);
        } else {
            normalMembers.push(member);
        }
    });
    
    // 운전자 > 자동차 소유자 > 일반 멤버 순으로 정렬
    const sortedMembers = [...activeDrivers, ...carOwners, ...normalMembers];
    
    const member_list = document.getElementById('memberList');
    member_list.innerHTML = sortedMembers.map((member, index) => {
        // 운전자인지 확인 (솔팅 후에도 다시 확인)
        const isDriver = cars.some(car => car.driver === member);
        const hasCar = has_car_members.includes(member);
        // 실제 members 배열에서의 인덱스를 찾아야 함
        const realIndex = members.indexOf(member);
        
        // 자동차 아이콘 HTML (has_car_members에 포함된 경우에만 표시)
        const carIconHtml = hasCar ? `
        <svg class="car-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>` : '';
        
        return `
        <div class="member-item ${isDriver ? 'selected' : ''}" onclick="showCarAddForm(event, '${member}')">
            ${carIconHtml}
            <img src="images/${member}.png" alt="${member}" onerror="this.src='images/default.png'" width="50" height="50">
            ${member}
            <button class="delete-btn" onclick="deleteMember(${realIndex}, event)">×</button>
            <div class="car-add-form" id="car-form-${member}" onclick="event.stopPropagation()">
                <div class="person-selector">
                    <button onclick="adjustPersonCount('${member}', -1, event)">-</button>
                    <span id="person-count-${member}">3</span>
                    <button onclick="adjustPersonCount('${member}', 1, event)">+</button>
                </div>
                <div class="person-icons" id="person-preview-${member}">
                    <svg class="person-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <svg class="person-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <svg class="person-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
                <button onclick="addCarFromMember('${member}', event)">차량 추가</button>
            </div>
        </div>
        `;
    }).join('');

    // 폼 요소에 이벤트 리스너 추가
    setTimeout(() => {
        sortedMembers.forEach(member => {
            const formElem = document.getElementById(`car-form-${member}`);
            
            if (formElem) {
                formElem.addEventListener('click', e => e.stopPropagation());
            }
        });
    }, 0);
}

function update_driver_select() {
    const select = document.getElementById('driverSelect');
    if (!select) return;
    select.innerHTML = members.map(member => 
        `<option value="${member}">${member}</option>`
    ).join('');
}

function addCar() {
    const driver = document.getElementById('driverSelect').value;
    const passenger_count = parseInt(document.getElementById('passengerCount').value);
    
    if (driver && passenger_count > 0) {
        cars.push({ driver, passenger_count, passengers: [] });
        update_car_list();
        document.getElementById('passengerCount').value = '';
    }
}

function update_car_list() {
    const car_list = document.getElementById('carList');
    car_list.innerHTML = cars.map((car, index) => {
        let personIcons = '';
        for (let i = 0; i < car.passenger_count; i++) {
            personIcons += `<svg class="person-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>`;
        }

        return `
        <div class="car-group">
            <img src="images/${car.driver}.png" alt="${car.driver}" onerror="this.src='images/default.png'" width="50" height="50">
            <span>${car.driver}</span>
            <div class="person-selector">
                <button onclick="adjustCarPassengerCount(${index}, -1)">−</button>
                <span>${car.passenger_count}</span>
                <button onclick="adjustCarPassengerCount(${index}, 1)">＋</button>
            </div>
            <div class="person-icons">${personIcons}</div>
            <button class="car-delete-btn" onclick="deleteCar(${index})">삭제</button>
        </div>
        `;
    }).join('');

    update_member_list();
}

function adjustCarPassengerCount(index, change) {
    const car = cars[index];
    const newCount = car.passenger_count + change;
    if (newCount < 1) return;
    car.passenger_count = newCount;
    update_car_list();
}

function deleteCar(index) {
    cars.splice(index, 1);
    update_car_list();
}

function simulate() {
    // 운전자를 제외한 승객 리스트
    let available_passengers = members.filter(member =>
        !cars.some(car => car.driver === member)
    );

    // 섞기
    available_passengers = shuffle_array(available_passengers);

    // 초기화
    cars.forEach(car => car.passengers = []);

    // 배정
    let passenger_index = 0;
    let car_index = 0;
    while (passenger_index < available_passengers.length) {
        let assigned = false;
        for (let i = 0; i < cars.length; i++) {
            const car = cars[car_index];
            if (car.passengers.length < car.passenger_count) {
                car.passengers.push(available_passengers[passenger_index]);
                passenger_index++;
                assigned = true;
            }
            car_index = (car_index + 1) % cars.length;
            if (passenger_index >= available_passengers.length) break;
        }
        if (!assigned) break;
    }

    // 로컬 스토리지에 저장
    localStorage.setItem('simulation_result', JSON.stringify(cars));

    // 결과 페이지로 이동
    window.location.href = 'simulate_result.html';
}

// 배열을 랜덤으로 섞는 함수
function shuffle_array(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function filterDrivers() {
    const search_value = document.getElementById('driverSearch').value.toLowerCase();
    const driver_select = document.getElementById('driverSelect');
    driver_select.innerHTML = members
        .filter(member => member.toLowerCase().includes(search_value))
        .map(member => `<option value="${member}">${member}</option>`)
        .join('');
}

// 멤버 클릭 시 차량 추가 폼 표시
function showCarAddForm(event, member) {
    // 삭제 버튼 클릭 시 이벤트 버블링 방지를 위한 추가 체크
    if (event.target.classList.contains('delete-btn')) return;
    
    const formElement = document.getElementById(`car-form-${member}`);
    const isFormVisible = formElement.classList.contains('show');
    
    // 열려있는 모든 폼 닫기
    document.querySelectorAll('.car-add-form.show').forEach(form => {
        form.classList.remove('show');
    });
    
    // 이미 열려있던 폼이면 닫기만 하고 종료 (토글 효과)
    if (isFormVisible) {
        return;
    }
    
    // 이미 운전자인지 확인
    const existingCar = cars.find(car => car.driver === member);
    if (existingCar) {
        // 기존 차량 정보로 폼 초기화
        const countElem = document.getElementById(`person-count-${member}`);
        countElem.textContent = existingCar.passenger_count;
        updatePersonPreview(member, existingCar.passenger_count);
    }
    
    // 폼 열기
    formElement.classList.add('show');
}

// 멤버 클릭 후 차량 추가 기능
function addCarFromMember(driver, event) {
    event.stopPropagation();
    
    const countElem = document.getElementById(`person-count-${driver}`);
    const passenger_count = parseInt(countElem.textContent);
    
    if (passenger_count > 0) {
        // 이미 운전자인지 확인
        const existingCarIndex = cars.findIndex(car => car.driver === driver);
        
        if (existingCarIndex >= 0) {
            // 기존 차량 정보 업데이트
            cars[existingCarIndex].passenger_count = passenger_count;
        } else {
            // 새 차량 추가
            cars.push({ driver, passenger_count, passengers: [] });
        }
        
        update_car_list();
        
        // 폼 닫기
        document.getElementById(`car-form-${driver}`).classList.remove('show');
    }
}

// 인원 수 조절 함수
function adjustPersonCount(member, change, event) {
    event.stopPropagation();
    
    const countElem = document.getElementById(`person-count-${member}`);
    let count = parseInt(countElem.textContent);
    
    count = Math.max(1, count + change); // 최소 1명
    countElem.textContent = count;
    
    // 미리보기 업데이트
    updatePersonPreview(member, count);
}

// 인원 아이콘 미리보기 업데이트
function updatePersonPreview(member, count) {
    const previewElem = document.getElementById(`person-preview-${member}`);
    let icons = '';
    
    for (let i = 0; i < count; i++) {
        icons += `<svg class="person-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>`;
    }
    
    previewElem.innerHTML = icons;
}