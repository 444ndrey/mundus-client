const NINJAPAPI_KEY = import.meta.VITE_NINJA_API_KEY;

const URL = 'https://restcountries.com/v3.1/';
async function getCountryInfo(countryID){

    const requestOptions = {
        method: 'GET',
    }
    try {
        const response = await fetch(`${URL}/alpha/${countryID}`);
        const country = (await response.json())[0];
        console.log(country);
        return {
            id: countryID,
            title: country.name.official,
            capital: country.capital[0],
            flag: country.flags.png,
            altFlag: country.flags.alt,
            population: country.population,
            curency: Object.values(country.currencies)[0] //symbol and name

        }
    } catch (error) {
        console.error(error);
        return null;
    }
}


export {getCountryInfo}



