// const base_url = 'https://app-dev.autodeal.ro/api/v1';
// const base_url_mobilpay = 'https://app-dev.autodeal.ro';
// const token = '100200|mFZqjzdO2Izu4e72eUSh0D0XctvkPQ2MMEDC78Hq';

const base_url_mobilpay = 'https://app.autodeal.ro';
const base_url = 'https://app.autodeal.ro/api/v1';
const token = '113701|STygD85xaZB20zgdeOGtJXM5q2NX6bpwmIQ5JRxB';

var cache = new Map();
var insuranceCompanies = [];
var discoutListElements = []
var availabilityListElements = []

const errorColor = "hsl(350 100% 13.5%)";
const errorBg = "hsl(350 100% 66.5%)";


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

function fetchOffer2(path, qs, insuranceId, availability) {

  var request = new XMLHttpRequest();
  request.open('POST', `${base_url}${path}?${qs}`, true);
  request.setRequestHeader('Authorization', `Bearer ${token}`);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      addOffersToCache(data, availability, getInsuranceCompanyWithId(insuranceId));
      const discount = localStorage.getItem('discount');
      const trueAvailability = localStorage.getItem('availability');

      clearOffersTableExceptHead();
      cache.get(trueAvailability).forEach((offerEntry) => {
        addOfferToTable(offerEntry[discount], offerEntry["insurance"], trueAvailability)
      })
    } else {
      generateToast({
        message: "Eroare: " + data.error.pretty_message,
        background: errorBg,
        color: errorColor,
      });
      console.log('Error fetching offer data: ' + data.error.pretty_message);
    }
  };

  // displayLoading();
  request.send();
}


function getInsuranceCompanies2() {
  var request = new XMLHttpRequest();
  request.open('GET', `${base_url}/rca-policies/insurance-companies`, false);
  request.setRequestHeader('Authorization', `Bearer ${token}`);
  request.onload = function () {
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
      insuranceCompanies = data.data;
    } else {
      generateToast({
        message: "A avut loc o eroare!",
        background: errorBg,
        color: errorColor,
      });
    }
  };

  request.send();
}

function clearOffersTableExceptHead() {
  const parent = document.getElementById('oferte-table');
  parent.querySelectorAll(".oferte-table-content").forEach(child => {
    child.remove()
  });
}


function changeQueryAvailability(querystring, newAvailability) {
  const searchVal = '&availability=';
  var regex = new RegExp(searchVal);
  const valueIndex = querystring.search(regex) + searchVal.length;

  return querystring.substring(0, valueIndex) + newAvailability + querystring.substring(valueIndex + 1);
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

function isInsuranceIdInCacheForGivenAvailability(id, availability) {
  if (!cache.has(availability)) {
    return false;
  }
  if (cache.get(availability).find((entry) => entry["insurance"]["id"] === id)) {
    return true;
  }
  return false;
}

function getInsuranceCompanyWithId(companyId) {
  for (var item of insuranceCompanies) {
    if (item.id === companyId) {
      return item;
    }
  }
}

function addOffersToCache(offerResponse, availability, insurance) {
  if (!cache.has(availability)) {
    cache.set(availability, []);
  }

  if (isInsuranceIdInCacheForGivenAvailability(insurance.id, availability)) {
    return;
  }

  const deductedOffer = offerResponse["data"]["offerWithDeductedPrice"],
    standardOffer = offerResponse["data"]["offerWithoutDeductedPrice"];

  const offerResponseFilled = { "decontat": deductedOffer, "standard": standardOffer, "insurance": insurance }

  cache.set(
    availability,
    [...cache.get(availability), offerResponseFilled],
  );
}


function fetchOffersForAvailability(availability) {
  const qs = changeQueryAvailability(localStorage.getItem('querystring'), availability)

  insuranceCompanies.forEach((entry) => {
    if (!isInsuranceIdInCacheForGivenAvailability(entry.id, availability)) {
      fetchOffer2('/rca-quotations-web', qs + "&insurance_company_id=" + entry.id, entry.id, availability);
    }
  });
}


function addOfferToTable(offerJson, insurance, availability) {

  if (offerJson["error"] === true) {
    // generateToast({
    //   message: offerJson["insurance_name"] + ': ' + offerJson["error_message"],
    //   background: errorBg,
    //   color: errorColor,
    // });
    return;
  }

  const parent = document.getElementById('oferte-table');

  var row = document.createElement('div');
  addClass(row, 'oferte-table-content');

  var img = document.createElement('img');
  addClass(img, 'oferte-fields-asigurator');
  img.setAttribute('src', insurance.image);
  img.setAttribute('loading', 'lazy');
  img.setAttribute('width', '138');
  img.setAttribute('alt', insurance.name);
  row.appendChild(img);

  var bmDiv = document.createElement('div');
  addClass(bmDiv, 'oferte-fields-bonus-malus');
  bmDiv.innerHTML = "Clasa: " + offerJson["class_bm"];
  row.appendChild(bmDiv);

  var availabilityDiv = document.createElement('div');
  addClass(availabilityDiv, 'oferte-fields-perioada');
  availabilityDiv.innerHTML = availability + " luni";
  row.appendChild(availabilityDiv);

  var priceDiv = document.createElement('div');
  addClass(priceDiv, 'oferte-fields-pret');
  priceDiv.innerHTML = offerJson["prime"] + " lei";
  row.appendChild(priceDiv);

  var button = document.createElement('a');
  addClass(button, 'button button-form');
  button.innerHTML = "Alege oferta";
  button.addEventListener("click", (event) => {
    triggerActiveButton(event);
    // showModal();
    // unfade(document.getElementById("modal"));
    // $("#modal").fadeIn();
    fadeIn(document.getElementById("modal"));
    // document.getElementById("modal").style.display = "block";
    // document.getElementById("modal").style.opacity = 1;

    localStorage.setItem("selectedOfferId", offerJson["id"]);

    // document.getElementById("modalAnimationButton").click();
  })

  row.appendChild(button);

  parent.appendChild(row);
}

function toggleActive(event) {
  var target = event.target || event.srcElement;
  var buttonList = document.querySelectorAll(".button");
  buttonList.forEach(function (button) {
    if (button === target && !button.classList.contains("active")) {
      return button.classList.add("active");
    }
    if (button === target && button.classList.contains("active")) {
      return;
    }
    return button.classList.remove("active");

  });
}

function triggerActiveButton(event) {//works but not perfect
  var button = event.target || event.srcElement;
  if (!button.classList.contains("active")) {
    button.classList.add("active");
    setTimeout(function () {

      button.classList.remove("active");
    }, 200);

  }
}

function postRcaPoliciesWeb(quotationOfferId, type) {
  var request = new XMLHttpRequest();
  request.open('POST', `${base_url}/rca-policies-web?quotation_offer_id=${quotationOfferId}&voucher_id=`, true);
  request.setRequestHeader('Authorization', `Bearer ${token}`);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function () {
    var data = JSON.parse(this.response);

    // console.log("postRcaPoliciesWeb");

    // console.log(data);

    if (request.status >= 200 && request.status < 400) {
      if (type === "card") {
        postMobilpay(data.data.order_id);
      }
      if (type === "rate") {
        postTbi(data.data.order_id);
      }
    } else {
      generateToast({
        message: data.error.pretty_message,
        background: errorBg,
        color: errorColor,
      });
      console.log('Error fetching offer data: ' + data.error.pretty_message);
    }
  };

  request.send();
}

function postMobilpay(orderId) {
  var request = new XMLHttpRequest();
  request.open('POST', `${base_url}/payu/create?order_id=${orderId}`, true);
  request.setRequestHeader('Authorization', `Bearer ${token}`);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function () {
    var data = JSON.parse(this.response);

    // console.log("postMobilpay");

    // console.log(data);

    if (request.status >= 200 && request.status < 400) {
      getMobilpay(data.data.token);
    } else {
      generateToast({
        message: data.error.pretty_message,
        background: errorBg,
        color: errorColor,
      });
      console.log('Error fetching offer data: ' + data.error.pretty_message);
    }
  };

  request.send();
}

function postTbi(orderId, instalments = 4) {
  var request = new XMLHttpRequest();
  request.open('POST', `${base_url}/tbi/create?order_id=${orderId}&instalments=${instalments}`, true);
  request.setRequestHeader('Authorization', `Bearer ${token}`);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function () {
    var data = JSON.parse(this.response);

    // console.log("postTbi");

    // console.log(data);

    if (request.status >= 200 && request.status < 400) {
      getTbi(data.data.token);
    } else {
      generateToast({
        message: data.error.pretty_message,
        background: errorBg,
        color: errorColor,
      });
      console.log('Error fetching offer data: ' + data.error.pretty_message);
    }
  };

  request.send();
}

function getMobilpay(tokn) {

  window.location.href = `${base_url_mobilpay}/payu?token=${tokn}`;

}

function getTbi(tokn) {

  window.location.href = `${base_url_mobilpay}/tbi?token=${tokn}`;

}

function displayLoading() {
  generateToast({
    message: "Se proceseaza cererea..",
    background: "hsl(198, 99%, 58%);",
    color: "hsl(171 100% 13.1%)",
    length: "35000ms",
  })
}

function loadOffers() {//take from localstorage and display offers OR request uncached offers and display loading
  const availability = localStorage.getItem('availability');
  const discount = localStorage.getItem('discount');

  if (!cache.has(availability)) {
    //fetch offers for that availability and add to cache, wait for it and display loading
    displayLoading();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    fetchOffersForAvailability(availability);

    //stop displaying loading, class on last-row of table might be useful
  }

  //clear table and add from cache

  clearOffersTableExceptHead();
  availability = localStorage.getItem('availability');
  discount = localStorage.getItem('discount');
  //  const offerResponseFilled = { "deducted": deductedOffer, "standard": standardOffer, "insurance": insurance }
  // cache.get(availability).sort((a, b) => {
  //   if (a.insurance.name < b.insurance.name) { return -1; }
  //   if (a.insurance.name > b.insurance.name) { return 1; }
  //   return 0;
  // });
  cache.get(availability)?.forEach((offerEntry) => {
    addOfferToTable(offerEntry[discount], offerEntry["insurance"], availability)
  })
}

function addClassAndRemoveForOtherElements(elementArray, activatedElement, classToSet = 'active') {
  elementArray.forEach((element) => {
    removeClass(element, classToSet);
  })
  addClass(activatedElement, classToSet)
}

function fadeIn(element) {
  element.style.display = 'block';
  element.style.opacity = 1;

  // let initOpacity = 0.1;
  // element.style.display = 'block';
  // // Update the opacity with 0.1 every 10 milliseconds
  // const timer = setInterval(function () {
  //   if (initOpacity >= 1) {
  //     clearInterval(timer);
  //   }
  //   element.style.opacity = initOpacity;
  //   element.style.filter = 'alpha(opacity=' + initOpacity * 100 + ")";
  //   initOpacity += initOpacity * 0.1;
  // }, 500);
}

function fadeOut(element) {
  element.style.opacity = 1;
  setTimeout(() => {
    element.style.opacity = 0;
  }, 500 + 20);
}

window.onload = function () {
  initToast();

  getInsuranceCompanies2();


  const initialDiscoutState = localStorage.getItem("discount");
  const initialAvailability = localStorage.getItem("availability");

  availabilityListElements = [
    document.getElementById('1'),
    document.getElementById('3'),
    document.getElementById('6'),
    document.getElementById('12')
  ];

  discoutListElements = [
    document.getElementById('standard'),
    document.getElementById('decontat')
  ];



  availabilityListElements.forEach(function (elem) {
    elem.addEventListener("click", function () {
      //set elem class as active and remove for others of same type
      addClassAndRemoveForOtherElements(availabilityListElements, elem);
      localStorage.setItem("availability", elem.id);
      loadOffers();
      // elem.scrollIntoView();
    });
  });

  discoutListElements.forEach(function (elem) {
    elem.addEventListener("click", function () {
      addClassAndRemoveForOtherElements(discoutListElements, elem);
      localStorage.setItem("discount", elem.id);
      loadOffers();
      // elem.scrollIntoView();
    });
  });

  addClassAndRemoveForOtherElements(availabilityListElements, document.getElementById(initialAvailability));

  addClassAndRemoveForOtherElements(discoutListElements, document.getElementById(initialDiscoutState));

  loadOffers();

  document.getElementById("close-modal").addEventListener('click', function (event) {
    // fade(document.getElementById("modal"));
    // $("#modal").fadeOut();
    // document.getElementById("modal").style.display = "none";
    // document.getElementById("modal").style.opacity = 0;
    fadeOut(document.getElementById("modal"));

  });

  document.getElementById("modal").style.transition = "opacity 0.5s ease-in-out;";


  document.getElementById("paymentButton").addEventListener('click', function (event) {
    // if (hasClass(document.getElementById("mobilpaySelect"), "w--current")) {
    //   console.log("CARD!");
    //   postRcaPoliciesWeb(localStorage.getItem("selectedOfferId"), "card");
    // }
    if (hasClass(document.getElementById("tbiSelect"), "w--current")) {
      postRcaPoliciesWeb(localStorage.getItem("selectedOfferId"), "rate");
    } else {
      postRcaPoliciesWeb(localStorage.getItem("selectedOfferId"), "card");
    }
    // document.getElementById("modal").style.display = 'none';
  });

  document.getElementById("paymentButtonCard").addEventListener('click', function (event) {
    // if (hasClass(document.getElementById("mobilpaySelect"), "w--current")) {
    //   console.log("CARD!");
    //   postRcaPoliciesWeb(localStorage.getItem("selectedOfferId"), "card");
    // }
    if (hasClass(document.getElementById("tbiSelect"), "w--current")) {
      postRcaPoliciesWeb(localStorage.getItem("selectedOfferId"), "rate");
    } else {
      postRcaPoliciesWeb(localStorage.getItem("selectedOfferId"), "card");
    }
    // document.getElementById("modal").style.display = 'none';
  });

}