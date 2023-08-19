const CURRENCY_KEY = import.meta.env.VITE_CURRENCY_API_KEY;
const NINJAS_KEY = import.meta.env.VITE_NINJA_API_KEY;
import { storeExchangeData, getExchangeDataFromStorage,
     storeCountry, getCountryFromStorage } from "./cache_storage.js";


const RESTCOUNTRIES_URL = 'https://restcountries.com/v3.1/';
const NINJAS_URL = 'https://api.api-ninjas.com/v1/';
const EXCHANGE_URL = 'https://v6.exchangerate-api.com/v6';

async function getCountryInfo(countryID){
    try {
        const countryFromStorage = getCountryFromStorage(countryID);
        let country = null;
        if(countryFromStorage === null){
            const response = await fetch(`${RESTCOUNTRIES_URL}/alpha/${countryID}`);
            const ninjasData = await getCountryFromNinjasApi(countryID);
            const data = (await response.json())[0];
            country = {id: countryID,
                title: data.name.official,
                capital: data.capital[0],
                flag: data.flags.png,
                altFlag: data.flags.alt,
                population: data.population,
                startOfTheWeek: data.startOfWeek,
                languages: Object.values(data.languages),
                curency: Object.values(data.currencies)[0], //symbol and name
                currencyCode: Object.keys(data.currencies)[0],
                gini: data.gini !== undefined ? Object.values(data.gini).at(-1) : 0,
                area: data.area
            }
            if(ninjasData){
                country.gdp = ninjasData.gdp * 1_000_000;
                country.gdpGrowth = ninjasData.gdp_growth;
                country.imports = ninjasData.imports * 1_000_000;
                country.exports = ninjasData.exports * 1_000_000;
                country.gdpPerCaptia = ninjasData.gdp_per_capita;
            }
            storeCountry(country);
        }
        else{
            country = countryFromStorage;
            console.log('COUNTRY FROM CACHE');
        }
        return country;
        
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getCountryFromNinjasApi(countryID){
    const options = {
        headers: {"X-Api-Key": NINJAS_KEY},
    };
    try {
        const response = await fetch(`${NINJAS_URL}/country?name=${countryID}`,options);
        if(response.ok){
            const result = await response.json();
            return result[0]
        }
        else{
            throw new Error(response.statusText)
        }
    } catch (error) {
        console.error(error)
        return null;
    }
}


/**
 * Returns the codeFrom currency price in codeTo currency
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
            const response = await fetch(`${EXCHANGE_URL}/${CURRENCY_KEY}/latest/USD`);
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

async function getAllCurrencies(){
    try {
        const data = await (await fetch('/currencies.json')).json();
        return Object.values(data);
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getAllCountries(){
    try {
        const response = await fetch(`${RESTCOUNTRIES_URL}/all`);
        const data = await response.json();
        const countreis = data.map(c => {
            return {
                id: c.cca2,
                flag: c.flags.png,
                title: c.name.common,
                gini: c.gini !== undefined ? Object.values(c.gini).at(-1) : 0,
                population: c.population,
                area: c.area
            }
        });
        return countreis.sort((a,b) => b.population - a.population);
        
    } catch (error) {
        console.error(error);
        return [];
    }
}

export {getCountryInfo,
     getCurrenciesExcangeRate,
     getAllCurrencies, getAllCountries}



