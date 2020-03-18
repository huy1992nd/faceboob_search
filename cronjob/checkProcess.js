const processExec = require('child_process').exec;
var request = require('request');
var os = require( 'os' );

var networkInterfaces = os.networkInterfaces( );
var current_ip = "0.0.0.0";
if(networkInterfaces && networkInterfaces.eth0 && Array.isArray(networkInterfaces.eth0)){
    var eth0 = networkInterfaces.eth0;
    if(eth0.length){
        current_ip = eth0[0].address;
    }
}
console.log( current_ip );

function checkChrome(){
    processExec('pgrep chrome | wc -l', (err, stdout, stderr) => {
        if (err) { console.log(err); }

    var pushMessageurl = "https://api.chatwork.com/v2/rooms/:group_id/messages";
    //var group_id = config.get('chatwork_group_id');
    pushMessageurl = pushMessageurl.replace(':group_id', "158909408");
    var cnt = parseInt(stdout);
    if(cnt > 10){
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ChatWorkToken': "68d4046581a03bde4defb9a4d08d971e"
        };

        request.post({url: pushMessageurl, form: {
            body: "[To:1738411] " +
            "\n IP Address: " +  current_ip +
            "\n Chrome process cnt: " +  stdout
        },
            headers: headers,  method: 'POST'}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
            }else{
                console.log(body);
            }
        });
    }
});
}

exports.checkChrome = checkChrome;