const selectFrom = document.getElementById("selectFrom");
const selectTo = document.getElementById("selectTo");
const input1Currency = document.getElementById("input1-currency");
const input2Currency = document.getElementById("input2-currency");
const convertButton = document.getElementById("convertButton");
const fromInput = document.getElementById("fromInput");
const toInput = document.getElementById("toInput");

window.onload = () => {
  getListOfCurrencies();
  convertButton.addEventListener('click', convertCurrency);
};

function getListOfCurrencies () {
  fetch('https://free.currencyconverterapi.com/api/v5/currencies')
  .then(response => response.json())
  .then(myJson => setCurrencies(myJson));
}

function setCurrencies({results}) {
  console.log(results);
  for(let i in results) {
    const option1 = document.createElement('option');
    const option2 = document.createElement('option');
    option1.text = i;
    option2.text = i;
    option1.innerHTML = i;
    option2.innerHTML = i;
    selectFrom.appendChild(option1);
    selectTo.appendChild(option2);
  }
  setInputCurrencySymbol(input1Currency, selectFrom);
  setInputCurrencySymbol(input2Currency, selectTo);
}

function setInputCurrencySymbol(inputHTMLElement, {value}) {
  inputHTMLElement.innerText = value;
}

function selectFromChanged(selectObject) {
  setInputCurrencySymbol(input1Currency, selectObject);
  toInput.value ='';
}

function selectToChanged(selectObject) {
  setInputCurrencySymbol(input2Currency, selectObject);
  toInput.value ='';
}

function convertCurrency() {
  const fromInputValue = fromInput.value;
  if(fromInputValue !==''){
    console.log('fetching');
    const currncyFromValue = selectFrom.value;
    const currncyToValue = selectTo.value;
    const query = `${ currncyFromValue }_${ currncyToValue }`
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${ query }&compact=ultra`)
    .then(response => response.json())
    .then(myJson => toInput.value = Number(Number(fromInputValue)*myJson[query]).toFixed(2));
  }
}



