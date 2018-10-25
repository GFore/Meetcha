// =================================
// CONSTANT DEFINITIONS
// =================================
const getMeetupForm = document.querySelector('[data-form]');
const formZipcode = document.querySelector('[data-zipcode]');
const formRadius = document.querySelector('[data-radius]');
const formCategoryDropdown = document.querySelector('[data-category]');
const sectionEventList = document.querySelector('[data-eventList]');
const corsUrlPrefix = 'http://my-little-cors-proxy.herokuapp.com/';


// =================================
// FUNCTION DEDEFINITIONS
// =================================

function initMap() {
    // const address = formZipcode.value;
    const address = `30301`;
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        // center: {lat: 33.749, lng: 84.388}
    });
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results) {
        map.setCenter(results[0].geometry.location);
    });
    
    const pins = [
        {
            'id': '0',
            'eventName': 'Alpha',
            'lat': 33.749,
            'long': 84.388,
        },
        {
            'id': '1',
            'eventName': 'Bravo',
            'lat': 33.837,
            'long': 84.406,
        },
        {
            'id': '2',
            'eventName': 'Cierra',
            'lat': 34.023,
            'long': 84.615,
        },

    ]
    // testing loop
    for (var i = 0; i < pins.length; i++) {
        const lat = pins[i].lat;
        const lon = pins[i].lon;
        let coord = new google.maps.LatLng(lat, lon);
        let marker = new google.maps.Marker({
            position: coord,
            map: map
        })
    }

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
    //debugger;
    return returnedData.results;
}

function displayResults(results) {      // TBD - function to add DIVs containing events
    results.forEach(addEventDiv);
    return results;
}

function addEventDiv(event) {
    //event is an object with key-value pairs containing details for an event - see the results
    // const in sampleData.js for an example of the event data
    // This function will add a div to the html body element that displays info for the event.
    //debugger;
    let newEvent = document.createElement("details");
    let newEventSummary = document.createElement("summary");
    let newEventDetails = document.createElement("div");
    newEventSummary.innerHTML = `<h3>Event: ${event.name}</h3>`;
    newEventDetails.innerHTML = `
        <p>Description:${event.description}</p>
        <p><a href="${event.event_url}" target="_blank">See event details on Meetup.com</a></p>`;
    //console.log('creating event div');
    newEvent.appendChild(newEventSummary);
    newEvent.appendChild(newEventDetails);
    sectionEventList.appendChild(newEvent);
    //debugger;
}

function getPinInfo(results) {
    // function to build the pins array to contain event info (id, name, and lat/lon)
    // for map pins. The pins array will look like:
    // [{   'id': '<string>',
    //      'eventName': '<string>',
    //      'lat': <int>,
    //      'lon': <int>
    // }, ...]
    let pins = [];
    let eventInfo;
    results.forEach(x => {
        //debugger;
        console.log(`Pins size: ${pins.length}`);
        eventInfo = {};
        eventInfo['id'] = x.id;
        eventInfo['eventName'] = x.name;

        //account for case where event does not include separate venue info
        if (Object.keys(x).includes('venue')) {
            eventInfo['lat'] = x.venue.lat;
            eventInfo['lon'] = x.venue.lon;
        } else {
            eventInfo['lat'] = x.group.group_lat;
            eventInfo['lon'] = x.group.group_lon;
        }
        pins.push(eventInfo)});
    
    return pins;
}


function mapPins(pins) {      // TBD - placeholder for function to display pins on map - replace with Kyle's work
<<<<<<< HEAD
    // attempt at adding pins
    for (var i = 0; i < pins.length; i++) {
        const lat = pins[i].lat;
        const lon = pins[i].lon;
        let coord = new google.maps.LatLng(lat, lon);
        let marker = new google.maps.Marker({
            position: coord,
            map: map
        })
    }
=======
    console.table(pins);
>>>>>>> master
    return pins;
}

function handleSubmit(event) {
	event.preventDefault();
	console.log('submit was clicked');
	console.log(event.target);
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
    
    
// =================================
// MAIN
// =================================

// forEach loop to build dropdown list of categories by adding child option
// elements to the select element in the html file
categories.forEach(x => drawOption(x.name, x.id));
getMeetupForm.addEventListener('submit', handleSubmit);