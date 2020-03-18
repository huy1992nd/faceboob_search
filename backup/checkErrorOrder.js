const request = require('request');
var moment = require('moment-timezone');
var model = require('../model');
var EfoCv = model.EfoCv;
var EfoUserProfile = model.EfoUserProfile;
var ConnectPage = model.ConnectPage;
const puppeteerRequest = model.PuppeteerRequest;
const puppeteerException = model.PuppeteerException;
const puppeteerOrderClick = model.PuppeteerOrderClick;
const TIMEZONE = "Asia/Tokyo";
const fs = require('fs');

const  convert_step_flg =[
    "5d3fe320a24a619db701eec7",
    "5d954b9ba24a617e8b1a0add",
    "5d89bfd5a24a613f8501ee06",
    "5de737aea24a61c6811d515b",
    "5de9b45fa24a61445d807073",
    "5d6c726aa24a611d9324e575",
    "5d6c65c1a24a614476389eb9",
    "5dc98505a24a61c6802c3061"
];

var tmp_arr = [];

var header_arr = ["data", "page_url", "user_id", "login_type", "last_name", "first_name", "zipcode", "pref", "address01", "address02", "mail", "password", "phone", "birthday", "product_code"];


checkErrorOrder();
function checkErrorOrder(){
    puppeteerOrderClick.find({"cpid" : "5d439117a24a6107917be760", "order_id" : null,  "error_message" : "エラーが発生しました。再度お試しください。"}, function (err, result) {
        if (result) {
            var index = 0;
            var y;
            tmp_arr.push(header_arr.join(","));
            getInfo(index, result, y = function (next) {
                if (next) {
                    console.log("index=", index);
                    getInfo(++index, result, y);
                } else {
                    console.log("done checkHailt01", tmp_arr);

                    fs.writeFile(`data/123.csv`, tmp_arr.join("\n"), function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        console.log("The file  was saved!");
                    });

                }
            });
        }
    });
}



function getInfo(index, result, callback){
    if(result[index]){
        var row = result[index];
        var updated_at =  moment(row.created_at).tz(TIMEZONE).format('YYYY-MM-DD');
        //console.log(updated_at);
        if(updated_at < "2019-11-16"){
            return callback(true);
        }

        EfoCv.findOne({"connect_page_id" : "5d439117a24a6107917be760", "user_id" : row.uid}, function (err, cv_row) {
            var arr = [];
            var page_start_url = "";
            if (cv_row) {
                page_start_url = cv_row.page_start_url;
            }
            arr.push(moment(row.created_at).tz(TIMEZONE).format('YYYY-MM-DD HH:mm'));

            arr.push(page_start_url);

            puppeteerRequest.findOne({"cpid" : "5d439117a24a6107917be760", "user_id" : row.uid, index: 2}, function (err, p_row) {
                //console.log(p_row);
                if (p_row) {
                    //console.log(page_start_url, p_row.param);
                    var param =  p_row.param;

                    var login_type = param["login_type"];
                    console.log(login_type);

                    for(var i = 2; i <  header_arr.length; i++){
                        var label = header_arr[i];
                        if(label == "pref" || label == "address01" || label == "address02"){
                            if(login_type == 2){
                                arr.push(param[label]);
                            }else{
                                arr.push("");
                            }
                        }
                        else if(label == "user_id"){
                            arr.push(row.uid);
                        }
                        else if(label == "birthday"){
                            if(login_type == 2){
                                arr.push(param.year + "/" + param.month + "/" + param.day);
                            }else{
                                arr.push("");
                            }

                        }else{
                            arr.push(param[label]);
                        }

                    }
                    console.log(arr);
                    tmp_arr.push(arr.join(","));
                }
                return callback(true);
            });
        });
    }else {
        return callback(false);
    }
}
//checkDataUser();

