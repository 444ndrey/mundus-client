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


export {formatNumber}