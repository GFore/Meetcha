// =================================
// CONSTANT DEFINITIONS
// =================================
const getMeetupForm = document.querySelector('[data-form]');
const formZipcode = document.querySelector('[data-zipcode]');
const formRadius = document.querySelector('[data-radius]');
const formCategoryDropdown = document.querySelector('[data-category]');
const corsUrlPrefix = 'http://my-little-cors-proxy.herokuapp.com/'



// =================================
// FUNCTION DEDEFINITIONS
// =================================

// function getLocationCoordinates {

// }

// Adds google map with sample pins
function initMap() {

    let broadway = {
        info: '<strong>Chipotle on Broadway</strong><br>\
                    5224 N Broadway St<br> Chicago, IL 60640<br>',
        lat: 41.976816,
        long: -87.659916
    };

    let belmont = {
        info: '<strong>Chipotle on Belmont</strong><br>\
                    1025 W Belmont Ave<br> Chicago, IL 60657<br>',
        lat: 41.939670,
        long: -87.655167
    };

    let sheridan = {
        info: '<strong>Chipotle on Sheridan</strong><br>\r\
                    6600 N Sheridan Rd<br> Chicago, IL 60626<br>',
        lat: 42.002707,
        long: -87.661236
    };

    let locations = [
        [broadway.lat, broadway.long, 0],
        [broadway.info, broadway.lat, broadway.long, 0],
        [belmont.info, belmont.lat, belmont.long, 1],
        [sheridan.info, sheridan.lat, sheridan.long, 2],
    ];

    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(41.976816, -87.659916),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    let infowindow = new google.maps.InfoWindow({});

    let marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}


function drawOption(catName, catID) {
    /* Function that draws drop-down list option to DOM for the Meetup categories. Uses the static const variable list of categories that was pulled from Meetup on 10/23/18. This could be changed to a dynamic list that pulls the current list of categories via an API call (https://api.meetup.com/2/categories?key=...) but this list should be fairly stable so it should be OK to use a snapshot. */
        const newOption = document.createElement('option');
        newOption.setAttribute('value', catID);
        newOption.textContent = catName;
        formCategoryDropdown.appendChild(newOption);
    }

function checker(event) {
    console.log(event);
    debugger;
}

function handleSubmit(event) {
	event.preventDefault();
	console.log('submit was clicked');
	console.log(event.target);
//build URL from form data and API Key constant
//use fetch and then expressions to retrieve API info results
    //const baseurl = `https://api.meetup.com/find/groups?key=${MEETUP_APIKEY}`;
    const baseurl = `https://api.meetup.com/2/open_events?key=${MEETUP_APIKEY}`;
    const urlZip = `&zip=${formZipcode.value}`;
    const urlRadius = `&radius=${formRadius.value}`;
    const urlCategory = `&category=${formCategoryDropdown.value}&order=time`;
    // NEED TO HANDLE CASES WHERE FORM FIELDS WERE LEFT BLANK
    const url = `${corsUrlPrefix}${baseurl}${urlZip}${urlRadius}${urlCategory}`;
    console.log(`fetching ${url}`);
    //debugger;
    fetch(url, {headers: {'Content-Type': 'application/json; charset=utf-8'}}).then(r => r.json()).then(checker);
}


    //debugger;
    //fetchMeetupData();
	/* We're gonna Ajax that thing.
	// Call fetch()
	// pass it the URL
	// and an object with a method and a body

	
		.then((r) => r.json())
		.then((orderInfo) => {
			// check the orderInfo for errors
			// && is a "falsey hunter"
			// It moves from left to right, and will stop moving
			// when it finds the first falsey expression.
			if (orderInfo.name && orderInfo.name === 'ValidationError') {
				notifyUser(`I'm sorry. 
				Please fill out the coffee field and the email address field. 
				Thanks. K. Byeeee.`);
			} else {
				notifyUser(`You coffee is totally (not) on its way!`);
			}
		}); // gotta wrap it in an anonymous function
*/
	// debugger;
//}
    
    
// =================================
// MAIN
// =================================

// forEach loop to build dropdown list of categories by adding child option
// elements to the select element in the html file
categories.forEach(x => drawOption(x.name, x.id));
getMeetupForm.addEventListener('submit', handleSubmit);