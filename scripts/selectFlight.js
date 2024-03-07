var activeUser = JSON.parse(localStorage.getItem('currentUser'));
var currentSearch = JSON.parse(sessionStorage.getItem('searchFlight'));
var flightList = JSON.parse(localStorage.getItem('flightList'));

function setup() {
    if (currentSearch == null) {
        window.location = "index.html";
    }

    if (flightList == null) {
        flightList = [];
    }

    var title = document.getElementById("title");
    title.innerHTML = currentSearch.departureLocation + " to " + currentSearch.arrivalLocation;

    var depToArr = document.getElementById("depToArr");
    depToArr.innerHTML = currentSearch.departureLocation + " to " + currentSearch.arrivalLocation;

    var arrToDep = document.getElementById("arrToDep");
    arrToDep.innerHTML = currentSearch.arrivalLocation + " to " + currentSearch.departureLocation;

    var depDate = document.getElementById("depDate");
    var tempDate = new Date(currentSearch.departureDate);
    var tempDateString = tempDate.toLocaleDateString('default', {
        weekday: 'long'
    });
    tempDateString += " " + tempDate.toLocaleDateString('default', {
        day: 'numeric'
    });
    tempDateString += " " + tempDate.toLocaleDateString('default', {
        month: 'long'
    });
    tempDateString += " " + tempDate.toLocaleDateString('default', {
        year: 'numeric'
    });
    depDate.innerHTML = tempDateString;

    if (currentSearch.returnDate != null) {
        var arrDate = document.getElementById("arrDate");
        tempDate = new Date(currentSearch.returnDate);
        tempDateString = tempDate.toLocaleDateString('default', {
            weekday: 'long'
        });
        tempDateString += " " + tempDate.toLocaleDateString('default', {
            day: 'numeric'
        });
        tempDateString += " " + tempDate.toLocaleDateString('default', {
            month: 'long'
        });
        tempDateString += " " + tempDate.toLocaleDateString('default', {
            year: 'numeric'
        });
        arrDate.innerHTML = tempDateString;

    } else {
        document.getElementById("returnList").style.display = "none";
    }

    makeURL();
}

var flightTimeArray = [];
var flightTimeText = "";

// function makeURL() {
//     var depLoc = currentSearch.departureLocationCode;
//     var arrLoc = currentSearch.arrivalLocationCode;

//     var urlQuery = "https://www.travelmath.com/flying-time/from/" + depLoc + "/to/" + arrLoc;

//     makeAjaxQuery(urlQuery);
// }

async function makeURL() {
    var spinner = document.getElementById("loadingSpinner");
    spinner.style.display = "block";
    
    // Temporary values
    // var temp = {
    //     data: ["1 hour, 23 minutes", 1, 23]
    // };
    // handleStatusSuccess(temp);

    // Proper values
    const depLoc = currentSearch.departureLocationCode;
    const arrLoc = currentSearch.arrivalLocationCode;

    try {
        const response = await axios.get(`http://localhost:5502/fetch-flight-info?from=${depLoc}&to=${arrLoc}`);
        handleStatusSuccess(response);
    } catch (error) {
        handleStatusFailure(error);
    } finally {
        spinner.style.display = "none";
    }
}


// Ajax Query

// function makeAjaxQuery(url) {
//     var xhttp = new XMLHttpRequest();

//     xhttp.onreadystatechange = function () {
//         readyStateChangeHandler(xhttp);
//     }

//     xhttp.open("GET", url, true);
//     xhttp.send();
// }

// function readyStateChangeHandler(xhttp) {
//     if (xhttp.readyState == XMLHttpRequest.DONE) {
//         if (xhttp.status == 200) {
//             handleStatusSuccess(xhttp);
//         }
//         else {
//             handleStatusFailure(xhttp);
//         }
//     }
// }

function handleStatusFailure(error) {
    var errorMessage = "An error occurred while fetching flight information. Please try again later.";

    var errorText = document.getElementById("errorMessage");
    errorText.textContent = errorMessage;
    errorText.style.display = "block";
}

function handleStatusSuccess(response) {
    var submitButton = document.getElementById("submitButton");
    var depList = document.getElementById("departList");
    var arrList = document.getElementById("returnList");
    depList.style.display = "flex";

    if (currentSearch.tripType == "return"){
        arrList.style.display = "flex";
    }

    submitButton.style.display = "block";

    flightTimeText = response.data[0];

    flightTimeArray[0] = response.data[1]; // Hours
    flightTimeArray[1] = response.data[2]; // Minutes
    generateFlights();
}

function generateFlights() {
    var flightIndex;

    var depTimes = [6, 7.5, 9, 10.5, 12, 13.5, 15, 16.5, 18, 19.5, 21, 23];

    var randFlightAmount = Math.floor(Math.random() * (depTimes.length - 2 + 1)) + 2;

    var randomTimes = [];

    for (var i = 0; i < randFlightAmount; i++) {
        var randomIndex = Math.floor(Math.random() * depTimes.length);

        while (randomTimes.includes(depTimes[randomIndex])) {
            randomIndex = Math.floor(Math.random() * depTimes.length);
        }

        randomTimes[i] = depTimes[randomIndex];
    }
    randomTimes.filter(function (el) {
        return el != null;
    });
    randomTimes.sort(function (a, b) {
        return a - b
    });

    var departureContainer = document.getElementById("departingContainer");

    var newFlight = "";
    for (var i = 0; i < randomTimes.length; i++) {
        var tempPrice = 100 * (parseInt(flightTimeArray[0]) + (flightTimeArray[1] / 60));
        tempPrice = Math.floor(Math.random() * ((tempPrice * 1.4) - (tempPrice / 1.4)) + (tempPrice / 1.4));
        tempPrice = (Math.round(tempPrice * 100) / 100).toFixed(2);

        newFlight += '<div class="flight">';
        newFlight += '<div class="time">';

        // Departure Time
        var tempTimeHour = calcTime(randomTimes[i]);

        newFlight += '<span><a>' + tempTimeHour + '</a>';

        newFlight += '<br><a style="font-size:15px;"><b style="font-size:20px;">' + currentSearch.departureLocationCode + '</b> DEPARTURE</a></span></div>';
        newFlight += '<img src="images/planeside.png" style="filter:brightness(0%); height: 20px;"/>';

        newFlight += '<div class="time">';

        // Arrival Time
        var newTime = randomTimes[i] + parseInt(flightTimeArray[0]);
        newTime += flightTimeArray[1] / 60;
        var tempTimeHour = calcTime(newTime);

        newFlight += '<span><a>' + tempTimeHour + '</a>';

        newFlight += '<br><a style="font-size:15px;"><b style="font-size:20px;">' + currentSearch.arrivalLocationCode + '</b> ARRIVAL</a></span></div>';
        newFlight += '<div class="flightDuration">';
        newFlight += '<a>Direct Flight - ' + flightTimeText;
        newFlight += '</a></div>';
        newFlight += '<div><a>from</a>';
        newFlight += '<a id="price">$' + tempPrice + '</a></div>'
        newFlight += '<div><button class="selectFlightButtonDep" onClick="selectDepartureFlight(' + randomTimes[i] + ',' + newTime + ',' + tempPrice + ')">Select Flight</button></div>';
        newFlight += '</div>';
        newFlight += '</div>';
        newFlight += '</div><br>';
    }

    departureContainer.innerHTML = newFlight;

    $('.selectFlightButtonDep').click(function () {
        // Button
        $('.selectFlightButtonDep').removeClass('selectFlightButtonActive');
        $('.selectFlightButtonDep').parent().parent().removeClass('flightActive');
        $(this).addClass('selectFlightButtonActive');
        $(this).parent().parent().addClass('flightActive');

    });

    // Return flight
    if (currentSearch.tripType == "return") {
        var randFlightAmount = Math.floor(Math.random() * (depTimes.length - 2 + 1)) + 2;

        var randomTimes = [];

        for (var i = 0; i < randFlightAmount; i++) {
            var randomIndex = Math.floor(Math.random() * depTimes.length);

            while (randomTimes.includes(depTimes[randomIndex])) {
                randomIndex = Math.floor(Math.random() * depTimes.length);
            }

            randomTimes[i] = depTimes[randomIndex];
        }
        randomTimes.filter(function (el) {
            return el != null;
        });
        randomTimes.sort(function (a, b) {
            return a - b
        });

        var departureContainer = document.getElementById("departingContainer");

        departureContainer += '<div class="break_60"></div>';

        var newFlight = "";
        for (var i = 0; i < randomTimes.length; i++) {
            var tempPrice = 100 * (parseInt(flightTimeArray[0]) + (flightTimeArray[1] / 60));
            tempPrice = Math.floor(Math.random() * ((tempPrice * 1.4) - (tempPrice / 1.4)) + (tempPrice / 1.4));
            tempPrice = (Math.round(tempPrice * 100) / 100).toFixed(2);

            newFlight += '<div class="flight">';
            newFlight += '<div class="time">';

            // Departure Time
            var tempTimeHour = calcTime(randomTimes[i]);

            newFlight += '<span><a>' + tempTimeHour + '</a>';

            newFlight += '<br><a style="font-size:15px;"><b style="font-size:20px;">' + currentSearch.arrivalLocationCode + '</b> DEPARTURE</a></span></div>';
            newFlight += '<img src="images/planeside.png" style="filter:brightness(0%); height: 20px;"/>';

            newFlight += '<div class="time">';

            // Arrival Time
            var newTime = randomTimes[i] + parseInt(flightTimeArray[0]);
            newTime += flightTimeArray[1] / 60;
            var tempTimeHour = calcTime(newTime);

            newFlight += '<span><a>' + tempTimeHour + '</a>';

            newFlight += '<br><a style="font-size:15px;"><b style="font-size:20px;">' + currentSearch.departureLocationCode + '</b> ARRIVAL</a></span></div>';
            newFlight += '<div class="flightDuration">';
            newFlight += '<a>Direct Flight - ' + flightTimeText;
            newFlight += '</a></div>';
            newFlight += '<div><a>from</a>';
            newFlight += '<a id="price">$' + tempPrice + '</a></div>'
            newFlight += '<div><button class="selectFlightButtonArr" onClick="selectReturnFlight(' + randomTimes[i] + ',' + newTime + ',' + tempPrice + ')">Select Flight</button></div>';
            newFlight += '</div>';
            newFlight += '</div>';
            newFlight += '</div><br>';
        }

        returnContainer.innerHTML = newFlight;

        $('.selectFlightButtonArr').click(function () {
            // Button
            $('.selectFlightButtonArr').removeClass('selectFlightButtonActive');
            $('.selectFlightButtonArr').parent().parent().removeClass('flightActive');
            $(this).addClass('selectFlightButtonActive');
            $(this).parent().parent().addClass('flightActive');

        });
    }
    document.getElementById('totalPassengersDepart').innerHTML = currentSearch.passengerCount + " Passengers";
    document.getElementById('totalPassengersReturn').innerHTML = currentSearch.passengerCount + " Passengers";
}

function calcTime(time) {
    var tempTimeSuffix = "";
    if (time >= 12 && time <= 23) {
        tempTimeSuffix = "pm";
    } else {
        tempTimeSuffix = "am";
    }
    var hour = Math.floor(Math.abs(time));
    if (hour > 12 && hour <= 24) {
        hour -= 12;
    } else if (hour > 24) {
        hour -= 24;
    }
    var min = Math.floor((Math.abs(time) * 60) % 60);
    return (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min + tempTimeSuffix;
}

function selectDepartureFlight(dT, aT, price) {
    currentSearch.departureFlight = {};
    currentSearch.departureFlight.departureTime = calcTime(dT);
    currentSearch.departureFlight.arrivalTime = calcTime(aT);
    currentSearch.departureFlight.price = price;

    document.getElementById('totalPriceDisplayDepart').innerHTML = "$" + (price * currentSearch.passengerCount);
}

function selectReturnFlight(dT, aT, price) {
    currentSearch.returnFlight = {};
    currentSearch.returnFlight.departureTime = calcTime(dT);
    currentSearch.returnFlight.arrivalTime = calcTime(aT);
    currentSearch.returnFlight.price = price;

    document.getElementById('totalPriceDisplayReturn').innerHTML = "$" + (price * currentSearch.passengerCount);
}

function submitFlightSelection() {
    if (currentSearch.departureFlight == null) {
        alert("Error\n\nYou have not selected a departing flight.");
    } else if (currentSearch.returnFlight == null & currentSearch.tripType == "return") {
        alert("Error\n\nYou have not selected a return flight.");
    } else {
        if (currentSearch.returnFlight != null) {
            currentSearch.totalPrice = ((currentSearch.departureFlight.price * currentSearch.passengerCount) + (currentSearch.returnFlight.price * currentSearch.passengerCount));
        } else {
            currentSearch.totalPrice = (currentSearch.departureFlight.price * currentSearch.passengerCount);
        }

        sessionStorage.setItem('searchFlight', JSON.stringify(currentSearch));
        window.location = "select_baggage.html";
    }
}