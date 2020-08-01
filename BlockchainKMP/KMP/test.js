function newId() {
    let randomNum = Math.random() * ((new Date()/1000) - 1) + 1;
    return "AAI"+Math.floor(randomNum+(new Date()/1000));
}


console.log(newId());