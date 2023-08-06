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
        if(value <= heats[heatOption].VERY_COLD){
            color = '#d0ff00';
        }
        if( value > heats[heatOption].VERY_COLD && value <= heats[heatOption].COLD){
            color = '#ffea00';
        }
        if(value > heats[heatOption].COLD && value <= heats[heatOption].WARM){
            color = '#ffbf00';
        }
        if(value > heats[heatOption].WARM && value <= heats[heatOption].HOT){
            color= '#ff8c00';
        }
        if(value > heats[heatOption].HOT && value <= heats[heatOption].VERY_HOT){
            color= '#ff4d00';
        }
        if(value > heats[heatOption].VERY_HOT){
            color = '#FF0400';
        }
        if(!value || value == 0){
            color = '';
        }
        return color;
    }
export {formatNumber,getColorOfCountry}