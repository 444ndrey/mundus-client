

const options = {
    scale: 1.4,
    pointX: 0,
    pointY: 0,
    panning: false,
    startX: 0,
    startY: 0,
    isMoving: false,
    limit: 5
}
let wrapper_map, wrapper, map_svg

let clickHandler = () => {};


function subscribeToClick(callback){
    clickHandler = callback
}


 function init(wr, wr_mp, map){
    wrapper = wr;
    wrapper_map = wr_mp;
    map_svg = map;
    wrapper.addEventListener('mousedown', e => {
        e.preventDefault();
        options.isMoving = false;
        if(!options.panning){
            options.startX =  e.clientX - options.pointX;
            options.startY =  e.clientY - options.pointY;
            options.panning = true;
        }
        options.isMoving
        wrapper.addEventListener('mousemove', e => {
            e.preventDefault();
            if(options.panning){
                 options.pointX = (e.clientX - options.startX);
                 options.pointY = (e.clientY - options.startY);
                 transform();
                 options.isMoving = true
            }
        });
    });
    wrapper.addEventListener('mouseup', e => {
            options.panning = false;
            if(!options.isMoving){
                const country = {
                    title: e.target.getAttribute('title'),
                    id: e.target.getAttribute('id'),
                    htmlTarget: e.target
                    };
                    clickHandler(country); 
            }   
    });
    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
        const xs = (e.clientX - options.pointX) / options.scale
        const ys = (e.clientY - options.pointY) / options.scale;
        options.pointX = e.clientX - xs * options.scale;
        options.pointY = e.clientY - ys * options.scale;
        if(delta > 0){
            if(options.scale >= 14){
                return;
            }
            options.scale *= 1.2;
        }
        else{
            if(options.scale <= 1.4){
                return
            }
            options.scale /= 1.2;
        }
        transform();
    });
    wrapper.addEventListener('mouseout', e => {
        options.panning = false;
    });
    

}

function transform(){
    wrapper_map.style.transform = `translate(${options.pointX}px, ${options.pointY}px) scale(${options.scale})`;
}


function reset(){
    console.log('ds')
    options.pointX = 0;
    options.pointY = 0;
    options.scale = 1.4;
    transform();
}

function zoomPlus(){

    if(options.scale >= 14){
        return;
    }
    options.scale *= 1.2;   
    transform();

}
function zoomMinus(){
    if(options.scale <= 1.4){
        return
    }
    options.scale /= 1.2;
    transform();
}



export  {init, reset, zoomPlus, zoomMinus, subscribeToClick}


