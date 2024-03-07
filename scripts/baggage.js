var activeUser = JSON.parse(localStorage.getItem('currentUser'));
var currentSearch = JSON.parse(sessionStorage.getItem('searchFlight'));
var totalCost;

function setup() {
    if (currentSearch == null) {
        window.location = "index.html";
    } else {
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

        var depToArr = document.getElementById("depToArr");
        depToArr.innerHTML = "<b>" + currentSearch.departureLocation + " to " + currentSearch.arrivalLocation + "</b>";
        var arrToDep = document.getElementById("arrToDep");
        depToArr.innerHTML = "<b>" + currentSearch.arrivalLocation + " to " + currentSearch.departureLocation + "</b>";

        // If return flight
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
            document.getElementById("returnFlight").style.display = "none";
        }

        $('.bSDepart > div').click(function () {
            $('.bSDepart > div').css("box-shadow", "0 0 5px rgba(0, 0, 0, 0.2)");
            $('.bSDepart > div').css("outline", "none");
            $('.bSDepart > div').find('img:last').attr('src', "./images/radioButtonOff.png");
            $(this).css('box-shadow', "0 0 10px rgba(49, 152, 255, 1)");
            $(this).css('outline', "2px solid rgba(49, 152, 255, 1)");
            $(this).find('img').last().attr('src', "./images/radioButtonOn.png");
        });
        $('.bSReturn > div').click(function () {
            $('.bSDepart > div').css("box-shadow", "0 0 5px rgba(0, 0, 0, 0.2)");
            $('.bSDepart > div').css("outline", "none");
            $('.bSDepart > div').find('img:last').attr('src', "./images/radioButtonOff.png");
            $(this).css('box-shadow', "0 0 10px rgba(49, 152, 255, 1)");
            $(this).css('outline', "2px solid rgba(49, 152, 255, 1)");
            $(this).find('img').last().attr('src', "./images/radioButtonOn.png");
        });
    }
    document.getElementById('totalPassengersDepart').innerHTML = currentSearch.passengerCount + " Passengers";
    document.getElementById('totalPassengersReturn').innerHTML = currentSearch.passengerCount + " Passengers";
    document.getElementById('totalPriceDisplayDepart').innerHTML = "$" + (currentSearch.departureFlight.price * currentSearch.passengerCount);
    document.getElementById('totalPriceDisplayReturn').innerHTML = "$" + (currentSearch.returnFlight.price * currentSearch.passengerCount);
}

function selectBaggageDep(weight, price) {
    console.log("Weight: " + weight + "kg\nPrice: $" + price);

    currentSearch.departureFlight.baggageWeight = weight;
    currentSearch.departureFlight.baggagePrice = price;
    document.getElementById('totalBaggageWeightDepart').innerHTML = "Baggage Weight: " + weight + "kg";
    document.getElementById('totalBaggageCostDepart').innerHTML = "$" + (price * currentSearch.passengerCount);
    //document.getElementById('totalFlightCost').innerHTML = (price * currentSearch.passengerCount);
    console.log(currentSearch);
}

function selectBaggageRet(weight, price) {
    console.log("Weight: " + weight + "kg\nPrice: $" + price);

    currentSearch.returnFlight.baggageWeight = weight;
    currentSearch.returnFlight.baggagePrice = price;
    document.getElementById('totalBaggageWeightReturn').innerHTML = "Baggage Weight: " + weight + "kg";
    document.getElementById('totalBaggageCostReturn').innerHTML = "$" + (price * currentSearch.passengerCount);
    console.log(currentSearch);
}

function submitFlightSelection() {
    if (currentSearch.returnFlight != null) {
        currentSearch.totalPrice += ((currentSearch.departureFlight.baggagePrice * currentSearch.passengerCount) + (currentSearch.returnFlight.baggagePrice * currentSearch.passengerCount));
    } else {
        currentSearch.totalPrice += (currentSearch.departureFlight.baggagePrice * currentSearch.passengerCount);
    }

    sessionStorage.setItem('searchFlight', JSON.stringify(currentSearch));
    console.log(currentSearch);
    window.location = "select_seat.html";
}