// =================================
// CONSTANT DEFINITIONS
// =================================
const getMeetupForm = document.querySelector('[data-form]');
const formZipcode = document.querySelector('[data-zipcode]');
const formRadius = document.querySelector('[data-radius]');
const formCategoryDropdown = document.querySelector('[data-category]');
const sectionEventList = document.querySelector('[data-eventList]');
const pinInfoPopUp = document.querySelector('[data-popUP]');
const corsUrlPrefix = 'http://my-little-cors-proxy.herokuapp.com/';


// =================================
// FUNCTION DEDEFINITIONS
// =================================
function getLocation(cb) {
    let lats;
    let longs;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(location) {
            lats = location.coords.latitude;
            longs = location.coords.longitude;
            console.log("Your Lat/Lon: " + lats + "/" + longs);
            cb({'myLat': lats, 'myLon': longs});
        })}    
}

function initMap() {
    getLocation(function(myLatLon) {
                let map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 13,
                        center: {lat: parseFloat(myLatLon.myLat), lng: parseFloat(myLatLon.myLon)}
                        });
                }
    );
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

function displayResults(results) {
    sectionEventList.innerHTML = "";    // this clears the list of events so it can be replaced with new search results
    results.forEach(addEventDiv);
    return results;
}

function addEventDiv(event) {
    //event is an object with key-value pairs containing details for an event - see the results
    // const in sampleData.js for an example of the event data
    // This function will add a div to the html body element that displays info for the event.
    let newEvent = document.createElement("details");
    let newEventSummary = document.createElement("summary");
    let newEventDetails = document.createElement("div");
    newEventSummary.innerHTML = `<strong>${getEventTime(event.time)}, ${event.name}</strong> (<i><a href="https://www.meetup.com/${event.group.urlname}" target="_blank">${event.group.name}</a></i>)`;

    //Display the venue location info if included, nothing for venue if not included
    if (Object.keys(event).includes('venue')) {
        newEventDetails.innerHTML = `<p><strong>Location: </strong>${event.venue.name}, ${event.venue.address_1}, ${event.venue.city}</p>`;
    }

    newEventDetails.innerHTML += `
        <p><strong>Description: </strong>${event.description}</p>
        <p><a href="${event.event_url}" target="_blank">See event details on Meetup.com</a></p>`;
    newEvent.appendChild(newEventSummary);
    newEvent.appendChild(newEventDetails);
    sectionEventList.appendChild(newEvent);
}

function getEventTime(epochTime) {
    let fullDateArray = new Date(epochTime).toString().split(' ').slice(0,5);
    // e.g., epochTime 1540491895495 would now be converted to ["Thu", "Oct", "25", "2018", "15:08:33"]
    // need to convert last item from 24hr time to 12hr time with AM/PM
    let milTime = fullDateArray.pop().split(':');  //pulls off last value and converts "15:08:33" to ["15", "13", "44"]
    let milHour = parseInt(milTime[0]);
    milTime[2] = (milHour > 11) ? "PM" : "AM";
    if (milHour === 0) {milTime[0] = "12"};
    if (milHour > 12) {milTime[0] = `${milHour % 12}`};
    fullDateArray.push(`${milTime[0]}:${milTime[1]} ${milTime[2]}`);
    // now, fullDateArray contains ["Thu", "Oct", "25", "2018", "3:08 PM"]
    return fullDateArray.join(' ');
}

function getPinInfo(results) {
    // function to build the pins array to contain event info (id, name, and lat/lon)
    // for map pins. The pins array will look like:
    // [{   'id': '<string>',
    //      'eventName': '<string>',
    //      'eventTime': '<string>',
    //      'lat': <int>,
    //      'lon': <int>,
    // }, ...]
    let pins = [];
    let eventInfo;
    results.forEach(x => {
        //debugger;
        //console.log(`Pins size: ${pins.length}`);
        //console.log(`${x.time} is ${getEventTime(x.time)}`);
        eventInfo = {};
        eventInfo['id'] = x.id;
        eventInfo['eventName'] = x.name;
        eventInfo['eventTime'] = getEventTime(x.time);

        //account for case where event does not include separate venue info
        if (Object.keys(x).includes('venue')) {
            eventInfo['lat'] = x.venue.lat;
            eventInfo['lon'] = x.venue.lon;
        } else {
            eventInfo['lat'] = x.group.group_lat;
            eventInfo['lon'] = x.group.group_lon;
        }
        pins.push(eventInfo)});
    //debugger;
    return pins;
}


function mapPins(pins) {      
    // First rewrites the map centered on the zipcode that is put in the 
    // for field
    // then takes the pins info and uses the long/lat to set the pins
    // the pins will show specific info when clicked
    
    const address = formZipcode.value;
    console.log('drawing map');
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        //mapTypeId: google.maps.mapTypeId.ROADMAP
    });
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results) {
        map.setCenter(results[0].geometry.location);
    });

    // draw pins and make them clickable
    let marker, i
    let infowindow = new google.maps.InfoWindow({});
    for(i = 0; i < pins.length; i++){
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(pins[i].lat, pins[i].lon),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            
            return function (){
                infowindow.setContent('<h3 style="color:red">' + pins[i].eventName + '</h3>' + pins[i].eventTime);
                infowindow.open(map,marker);
                // marker.setAnimation(google.maps.Animation.BOUNCE);
                let newEvent = document.createElement("header");
                let newEventDetails = document.createElement("div");
                newEventDetails.innerHTML += `<p><strong>Event: </strong>${pins[i].eventName}</p><p><strong>Date: </strong>${pins[i].eventTime}</p>`;
                pinInfoPopUp.innerHTML = ""
                newEvent.appendChild(newEventDetails);
                pinInfoPopUp.appendChild(newEvent);

            }
        })(marker, i));
    }

    console.table(pins);
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
    // drawMap();
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