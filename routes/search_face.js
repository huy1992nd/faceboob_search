var express = require('express');
var Parent = require('./parent.class');
const headless = false;
const FACEBOOK_URL = "https://www.facebook.com/login/identify?ctx=login&lwv=206";
const LIST_TYPE_REJECT = ["other", "media", "font", "stylesheet", "image"];
// const LIST_TYPE_REJECT = [];
class searchFace extends Parent {
    constructor(list_address) {
        super();
        this.list_address = list_address;
        this.list_result = {};
        this.list_sub_address = [];
        this.number_error = 0;
        this.number_process = 5;
        this.time_wait = 1000;
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
                    if (sub_address.length) {
                        this.list_sub_address.push(sub_address);
                    }
                    if (end_index > this.list_address.length + 1) {
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
                await browser.close();
                reject(error);
            }
        })
    }
    async readPage(address, page) {
        return new Promise(async (resolve, reject) => {
            try {
                await page.goto(FACEBOOK_URL, { waitUntil: 'networkidle0' });
                await this.typeElement(page, [{ element: "#identify_email", value: address, type: 'text' }]);
                await page.click('input[name="did_submit"]');
                // await page.waitFor(this.time_wait);
                // await page.evaluate(_ => window.stop());
                try {
                    await page.$eval(".uiBoxRed", el => el.innerText);
                } catch (error) {
                    try {
                        await page.waitForNavigation({ timeout: 2000 });
                    } catch (error) {
                    }
                }
                // await Promise.all([
                //     page.click('input[name="did_submit"]'),
                // ]);

                // await page.waitFor('a');

                if (await page.$(".uiBoxRed") !== null) {
                    let list_text = await page.$eval(".uiBoxRed", el => el.innerText);
                    if (!list_text) {
                        this.list_result[address] = "Không xác định";
                    }
                } else {
                    let infor_user = "";
                    let forgot = await page.$("#forgot-password-link");
                    if (forgot === null) {
                        if (await page.$("ul.uiList li:last-child td.fbLoggedOutAccountAuxContent a.uiButton") !== null) {
                            let href = await page.$eval("ul.uiList li:last-child td.fbLoggedOutAccountAuxContent a.uiButton", el => el.href);
                            await page.goto(href, { waitUntil: 'networkidle0' });
                        }
                        forgot = await page.$("#forgot-password-link");
                    }
                    if (forgot !== null) {
                        await Promise.all([
                            page.click('#forgot-password-link'),
                            await page.waitForNavigation()
                        ]);
                        if (await page.$("._k0") !== null) {
                            infor_user = await page.$eval("._k0", el => el.innerText);
                        }
                    }
                    if (infor_user) {
                        this.list_result[address] = this.parseInfor(infor_user);
                    }
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }

    parseInfor(input) {
        let list_line = input.split("\n");
        return list_line.filter(item => item && (item.includes("@") || item.includes("+") || !isNaN(item))).join("   Hoặc   ");
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
            let time_pre_run = this.is_running ? new Date().getTime() - this.is_running : 0;
            if (this.is_running && time_pre_run < 10 * 60 * 1000) {
                res.status(500).json({
                    status: false,
                    message: "Server is running"
                });
            } else {
                this.is_running = new Date().getTime();
                var body = req.body;
                console.log('-----> confirm api', new Date().toISOString(), body);
                var list_input = [
                    'phone',
                    "up"
                ];
                var data = this.getDataInput(list_input, body);
                if (data.phone && data.phone.includes("**")) {
                    try {
                        let list_phone = [];
                        let start = 0;
                        let end = 50;
                        if (data.up) {
                            start = 50;
                            end = 100;
                        }
                        for (let i = start; i < end; i++) {
                            let str_replace = i < 10 ? "0" + i : "" + i;
                            list_phone.push(data.phone.replace("**", str_replace));
                        }
                        var search = new searchFace(list_phone);
                        var result = await search.getList();
                        this.is_running = false;
                        res.status(200).json(result);
                    } catch (error) {
                        this.is_running = false;
                        res.status(500).json({ "message": "Have an error" });
                    }
                } else {
                    this.is_running = false;
                    res.status(500).json({ "message": "Không đúng định dạng đầu vào" });
                }
            }
        }
        );
    }
}

module.exports = new searchFaceRouter().router;
