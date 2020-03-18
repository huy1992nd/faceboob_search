var model = require('../model');
const puppeteerException = model.PuppeteerException;
const puppeteerEmailRegister = model.PuppeteerEmailRegister;

function savePuppeteerException(data) {
    var exception_data = new puppeteerException(data);
    exception_data.save(function(err) {});
}

function splitZipcode(zipcode) {
    var result = {
        zipcode1: '',
        zipcode2: '',
    };
    if (typeof zipcode != 'undefined' && zipcode) {
        result['zipcode1'] = zipcode.slice(0, 3);
        result['zipcode2'] = zipcode.slice(3, 8);
    }
    return result;
}

function splitPhoneNumber(phone_number) {
    var result = {
        phone1: '',
        phone2: '',
        phone3: '',
    };
    if (typeof phone_number != 'undefined' && phone_number != '') {
        var phone_arr = phone_number.split('-');
        if (phone_arr.length == 3) {
            result['phone1'] = phone_arr[0];
            result['phone2'] = phone_arr[1];
            result['phone3'] = phone_arr[2];
        }
    }
    return result;
}

function splitBirthday(birth_day) {
    var result = {
        year: '',
        month: '',
        day: '',
    };
    if (typeof birth_day != 'undefined' && birth_day != '') {
        var date = new Date(birth_day);
        result['year'] = date.getFullYear();
        result['month'] = date.getMonth() + 1;
        result['day'] = date.getDate();
    }
    return result;
}

async function savePuppeteerEmailRegisters(data) {
    var mail_data = new puppeteerEmailRegister(data);
    await mail_data.save(function(err) {});
}

// 機種依存文字置換関数
function replace_Char(text){
    var ngchr = [
        '①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮',
        '⑯','⑰','⑱','⑲','⑳','Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ',
        '㍉','㌔','㌢','㍍','㌘','㌧','㌃','㌶','㍑','㍗','㌍','㌦','㌣','㌫','㍊','㌻',
        '㎜','㎝','㎞','㎎','㎏','㏄','㎡','㍻',
        '〝','〟','№','㏍','℡','㊤','㊥','㊦','㊧','㊨','㈱','㈲','㈹','㍾','㍽','㍼'
    ];
    var trnchr = [
        '(1)','(2)','(3)','(4)','(5)','(6)','(7)','(8)','(9)','(10)','(11)','(12)','(13)','(14)','(15)',
        '(16)','(17)','(18)','(19)','(20)','I','II','III','IV','V','VI','VII','VIII','IX','X',
        'ミリ','キロ','センチ','メートル','グラム','トン','アール','ヘクタール','リットル','ワット','カロリー','ドル','セント','パーセント','ミリバール','ページ',
        'mm','cm','km','mg','kg','cc','平方メートル','平成',
        '「','」','No.','K.K.','TEL','(上)','(中)','(下)','(左)','(右)','(株)','(有)','(代)','明治','大正','昭和'
    ];
    for(var i=0; i<=ngchr.length;i++){
        text = text.replace( ngchr[i], trnchr[i], 'mg' );
    }
    return text;
}

// 機種依存文字チェック関数
function chk_Char(text){
    var c_regP = "[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡㍻〝〟№㏍℡㊤㊥㊦㊧㊨㈱㈲㈹㍾㍽㍼]";
    if(text.match(c_regP)){
        text = replace_Char(text);
        text = text.replace(/[\r|\n]/mg, '');
    }
    return text;
}

console.log(chk_Char("Ⅳ"));

exports.savePuppeteerEmailRegisters = savePuppeteerEmailRegisters;
exports.savePuppeteerException = savePuppeteerException;
exports.splitZipcode = splitZipcode;
exports.splitPhoneNumber = splitPhoneNumber;
exports.splitBirthday = splitBirthday;
exports.chk_Char = chk_Char;