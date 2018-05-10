'use strict';

var Model = "Product";
exports.model = Model;

// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ModelSchema = new Schema({
    name: {
        type: String,
        required: 'Please fill product name',
    },
    image: {
        type: String
    },
    category: {
        name: {
            type: String
        }
    },
    prices: {
        required: 'Please fill product price',
        type: [{
            name: {
                type: String
            },
            _type: {
                type: String
            },
            price: {
                type: Number
            }
        }]
    },
    submenus: [{
        _type: {
            type: String
        },
        name: {
            type: String
        },
        prices: [{
            name: {
                type: String
            },
            _type: {
                type: String
            },
            price: {
                type: Number
            }
        }],
    }],
    typebranch: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayName: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayName: {
            type: String
        }
    }
});

mongoose.model(Model, ModelSchema);