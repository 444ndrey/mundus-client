
const storeTime = 7 * 24 * 60 * 60 * 1000;
/**
 * Stores country info
 * @param {{id: string, title: string}}country 
 */
function storeCountry(country){

    const key = `country-${country.id}`;
    const objectToStore = {
        lifeTimeEnd: Date.now() + storeTime,
        data: country
    }
    const jsonCountry = JSON.stringify(objectToStore);
    localStorage.setItem(key, jsonCountry);
}
/**
 * Returns country from storage by country id.
 * If Id doesn't exist or lifetime is gone returns null.
 * @param {{id: string, title: string}}country 
 */
function getCountryFromStorage(countryId){
    const key = `country-${countryId}`;
    const stringFromStorage = localStorage.getItem(key);
    if(stringFromStorage === null){
        return null;
    }
    const dataFromStorage = JSON.parse(stringFromStorage);
    if(dataFromStorage.lifeTimeEnd < Date.now()){
        localStorage.removeItem(key);
        return null;
    }
    return  dataFromStorage.data;
}
/**
 * STORE exchange date
 * @param {Object} exchangeData 
 */
function storeExchangeData(exchangeData){
    const jsonString = JSON.stringify(exchangeData);
    localStorage.setItem('exchangeData', jsonString)
}
/**
 * Returns exchange data from storage
 * Retrun NULL if data isn't exist or lifetime is gone
 */
function getExchangeDataFromStorage(){
    const dataString = localStorage.getItem('exchangeData');
    if(dataString !== null){
        const data = JSON.parse(dataString);
        const currentTime = Math.floor(new Date(Date.now()).getTime() / 1000);
        if(data.time_next_update_unix < currentTime){
            console.log('EXCHANGE WAS UPDATED')
            localStorage.removeItem('exchangeData');
            return null;
        }
        return data;
    }
    return null;
}
function getCurrenciesListFromStorage(){
    const dataString = localStorage.getItem('exchangeData');
    if(!dataString){
        return [];
    }
    const data = JSON.parse(dataString);
    return Object.keys(data.conversion_rates);  
}
// function storeAllCountriesToStorage(countries){
//     const string = JSON.stringify(countries);
//     localStorage.setItem('all-countries', string);
// }
// async function getAllCountriesFromStorageAsync(){
//     try {
//         const data = await new Promise((resolve, reject) => {
//             const string = localStorage.getItem('all-countries');
//             if(string === null){
//                 resolve(null);
//             }
//             resolve(JSON.parse(string));
//         });
//         return data;
//     } catch (error) {
//         console.error
//         return null;
//     }
// }

export {storeCountry,
    getCountryFromStorage,
    storeExchangeData,
    getExchangeDataFromStorage,
    getCurrenciesListFromStorage}