var activeUser = JSON.parse(localStorage.getItem('currentUser'));
var currentSearch = JSON.parse(sessionStorage.getItem('searchFlight'));
var selectedSeatsDeparture = [];
var selectedSeatsReturn = [];

function setup() {
    if (currentSearch == null) {
        window.location = "index.html";
    } else {

        document.getElementById("returnFlight").style.display = "none";

        var html = "";
        var seatContainer = document.getElementById("departureFlight");

        var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", ]

        for (var i = 0; i < 20; i++) {
            var letterCounter = 0;
            html += '<div class="row">'
            // Left
            for (var j = 0; j < 3; j++) {
                html += '<div class="seat">' + '<a class="seatNumber">' + (i + 1) + letters[letterCounter] + "</a>" + '</div>'
                letterCounter++;
            }

            html += '<div class="aisle"></div>'

            // Middle
            for (var j = 0; j < 4; j++) {
                html += '<div class="seat">' + '<a class="seatNumber">' + (i + 1) + letters[letterCounter] + "</a>" + '</div>'
                letterCounter++;
            }

            html += '<div class="aisle"></div>'

            // Right
            for (var j = 0; j < 3; j++) {
                html += '<div class="seat">' + '<a class="seatNumber">' + (i + 1) + letters[letterCounter] + "</a>" + '</div>'
                letterCounter++;
            }

            html += '</div>'
        }

        seatContainer.innerHTML = html;

        $('.seat').click(function () {
            var seat = $(this).text();

            if ((selectedSeatsDeparture.length < currentSearch.passengerCount) && ($(this).hasClass('activeSeat') == false)) {
                $(this).addClass('activeSeat');
                selectedSeatsDeparture.push(seat);
            } else if ($(this).hasClass('activeSeat')) {
                $(this).removeClass('activeSeat');

                var i = $.inArray(seat, selectedSeatsDeparture);
                if (i >= 0) {
                    selectedSeatsDeparture.splice(i, 1);
                }
            }

            console.log(selectedSeatsDeparture);
            console.log(currentSearch);
        });
    }
}

function submitFlightSelection() {
    if (currentSearch.returnFlight != null) {
        currentSearch.departureFlight.selectedSeats = selectedSeatsDeparture;
        currentSearch.returnFlight.selectedSeats = selectedSeatsReturn;
    } else {
        currentSearch.departureFlight.selectedSeats = selectedSeatsDeparture;
    }

    sessionStorage.setItem('searchFlight', JSON.stringify(currentSearch));
    console.log(currentSearch);
}