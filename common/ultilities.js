function getRandomIntArray(min, max) {
    const arr = [];
    let i = 0;

    while(i < 10){
        const num = Math.floor(Math.random() * (max - min + 1)) + min; 
        if(!arr.includes(num)){
            arr.push(num);
            i++;
        }
    }
    
    return arr;
}
module.exports = {
    getRandomIntArray: getRandomIntArray
}