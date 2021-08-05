require('../src/db/mongoose');
const User = require('../src/models/user');

User.findByIdAndUpdate('61081a777c6601375c6e8c4c', {name: 'Kellys'}).then((user) => {
    console.log(user);
    return User.countDocuments({name: 'Kelly'})
}).then((count) => {
    console.log(count);
}).catch((err) => {
    console.log(err);
})