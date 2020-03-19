var express = require('express');
var Parent = require('./parent.class');
const headless = false;
const FACEBOOK_URL = "https://www.facebook.com/login/identify?ctx=login&lwv=206";
const LIST_TYPE_REJECT = ["other", "media", "font", "stylesheet", "image"];
// const LIST_TYPE_REJECT = [];
class searchFace extends Parent {
    constructor(list_address) {
        super();
        this.list_address  = [...new Set(list_address)];
        this.list_result = {};
        this.list_sub_address = [];
        this.number_error = 0;
        this.number_process = 5;
        this.list_page = {};
    }
    async getList() {
        return new Promise(async (resolve, reject) => {
            try {
                let len_sub = Math.ceil(this.list_address.length / this.number_process);
                for (let i = 1; i <= this.number_process; i++) {
                    let start_index = len_sub * (i - 1);
                    let end_index = len_sub * i;
                    var sub_address = this.list_address.slice(start_index, end_index);
                    this.list_sub_address.push(sub_address);
                    if (end_index > this.list_address.length) {
                        break;
                    }
                }
                var list_job = [];
                this.list_sub_address.forEach(async (list_sub) => {
                    list_job.push(this.pareListSub(list_sub));
                });

                await Promise.all(
                    list_job
                ).then(err => {
                    resolve(this.list_result)
                });
            } catch (error) {
                reject(error)
            }
        });
    }
    async pareListSub(list_sub) {
        return new Promise(async (resolve, reject) => {
            let browser = await this.initBrowser(headless);
            try {
                let page = await this.initPage5(browser, LIST_TYPE_REJECT, []);
                await this.asyncForEach(list_sub, async (address) => {
                    await this.readPage(address, page);
                });
                await browser.close();
                resolve(true);
            } catch (error) {
                reject(error);
                await browser.close();
            }
        })
    }
    async readPage(address, page) {
        return new Promise(async (resolve, reject) => {
            try {
                await page.goto(FACEBOOK_URL, { waitUntil: 'networkidle0' });
                await this.typeElement(page, [{ element: "#identify_email", value: address, type: 'text' }]);
                await page.click('input[name="did_submit"]');
                // await Promise.all([
                //     page.click('input[name="did_submit"]'), 
                //     await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
                // ]);
                await page.waitFor(1500);
                await page.evaluate(_ => window.stop());
                if (await page.$(".uiBoxRed") !== null) {
                    let list_text = await page.$eval(".uiBoxRed", el => el.innerText);
                    if (list_text) {
                        this.list_result[address] = "Không có";
                    } else {
                        this.list_result[address] = "Có";
                    }
                } else {
                    this.list_result[address] = "Có";
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }

        });
    }
}

class searchFaceRouter extends Parent {
    constructor() {
        super();
        this.router = express.Router();
        this.is_running = false;
        this.initRouter();
    }

    initRouter() {
        this.router.post('/search', async (req, res, next) => {
            if (this.is_running) {
                res.status(500).json({
                    status: false,
                    message: "Server is running"
                });
            } else {
                this.is_running = true;
                var body = req.body;
                console.log('-----> confirm api', new Date().toISOString(), body);
                var list_input = [
                    'list_phone'
                ];
                var data = this.getDataInput(list_input, body);
                var search = new searchFace(data.list_phone);
                try {
                    var result = await search.getList();
                    this.is_running = false;
                    res.status(200).json(result);
                } catch (error) {
                    res.status(500).json({"message": "Have an error"});
                }
                
            }
        });
    }
}

module.exports = new searchFaceRouter().router;
