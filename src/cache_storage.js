
const storeTime = 7 * 24 * 60 * 60 * 1000;
/**
 * Stores country info
 * @param {{id: string, title: string}}country 
 */
async function storeCountry(country){

    const key = `country-${country.id}`;
    const objectToStore = {
        lifeTimeEnd: Date.now() + storeTime,
        data: country
    }
    const jsonCountry = await JSON.stringify(objectToStore);
    localStorage.setItem(key, jsonCountry);
}
/**
 * Returns country from storage by country id.
 * If Id doesn't exist or lifetime is gone returns null.
 * @param {{id: string, title: string}}country 
 */
async function getCountryFromStorage(countryId){
    const key = `country-${countryId}`;
    const stringFromStorage = localStorage.getItem(key);
    if(stringFromStorage === null){
        return null;
    }
    const dataFromStorage = await JSON.parse(stringFromStorage);
    if(dataFromStorage.lifeTimeEnd < Date.now()){
        localStorage.removeItem(key);
        return null;
    }
    return await dataFromStorage.data;
}


export {storeCountry, getCountryFromStorage}