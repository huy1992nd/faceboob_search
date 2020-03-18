const CONFIG = {};

// エラーメッセージ
CONFIG.ERR_MSG_DEFAULT = 'エラーが発生しました。再度お試しください。';
CONFIG.ERR_MSG_SIMPLE = 'エラーが発生しました。';
CONFIG.ERR_MSG_INVALID_INPUT = '入力に不備があります。';
CONFIG.ERR_MSG_INVALID_EMAIL_OR_PASS = 'メールアドレスが存在しないか、パスワードが誤っています。';
CONFIG.ERR_MSG_NO_REGIST_CARD = '現在登録されているクレジットカード情報はありません。';
CONFIG.ERR_MSG_REGISTERED_CARD_NOT_FOUND = 'クレジットカードが存在しません。お手数ですが手動で入力してください。';
CONFIG.ERR_MSG_LOGIN_FAILED = 'ログインに失敗しました。';
CONFIG.ERR_MSG_REGISTER_FAILED = '新規会員登録に失敗しました。';
CONFIG.ERR_MSG_CREDIT = 'クレジット決済は完了していません。</br> カード情報の入力に誤りがある可能性があります。カード番号をお確かめの上、再度カード情報入力してください。';
CONFIG.ERR_MSG_REGISTERED_EMAIL = 'ご指定のメールアドレスはすでに登録されています。'
CONFIG.ERR_MSG_TIMEOUT = '処理に時間がかかっております。お手数ですが、時間を置いてから再度実行してください。';
CONFIG.ERR_MSG_INVALID_MAIL = 'メールアドレスの形式が不正です。';
CONFIG.CHECK_ORDER_STATUS_FAIL_MSG = "check_order_status 0";
CONFIG.CHECK_ORDER_STATUS_TIMEOUT_MSG = "check_order_status timeout";
CONFIG.ERR_MSG_INVALID_COUPON = 'ご指定のクーポンコードは使用できません';
CONFIG.ERR_MSG_REGISTERED_EMAIL_2 = "エラー：メールアドレスが登録済みです。メールアドレス入力欄に戻って別のメールアドレスを入力してください。";

// デフォルトデバイス
CONFIG.USER_DEVICE_DEFAULT = 'pc';

// 待機時間
CONFIG.WAIT_TIME_SHORT = 500;
CONFIG.WAIT_TIME_MIDDLE = 1500;
CONFIG.WAIT_TIME_LONG = 3000;
CONFIG.INTERVAL_TIME_CONFIRM_ORDER = 1500;
CONFIG.INTERVAL_TIME_CONFIRM_ORDER_2 = 1000;
CONFIG.INTERVAL_TIME_ORDER_CLICK = 2000;
CONFIG.INTERVAL_TIME_ORDER_CLICK_2 = 1000;
CONFIG.WAIT_TIME_ORDER_CLICK = 80;
CONFIG.WAIT_TIME_CONFIRM_CLICK = 80;

// 都道府県コード
CONFIG.PREF_CODE_LIST = {
  "北海道":   "1",
  "青森県":   "2",
  "岩手県":   "3",
  "宮城県":   "4",
  "秋田県":   "5",
  "山形県":   "6",
  "福島県":   "7",
  "茨城県":   "8",
  "栃木県":   "9",
  "群馬県":   "10",
  "埼玉県":   "11",
  "千葉県":   "12",
  "東京都":   "13",
  "神奈川県": "14",
  "新潟県":   "15",
  "富山県":   "16",
  "石川県":   "17",
  "福井県":   "18",
  "山梨県":   "19",
  "長野県":   "20",
  "岐阜県":   "21",
  "静岡県":   "22",
  "愛知県":   "23",
  "三重県":   "24",
  "滋賀県":   "25",
  "京都府":   "26",
  "大阪府":   "27",
  "兵庫県":   "28",
  "奈良県":   "29",
  "和歌山県": "30",
  "鳥取県":   "31",
  "島根県":   "32",
  "岡山県":   "33",
  "広島県":   "34",
  "山口県":   "35",
  "徳島県":   "36",
  "香川県":   "37",
  "愛媛県":   "38",
  "高知県":   "39",
  "福岡県":   "40",
  "佐賀県":   "41",
  "長崎県":   "42",
  "熊本県":   "43",
  "大分県":   "44",
  "宮崎県":   "45",
  "鹿児島県": "46",
  "沖縄県":   "47"
};
CONFIG.CODE_PREF_LIST = {
  "1":"北海道",
  "2":"青森県",
  "3":"岩手県",
  "4":"宮城県",
  "5":"秋田県",
  "6":"山形県",
  "7":"福島県",
  "8":"茨城県",
  "9":"栃木県",
  "10":"群馬県",
  "11":"埼玉県",
  "12":"千葉県",
  "13":"東京都",
  "14": "神奈川県",
  "15":"新潟県",
  "16":"富山県",
  "17":"石川県",
  "18":"福井県",
  "19":"山梨県",
  "20":"長野県",
  "21":"岐阜県",
  "22":"静岡県",
  "23":"愛知県",
  "24":"三重県",
  "25":"滋賀県",
  "26":"京都府",
  "27":"大阪府",
  "28":"兵庫県",
  "29":"奈良県",
  "30": "和歌山県",
  "31":"鳥取県",
  "32":"島根県",
  "33":"岡山県",
  "34":"広島県",
  "35":"山口県",
  "36":"徳島県",
  "37":"香川県",
  "38":"愛媛県",
  "39":"高知県",
  "40":"福岡県",
  "41":"佐賀県",
  "42":"長崎県",
  "43":"熊本県",
  "44":"大分県",
  "45":"宮崎県",
  "46": "鹿児島県",
  "47":"沖縄県"  
};

CONFIG.LOGIN_TYPE_NUMBER = '1';
CONFIG.LOGIN_TYPE_REGISTER = '2';

module.exports = CONFIG;