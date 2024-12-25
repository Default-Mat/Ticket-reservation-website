// Parameters from the previous page
const queryParams = new URLSearchParams(window.location.search);
const source = queryParams.get('source');
const destination = queryParams.get('destination');
const date = queryParams.get('date');
const passengers = queryParams.get('passengers');

// Function to calculate next and previous days in Jalali calendar
function calculateJalaliDays(baseDate, range) {
    // Split the input date into year, month, day
    const [year, month, day] = baseDate.split("-").map(Number);

    const days = [];
    for (let i = -range; i <= range; i++) {
        // Convert Jalali date to Gregorian
        const gregorian = jalaali.toGregorian(year, month, day);
        const baseGregorian = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);

        // Adjust the date
        baseGregorian.setDate(baseGregorian.getDate() + i);

        // Convert back to Jalali
        const jalaliDate = jalaali.toJalaali(
            baseGregorian.getFullYear(),
            baseGregorian.getMonth() + 1,
            baseGregorian.getDate()
        );

        // Format as YYYY-MM-DD
        days.push(`${jalaliDate.jy}-${String(jalaliDate.jm).padStart(2, "0")}-${String(jalaliDate.jd).padStart(2, "0")}`);
    }
    return days;
}

document.addEventListener("DOMContentLoaded", () => {
    // Get the range of dates
    const daysRange = calculateJalaliDays(date, 5);
    let day_index = 0;
    document.querySelectorAll('.page-link').forEach(link => {
        link.innerHTML = daysRange[day_index];
        day_index += 1;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const pagination = document.querySelector(".pagination");
    const leftButton = document.querySelector(".left-btn");
    const rightButton = document.querySelector(".right-btn");
    const wrapperWidth = document.querySelector(
    ".pagination-wrapper"
    ).offsetWidth;
    let currentOffset = -375;
    const step = 125; // مقدار حرکت در هر کلیک (پیکسل)
    const maxOffset = 0;
    const minOffset = -(pagination.scrollWidth - wrapperWidth);
    pagination.style.transform = `translateX(${currentOffset}px)`;

    function updateButtons() {
        leftButton.disabled = currentOffset >= maxOffset;
        rightButton.disabled = currentOffset <= minOffset;
    }

    leftButton.addEventListener("click", () => {
        if (currentOffset < maxOffset) {
            currentOffset += step;
            pagination.style.transform = `translateX(${currentOffset}px)`;
        }
        updateButtons();
    });

    rightButton.addEventListener("click", () => {
        if (currentOffset > minOffset) {
            currentOffset -= step;
            pagination.style.transform = `translateX(${currentOffset}px)`;
        }
        updateButtons();
    });

    // تنظیم دکمه‌ها در بارگذاری اولیه
    updateButtons();
});

document.querySelectorAll('.page-item').forEach(item => {
    item.addEventListener('click', event => {
        const date = event.target.innerHTML;
        const queryParams = new URLSearchParams({ source, destination, date, passengers }).toString();
        window.location.href = `/train-tickets.html?${queryParams}`;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    fetch(`/search-tickets?source=${source}&destination=${destination}&date=${date}&passengers=${passengers}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('box1');
            if (data.length === 0) {
                resultsDiv.innerHTML = `
                    <div class="search-error">
                        <img src="./assets/image/system-error.png" alt="search error">
                        <h2>قطاری برای تاریخ مورد یافت نشد</h2>
                    </div>
                `;
            }
            else {
                data.forEach(train => {
                    const trainDiv = document.createElement('div');
                    trainDiv.innerHTML = `
                        <div class="child1">
                            <div class="child7">
                                <span class="text5">
                                    <b>
                                        ${train.arrival_time}
                                    </b>
                                </span>
                                <span class="text4">
                                    ${train.destination_station}
                                </span>
                                <img class="path-image" src="./assets/image/tt23.jpg" alt="no img">
                                <span class="text3">
                                    <b>${train.departure_time}</b>
                                </span>
                                <span class="text2">
                                    ${train.source_station}
                                </span>
                            </div>
                            <div class="train-type">
                                <b>${train.train_type}</b>
                            </div>
                            <div class="child6">
                                <img  class="imgg"  src="./assets/image/tt.jpg" alt="no img">
                                <b>${train.train_name}</b>
                            </div>
                            <div class="child2">
                                <div class="child3">
                                    <span class="textbold">
                                    ${train.price}
                                    </span>
                                </div>
                                <button class="child4" onclick="select_train(${train.ticket_id})">
                                انتخاب بلیط
                                </button>
                                <div class="child5">
                                    <p class="text1">
                                    ${train.available_tickets} :صندلی باقی مانده 
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;
                    resultsDiv.appendChild(trainDiv);
                });
            }
        })
        .catch(error => console.error('Error:', error));
});

function select_train(ticket_id) {
    window.location.href = `/passengers.html?ticketId=${ticket_id}&passengers=${passengers}`;
}
