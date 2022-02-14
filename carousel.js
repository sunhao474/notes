function CircularQuee(imgs) {
    if (!Array.isArray(imgs) || imgs.length < 1) throw new Error(`${imgs} is illegal`)
    this.queue = imgs;
    this.inner = [];
    
    let len = imgs.length


    this.currentIndex = 0;
}

CircularQuee.prototype.roll = function (action) {
    switch (action) {
        case 'forward':

            break;
        case 'backward':

            break;
        default:
            break;
    }

    change = (index) => {
        this.currentIndex = index;

    }
}
