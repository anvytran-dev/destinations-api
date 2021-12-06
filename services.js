function generateUniqueId() {
    
    let id = ""


    for(let index = 0; index < 6; index++) {
        const randNumber = Math.floor(Math.random() * 9) +1

        id+=randNumber;
    }

    return id;
    
}

module.exports= {generateUniqueId}