var model = require('../model');
var Exception = model.Exception;
const EFO_USER_PULLDOWN = "006";

function saveException(cpid, uid, errors, sub_type, type = '002') {
    var now = new Date();
    var exception = new Exception({
        err: errors,
        cpid: cpid,
        uid: uid,
        type: type,
        sub_type: sub_type,
        push_chatwork_flg: 0,
        created_at: now,
        updated_at: now
    });
    exception.save(function (err) {
    });
}


// 機種依存文字置換関数
function replace_Char(text){
    var ngchr = [
        '①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮',
        '⑯','⑰','⑱','⑲','⑳','Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ',
        '㍉','㌔','㌢','㍍','㌘','㌧','㌃','㌶','㍑','㍗','㌍','㌦','㌣','㌫','㍊','㌻',
        '㎜','㎝','㎞','㎎','㎏','㏄','㎡','㍻',
        '〝','〟','№','㏍','℡','㊤','㊥','㊦','㊧','㊨','㈱','㈲','㈹','㍾','㍽','㍼', '髙', '隆', '﨑'
    ];
    var trnchr = [
        '(1)','(2)','(3)','(4)','(5)','(6)','(7)','(8)','(9)','(10)','(11)','(12)','(13)','(14)','(15)',
        '(16)','(17)','(18)','(19)','(20)','I','II','III','IV','V','VI','VII','VIII','IX','X',
        'ミリ','キロ','センチ','メートル','グラム','トン','アール','ヘクタール','リットル','ワット','カロリー','ドル','セント','パーセント','ミリバール','ページ',
        'mm','cm','km','mg','kg','cc','平方メートル','平成',
        '「','」','No.','K.K.','TEL','(上)','(中)','(下)','(左)','(右)','(株)','(有)','(代)','明治','大正','昭和', '高', '隆', '崎'
    ];
    for(var i=0; i <= ngchr.length; i++){
        text = text.replace(ngchr[i], trnchr[i], 'mg' );
    }
    return text;
}

// 機種依存文字チェック関数
function chk_Char(text){
    text = text !== undefined ? text : "";
    var c_regP = "[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡㍻〝〟№㏍℡㊤㊥㊦㊧㊨㈱㈲㈹㍾㍽㍼髙隆﨑]";
    if(text.match(c_regP)){
        text= replace_Char(text);
        text = text.replace(/[\r|\n]/mg, '');
    }
    return text;
}


exports.saveException = saveException;
exports.chk_Char = chk_Char;