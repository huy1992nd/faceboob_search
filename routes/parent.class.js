const request = require('request');
const puppeteer = require('puppeteer');
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
class Parent {
    constructor() {
    }

    async asyncForEach (array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    async autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
    
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }



    async removeSomeFile(page, status){
        if(status){
            page.on('request', request => {
                var rtype = request.resourceType();
                var rurl = request.url();
                if (rtype === "font" || rtype === 'stylesheet' || rtype === 'image') {
                    request.abort();
                } else if (rtype == "script") {
                    if (request.url().indexOf("gmo_token") !== -1) {
                        request.abort();
                    } else {
                        request.continue();
                    }
                } else {
                    request.continue();
                }
            });
        }else{
            page.on('request', request => {
                request.continue();
            })
        }
    }

    async initPage(browser, list_file_abort = [], status = true){
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        if(status){
            page.on('request', request => {
                var rtype = request.resourceType();
                var rurl = request.url();
                if (rurl.indexOf("ebis") !== -1) {
                    request.continue();
                }else if(list_file_abort.includes(rtype)){
                    request.abort();
                } else if (rtype === "document") {
                    request.continue();
                } else {
                    request.continue();
                }
            });
        }else{
            page.on('request', request => {
                request.continue();
            })
        }

        page.on('error', async () => {
            await browser.close();
        });

        return page;
    }
    async initPage3(browser, list_file_abort = [], list_url_abort= [], status = true){
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        if(status){
            page.on('request', request => {
                var rtype = request.resourceType();
                var rurl = request.url();
                if (rurl.indexOf("ebis") !== -1) {
                    request.continue();
                }else if(list_url_abort.filter(item=>rurl.includes(item)).length && rtype === "script"){
                    request.abort();
                }
                else if(list_file_abort.includes(rtype)){
                    request.abort();
                } else if (rtype === "document") {
                    request.continue();
                } else {
                    request.continue();
                }
            });
        }else{
            page.on('request', request => {
                request.continue();
            })
        }

        page.on('error', async () => {
            await browser.close();
        });

        return page;
    }
    
    delay(ms){
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async initPage2(browser, list_file_abort = [], status = true){
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        await page.on("dialog", (dialog) => {
            console.log("Dialog is up...");
            this.delay(500);
            console.log("Accepted...");
            dialog.accept();
            this.delay(500);
        });
        if(status){
            page.on('request', request => {
                var rtype = request.resourceType();
                var rurl = request.url();
                if (rurl.indexOf("ebis") !== -1) {
                    request.continue();
                }else if(list_file_abort.includes(rtype)){
                    request.abort();
                } else if (rtype === "document") {
                    request.continue();
                } else {
                    request.continue();
                }
            });
          
        }else{
            page.on('request', request => {
                request.continue();
            })
        }

        page.on('error', async () => {
            await browser.close();
        });

        return page;
    }

    async initPage5(browser, list_file_abort = [], list_url_abort = [], status = true){
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        await page.on("dialog", (dialog) => {
            console.log("Dialog is up...");
            this.delay(500);
            console.log("Accepted...");
            dialog.accept();
            this.delay(500);
        });
        if(status){
            page.on('request', request => {
                var rtype = request.resourceType();
                var rurl = request.url();
                if (rurl.indexOf("ebis") !== -1) {
                    request.continue();
                }else if(list_file_abort.includes(rtype)){
                    request.abort();
                }else if(list_url_abort.filter(item=>rurl.includes(item)).length && rtype === "script"){
                    request.abort();
                }
                else if (rtype === "document") {
                    request.continue();
                } else {
                    console.log(rtype, "--->" , rurl);
                    request.continue();
                }
            });
          
        }else{
            page.on('request', request => {
                request.continue();
            })
        }

        page.on('error', async () => {
            await browser.close();
        });

        return page;
    }

    formatBirthDay(birthday_str){
        let list_bd = birthday_str.split("-");
        let birthday = birthday_str;
        if(list_bd.length == 3){
            birthday = `${list_bd[1]}/${list_bd[2]}/${list_bd[0]}`;
        }
        return  birthday
    }

    async typeElement(page, list_element) {
        await this.asyncForEach(list_element, async (item) => {
            if( await page.$(item.element) !== null){
                switch (item.type) {
                    case 'text':
                        if (item.value != undefined) {
                            await page.focus(item.element);
                            await page.evaluate((item) => {
                                document.querySelector(item.element).value = item.value;
                            }, item);
                            // if(item.value != ''){
                            //     await page.type(item.element, item.value);
                            // }
                        }
                        break;

                    case 'date':
                        if (item.value != undefined) {
                            if(item.value != ''){
                                await page.type(item.element, item.value);
                            }
                        }
                        break;
    
                    case 'select':
                        if (item.value && item.value != undefined && item.value != '') {
                            await page.select(item.element, item.value);
                        }
                        break;
                        
                    case 'click':
                            await page.click(item.element);
                        break;
    
                    default:
                        break;
                }
            }else{
                console.log('element ' + item.element + ' type '+ item.type +' null');
            }
        });
    }

    async getUserDevice(user_device, page, key){
        console.log('in get user device ' + user_device + '---' + key);
        return new Promise( async (resolve, reject) =>{
            var exit_element =  await page.$(key);
            if( exit_element !== null){
                console.log('user device --->', user_device);
                resolve(user_device);
            }else {
                if(user_device == 'pc'){
                    console.log('user device ---> mobile');
                    resolve('mobile');
                }else {
                    console.log('user device ---> pc');
                    resolve('pc');
                }
            }
        })
    }

    async typeElement_2(page, list_element, list_element_2) {
        await this.asyncForEach(list_element, async (item) => {
            var element = item.element;
            if( await page.$(item.element) === null){
                element = list_element_2[item.key];
            }
            if( await page.$(element) !== null){
                switch (item.type) {
                    case 'text':
                        if (item.value != undefined) {
                            await page.focus(element);
                            await page.evaluate((item) => {
                                document.querySelector(element).value = item.value;
                            }, item);
                            // if(item.value != ''){
                            //     await page.type(element, item.value);
                            // }
                        }
                        break;
    
                    case 'select':
                        if (item.value && item.value != undefined && item.value != '') {
                            await page.select(element, item.value);
                        }
                        break;
                        
                    case 'click':
                            await page.click(element);
                        break;
    
                    default:
                        break;
                }
            }else{
                item
                console.log('element' + item.element + ' type '+ item.type +' null');
            }
        });
    }

    async checkboxElement(page , element) {
        const checkbox = await page.$(element);
        var status = await (await checkbox.getProperty('checked')).jsonValue();
        console.log('status', status);
        if(!status) {
            await checkbox.click();
        }
    }

    async uncheckedElement(page , element) {
        const checkbox = await page.$(element);
        var status = await (await checkbox.getProperty('checked')).jsonValue();
        console.log('status', status);
        if(status) {
            await checkbox.click();
        }
    }

    async uncheckedAllElement(page , element) {
        console.log("element===", element);
        console.log("length===", element.length);
        if(element.length > 0) {
            for(var i in element) {
                const checkbox = await page.$(element[i]);
                var status = await (await checkbox.getProperty('checked')).jsonValue();
                console.log('status', status);
                if(status) {
                    await checkbox.click();
                }
            }
        }

    }

    async clickButton(page, element) {
        await Promise.all([
            page.click(element),
            page.waitForNavigation()
        ]);
    }

    async waitForTime(page, time) {
        await page.waitFor(time);
    }


    async clearInputData(page, data) {
        await asyncForEach(data, async (item) => {
            if(await page.$(item) != null) {
                await page.evaluate((item) => {
                    document.querySelector(item).value = '';
                }, item);
            } else {
                console.log(item, '==Not exist==');
            }
        });
    }


    savePuppeteerException(data) {
        var exception_data = new puppeteerException(data);
        exception_data.save(function (err) { });
    }

    getCookie(arr) {
        if (arr) {
            var result = [];
            arr.forEach(function (element) {
                if (element.name == '_session_id' && element.name != '') {
                    result.push(element);
                }
            });
            return result
        }
        return false;
    }

    getCookieAll(arr) {
        if (arr) {
            var result = [];
            arr.forEach(function (element) {
                result.push(element);
            });
            return result
        }
        return false;
    }

    getDataInput(list_input, body){
        var data = {};
        list_input.forEach(key =>{
            data[key] = this.validateInput(body,key);
        });
        return data;
    }

    splitBirthday(birth_day) {
        var result = {
            year: '',
            month: '',
            day: ''
        };
        if (typeof birth_day != "undefined" && birth_day != '') {
            var date = new Date(birth_day);
            result['year'] = date.getFullYear();
            result['month'] = date.getMonth() + 1;
            result['day'] = date.getDate();
        }
        return result;
    }

    validateInput(body, key, value_default = "") {
        let result = value_default;
        if (typeof body[key] !== "undefined") {
            result = body[key];
        } else {
            console.log(" Don't have data input ---> " + key);
        }
        return result;
    }

    getRequest(request_body_user) {
        return new Promise((resolve, reject) => {
            request(request_body_user, (error, response, body) => {
                if (error) {
                    console.log('Have error when request get', error);
                    reject(error)
                }
                if (!error && response.statusCode == 200) {
                    resolve(body);
                }
            });
        });
    }

    postRequest(url, body, headers) {
        return new Promise(function (resolve, reject) {
            request.post({
                headers: headers,
                url: url,
                body: body
            }, function (error, response, body) {
                if (error)
                    reject(error)
                else {
                    console.log('body is', body);
                    resolve(JSON.parse(body));
                }
            });
        });
    }

    checkChangeProfile(data_new, data_old, fields = []){
        console.log("checkChangeProfile");
        var is_change = 0;
        if(data_new.login_type.toString() == "3" || data_new.login_type.toString() == "1" ){
            return is_change;
        }
        for(var i = 0; i < fields.length; i++){
            if(data_new[fields[i]] != data_old[fields[i]]){
                console.log(data_new[fields[i]], data_old[fields[i]]);
                is_change = 1;
                break;
            }
        }
        return is_change;
    }
    
    checkShippingChange(data_new, data_old, fields){
        var is_change = 0;
        // if(data_new.login_type.toString() == "3"){
        //     return is_change;
        // }
        if(!data_old){
            return 1;
        }
        for(var i = 0; i < fields.length; i++){
            console.log(data_new[fields[i]], data_old[fields[i]]);
            if(data_new[fields[i]] != data_old[fields[i]]){
                is_change = 1;
                break;
            }
        }
        return is_change;
    }


    convertKanjiJapan(str) {
        var result = '';
        try {
            if (str) {
                str = str.replace(/[A-Za-z0-9-]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0) + 65248);
                });
                result = str.replace(/ /g, "　");
            }
        } catch (e) {
            console.log('convertKanjiJapan', e);
        }
    
        return result;
    }

    async initBrowser(headless) {
        const browser =
        await puppeteer.launch({
            headless: headless,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                // '--single-process'
            ]
        });
        return browser;
    }

    async initPagePuppeteer(browser) {
        const page = await browser.newPage();
        await page.setRequestInterception(true);

        page.on('request', request => {
            var rtype = request.resourceType();
            var rurl = request.url()
            if (rurl.indexOf("ebis") !== -1) {
                request.continue();
            }
            // else if (rtype === "font" || rtype === 'stylesheet' ) {
            else if (rtype === "font" || rtype === 'stylesheet' || rtype === 'image') {
                request.abort();
            } else if (rtype == "script") {
                request.continue();
            } else if (rtype === "document") {
                request.continue();
            } else {
                request.continue();
            }
        });
    
        page.on('error', async () => {
            await browser.close();
        });
    
        return page;
    }

    async typeFirstItem(page, item) {
        await page.evaluate((elm, value) => {
            let mail_element = document.querySelectorAll(elm)[0];
            mail_element.value = value;
        }, item.element, item.value);
    }

    async typeLastItem(page, item) {
        await page.evaluate((elm, value) => {
            let length = document.querySelectorAll(elm).length;
            let mail_element = document.querySelectorAll(elm)[length -1];
            mail_element.value = value;
        }, item.element, item.value);
    }

    async clickLastItem(page, btn_item) {
        await page.evaluate((elm) => {
            let length = document.querySelectorAll(elm).length;
            let last_item_click = document.querySelectorAll(elm)[length -1];
            last_item_click.click();
        }, btn_item);
    }

    getPref(input){
        const g_pref_list = {
            "北海道" : "01",
            "青森県" : "02",
            "岩手県" : "03",
            "宮城県" : "04",
            "秋田県" : "05",
            "山形県" : "06",
            "福島県" : "07",
            "茨城県" : "08",
            "栃木県" : "09",
            "群馬県" : "10",
            "埼玉県" : "11",
            "千葉県" : "12",
            "東京都" : "13",
            "神奈川県" : "14",
            "新潟県" : "15",
            "富山県" : "16",
            "石川県" : "17",
            "福井県" : "18",
            "山梨県" : "19",
            "長野県" : "20",
            "岐阜県" : "21",
            "静岡県" : "22",
            "愛知県" : "23",
            "三重県" : "24",
            "滋賀県" : "25",
            "京都府" : "26",
            "大阪府" : "27",
            "兵庫県" : "28",
            "奈良県" : "29",
            "和歌山県" : "30",
            "鳥取県" : "31",
            "島根県" : "32",
            "岡山県" : "33",
            "広島県" : "34",
            "山口県" : "35",
            "徳島県" : "36",
            "香川県" : "37",
            "愛媛県" : "38",
            "高知県" : "39",
            "福岡県" : "40",
            "佐賀県" : "41",
            "長崎県" : "42",
            "熊本県" : "43",
            "大分県" : "44",
            "宮崎県" : "45",
            "鹿児島県" : "46",
            "沖縄県" : "47",
            "国外" : "48"
        };
        var result = g_pref_list[input] || "";
        return result;
    }

}

module.exports = Parent;