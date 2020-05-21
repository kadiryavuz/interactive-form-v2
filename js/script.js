
//global initials
let selectColor;
let selectPayment;
let otherJob;
let firstFieldSet;
let activitiesFieldSet;
let formEl;
let dynamicallyCreatedElements;
let initialColorOptions;
let colorDiv;
let creditCardDiv;
let paypalDiv;
let bitcoinDiv;
let resetTypes;
let validationErrors;


/**
 * `registerGlobals` function
 * registers initials with first/ expected values
 */
const registerGlobals = () => {
    selectColor = document.getElementById('color');
    selectPayment = document.getElementById('payment');
    otherJob = document.getElementById('other-title');
    activitiesFieldSet = document.getElementsByClassName('activities')[0];
    formEl = document.getElementsByTagName('form')[0];
    dynamicallyCreatedElements = [];
    initialColorOptions = [...selectColor.options];
    paypalDiv = document.getElementById('paypal');
    bitcoinDiv = document.getElementById('bitcoin');
    creditCardDiv = document.getElementById('credit-card');
    resetTypes = {
        "ID": 0,
    };
    validationErrors = [];
}


/**
 * `resetDynamics` function
 * Detects and Resets dynamically created element regarding the param values
 * 
 * @param {*} type - enum => ID spec with resetTypes enum
 * @param {*} value  - string => id of the element
 */
const resetDynamics = (type, value) => {
    if (type === resetTypes.ID) {
        for (let i = 0; i < dynamicallyCreatedElements.length; i += 1) {
            let el = dynamicallyCreatedElements[i];
            if (value === el.id) {
                const parentEl = document.getElementById(el.id).parentNode;
                parentEl.removeChild(el);
            }

        }
    }


    const indexVal = dynamicallyCreatedElements.findIndex(s => s.id === value);
    if (indexVal > -1) {
        dynamicallyCreatedElements.splice(indexVal, 1);
    }

}

/**
 * `forceClearDynamics`
 * Directly calls to reset all dynamically created elements
 */
const forceClearDynamics = () => {
    for (let i = 0; i < dynamicallyCreatedElements.length; i += 1) {
        resetDynamics(resetTypes.ID, dynamicallyCreatedElements[i].id);
    }
}

/**
 * `clearErrors` function
 * Clears all validation errors produced due to user-intereaction with the form
 */
const clearErrors = () => {
    for (let i = 0; i < validationErrors.length; i += 1) {
        if (validationErrors[i].control.tagName === 'INPUT') {
            validationErrors[i].control.style.border = "2px solid rgb(111, 157, 220)";
        } else {
            if (validationErrors[i].control.tagName === 'LEGEND' && validationErrors[i].code === 'ACT101') {
                validationErrors[i].control.parentNode.style.border = "none";
            }

        }

        //clear all error labels
        resetDynamics(resetTypes.ID, validationErrors[i].code);
    }
}

/**
 * `clearZipErrors` function
 *  resets real time messaging enabled zip code field specific errors
 *  applies accordingly to adapt with genereally tracked validation errors in the form
 */
const clearZipErrors = () => {
    let foundIndexes = [];
    for (let i = 0; i < validationErrors.length; i += 1) {
        if (validationErrors[i].code.indexOf('ZIP') > -1) {
            foundIndexes.push(i);
            validationErrors[i].control.style.border = "2px solid rgb(111, 157, 220)";
            resetDynamics(resetTypes.ID, validationErrors[i].code);
        }

    }

    //needed to co-op with other produced form validation errors
    if (foundIndexes > -1) {
        for (let i = 0; i < foundIndexes.length; i += 1) {
            validationErrors.splice(foundIndexes[i], 1);
        }
    }

}

/**
 * `clearOptions` function
 * if a node applied in the params contains options, removes all its options: SELECT
 * @param {*} node - HTMLNode
 */
const clearOptions = (node) => {
    if (node && node.options.length > 0) {
        while (node.options.length > 0) {
            node.remove(0);
        }
    }
}

/**
 * `switchColorSelection` function
 * displays or hides color selection div due to the value of param
 * @param {*} value -- boolean display or not
 */
const switchColorSelection = (value) => {
    const colorDiv = document.getElementById('colors-js-puns');
    if (value) {
        colorDiv.style.display = 'block';
    } else {
        colorDiv.style.display = 'none';
    }
}


/**
 * `createElement` function
 * 
 * creates element and appends to targetted parent if applied in the params
 * behaves specifically when an OPTION arrives
 * applies insertBefore appending for error labels if applied in the params
 * @param {*} type string - HTML Node type
 * @param {*} args object - all given node details like id, textContent, style color red etc.
 * @param {*} appendTo HTMLNode - parent element to append to
 * @param {*} doInsert HTMLNode - child element to insert before to parent
 */
const createElement = (type, args, appendTo, doInsert) => {
    let el = document.createElement(type);
    const argsKeys = Object.keys(args);
    for (let i = 0; i < argsKeys.length; i += 1) {
        if (argsKeys[i] === 'style') {
            const styleArgs = Object.keys(args[argsKeys[i]]);
            for (let v = 0; v < styleArgs.length; v += 1) {
                el[argsKeys[i]][styleArgs[v]] = args[argsKeys[i]][styleArgs[v]];
            }
        } else {
            el[argsKeys[i]] = args[argsKeys[i]];
        }

    }


    if (appendTo) {
        if (el.tagName === 'OPTION') {
            appendTo.add(el, 0);
        } else {
            if (doInsert) {
                appendTo.insertBefore(el, doInsert);
            } else {
                appendTo.appendChild(el);
            }

            dynamicallyCreatedElements.push(el);
        }

    }
}

/**
 * `applyFailedValidation` function
 * applies error styling to targeting nodes and creates labels to insert err description also
 * 
 * @param {*} playingZip - boolean => Exceeds case 3 applied to zipcode field in cc sections. Bypasses generics purpose of this function
 */
const applyFailedValidation = (playingZip) => {

    //if user is interecting with Zip filed then re-arrange validation errors
    let errorList = [...validationErrors];
    if (playingZip) {
        errorList = validationErrors.filter(s => s.code.indexOf('ZIP') > -1);
    }

    for (let i = 0; i < errorList.length; i += 1) {
        let parentEl = errorList[i].control.parentNode;
        //apply styling
        switch (errorList[i].code) {
            case 'NAME101':
            case 'MAIL101':
            case 'CC101':
            case 'CC102':
            case 'ZIP101':
            case 'ZIP102':
            case 'ZIPRANDOM':
            case 'CVV101':
            case 'CVV102':
                errorList[i].control.style.border = "2px solid red";
                break;
            case 'ACT101':
                parentEl.style.border = "2px solid red";
                break;
        }


        createElement('label', { id: errorList[i].code, textContent: errorList[i].text, style: { 'color': 'red' } }, parentEl, errorList[i].control);


    }

}

/**
 * `validateForm` function
 * execute conditionals and check if applicable or producing error within the scope of given specs
 * @param {*} cb - callback to trigger validateform if no validationErrors produced
 */
const validateForm = (cb) => {

    //clearing part
    forceClearDynamics();
    clearErrors();
    validationErrors = [];

    //case 1: Name field can't be blank.
    const nameInput = document.getElementById('name');
    if (nameInput.value === '') {
        validationErrors.push({ code: 'NAME101', text: "Name field can't be blank", control: nameInput });
    }

    //case 2: Email field must be a validly formatted e-mail address 
    const eMailInput = document.getElementById('mail');
    //credit for the email regex pattern: https://gist.github.com/nerdsrescueme/1237767
    const pattern = new RegExp('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
    const isValidEmail = pattern.test(eMailInput.value);
    if (!isValidEmail) {
        validationErrors.push({ code: 'MAIL101', text: "Email field must be a validly formatted e-mail address", control: eMailInput });
    }

    //Case 3: select at least one checkbox under the "Register for Activities" section of the form
    const checkList = document.querySelectorAll('input[type=checkbox]');
    let atLeastOneChecked = false;
    for (let i = 0; i < checkList.length; i += 1) {
        if (checkList[i].checked) {
            atLeastOneChecked = true;
            break;
        }
    }

    if (!atLeastOneChecked) {
        validationErrors.push({ code: 'ACT101', text: "Select at least one checkbox under the 'Register for Activities' section of the form", control: activitiesFieldSet.children[0] });
    }


    //case4: payment field validations - only if credit card selected
    if (selectPayment.value === "credit card") {

        //setting initials
        const ccPattern13 = new RegExp(/^\d{13}$/);
        const ccPattern16 = new RegExp(/^\d{16}$/);
        const creditInput = document.getElementById('cc-num');

        const zipPattern = new RegExp(/^\d{5}$/);
        const zipInput = document.getElementById('zip');

        const cvvPattern = new RegExp(/^\d{3}$/);
        const cvvInput = document.getElementById('cvv');

        const isDigit13 = ccPattern13.test(creditInput.value);
        const isDigit16 = ccPattern16.test(creditInput.value);


        //CC Input => checks executed with exceed case 2: Conditional Error Message
        if (creditInput.value === '') {
            validationErrors.push({ code: 'CC102', text: "Credit Card field can't be blank", control: creditInput });
        } else {
            if (isDigit13 || isDigit16) {
                //Do nothing
            } else {
                validationErrors.push({ code: 'CC101', text: "Credit Card field only accepts a number between 13 and 16 digits", control: creditInput });
            }
        }

        //ZIP Input => checks executed with exceed case 2: Conditional Error Message
        const isDigit5 = zipPattern.test(zipInput.value);
        if (zipInput.value === '') {
            validationErrors.push({ code: 'ZIP102', text: "Zip Code field can't be blank", control: zipInput });
        } else {
            if (isDigit5) {
                //do nothing
            } else {
                validationErrors.push({ code: 'ZIP101', text: "Zip Code field only accepts a 5-digit number", control: zipInput });
            }
        }

        //CVV Input => checks executed with exceed case 2: Conditional Error Message
        const isDigit3 = cvvPattern.test(cvvInput.value);
        if (cvvInput.value === '') {
            validationErrors.push({ code: 'CVV102', text: "CVV field can't be blank", control: cvvInput });
        } else {
            if (isDigit3) {
                //do nothing
            } else {
                validationErrors.push({ code: 'CVV101', text: "CVV field only accepts a 3-digit number", control: cvvInput });
            }
        }


    }

    //if no validation error produced then trigger callback else go apply styles, create error messages etc.
    if (validationErrors.length > 0) {
        applyFailedValidation();
    } else {
        cb();
    }

}

/**
 * `submitForm` function
 * validates form first if everyting is ok, then submits as expected -with callback-
 * 
 * @param {*} e  - Need to prevent default action
 */
const submitForm = (e) => {
    e.preventDefault();

    validateForm(() => {
        console.log("now we can submit");
        formEl.submit();
        // initForm();
    })
}


/**
 * `registerEvents`function
 * mainly handles bubbled events to form element by differantiating SELECT, INPUT tags
 * seperately hanliding realtime messaging functionality to zip field in the CC form
 */
const registerEvents = () => {
    //local initials
    const firstFieldSet = document.getElementsByTagName('fieldset')[0];

    /** exceeds Real-time Error Messages case
     * applied to zip field
    */
    const zipInput = document.getElementById('zip');
    zipInput.addEventListener('input', (e) => {
        clearZipErrors();
        // validationErrors = [];
        const zipVal = e.target.value;
        const isAllDigits = /^[0-9]*$/gm.test(zipVal);
        if (zipVal.length > 0 && zipVal.length < 5) {

            if (isAllDigits) {
                validationErrors.push({ code: 'ZIPRANDOM1', text: `A sample Zipcode: 44112 => ${5 - zipVal.length} digits more`, control: zipInput });
            }
            else {
                validationErrors.push({ code: 'ZIPRANDOM2', text: `Digits Only Please!!`, control: zipInput });
            }

        } else if (zipVal.length > 5) {
            if (isAllDigits) {
                validationErrors.push({ code: 'ZIPRANDOM3', text: `Too much digits: Need only 5`, control: zipInput });
            } else {
                validationErrors.push({ code: 'ZIPRANDOM4', text: `Calm Down!`, control: zipInput });
            }

        } else if (zipVal.length === 5 && isAllDigits) {
            //while real-time checking, better to remove remining errors if all validation fulfilled
            clearZipErrors();
        } else if (zipVal.length === 5 && !isAllDigits) {
            //while real-time checking, better to remove remining errors if all validation fulfilled
            validationErrors.push({ code: 'ZIPRANDOM6', text: `Clear non-digits please!`, control: zipInput });
        } else {
            validationErrors.push({ code: 'ZIPRANDOM5', text: `You can do it!`, control: zipInput });
        }

        applyFailedValidation(true);
    })

    formEl.addEventListener('submit', submitForm);

    formEl.addEventListener('change', (e) => {
        const subjectElId = e.target.id;
        const changeVal = e.target.value;
        const changeIndex = e.target.selectedIndex;
        const tag = e.target.tagName;

        if (tag === 'SELECT') {

            switch (subjectElId) {
                case 'title':
                    if (changeVal === 'other') {
                        //display inline seems better option
                        otherJob.style.display = 'inline-block';
                    } else {
                        otherJob.style.display = 'none';
                    }
                    break;
                case 'size':
                    break;
                case 'design':
                    const refMiddle = Math.floor(initialColorOptions.length / 2);
                    if (changeIndex > 0) {
                        switchColorSelection(true);
                        clearOptions(selectColor);
                        if (changeIndex === 1) {
                            //Get first three to colors
                            for (let i = 0; i < refMiddle; i += 1) {
                                selectColor.options.add(initialColorOptions[i], i);
                            }

                            selectColor.selectedIndex = 0;

                        } else if (changeIndex === 2) {
                            let indexCounter = 0;
                            for (let i = refMiddle; i < initialColorOptions.length; i += 1) {
                                selectColor.options.add(initialColorOptions[i], indexCounter);
                                indexCounter++;

                            }

                            selectColor.selectedIndex = 0;
                        } else {
                            //do nothing
                        }
                    } else {
                        clearOptions(selectColor);
                        createElement('option', { textContent: 'Please select a T-shirt theme' }, selectColor);
                    }

                    break;
                case 'color':
                    break;
                case 'payment':

                    if (changeVal === "credit card") {
                        creditCardDiv.style.display = "block";
                        paypalDiv.style.display = "none";
                        bitcoinDiv.style.display = "none";

                    } else if (changeVal === "paypal") {
                        creditCardDiv.style.display = "none";
                        paypalDiv.style.display = "block";
                        bitcoinDiv.style.display = "none";

                    } else if (changeVal === "bitcoin") {
                        creditCardDiv.style.display = "none";
                        paypalDiv.style.display = "none";
                        bitcoinDiv.style.display = "block";

                    } else {
                        console.warn("Unexpected payment value: ", changeVal);
                    }
                    break;
                case 'exp-month':
                    break;
                case 'exp-year':
                    break;
                default:
                    console.warn("Unrecognized change event targeted to: ", subjectElId);
                    break;
            }

        } else if (tag === 'INPUT') {
            const changeInput = e.target;
            let totalCost = 0;
            const changeInputTime = changeInput.getAttribute("data-day-and-time");

            const checkList = document.querySelectorAll('input[type=checkbox]');

            for (let i = 0; i < checkList.length; i += 1) {

                const checkedCost = +checkList[i].getAttribute('data-cost');
                if (checkList[i].checked) {
                    totalCost += checkedCost;
                }

                const nodeTime = checkList[i].getAttribute("data-day-and-time");

                if (changeInput.name !== checkList[i].name) {
                    if (nodeTime === changeInputTime) {
                        if (changeInput.checked) {

                            checkList[i].disabled = true;
                        } else {

                            checkList[i].disabled = false;
                        }

                    }
                }

            }

            resetDynamics(resetTypes.ID, 'total-workshop-cost');
            if (totalCost > 0) {
                createElement('label', { id: "total-workshop-cost", textContent: `Total: $${totalCost}` }, activitiesFieldSet);
            }

        }

    })
}


/**
 * `initForm` function
 * initializes action with defaults
 */
const initForm = () => {
    //local initials

    const firstInput = document.getElementsByTagName('input')[0];

    //registering global variables
    registerGlobals();

    //default action with design seelction
    clearOptions(selectColor);
    createElement('option', { textContent: 'Please select a T-shirt theme' }, selectColor);

    //give focus to first element
    firstInput.focus();

    //expected behavior is to set cc first and arrange cc display only
    selectPayment.selectedIndex = 1; // credit card
    selectPayment.options[0].disabled = true;
    paypalDiv.style.display = 'none';
    bitcoinDiv.style.display = 'none';

    //hiding other job field initially
    otherJob.style.display = 'none';

    //one of the exceeds cases: hiding Color selectin initially
    switchColorSelection(false);

    //all events to be registered
    registerEvents();
}



//start flow when everything is parsed
window.addEventListener('DOMContentLoaded', () => {
    initForm();
});