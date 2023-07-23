
async function getCountries(){
 return await fetch('./src/assets/world_map.svg')
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