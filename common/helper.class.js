/**
 * Created by nguyen.the.vinh on 9/5/2019.
 */
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
var crypto = require('crypto');
const puppeteerRequest = model.PuppeteerRequest;
const puppeteerException = model.PuppeteerException;
const puppeteerOrderClick = model.PuppeteerOrderClick;
const puppeteerEmailRegister = model.PuppeteerEmailRegister;
const EfoMessageVariable = model.EfoMessageVariable;
const Variable = model.Variable;
const EfoCv = model.EfoCv;
const config = require('config');
const request = require('request');
const fs = require('fs');
var moment = require('moment-timezone');

class Helper {
    constructor(){

    }

    puppeteerRequestInsert(data) {
        var data_save = new puppeteerRequest(data);
        var result = data_save.save();
        return result;
    };

    puppeteerRequestRemoveByCondition(condition) {
        puppeteerRequest.remove({condition});
    };

    updatePuppeteerRequest (id, status, data, new_url = '', error = '') {
        puppeteerRequest.findOneAndUpdate({_id: id}, {
            $set: {
                status: status,
                new_url: new_url,
                error_message: error,
                param: data,
                updated_at: new Date()
            }
        }, {upsert: false, multi: false}, function (err, result) {
            // console.log('confirm result', result);
            if (err) throw err;
        });
    };

    puppeteerRequestFindAndUpdate(id, param) {
        puppeteerRequest.findOneAndUpdate({_id: id}, {
            $set: param
        }, {upsert: false, multi: false}, function (err, result) {
            if (err) throw err;
        });
    }

    updatePuppeteerRequestParamObject (id, param) {
        puppeteerRequest.findOneAndUpdate({_id: id}, {
            $set:  param
        }, {upsert: false, multi: false}, function (err, result) {
            if (err) throw err;
        });
    };

    updatePuppeteerOrderClick(id, status, error){
        puppeteerOrderClick.findOneAndUpdate({_id: id}, {
            $set: {
                status_puppeteer: status,
                error_message: error,
                updated_at: new Date()
            }
        }, {upsert: false, multi: false}, function (err, result) {

        });
    };

    updateTimeOutOrderClick(id, timeout_flg) {
        console.log('update timeout puppeteerOrderClick');
        puppeteerOrderClick.findOneAndUpdate({_id: id}, {
            $set: {
                timeout_flg: timeout_flg,
                updated_at: new Date()
            }
        }, {upsert: false, multi: false}, function (err, result) {

        });
    };

    updatePuppeteerOrderClickSuccess(id, status, order_id, thank_url) {
        puppeteerOrderClick.findOneAndUpdate({_id: id}, {
            $set: {
                status_puppeteer: status,
                order_id: order_id,
                thank_url: thank_url,
                updated_at: new Date()
            }
        }, {upsert: false, multi: false}, function (err, result) {

        });
    };

    savePuppeteerException(data) {
        var exception_data = new puppeteerException(data);
        exception_data.save(function (err) { });
    };

    puppeteerEmailRegisterFindOne(condition) {
        puppeteerEmailRegister.findOne(condition, function (err, result) {
            if (result) {
                return result;
            } else {
                return false;
            }
        });
    }

    puppeteerEmailRegisterFindAndUpdate(id, param) {
        puppeteerEmailRegister.findOneAndUpdate({_id: id}, {
            $set: param
        }, {upsert: false}, function (err) {
            if (err) throw err;
        });
    }

    savePuppeteerEmailRegisters(data) {
        var mail_data = new puppeteerEmailRegister(data);
        mail_data.save(function (err) { });
    };

    updateEfoCv(cpid, user_id, order_id) {
        EfoCv.update({connect_page_id: cpid, user_id: user_id}, {
            $set: {
                order_id: order_id
            }
        }, {upsert: false, multi: false}, function (err) {

        });
    }

    updateMessageVariable (cpid, user_id, variable_name, variable_value) {
        Variable.findOne({ connect_page_id: cpid, variable_name: variable_name }, function(
            err,
            result,
        ) {
            if (err) throw err;
            if (result) {
                var now = new Date();
                EfoMessageVariable.update(
                    {
                        connect_page_id: cpid,
                        user_id: user_id,
                        variable_id: result._id,
                    },
                    {
                        $set: {
                            variable_value: variable_value,
                            type: '001',
                            created_at: now,
                            updated_at: now,
                        },
                    },
                    { upsert: true, multi: false },
                    function(err) {
                        if (err) throw err;
                    },
                );
            }
        });
    }

    getAllCookie(arr) {
        if (arr) {
            var result = [];
            arr.forEach(function (element) {
                if (element) {
                    result.push(element);
                }
            });
            return result
        }
        return false;
    }

}

module.exports = Helper;

