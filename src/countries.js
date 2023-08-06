
import { getAllCountries } from "./api.js";
let countriesInfo = null;

async function getCountries(){
    if(!countriesInfo){
        countriesInfo = await getAllCountries(); 
    }
 return await fetch('/world_map.svg')
    .then(res => res.text())
    .then(svgData => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(svgData, 'image/svg+xml');
        const paths =  xml.getElementsByTagName('path');
        const countries = Array.from(paths).map(path => {
            return {
                id: path.getAttribute('id'),
                title: path.getAttribute('title'),
                d: path.getAttribute('d'),
                data: {
                    population: countriesInfo.find(c => c.id === path.getAttribute('id'))?.population || 0,
                    gini: countriesInfo.find(c => c.id === path.getAttribute('id'))?.gini || 0,
                    area: countriesInfo.find(c => c.id === path.getAttribute('id'))?.area || 0,
                }
            }
        });
        return countries;
    });
}


async function getFiltredCountriesForGame(){
    const countries = await getCountries();
    const result = countries.filter(c => c.d.length > 500);
    console.log(result);
    return result;
}

export {
    getCountries,
    getFiltredCountriesForGame
}