const base_url = 'https://app-dev.autodeal.ro/api/v1';

const token = '100200|mFZqjzdO2Izu4e72eUSh0D0XctvkPQ2MMEDC78Hq';


// const base_url = 'https://app.autodeal.ro/api/v1';
// const token = '113701|STygD85xaZB20zgdeOGtJXM5q2NX6bpwmIQ5JRxB';

var citites = [];
var areas = [];

const errorColor = "hsl(350 100% 13.5%)";
const errorBg = "hsl(350 100% 66.5%)";

function prepare_request(path) {
  var request = new XMLHttpRequest();
  request.open('GET', `${base_url}${path}`, true);
  request.setRequestHeader('Authorization', `Bearer ${token}`);
  return request;
}

function set_data_to_dropdown(data, element_id, attribute) {
  const dropdown = document.getElementById(element_id);

  data.forEach(element => {
    const option = document.createElement('option');
    option.setAttribute('value', element[attribute]);
    option.textContent = element.name;
    dropdown.appendChild(option);
  });
}

let toastContainer;

function generateToast({
  message,
  background = '#00214d',
  color = '#fffffe',
  length = '3000ms',
}) {
  toastContainer.insertAdjacentHTML('beforeend', `<p class="toast" 
    style="background-color: ${background};
    color: ${color};
    animation-duration: ${length}">
    ${message}
  </p>`)
  const toast = toastContainer.lastElementChild;
  toast.addEventListener('animationend', () => toast.remove())
}

function initToast() {
  document.body.insertAdjacentHTML('afterbegin', `<div class="toast-container"></div>
  <style>
  
.toast-container {
  position: fixed;
  z-index: 10000;
  top: 8rem;
  right: 1.5rem;
  display: grid;
  justify-items: end;
  gap: 0.5rem;
  
}

.toast {
  line-height: 1;
  padding: 0.5em 1em;
  animation: toastIt 7000ms cubic-bezier(0.785, 0.135, 0.15, 0.86) forwards;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    background: hsl(0, 0%, 91.8%) !important;
}

@keyframes toastIt {
  0%,
  100% {
    transform: translateY(-150%);
    opacity: 0;
  }
  10%,
  90% {
    transform: translateY(0);
    opacity: 1;
  }
}

@media screen and (max-width: 991px) {
	.toast-container {
  	justify-items: center;
    background: #fff;
	  width: 100%;
  }
  .toast-container .toast {
  	margin-top: 1em;
  }
}
  </style>
  `);
  toastContainer = document.querySelector('.toast-container');
}

//verde
// success.addEventListener('click', (e) => {
//   generateToast({
//     message: e.currentTarget.dataset.message,
//     background: "hsl(171 100% 46.1%)",
//     color: "hsl(171 100% 13.1%)",
//     length: "5000ms",
//   })
// })

//galben
// info.addEventListener("click", () => {
//   generateToast({
//     message: "✍️ Write this down… ✍️",
//     background: "hsl(51 97.8% 65.1%)",
//     color: "hsl(51 97.8% 12.1%)",
//     length: "8000ms",
//   });
// });

//rosu
// warning.addEventListener("click", () => {
//   generateToast({
//     message: "⚠️ Ya sure about that? ⚠️",
//     background: "hsl(350 100% 66.5%)",
//     color: "hsl(350 100% 13.5%)",
//   });
// });


// ------------------------------------

// function fetch_offers(json_body) {
//   var request = new XMLHttpRequest();
//   request.open('POST', `${offers_url}`);

//   // TODO: uncomment the bellow line if the server does this validation; also add the 'Accept'            header if it does not work
//   // request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//   request.setRequestHeader('Authorization', `Bearer ${token}`);

//   request.onload = function () {
//     return JSON.parse(request.response);
//   };

//   request.send(JSON.stringify(json_body));
// }

// ------------------------------------

// Open a new connection, using the GET request on the URL endpoint
request_areas = prepare_request('/areas');
request_cities = prepare_request('/cities');
request_vehicles_registration_type = prepare_request('/vehicles/registration-types');
request_vehicles_using_type = prepare_request('/vehicles/using_types');
request_vehicles_categs = prepare_request('/vehicles/categories');
request_vehicles_fuel_type = prepare_request('/rca-policies/fuel-types');
//rca-policies/insurance-companies pentru quotation offers 



// areas call
request_areas.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  // console.log(data);

  if (request_areas.status >= 200 && request_areas.status < 400) {
    areas = data.data;
    set_data_to_dropdown(data.data, 'area_id', 'id');
  } else {
    console.log('error');
  }
};

// cities call
request_cities.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  // console.log(data);

  if (request_cities.status >= 200 && request_cities.status < 400) {
    cities = data.data;
    removeSelectOptionsExceptAlege('city_id');
    set_data_to_dropdown(cities.filter(function (city) { return city.area_code === 'AB'; }), 'city_id', 'id');
  } else {
    console.log('error');
  }
};

function setDisabledAlege(){
  removeSelectOptionsExceptAlege('area_id');
  removeSelectOptionsExceptAlege('city_id');
  removeSelectOptionsExceptAlege('make');
  removeSelectOptionsExceptAlege('model');
  removeSelectOptionsExceptAlege('year');
  // removeSelectOptionsExceptAlege('driving_license_year');

  removeSelectOptionsExceptAlege('category');
}

// vehicles reg type calls
request_vehicles_registration_type.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  // console.log(data);

  if (request_vehicles_registration_type.status >= 200 && request_vehicles_registration_type.status < 400) {
    set_data_to_dropdown(data.data, 'vehicle_registration', 'name');
  } else {
    console.log('error');
  }
};

// vehicles fuel type calls
request_vehicles_fuel_type.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  // console.log(data);

  if (request_vehicles_fuel_type.status >= 200 && request_vehicles_fuel_type.status < 400) {
    set_data_to_dropdown(data.data, 'fuel', 'code');
  } else {
    console.log('error');
  }
};

// vehicles using type calls
request_vehicles_using_type.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  // console.log(data);

  if (request_vehicles_using_type.status >= 200 && request_vehicles_using_type.status < 400) {
    set_data_to_dropdown(data.data, 'using_type', 'name');
  } else {
    console.log('error');
  }
};

// vehicles categories calls
request_vehicles_categs.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  // console.log(data);

  if (request_vehicles_categs.status >= 200 && request_vehicles_categs.status < 400) {
    set_data_to_dropdown(data.data, 'category', 'id');
    loadCarMakesBasedOnCategory2(document.getElementById('category'));
  } else {
    console.log('error');
  }
};





// Send request
request_areas.send();
request_cities.send();
request_vehicles_registration_type.send();
request_vehicles_fuel_type.send();
request_vehicles_using_type.send();
request_vehicles_categs.send();


function validateCNP(value) {
  var re = /^\d{1}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d| 5[0-2]|99)\d{4}$/,
    bigSum = 0,
    rest = 0,
    ctrlDigit = 0,
    control = '279146358279',
    i = 0;
  if (re.test(value)) {
    for (i = 0; i < 12; i++) {
      bigSum += value[i] * control[i];
    }
    ctrlDigit = bigSum % 11;
    if (ctrlDigit === 10) {
      ctrlDigit = 1;
    }

    if (ctrlDigit !== parseInt(value[12], 10)) {
      return false;
    } else {
      return true;
    }
  }
  return false;
};

function validateStep(step) {

  var steps = document.getElementsByClassName(step);
  console.log(steps);

  var valid = true, globalValid = true;

  for (let stepMap in steps) {
    valid = true;
    console.log(stepMap);
    // if (stepMap.innerHTML.isEmpty()) {
    //   console.log("innerHTML is empty");
    //   valid = false;
    // }
    if (steps[stepMap].value?.trim() === "") {
      console.log("value is empty" + steps[stepMap]);
      valid = false;
    }

    if (steps[stepMap].id == 'identity' && !validateCNP(stepMap.value)) {
      console.log("cnp is invalid");
      valid = false;
    }

    if (steps[stepMap].value?.trim() === 'Alege') {
      console.log("value is 'Alege'" + steps[stepMap]);
      valid = false;
    }

    console.log(steps[stepMap]);

    // console.log("selected options: " + steps[stepMap].selectedOptions);
    const selectedOptions = steps[stepMap].selectedOptions;

    if (selectedOptions && selectedOptions[selectedOptions.length - 1]?.outerText?.trim() === 'Alege') {
      console.log("value is 'Alege'" + steps[stepMap]);
      valid = false;
    }

    if (!valid) {
      globalValid = false;
      $(steps[stepMap]).focus();
      return false;
    }

  }

  return globalValid;
}

function emptyError() {
  generateToast({
    message: "Toate campurile trebuie completate corect",
    background: errorBg,
    color: errorColor,
  });
}

function removeSuccess(seconds = 0) {
  setTimeout(function () {
    container = document.getElementById('successMessageSubmit');
    if (container == null) return; // abort if element isn't available

    container.style.display = 'none';
  }, seconds * 1000);
}

// catch form response to object
function handleSubmit(event) {
  event.preventDefault();

  if (!validateStep('step1')) {
    // event.preventDefault();
    emptyError();
    document.getElementById('prevButton').click();
    return false;
  }

  if (!validateStep('step2')) {
    // event.preventDefault();
    emptyError();
    removeSuccess();
    removeSuccess(7);

    $(window).scrollTop(0);
    return false;
  }

  const data = new FormData(event.target);

  data.append("type", "fizica");

  const queryString = new URLSearchParams(data); // .delete("parametru") ca sa stergem ce nu e nev, gen terms

  queryString.delete("_redirect");
  queryString.delete("owner");

  localStorage.setItem("discount", queryString.get("decontare"));
  localStorage.setItem("availability", queryString.get("availability"));




  // console.log(queryString);

  // let query_params = [...data.entries()].map(e => encodeURIComponent(e[0]) + "=" + encodeURIComponent(e[1]));

  // console.log(queryString.toString());

  //request cu datele din form pentru a obtine ofertele 
  //fetch_offers('/rca-quotations-web', queryString.toString());

  localStorage.setItem("querystring", queryString.toString());

  window.location.href = '/asigurare-rca-oferte-disponibile';
}


function loadCarMakesBasedOnCategory2(elem) {
  request_vehicles_makes = prepare_request('/vehicles/makes?app_mapped_category_id=' + elem.selectedOptions[0].value);


  // vehicles makes calls
  request_vehicles_makes.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    // console.log(data);

    if (request_vehicles_makes.status >= 200 && request_vehicles_makes.status < 400) {
      removeSelectOptionsExceptAlege('make');
      set_data_to_dropdown(data.data, 'make', 'id');
      loadCarModelsBasedOnMake2(document.getElementById('make'));
    } else {
      console.log('error');
    }
  };

  request_vehicles_makes.send();
}

function loadCarModelsBasedOnMake2(elem) {
  request_vehicles_models = prepare_request('/vehicles/models?vehicle_make_id=' + elem.selectedOptions[0].value);

  // vehicles models calls
  request_vehicles_models.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    // console.log(data);

    if (request_vehicles_models.status >= 200 && request_vehicles_models.status < 400) {
      removeSelectOptionsExceptAlege('model');
      set_data_to_dropdown(data.data, 'model', 'id');
    } else {
      console.log('error');
    }
  };

  request_vehicles_models.send();

}


function loadCarMakesBasedOnCategory(event) {
  request_vehicles_makes = prepare_request('/vehicles/makes?app_mapped_category_id=' + event.target.value);


  // vehicles makes calls
  request_vehicles_makes.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    // console.log(data);

    if (request_vehicles_makes.status >= 200 && request_vehicles_makes.status < 400) {
      removeSelectOptionsExceptAlege('make');
      set_data_to_dropdown(data.data, 'make', 'id');
    } else {
      console.log('error');
    }
  };

  request_vehicles_makes.send();
}

function loadCarModelsBasedOnMake(event) {
  request_vehicles_models = prepare_request('/vehicles/models?vehicle_make_id=' + event.target.value);

  // vehicles models calls
  request_vehicles_models.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    // console.log(data);

    if (request_vehicles_models.status >= 200 && request_vehicles_models.status < 400) {
      removeSelectOptionsExceptAlege('model');
      set_data_to_dropdown(data.data, 'model', 'id');
    } else {
      console.log('error');
    }
  };

  request_vehicles_models.send();

}

function populateYears() {

  var currentYear = new Date().getFullYear(), years = [];
  startYear = 1930;
  while (startYear <= currentYear) {
    years.push(startYear++);
  }

  const dropdown = document.getElementById('year');//license_date

  years.reverse();

  years.forEach(element => {
    const option = document.createElement('option');
    option.setAttribute('value', element);
    option.textContent = element;
    dropdown.appendChild(option);
  });

  const dropdown2 = document.getElementById('driving_license_year');

  years.forEach(element => {
    const option = document.createElement('option');
    option.setAttribute('value', element);
    option.textContent = element;
    dropdown2.appendChild(option);
  });
}

function removeSelectOptionsExceptAlege(elementId) {

  var selectElement = document.getElementById(elementId);

  while (selectElement.options.length > 0) {
    selectElement.remove(0);
  }

  const option = document.createElement('option');
  option.setAttribute('value', 'Alege');
  option.disabled = true;
  option.textContent = 'Alege';
  selectElement.appendChild(option);
}

function formatDateToStandard(date) {
  return date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();
}

function loadCitiesBasedOnArea(event) {
  var selectedCities = [];

  // console.log(areas);
  // console.log(cities);

  const areaObject = areas.filter(function (area) { return area.id == event.target.value; });
  console.log(areaObject);
  selectedCities = cities.filter(function (city) { return city.area_code === areaObject[0].code; });

  console.log(selectedCities);
  removeSelectOptionsExceptAlege('city_id');
  //need to filter data
  set_data_to_dropdown(selectedCities, 'city_id', 'id');

}

function hasClass(ele, cls) {
  return new RegExp('(\\s|^)' + cls + '(\\s|$)').exec(ele.className);
}

function addClass(ele, cls) {
  if (!hasClass(ele, cls))
    ele.className += " " + cls;
}

function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

function goToSecondPage(event) {
  if (!validateStep('step1')) {
    event.preventDefault();
    generateToast({
      message: "Toate campurile trebuie completate",
      background: "hsl(350 100% 66.5%)",
      color: "hsl(350 100% 13.5%)",
    });
    document.getElementById('prevButton').click();
    return false;
  }
  const classToChange = "step-active";
  const pas = document.getElementById('pasText');
  const pasAlt = document.getElementById('pasTextAlt');



  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');

  removeClass(step1, classToChange);
  addClass(step2, classToChange);

  const step1alt = document.getElementById('step1alt');
  const step2alt = document.getElementById('step2alt');

  removeClass(step1alt, classToChange);
  addClass(step2alt, classToChange);

  pas.innerHTML = "Pasul 2";
  pasAlt.innerHTML = "Pasul 2";

  $(window).scrollTop(0);
}

function goBackToFirstPage(event) {
  const classToChange = "step-active";

  const pas = document.getElementById('pasText');
  const pasAlt = document.getElementById('pasTextAlt');


  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');

  removeClass(step2, classToChange);
  addClass(step1, classToChange);

  const step1alt = document.getElementById('step1alt');
  const step2alt = document.getElementById('step2alt');

  removeClass(step2alt, classToChange);
  addClass(step1alt, classToChange);

  pas.innerHTML = "Pasul 1";
  pasAlt.innerHTML = "Pasul 1";

  $(window).scrollTop(0);
}

window.onload = function () {

  initToast();
  setDisabledAlege();
  const form = document.getElementById('form-details');
  form.addEventListener('submit', handleSubmit);

  const category = document.getElementById('category');
  category.addEventListener('change', loadCarMakesBasedOnCategory);

  const make = document.getElementById('make');
  make.addEventListener('change', loadCarModelsBasedOnMake);

  const area = document.getElementById('area_id');
  area.addEventListener('change', loadCitiesBasedOnArea);

  const vin = localStorage.getItem('serie-sasiu');

  if (vin) {
    document.getElementById('vin').value = vin;
  }

  populateYears();

  const start_date = document.getElementById('start_date');
  // start_date.disabled = true;


  start_date.flatpickr({//document.getElementsByClassName('start_date')
    altInput: true,
    defaultDate: new Date().setDate(new Date().getDate() + 1),
    minDate: new Date(),
    allowInput: true,
    maxDate: new Date().setMonth(new Date().getMonth() + 1),
    // altFormat: "F j, Y",
    altFormat: "d.m.Y",
    // onReady: function() {
    //   var flatPickrInstance = this;
    //   // var $flatPickrInput = $(flatPickrInstance.element);
    //   start_date.sib.addEventListener("click",function () {
    //       flatPickrInstance.toggle();
    //   });
    // }
    dateFormat: "d.m.Y",//probabil formatul necesar pt quotations
    // If you want to show the date to the end-user one way, but
    // need to send it to some third-party with different formatting,
    // altInput and altFormat are your best friends. They allow
    // you to do exactly that.
  });

  const next = document.getElementById('nextButton');
  next.addEventListener('click', goToSecondPage);

  const prev = document.getElementById('prevButton');
  prev.addEventListener('click', goBackToFirstPage);

  const identity = document.getElementById('identity');
  identity.addEventListener('focusout', (e) => {
    if (!validateCNP(e.target.value)) {
      generateToast({
        message: "CNP-ul nu este valid.",
        background: errorBg,
        color: errorColor,
      });
    }
  })

  document.addEventListener("DOMContentLoaded", function () {
    var elements = document.getElementsByClassName("step1");
    for (var i = 0; i < elements.length; i++) {
      elements[i].oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (!e.target.validity.valid) {
          e.target.setCustomValidity("Invalid");
        }
      };
      elements[i].oninput = function (e) {
        e.target.setCustomValidity(e.target.value?.trim() == '' ? "Invalid" : "");

        if (e.target.id == 'identity') {
          e.target.setCustomValidity(validateCNP(e.target.value) ? "" : "CNP invalid");
        }
      };
      elements[i].onchange = function (e) {
        if (e.target.value == 'Alege') {
          e.target.setCustomValidity('Selectati o optiune');
        }
      }

      elements[i].onvalid = function (e) {
        e.target.setCustomValidity('');
      }
    }
  })
}

