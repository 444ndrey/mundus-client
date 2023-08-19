import heats from './heats.js'
function formatNumber(num){

    if(isNaN(num)){
        return undefined;
    }

    if(num >= 100000 && num < 1000000){
        return `${(num / 1000).toFixed(1)}k`;
    }
    if(num >= 1000000 && num < 1000000000  ){
        return `${(num / 1000000).toFixed(2)} million`;
    }
    if(num >=  1000000000 && num < Math.pow(10, 12)){
        return `${(num / 1000000000).toFixed(2)} billion`;
    }
    if(num >= Math.pow(10, 12)){
        return `${(num / Math.pow(10, 12)).toFixed(3)} trillion`
    }

    return new Intl.NumberFormat('en-In', { maximumSignificantDigits: 3 }).format(num);
}

function getColorOfCountry(value, heatOption){
    let color = '';

        if(value < heats[heatOption].VERY_COLD){
            color = '#3498db';
        }
        if( value >= heats[heatOption].VERY_COLD){
            color = '#16a085';
        }
        if(value >= heats[heatOption].COLD){
            color = '#f1c40f';
        }
        if(value >= heats[heatOption].WARM){
            color= '#f39c12';
        }
        if(value >= heats[heatOption].HOT){
            color= '#d35400';
        }
        if(value >= heats[heatOption].VERY_HOT){
            color = '#c0392b';
        }
        if(!value || value == 0){
            color = '';
        }
        return color;
    }
export {formatNumber,getColorOfCountry}