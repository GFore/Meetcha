// =================================
// CONSTANT DEFINITIONS
// =================================
const corsUrlPrefix = 'http://my-little-cors-proxy.herokuapp.com/';
const getMeetupForm = document.querySelector('[data-form]');
const formZipcode = document.querySelector('[data-zipcode]');
const formRadius = document.querySelector('[data-radius]');
const formCategoryDropdown = document.querySelector('[data-category]');
const btnReset = document.querySelector('[data-btnReset]');
const noResultsDiv = document.querySelector('[data-noResults]');
// const sectionEventList = document.querySelector('[data-eventList]');
const pinInfoPopUp = document.querySelector('[data-popUP]');
const eventListAccordion = document.querySelector('[data-eventListAccordion]');

// =================================
// GLOBAL VARIABLE DEFINITIONS
// =================================
let eventArray = [];
let markerArray = [];

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
    // sectionEventList.innerHTML = "";    // this clears the list of events so it can be replaced with new search results
    eventListAccordion.innerHTML = "";    // this clears the list of events so it can be replaced with new search results
    results.forEach((x, i) => {
        // addEventDiv(x, i);
        addEventDivAccordion(x, i);
        pushEventToEventArray(x);
    });
    if (results.length === 0) {
        noResultsDiv.innerHTML = '<strong>No events found.<br>Please enter a larger radius or select All Categories.</strong>';
        noResultsDiv.className = "noResults";
    }
    return results;
}

function addEventDiv(event, i) {
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
    newEventSummary.addEventListener('mouseenter', x => {
        // console.log(markerArray[i]())
        if (markerArray[i].getAnimation() != google.maps.Animation.BOUNCE) {
            markerArray[i].setAnimation(google.maps.Animation.BOUNCE);
        } else {
            markerArray[i].setAnimation(null);
        }
    });
    newEventSummary.addEventListener('mouseleave', x => {
        // console.log(markerArray[i]())
        markerArray[i].setAnimation(null);
        }
    );
}

function addEventDivAccordion(event, i) {
    //event is an object with key-value pairs containing details for an event - see the results
    // const in sampleData.js for an example of the event data
    // This function will add a div to the html body element that displays info for the event.
    let newEvent = document.createElement("div");
    let newEventSummary = document.createElement("button");
    newEventSummary.className = "accordion";
    let newEventDetails = document.createElement("div");
    newEventDetails.className = "panel";

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
    eventListAccordion.appendChild(newEvent);
    newEventSummary.addEventListener('mouseenter', x => {
        // console.log(markerArray[i]())
        if (markerArray[i].getAnimation() != google.maps.Animation.BOUNCE) {
            markerArray[i].setAnimation(google.maps.Animation.BOUNCE);
        } else {
            markerArray[i].setAnimation(null);
        }
    });
    newEventSummary.addEventListener('mouseleave', x => {
        // console.log(markerArray[i]())
        markerArray[i].setAnimation(null);
        }
    );
    newEventSummary.addEventListener("click", function() {
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        } 
    });
}

function pushEventToEventArray(event) {
    // event is an object with key-value pairs containing details for an event
    // This function gets pertinent details and adds the event to eventArray to be used after the initial fetch concludes.
    let eventInfo = {};

    eventInfo['id'] = event.id;
    eventInfo['eventName'] = event.name;
    eventInfo['Description'] = event.description;
    eventInfo['eventUrl'] = event.event_url;
    eventInfo['time'] = getEventTime(event.time);
    eventInfo['group'] = event.group.name;
    eventInfo['groupUrl'] = `https://www.meetup.com/${event.group.urlname}`;

    //account for case where event does not include separate venue info
    if (Object.keys(event).includes('venue')) {
        eventInfo['venueName'] = event.venue.name;
        eventInfo['venueAddress'] = event.venue.address_1;
        eventInfo['venueCity'] = event.venue.city;
        eventInfo['lat'] = event.venue.lat;
        eventInfo['lon'] = event.venue.lon;
    } else {
        eventInfo['venueName'] = "";
        eventInfo['venueAddress'] = "";
        eventInfo['venueCity'] = "";
        eventInfo['lat'] = event.group.group_lat;
        eventInfo['lon'] = event.group.group_lon;
    }
    eventArray.push(eventInfo);
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
        // Moves pins of same lat/lon to be next to eachother rather than stacked
        pins.forEach(y => {
            if (y.lat === eventInfo.lat && y.lon === eventInfo.lon) {
                eventInfo.lat += 0.00001;
                eventInfo.lon += 0.00001;  
            }
        })
        pins.push(eventInfo)
    });
    return pins;
}


function mapPins(pins) {      
    // First rewrites the map centered on the zipcode that is put in the 
    // for field
    // then takes the pins info and uses the long/lat to set the pins
    // the pins will show specific info when clicked
    
    const address = formZipcode.value;
    let zoomLevel = 13;
    if (formRadius.value > 9) {zoomLevel = 12};
    if (formRadius.value > 24) {zoomLevel = 11};
    if (formRadius.value > 49) {zoomLevel = 10};
    console.log('drawing map');
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoomLevel,
        //mapTypeId: google.maps.mapTypeId.ROADMAP
    });
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results) {
        map.setCenter(results[0].geometry.location);
    });

    // draw pins and make them clickable
    let marker, i;
    let infowindow = new google.maps.InfoWindow({});
    for(i = 0; i < pins.length; i++){
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(pins[i].lat, pins[i].lon),
            map: map
        });

        // markerInfo.push(marker);

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            
            let callback = function (){
                infowindow.setContent(`<h3 style="color:red"><a href="${eventArray[i].eventUrl}" target="_blank">${pins[i].eventName}</a></h3>` + pins[i].eventTime);
                infowindow.open(map,marker);
                // marker.setAnimation(google.maps.Animation.BOUNCE);
                let newEvent = document.createElement("p");
                let newEventDetails = document.createElement("div");
                let loc = "no venue specified";
                if (eventArray[i].venueName !== "") {
                    loc = `${eventArray[i].venueName}, ${eventArray[i].venueAddress}, ${eventArray[i].venueCity}`;
                }
                
                newEventDetails.innerHTML += 
                    `<h3><strong>Event: </strong>${pins[i].eventName}</h3>
                    <p><strong>Date: </strong>${pins[i].eventTime}</p>
                    <p><strong>Location: </strong>${loc}</p>
                    <p><strong>Description: </strong>${eventArray[i].Description}</p>
                    <p><a href="${eventArray[i].eventUrl}" target="_blank">See event details on Meetup.com</a></p>`;
                pinInfoPopUp.innerHTML = "";
                pinInfoPopUp.className = "description";
                newEvent.appendChild(newEventDetails);
                pinInfoPopUp.appendChild(newEvent);

            }
            return callback;
        })(marker, i));
        markerArray.push(marker);
    }
    return pins;
}

function handleSubmit(event) {
    event.preventDefault();
    handleReset();
    btnReset.removeAttribute('disabled');
	console.log(event.target);
    const baseurl = `https://api.meetup.com/2/open_events?key=${MEETUP_APIKEY}`;
    const urlZip = `&zip=${formZipcode.value}`;
    const urlRadius = `&radius=${formRadius.value}`;
    const urlCategory = (formCategoryDropdown.value === "0") ? `&order=time` : `&category=${formCategoryDropdown.value}&order=time`;
    // NEED TO HANDLE CASES WHERE FORM FIELDS WERE LEFT BLANK
    const url = `${corsUrlPrefix}${baseurl}${urlZip}${urlRadius}${urlCategory}`;
    console.log(`fetching ${url}`);
    fetch(url, {headers: {'Content-Type': 'application/json; charset=utf-8'}})
        .then(r => r.json())
        .then(extract)
        .then(displayResults)
        .then(getPinInfo)
        .then(mapPins);
}

function handleReset() {
    eventArray = [];
    markerArray = [];
    noResultsDiv.innerHTML = "";
    noResultsDiv.className = "noResults noDisplay";
    pinInfoPopUp.innerHTML = "";
    pinInfoPopUp.className = "description noDisplay";
    eventListAccordion.innerHTML = ""
    mapPins([]);
    btnReset.setAttribute('disabled', '');
}
    
    
// =================================
// MAIN
// =================================

categories.forEach(x => drawOption(x.name, x.id));      //builds Categories dropdown 
getMeetupForm.addEventListener('submit', handleSubmit);
btnReset.addEventListener('click', function(){
    handleReset();
    formZipcode.value = '';
});