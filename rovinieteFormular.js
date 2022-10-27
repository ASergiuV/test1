var slide1Height = $('#step-slide1 .collaborate-form-step').height();
var slide2Height = $('#step-slide2 .collaborate-form-step').height();

console.log(slide1Height);
console.log(slide2Height);

const prevButtonHTML = '<div class="previous w-slider-arrow-left" role="button" tabindex="0" aria-controls="w-slider-mask-0" aria-label="previous slide" style="display: none;"><div id="prevButton" class="previous-button">← Back</div></div>';
const nextButtonHTML = '<div class="next roviniete w-slider-arrow-right" role="button" tabindex="0" aria-controls="w-slider-mask-0" aria-label="next slide" style="top: -468.516px;"><div id="nextButton" class="next-button button">Continua</div></div>';


// if($("#step-slide1").is(":visible") == true){
//     $(".next.roviniete").css('top', "-" + slide1Height + "px");
//      {
//         top: - slide1Height
//       }
//     );
// }
// if($("#step-slide2").is(":visible") == true){
//     $(".next.roviniete").css(
//      {
//         top: - slide2Height
//       }
//     );
// }

var removedCategoryRowsNoTimes = 0;

const base_url = 'https://app-dev.autodeal.ro/api/v1';
const base_url_mobilpay = 'https://app-dev.autodeal.ro';
const token = '100200|mFZqjzdO2Izu4e72eUSh0D0XctvkPQ2MMEDC78Hq';


// const base_url = 'https://app.autodeal.ro/api/v1';
// const token = '113701|STygD85xaZB20zgdeOGtJXM5q2NX6bpwmIQ5JRxB';

const errorColor = "hsl(350 100% 13.5%)";
const errorBg = "hsl(350 100% 66.5%)";

// var citites = [];
// var areas = [];

var categories = [];
var availabilities = [];

const images = {
    "A-Autoturism": "https://uploads-ssl.webflow.com/60b35cb1a44c2d844c8e31f9/6332e5866e57b7cee8f870d5_sedan%201.png",
    "B-Mf 0,0t<MTMA<=3,5t": "https://uploads-ssl.webflow.com/60b35cb1a44c2d844c8e31f9/6332e586ea937c33d185a284_delivery-truck%201.png"
};

function removeRadiochildrenOnce(parentId) {
    if (removedCategoryRowsNoTimes >= 1) {
        return;
    }
    const parent = document.getElementById(parentId);
    // var counter = 0;
    // console.log(parent);

    // parent.innerHTML = "";

    for (const row of [...parent.children]) {
        // console.log(row);

        if (row.innerHTML.includes("radio-button-label-2")) {//testRow.textContent === "rov-row "
            parent.removeChild(row);
        }
    }

    if (parentId === 'category-table') {
        removedCategoryRowsNoTimes += 1;
    }
}


function getVignetteCategories() {
    var request = new XMLHttpRequest();
    request.open('GET', `${base_url}/vignette-categories`, false);
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.onload = function () {
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            categories = data.data;
            // removeRadiochildrenOnce('category-table');
            // addCategoriesRow();
        } else {
            // generateToast({
            //     message: "A avut loc o eroare!",
            //     background: errorBg,
            //     color: errorColor,
            // });
        }
    };

    request.send();
}


function getVignetteCategoryPrices(categoryId) {
    var request = new XMLHttpRequest();
    request.open('GET', `${base_url}/vignette-categories/${categoryId}/prices`, false);
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.onload = function () {
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            availabilities = data.data;
            addPrices();
        } else {
            // generateToast({
            //     message: "A avut loc o eroare!",
            //     background: errorBg,
            //     color: errorColor,
            // });
        }
    };

    request.send();
}

function addNextPrevButtonsAsChildOfId(elemId) {
    const parent = document.getElementById(elemId);

    if (!parent.innerHTML.includes(prevButtonHTML)) {
        parent.innerHTML += prevButtonHTML;
    }

    if (!parent.innerHTML.includes(nextButtonHTML)) {
        parent.innerHTML += nextButtonHTML;
    }
}

function removeNextPrevButtonsAsChildOfId(elemId) {
    const parent = document.getElementById(elemId);

    if (parent.innerHTML.includes(prevButtonHTML)) {
        parent.innerHTML = parent.innerHTML.replace(prevButtonHTML, '');
    }

    if (parent.innerHTML.includes(nextButtonHTML)) {
        parent.innerHTML = parent.innerHTML.replace(nextButtonHTML, '');
    }
}


function addCategoriesRow() {
    const parent = document.getElementById('category-table');
    // var counter = 0;
    // console.log(parent);

    // // parent.innerHTML = "";

    // for (const row of [...parent.children]) {
    //     console.log(row);

    //     if (row.innerHTML.includes("radio-button-label-2")) {//testRow.textContent === "rov-row "
    //         parent.removeChild(row);
    //     }
    // }

    // var title = document.createElement('div');
    // title.setAttribute('data-ix', "show-content-onslide");
    // addClass(title, 'form-section-title');
    // title.innerHTML = "Tipul de autovehicul";

    // parent.appendChild(title);

    // var paragraph = document.createElement('p');
    // addClass(paragraph, 'paragraph-7');
    // paragraph.innerHTML = "Va rugam selectati tipul de autovehicul pentru care doriti sa achizionati rovinieta.";

    // parent.appendChild(paragraph);

    var row = document.createElement('div');
    addClass(row, 'rov-row');//
    addClass(row, 'w-clearfix');

    for (let i = 0; i < categories.length; i++) {

        if (i % 4 == 0 && i != 0) {
            parent.appendChild(row);
            row = document.createElement('div');
            addClass(row, 'rov-row');
            addClass(row, 'w-clearfix');
        }

        var category = categories[i];
        var categoryDivInput = document.createElement('div');
        addClass(categoryDivInput, 'input-group input-fullwidth rovinieta-input');


        var categoryDivWrap = document.createElement('div');
        addClass(categoryDivWrap, 'extra-option-wrap');

        var label = document.createElement('label');
        addClass(label, 'radio-button-field-2 w-clearfix w-radio');

        var img = document.createElement('img');
        addClass(img, 'image-17');
        img.setAttribute('src', images[category.code]);
        img.setAttribute('loading', 'lazy');
        img.setAttribute('width', '64');
        img.setAttribute('alt', category.name);

        var categoryDivRadioInput = document.createElement('div');
        addClass(categoryDivRadioInput, 'w-form-formradioinput w-form-formradioinput--inputType-custom radio-button-2 align-right w-radio-input');
        if (category.code == "A-Autoturism") {
            addClass(categoryDivRadioInput, 'w--redirected-checked');
            localStorage.setItem('selectedCategory', category.id);
        }

        var input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'auto');
        input.setAttribute('data-name', 'auto');
        input.setAttribute('style', 'opacity:0;position:absolute;z-index:-1');
        input.setAttribute('value', category.id);
        input.setAttribute('id', "auto" + i);


        var span = document.createElement('span');
        addClass(span, 'radio-button-label-2 radio-image w-form-label');
        span.setAttribute('for', "auto" + i);


        var strong = document.createElement('strong');
        addClass(strong, 'bold-text-3');
        strong.innerHTML = category.name;

        span.appendChild(strong);

        label.appendChild(img);
        label.appendChild(categoryDivRadioInput);
        label.appendChild(input);
        label.appendChild(span);

        label.addEventListener('click', function (event) {
            // console.log(event.target);

            if (event.target.type == 'radio') {
                localStorage.setItem('selectedCategory', event.target.value);
            }
        })


        categoryDivWrap.appendChild(label);
        categoryDivInput.appendChild(categoryDivWrap);
        row.appendChild(categoryDivInput);

        // counter = counter + 1;
    }

    parent.appendChild(row);

}

function removeSuccess(seconds = 0) {
    setTimeout(function () {
        container = document.getElementById('successMessageSubmit');
        if (container == null) return; // abort if element isn't available

        container.style.display = 'none';

        form = document.getElementById('wf-form-rovinieta-detalii');
        form.style.display = 'block';


    }, seconds * 1000);
}

function addPrices() {
    const parent = document.getElementById('rovList');//price-table
    // var counter = 0;
    // console.log(parent);

    parent.innerHTML = "";
    // for (let element of parent.querySelector('.w-clearfix')) {
    //     if(element.innerHTML.includes("radio") || element.innerHTML.includes("Radio")){
    //         parent.removeChild(element);
    //     }
    // }

    // for (const row of [...parent.children]) {
    //     console.log(row);
    //     if (row.innerHTML.includes("radio-button-label-2")) {//testRow.textContent === "rov-row "
    //         parent.removeChild(row);
    //     }
    // }

    //slide 1 adaugare buton in lista la nivel cu row, trebuie adaugat si pe a doua 

    // parent.removeChild(parent.querySelector('.w-clearfix'));
    //if innerhtml contains radio

    // var title = document.createElement('div');
    // title.setAttribute('data-ix', "show-content-onslide");
    // addClass(title, 'form-section-title');
    // title.innerHTML = "Selecteaza rovinieta";

    // parent.appendChild(title);

    // var paragraph = document.createElement('p');
    // addClass(paragraph, 'paragraph-7');
    // paragraph.innerHTML = "Selecteaza tipul de rovinieta dorit, cat si data de incepere";

    // parent.appendChild(paragraph);

    var row = document.createElement('div');
    addClass(row, 'w-clearfix');

    for (let i = 0; i < availabilities.length; i++) {

        var availability = availabilities[i];
        var categoryDivInput = document.createElement('div');
        addClass(categoryDivInput, 'input-group input-fullwidth rovinieta-input');


        var categoryDivWrap = document.createElement('div');
        addClass(categoryDivWrap, 'extra-option-wrap');

        var label = document.createElement('label');
        addClass(label, 'radio-button-field-2 fullwidth w-clearfix w-radio');

        // var img = document.createElement('img');
        // addClass(img, 'image-17');
        // img.setAttribute('src', images[category.code]);
        // img.setAttribute('loading', 'lazy');
        // img.setAttribute('width', '64');
        // img.setAttribute('alt', category.name);

        var categoryDivRadioInput = document.createElement('div');
        addClass(categoryDivRadioInput, 'w-form-formradioinput w-form-formradioinput--inputType-custom radio-button-2 w-radio-input');
        if (i == 0) {
            addClass(categoryDivRadioInput, 'w--redirected-checked');
            localStorage.setItem('selectedAvailability', availability.availability_code);
        }

        var input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'availability');
        input.setAttribute('data-name', 'availability');
        input.setAttribute('style', 'opacity:0;position:absolute;z-index:-1');
        input.setAttribute('value', availability.availability_code);
        input.setAttribute('id', "availability" + i);


        var span = document.createElement('span');
        addClass(span, 'radio-button-label-2 radio-button-label-3 w-form-label');
        span.setAttribute('for', "availability" + i);


        var strong = document.createElement('strong');
        addClass(strong, 'bold-text-3');
        strong.innerHTML = availability.availability_name;

        span.appendChild(strong);

        var div13 = document.createElement('div');
        addClass(div13, 'div-block-13');

        var text13 = document.createElement('div');
        addClass(text13, 'text-block-13');
        text13.innerHTML = availability.value + " " + availability.currency_code;

        var eur = document.createElement('div');
        addClass(eur, 'eur');
        eur.innerHTML = availability.authority_value + " " + availability.authority_currency_code;


        div13.appendChild(text13);
        div13.appendChild(eur);


        // label.appendChild(img);
        label.appendChild(categoryDivRadioInput);
        label.appendChild(input);
        label.appendChild(span);
        label.appendChild(div13);

        label.addEventListener('click', function (event) {
            // console.log(event.target);

            if (event.target.type == 'radio') {
                localStorage.setItem('selectedAvailability', event.target.value);
            }
        })


        categoryDivWrap.appendChild(label);
        categoryDivInput.appendChild(categoryDivWrap);
        row.appendChild(categoryDivInput);

        // counter = counter + 1;
    }
    // const start_date = document.getElementById('dateDiv');

    parent.appendChild(row);

    // parent.innerHTML += '<div class="input-group input-date"><div class="input-field-wrap"><label for="Date-2" class="field-label-3">Vreau RCA valabil de la data</label><div class="field-wrap"><input type="hidden" class="date inner-page-input startdate w-input flatpickr-input" maxlength="256" name="start_date" data-name="start_date" placeholder="Date Picker Element" id="start_date" required="" value="21.10.2022"><input class="date inner-page-input startdate w-input form-control input" placeholder="Date Picker Element" required="" type="text"><img id="btnOpen" width="16" loading="lazy" src="https://uploads-ssl.webflow.com/60b35cb1a44c2d844c8e31f9/6310854cba34bd3b698d7320_calendar.svg" alt="" class="field-icon"></div></div></div>';
    // const start_date = document.getElementById('start_date');
}


// function prepare_request(path) {
//     var request = new XMLHttpRequest();
//     request.open('GET', `${base_url}${path}`, true);
//     request.setRequestHeader('Authorization', `Bearer ${token}`);
//     return request;
// }

// function set_data_to_dropdown(data, element_id, attribute) {
//     const dropdown = document.getElementById(element_id);

//     data.forEach(element => {
//         const option = document.createElement('option');
//         option.setAttribute('value', element[attribute]);
//         option.textContent = element.name;
//         dropdown.appendChild(option);
//     });
// }

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
  .toast-container{position:fixed;z-index:10000;top:8rem;right:1.5rem;display:grid;justify-items:end;gap:.5rem}.toast{line-height:1;padding:.5em 1em;animation:toastIt 7000ms cubic-bezier(.785,.135,.15,.86) forwards;border-radius:4px;font-size:12px;font-weight:400;background:hsl(0,0%,91.8%)!important}@keyframes toastIt{0%,100%{transform:translateY(-150%);opacity:0}10%,90%{transform:translateY(0);opacity:1}}@media screen and (max-width:991px){.toast-container{justify-items:center;background:#fff;width:100%}.toast-container .toast{margin-top:1em}}
  </style>
  `);
    toastContainer = document.querySelector('.toast-container');
}


// catch form response to object
function handleSubmit(event) {
    event.preventDefault();
    const license = localStorage.getItem('license-number');
    const availability = localStorage.getItem('selectedAvailability');
    // const category = localStorage.getItem('selectedCategory');

    const data = new FormData(event.target);

    // data.append("category_id", category);
    data.append("availability", availability);
    data.append("registration_number", license);


    const queryString = new URLSearchParams(data); // .delete("parametru") ca sa stergem ce nu e nev, gen terms

    queryString.delete("_redirect");
    // queryString.delete("owner");
    //   localStorage.setItem("discount", queryString.get("decontare"));
    //   localStorage.setItem("availability", queryString.get("availability"));

    localStorage.setItem("querystring2", queryString.toString());
    const qs = localStorage.getItem("querystring2");
    postVignetteAllData("card", qs);

    // document.getElementById("paymentButton").addEventListener('click', function (event) {
    //     // if (hasClass(document.getElementById("mobilpaySelect"), "w--current")) {
    //     //   console.log("CARD!");
    //     //   postVignetteAllData(localStorage.getItem("selectedOfferId"), "card");
    //     // }
    //     console.log(qs)

    //     if (hasClass(document.getElementById("tbiSelect"), "w--current")) {
    //         postVignetteAllData("rate", qs);
    //     } else {
    //         postVignetteAllData("card", qs);
    //     }
    //     // document.getElementById("modal").style.display = 'none';
    // });

    // document.getElementById("paymentButtonCard").addEventListener('click', function (event) {
    //     // if (hasClass(document.getElementById("mobilpaySelect"), "w--current")) {
    //     //   console.log("CARD!");
    //     //   postVignetteAllData(localStorage.getItem("selectedOfferId"), "card");
    //     // }
    //     console.log(qs)
    //     if (hasClass(document.getElementById("tbiSelect"), "w--current")) {
    //         postVignetteAllData("rate", qs);
    //     } else {
    //         postVignetteAllData("card", qs);
    //     }
    //     // document.getElementById("modal").style.display = 'none';
    // });

    // window.location.href = '/asigurare-rca-oferte-disponibile';

    removeSuccess(5);
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

function goToPreviousStep() {
    const classToChange = "step-active";
    const pas = document.getElementById('pasText');
    const pasAlt = document.getElementById('pasTextAlt');

    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');

    const step1alt = document.getElementById('step1alt');
    const step2alt = document.getElementById('step2alt');
    const step3alt = document.getElementById('step3alt');

    const nextWrapper = document.getElementById('nextBtnWrapperRov');
    const prevWrapper = document.getElementById('prevBtnWrapperRov');


    switch (pas.innerHTML) {
        case "Pasul 1":
            break;
        case "Pasul 2":
            addClass(step1, classToChange);
            removeClass(step2, classToChange);
            removeClass(step3, classToChange);

            addClass(step1alt, classToChange);
            removeClass(step2alt, classToChange);
            removeClass(step3alt, classToChange);

            pas.innerHTML = "Pasul 1";
            pasAlt.innerHTML = "Pasul 1";

            removeClass(nextWrapper, 'slider2');
            addClass(nextWrapper, 'slider1');
            removeClass(prevWrapper, 'slider2');
            addClass(prevWrapper, 'slider1');
            $(window).scrollTop(0);

            break;
        case "Pasul 3":
            // getVignetteCategoryPrices(localStorage.getItem('selectedCategory'));

            removeClass(step1, classToChange);
            addClass(step2, classToChange);
            removeClass(step3, classToChange);


            removeClass(step1alt, classToChange);
            addClass(step2alt, classToChange);
            removeClass(step3alt, classToChange);

            pas.innerHTML = "Pasul 2";
            pasAlt.innerHTML = "Pasul 2";

            if (!hasClass(nextWrapper, 'slider2')) {
                addClass(nextWrapper, 'slider2');
                removeClass(nextWrapper, 'slider1');
            }
            // break;

            if (!hasClass(prevWrapper, 'slider2')) {
                addClass(prevWrapper, 'slider2');
                removeClass(prevWrapper, 'slider1');
                removeClass(prevWrapper, 'slider3');

            }
            $(window).scrollTop(0);

            break;
    }
}


function goToNextStep(event) {
    const classToChange = "step-active";
    const pas = document.getElementById('pasText');
    const pasAlt = document.getElementById('pasTextAlt');

    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');

    const step1alt = document.getElementById('step1alt');
    const step2alt = document.getElementById('step2alt');
    const step3alt = document.getElementById('step3alt');

    const nextWrapper = document.getElementById('nextBtnWrapperRov');
    const prevWrapper = document.getElementById('prevBtnWrapperRov');


    switch (pas.innerHTML) {
        case "Pasul 1":

            getVignetteCategoryPrices(localStorage.getItem('selectedCategory'));

            removeClass(step1, classToChange);
            addClass(step2, classToChange);
            removeClass(step3, classToChange);


            removeClass(step1alt, classToChange);
            addClass(step2alt, classToChange);
            removeClass(step3alt, classToChange);

            pas.innerHTML = "Pasul 2";
            pasAlt.innerHTML = "Pasul 2";

            removeClass(nextWrapper, 'slider1');
            addClass(nextWrapper, 'slider2');
            removeClass(prevWrapper, 'slider1');
            addClass(prevWrapper, 'slider2');

            $(window).scrollTop(0);

            break;
        case "Pasul 2":
            if (document.getElementById('vin').value?.trim() === "") {
                event.preventDefault();
                generateToast({
                    message: "Toate campurile trebuie completate",
                    background: "hsl(350 100% 66.5%)",
                    color: "hsl(350 100% 13.5%)",
                });
                document.getElementById('pasText').innerHTML = "Pasul 3";
                document.getElementById('prevButton').click();
                return false;
            }
            removeClass(step1, classToChange);
            removeClass(step2, classToChange);
            addClass(step3, classToChange);

            removeClass(step1alt, classToChange);
            removeClass(step2alt, classToChange);
            addClass(step3alt, classToChange);

            pas.innerHTML = "Pasul 3";
            pasAlt.innerHTML = "Pasul 3";
            $(window).scrollTop(0);
            removeClass(prevWrapper, 'slider1');
            removeClass(prevWrapper, 'slider2');
            addClass(prevWrapper, 'slider3');
            

            break;
        case "Pasul 3":
            break;

    }
}


function fadeOut(element) {
    element.style.opacity = 1;
    setTimeout(() => {
        element.style.opacity = 0;
    }, 500 + 20);
}

function postVignetteAllData(type, qs) {
    var request = new XMLHttpRequest();
    // const qs = localStorage.getItem("querystring2");
    console.log(qs);

    request.open('POST', `${base_url}/vignette-policies/all-data?${qs}`, true);
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        var data = JSON.parse(this.response);

        console.log("postVignetteAllData");

        console.log(data);

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

        console.log("postMobilpay");

        console.log(data);

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

function addCategoryToLocalStorage(event) {
    localStorage.setItem('selectedCategory', event.target.value);
}


window.onload = function () {

    initToast();

    addClass(document.getElementById('nextBtnWrapperRov'), 'slider1');
    addClass(document.getElementById('prevBtnWrapperRov'), 'slider1');


    getVignetteCategories();

    const form = document.getElementById('wf-form-rovinieta-detalii');
    form.addEventListener('submit', handleSubmit);

    const radio1 = document.getElementById('1');
    radio1.addEventListener('click', addCategoryToLocalStorage);

    const radio2 = document.getElementById('2');
    radio2.addEventListener('click', addCategoryToLocalStorage);

    document.getElementById('1').click();

    const start_date = document.getElementById('start_date');
    // start_date.disabled = true;


    start_date.flatpickr({//document.getElementsByClassName('start_date')
        altInput: true,
        defaultDate: new Date(),
        minDate: new Date(),
        allowInput: true,
        maxDate: new Date().setMonth(new Date().getMonth() + 1),
        // altFormat: "F j, Y",
        altFormat: "d.m.Y",
        dateFormat: "d.m.Y",
    });

    const next = document.getElementById('nextButton');
    next.addEventListener('click', goToNextStep);

    const prev = document.getElementById('prevButton');
    prev.addEventListener('click', goToPreviousStep);

    // document.getElementById("close-modal").addEventListener('click', function (event) {
    //     // fade(document.getElementById("modal"));
    //     // $("#modal").fadeOut();
    //     // document.getElementById("modal").style.display = "none";
    //     // document.getElementById("modal").style.opacity = 0;
    //     fadeOut(document.getElementById("modal"));

    // });

    // document.getElementById("modal").style.transition = "opacity 0.5s ease-in-out;";
}

console.log("VERSIUNEA 9");
