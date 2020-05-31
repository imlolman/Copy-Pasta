function randint(i,j){
    // Inclusive Random Number Generator
    return Math.floor(Math.random()*(j-i))+(i+1)
}

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}


Array.prototype.delete = function (elem) {
    // if the other array is a falsy value, return
    if (!elem)
        return false;

    if(this.indexOf(elem) != -1){
        this.splice(this.indexOf(elem),1)
        return true
    }
    
    return false;
}


Array.prototype.count = function(elem){
    count = 0
    for(var item of this){
        if(elem == item){
            count += 1
        }
    }
    return count
};