if(process.env.NODE_ENV === 'produntion'){
    module.exports = require('./prod');
} else{
    module.exports = require('./dev');
}