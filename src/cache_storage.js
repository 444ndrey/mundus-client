
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



//TODO: FIND A WAY TO UPDATE THE SCORE WITHOUT HAVING TO REFRESH A PAGE
function storeGameBestResult(result){
    const lastBest = getGameBestResult();
    console.log(lastBest)
    if(!lastBest){
        localStorage.setItem('game-best', result);
        return
    }
    if(parseInt(lastBest) < parseInt(result)){
        localStorage.removeItem('game-best');
        localStorage.setItem('game-best', result);
    }
}

function getGameBestResult(){
    return localStorage.getItem('game-best');
}


/**
 * @param {String} theme 'dark' or 'light'
 */
function storeTheme(theme){
    localStorage.setItem('color-theme', theme);
}
function getTheme(){
    return localStorage.getItem('color-theme');
}

export {storeCountry,
    getCountryFromStorage,
    storeExchangeData,
    getExchangeDataFromStorage,
    getCurrenciesListFromStorage,
    storeGameBestResult,
    getGameBestResult,
    storeTheme,
    getTheme
}