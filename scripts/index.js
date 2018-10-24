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

function initMap() {
    // const address = formZipcode.value;
    const address = `99501`;
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: {lat: 33.749, lng: 84.388}
    });
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results) {
        map.setCenter(results[0].geometry.location);
    });

}


function drawOption(catName, catID) {
    /* Function that draws drop-down list option to DOM for the Meetup categories. Uses the static const variable list of categories that was pulled from Meetup on 10/23/18. This could be changed to a dynamic list that pulls the current list of categories via an API call (https://api.meetup.com/2/categories?key=...) but this list should be fairly stable so it should be OK to use a snapshot. */
        const newOption = document.createElement('option');
        newOption.setAttribute('value', catID);
        newOption.textContent = catName;
        formCategoryDropdown.appendChild(newOption);
    }

function extract(returnedData) {
    console.log(returnedData);
    // extract the results array from the returned data 
    debugger;
    return returnedData.results;
}

function displayResults(results) {      // TBD - function to add DIVs containing events
    return results;
}

function getPinInfo(results) {      // TBD - function to extract lat/lon and title info for map pins
    pins = results;
    return pins;
}


function mapPins(pins) {      // TBD - placeholder for function to display pins on map - replace with Kyle's work
    return pins;
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
    fetch(url, {headers: {'Content-Type': 'application/json; charset=utf-8'}})
        .then(r => r.json())
        .then(extract)
        .then(displayResults)
        .then(getPinInfo)
        .then(mapPins);
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