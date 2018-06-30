const selectFrom = document.getElementById("selectFrom");
const selectTo = document.getElementById("selectTo");
const input1Currency = document.getElementById("input1-currency");
const input2Currency = document.getElementById("input2-currency");
const convertButton = document.getElementById("convertButton");
const fromInput = document.getElementById("fromInput");
const toInput = document.getElementById("toInput");
let dbPromise;
let ratesStore;

window.onload = () => {
  getListOfCurrencies();
  convertButton.addEventListener('click', convertCurrency);
  dbPromise = openDatabase();
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../sw.js', {
    scope: '../'
  }).then(({installing, waiting, active}) => {

    if (installing) {
      console.log('Service worker installing');
    } else if (waiting) {
      console.log('Service worker installed');
    } else if (active) {
      console.log('Service worker active');
    }

  }).catch(error => {
    // registration failed
    console.log(`Registration failed with ${error}`);
  });
}

function openDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('currency-converter', 1, upgradeDb => {
    upgradeDb.createObjectStore('rates');
  });

}

function getListOfCurrencies() {
  fetch('https://free.currencyconverterapi.com/api/v5/currencies')
    .then(response => response.json())
    .then(myJson => setCurrencies(myJson));
}

function setCurrencies({
  results
}) {
  for (let i in results) {
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

function setInputCurrencySymbol(inputHTMLElement, {
  value
}) {
  inputHTMLElement.innerText = value;
}

function selectFromChanged(selectObject) {
  setInputCurrencySymbol(input1Currency, selectObject);
  toInput.value = '';
}

function selectToChanged(selectObject) {
  setInputCurrencySymbol(input2Currency, selectObject);
  toInput.value = '';
}

function convertCurrency() {
  const fromInputValue = fromInput.value;
  if (fromInputValue !== '') {
    const currncyFromValue = selectFrom.value;
    const currncyToValue = selectTo.value;
    const query = `${ currncyFromValue }_${ currncyToValue }`;
    showCachedRates(query);
  }
}

function fetchTheDataFromInternet(query) {
  const fromInputValue = fromInput.value;
  fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${ query }&compact=ultra`)
    .then(response => response.json())
    .then(myJson => {
      toInput.value = Number(Number(fromInputValue) * myJson[query]).toFixed(2);
      // add to indexed db
      addFetchedDataToIndexDB(myJson[query], query);
    });
}

function addFetchedDataToIndexDB(value, key) {
  dbPromise.then(db => {
    if (!db) return;

    let tx = db.transaction("rates", 'readwrite');
    let store = tx.objectStore('rates');
    store.put(value, key);
  });
}

function showCachedRates(key) {
  const fromInputValue = fromInput.value;
  dbPromise.then(db => {
    if (!db) return;

    let index = db.transaction('rates')
      .objectStore('rates');

    index.get(key).then(result => {
      if (result) {
        // we have now to display it to the user
        toInput.value = Number(Number(fromInputValue) * result).toFixed(2);
      } else {
        fetchTheDataFromInternet(key);
      }
    });
  });
}