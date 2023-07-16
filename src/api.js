const CURRENCY_KEY = import.meta.env.VITE_CURRENCY_API_KEY;
const CURRENCIES_LIST = [];
import { storeExchangeData, getExchangeDataFromStorage,
     storeCountry, getCountryFromStorage } from "./cache_storage.js";


const URL = 'https://restcountries.com/v3.1/';
async function getCountryInfo(countryID){
    try {
        const countryFromStorage = getCountryFromStorage(countryID);
        let country = null;
        if(countryFromStorage === null){
            const response = await fetch(`${URL}/alpha/${countryID}`);
            const data = (await response.json())[0];
            console.log(data);
            country = {id: countryID,
                title: data.name.official,
                capital: data.capital[0],
                flag: data.flags.png,
                altFlag: data.flags.alt,
                population: data.population,
                curency: Object.values(data.currencies)[0], //symbol and name
                currencyCode: Object.keys(data.currencies)[0]}
            storeCountry(country);
        }
        else{
            country = countryFromStorage;
            console.log('FROM CACHE');
        }
        console.log(country);
        return country;
        
    } catch (error) {
        console.error(error);
        return null;
    }
}


/**
 * Returns the codeFrom currency price in codeTo
 * Retruns null if codeFrom or codeTo were not found in exchangeList
 * Returns null if something went wrong
 * @param {String} codeFrom
 * @param {String} codeTo
 */
async function getCurrenciesExcangeRate(codeFrom, codeTo){
    try {
        let data;
        data = getExchangeDataFromStorage();
        if(data === null){
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${CURRENCY_KEY}/latest/USD`);
            data = await response.json();
            if(!response.ok)
                throw new Error(data);
            storeExchangeData(data);
        }
        else{
            console.log('EXCHANGE FROM CACHE')
        }
        const conversionKeys = Object.keys(data.conversion_rates);
        if(!conversionKeys.includes(codeFrom) || !conversionKeys.includes(codeTo)){
            return null;
        }
        const result = data.conversion_rates[codeTo] / data.conversion_rates[codeFrom];
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// async function getAllCountries(){
//     const countreisFromStore = await getAllCountriesFromStorageAsync();
//     if(countreisFromStore !== null){
//         return countreisFromStore;
//         console.log('ALL COUNTREIS FROM STORAGE')
//     }
//     try {
//         const response = await fetch(`${URL}/all`);
//         const data = await response.json();
//         allCountries = data.map(country => {
//             return {
//                 name: country.name,
//                 title: data.name.official,
//                 flag: data.flags.png,
//                 altFlag: data.flags.alt,
//                 currency: Object.values(data.currencies)[0], //symbol and name
//                 currencyCode: Object.keys(data.currencies)[0]
//             }
//         });
//         storeAllCountriesToStorage(allCountreis);
//     return allCountreis;
//     } catch (error) {
//         console.error
//         return null;
//     }
//     }

async function getAllCurrencies(){
    try {
        const data = await (await fetch('../src/assets/currencies.json')).json();
        return Object.values(data);
    } catch (error) {
        console.error(error);
        return [];
    }
}

export {getCountryInfo, getCurrenciesExcangeRate, getAllCurrencies}



