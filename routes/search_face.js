var express = require('express');
var Parent = require('./parent.class');
const headless = true;
const FACEBOOK_URL = "https://www.facebook.com/login/identify?ctx=login&lwv=206";

class searchFace extends Parent {
    constructor(list_address){
        this.list_address = list_address;
        this.list_result = {};
        this.list_sub_address = [];
        this.number_error = 0;
        this.number_process = 5;
        this.list_page = {};
    }

    async getList(){
        return new Promise(async (resolve, reject)=>{
            try {
               const browser = await this.initBrowser(headless);
               let len_sub = Math.ceil(this.list_address.length/this.number_process);
               for(i = 1; i <= this.number_process ; i ++){
                   let start_index = len_sub*(i-1);
                   let end_index = len_sub*i;
                   if(end_index > this.list_address.length){
                       break;
                   }
                   var sub_address = this.list_address.slice(start_index,end_index);
                   this.list_sub_address.push(sub_address);
               }

               this.list_sub_address.forEach(async (list_sub, index)=>{
                    this.list_page[index] = await this.initPage5(browser);
                    await Promise.all([
                        page.$eval(".did_submit", btn => btn.click()),
                        page.waitForNavigation({ waitUntil: 'networkidle2' })
                    ]);

               });

            } catch (error) {
                reject(error)
            }
        });
    }

    async pareSub(list_sub){
        return new Promise(async (resolve, reject)=>{
            var result = {};
            const page = await this.initPage5(browser,["image"],[]);
            this.asyncForEach(list_sub,  async (address, index)=>{
                await page.goto(FACEBOOK_URL, { waitUntil: 'networkidle0' });
                await this.typeElement(page, [{ element: "#identify_email", value: address, type: 'text' }]);
                
            });
        })
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
            if(this.is_running){
                res.status(500).json({
                    status: false,
                    message: "Server is running"
                });
            }else{
                this.is_running = true;

                var body = req.body;
                console.log('-----> confirm api', new Date().toISOString(), body);
                var list_input = [
                    'list_sdt'
                ];
                var data = this.getDataInput(list_input, body);
                var model = new puppeteerOrderClick(jsondata);
                res.status(200).json({});
            }
          
        });
    }
}

module.exports = new searchFaceRouter().router;
