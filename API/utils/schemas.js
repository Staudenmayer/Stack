"use strict";
const joi = require('joi');

module.exports = {
    schemas: {
        login: joi.object({
            email: joi.string().min(4).max(30).pattern(/^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b$/).required(),
            password: joi.string().min(8).max(100).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=_\-\/\\])[a-zA-Z\d@#$%^&+=_\-\/\\]{8,}$/).required()
        })
    },
    validate: function(schema, obj) {
        let res = module.exports.schemas[schema]?.validate(obj);
        if(res.hasOwnProperty('error')){
            throw new Error(res.error)
        }
    }
}