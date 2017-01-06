const Validate    = require('./validation').Validate;
const isValidDate = require('./common_functions').isValidDate;
const Content     = require('./content').Content;
const Cookies     = require('../../lib/js-cookie');
const localize    = require('../base/localize').localize;
const Client      = require('../base/client').Client;
const Contents    = require('../base/contents').Contents;
const url_for     = require('../base/url').url_for;

const ValidAccountOpening = (function() {
    const redirectCookie = function() {
        if (Contents.show_login_if_logout(true)) {
            return;
        }
        if (!Client.get_boolean('is_virtual')) {
            window.location.href = url_for('trading');
            return;
        }
        const client_loginid_array = Client.get_value('loginid_array');
        for (let i = 0; i < client_loginid_array.length; i++) {
            if (client_loginid_array[i].real === true) {
                window.location.href = url_for('trading');
                return;
            }
        }
    };
    const handler = function(response, message) {
        if (response.error) {
            const errorMessage = response.error.message;
            if (response.error.code === 'show risk disclaimer' && document.getElementById('financial-form')) {
                $('#financial-form').addClass('hidden');
                $('#financial-risk').removeClass('hidden');
                return;
            }
            if (document.getElementById('real-form')) {
                $('#real-form').remove();
            } else if (document.getElementById('japan-form')) {
                $('#japan-form').remove();
            } else if (document.getElementById('financial-form')) {
                $('#financial-form').remove();
                $('#financial-risk').remove();
            }
            const error = document.getElementsByClassName('notice-msg')[0];
            error.innerHTML = (response.msg_type === 'sanity_check') ? localize('There was some invalid character in an input field.') : errorMessage;
            error.parentNode.parentNode.parentNode.setAttribute('style', 'display:block');
        } else if (Cookies.get('residence') === 'jp') {
            window.location.href = url_for('new_account/knowledge_testws');
            $('#topbar-msg').children('a').addClass('invisible');
        } else {     // jp account require more steps to have real account
            Client.process_new_account(Cookies.get('email'), message.client_id, message.oauth_token, false);
        }
    };
    let letters,
        numbers,
        space,
        hyphen,
        period,
        apost;

    const initializeValues = function() {
        letters = Content.localize().textLetters;
        numbers = Content.localize().textNumbers;
        space   = Content.localize().textSpace;
        hyphen  = Content.localize().textHyphen;
        period  = Content.localize().textPeriod;
        apost   = Content.localize().textApost;
    };

    const checkFname = function(fname, errorFname) {
        if ((fname.value).trim().length < 2) {
            errorFname.innerHTML = Content.errorMessage('min', '2');
            Validate.displayErrorMessage(errorFname);
            window.accountErrorCounter++;
        } else if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(fname.value)) {
            initializeValues();
            errorFname.innerHTML = Content.errorMessage('reg', [letters, space, hyphen, period, apost]);
            Validate.displayErrorMessage(errorFname);
            window.accountErrorCounter++;
        }
    };
    const checkLname = function(lname, errorLname) {
        if ((lname.value).trim().length < 2) {
            errorLname.innerHTML = Content.errorMessage('min', '2');
            Validate.displayErrorMessage(errorLname);
            window.accountErrorCounter++;
        } else if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(lname.value)) {
            initializeValues();
            errorLname.innerHTML = Content.errorMessage('reg', [letters, space, hyphen, period, apost]);
            Validate.displayErrorMessage(errorLname);
            window.accountErrorCounter++;
        }
    };
    const checkDate = function(dobdd, dobmm, dobyy, errorDob) {
        if (!isValidDate(dobdd.value, dobmm.value, dobyy.value) || dobdd.value === '' || dobmm.value === '' || dobyy.value === '') {
            errorDob.innerHTML = Content.localize().textErrorBirthdate;
            Validate.displayErrorMessage(errorDob);
            window.accountErrorCounter++;
        }
    };
    const checkPostcode = function(postcode, errorPostcode) {
        if ((postcode.value !== '' || Client.get_value('residence') === 'gb') && !/^[a-zA-Z\d-]+$/.test(postcode.value)) {
            initializeValues();
            errorPostcode.innerHTML = Content.errorMessage('reg', [letters, numbers, hyphen]);
            Validate.displayErrorMessage(errorPostcode);
            window.accountErrorCounter++;
        }
    };
    const checkTel = function(tel, errorTel) {
        if (tel.value.replace(/\+| /g, '').length < 6) {
            errorTel.innerHTML = Content.errorMessage('min', 6);
            Validate.displayErrorMessage(errorTel);
            window.accountErrorCounter++;
        } else if (!/^\+?[0-9\s]{6,35}$/.test(tel.value)) {
            initializeValues();
            errorTel.innerHTML = Content.errorMessage('reg', [numbers, space]);
            Validate.displayErrorMessage(errorTel);
            window.accountErrorCounter++;
        }
    };
    const checkAnswer = function(answer, errorAnswer) {
        if (answer.value.length < 4) {
            errorAnswer.innerHTML = Content.errorMessage('min', 4);
            Validate.displayErrorMessage(errorAnswer);
            window.accountErrorCounter++;
        }
    };
    const checkCity = function(city, errorCity) {
        if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(city.value)) {
            initializeValues();
            errorCity.innerHTML = Content.errorMessage('reg', [letters, space, hyphen, period, apost]);
            Validate.displayErrorMessage(errorCity);
            window.accountErrorCounter++;
        }
    };
    const checkState = function(state, errorState) {
        if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(state.value)) {
            initializeValues();
            errorState.innerHTML = Content.errorMessage('reg', [letters, space, hyphen, period, apost]);
            Validate.displayErrorMessage(errorState);
            window.accountErrorCounter++;
        }
    };
    return {
        redirectCookie: redirectCookie,
        handler       : handler,
        checkFname    : checkFname,
        checkLname    : checkLname,
        checkDate     : checkDate,
        checkPostcode : checkPostcode,
        checkTel      : checkTel,
        checkAnswer   : checkAnswer,
        checkCity     : checkCity,
        checkState    : checkState,
    };
})();

module.exports = {
    ValidAccountOpening: ValidAccountOpening,
};
