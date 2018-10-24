// =================================
// CONSTANT DEFINITIONS
// =================================
const getMeetupForm = document.querySelector('[data-form]');
const formZipcode = document.querySelector('[data-zipcode]');
const formRadius = document.querySelector('[data-radius]');
const formCategoryDropdown = document.querySelector('[data-category]');



// =================================
// FUNCTION DEDEFINITIONS
// =================================

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat: 33.749, lng: 84.388}
    });
    var geocoder = new google.maps.Geocoder();
    
    geocodeZipCenter(geocoder, map);
  }

  function geocodeZipCenter(geocoder, resultsMap) {
    var address = `99501`;
    geocoder.geocode({'address': address}, function(results) {
        resultsMap.setCenter(results[0].geometry.location);
    });
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

function fetchMeetupData() {
//build URL from form data and API Key constant
//use fetch and then expressions to retrieve API info results
    const baseurl = `https://api.meetup.com/find/groups?key=${MEETUP_APIKEY}`;
    const urlZip = `&zip=${formZipcode.value}`;
    const urlRadius = `&radius=${formRadius.value}`;
    const urlCategory = `&category=${formCategoryDropdown.value}&order=members`;
    const url = `${baseurl}${urlZip}${urlRadius}${urlCategory}`;
    console.log(`fetching ${url}`);
    //debugger;
    fetch(url, {headers: {'Content-Type': 'application/json; charset=utf-8'}}).then(r => r.json()).then(checker);
}

function handleSubmit(event) {
	event.preventDefault();
	console.log('submit was clicked');

	console.log(event.target);
    //debugger;
    fetchMeetupData();
	// We're gonna Ajax that thing.
	// Call fetch()
	// pass it the URL
	// and an object with a method and a body
	// const url = event.target.action;
	/*const url = API_URL;
	const method = event.target.method;
	const elements = event.target.elements;
	const data = {
		strength: elements.strength.value,
		flavor: elements.flavor.value,
		size: elements.size.value,
		coffee: elements.coffee.value,
		emailAddress: elements.emailAddress.value
	};
	fetch(url, {
		method: method,
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
			// "Content-Type": "application/x-www-form-urlencoded",
		},
		body: JSON.stringify(data)
	})
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
}
    
    
// =================================
// MAIN
// =================================

// forEach loop to build dropdown list of categories by adding child option
// elements to the select element in the html file
categories.forEach(x => drawOption(x.name, x.id));
getMeetupForm.addEventListener('submit', handleSubmit);