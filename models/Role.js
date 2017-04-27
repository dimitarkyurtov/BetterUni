/**
 * Created by adminuser on 4/15/2017.
 */
const mongoose = require('mongoose');

let rolesSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const Role = mongoose.model('Role', rolesSchema);

module.exports = Role;

module.exports.initialize = () =>{
    Role.findOne({name: 'User'}).then(role =>{
        if (!role){
            Role.create({name: 'User'});
        }
    });

    Role.findOne({name: 'Admin'}).then(role =>{
        if (!role){
            Role.create({name: 'Admin'});
        }
    });
}