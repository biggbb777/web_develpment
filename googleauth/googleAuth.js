
var oneTimeCode;//验证码 
var sk  = makeid();//16位随机密钥
//E733IIEUBBPZ3X73
//JBSWY3DPEHPK3PXP
var org = $('#newUserId').val();//用户名（可以在验证器上显示出来）
var userId;//注册成功的账户
var password;//注册成功的密码

function dec2hex(s) { return (s < 15.5 ? '0' : '') + Math.round(s).toString(16); }//10进制数转为16进制数
function hex2dec(s) { return parseInt(s, 16); }//16进制数转为10进制数

    function base32tohex(base32) {//密钥转为16进制数
        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";//密钥中可能会出现的字符
        var bits = "";
        var hex = "";

        for (var i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }

        for (var i = 0; i+4 <= bits.length; i+=4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16) ;
        }
        return hex;

    }

    function leftpad(str, len, pad) { //用pad来从左边来补全str，直到满足len位
        if (len + 1 >= str.length) {
            str = Array(len + 1 - str.length).join(pad) + str;
        }
        return str;
    }
    //例子
    //leftPad(17, 5, 0)
        // => "00017"

    function updateOtp() {//更新验证码
            
        var key = base32tohex(sk);
        var epoch = Math.round(new Date().getTime() / 1000.0);
        var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');
        var shaObj = new jsSHA("SHA-1", "HEX");
        shaObj.setHMACKey(key, "HEX");
        shaObj.update(time);
        var hmac = shaObj.getHMAC("HEX");
        
      //  $('#secretHex').text(key);//在网页上显示密钥
       // $('#secretHexLength').text((key.length * 4) + ' bits'); 
        //$('#epoch').text(time);
        //$('#hmac').empty();

        if (hmac == 'KEY MUST BE IN BYTE INCREMENTS') {
            $('#hmac').append($('<span/>').addClass('label important').append(hmac));
        } else {
            var offset = hex2dec(hmac.substring(hmac.length - 1));
            var part1 = hmac.substr(0, offset * 2);
            var part2 = hmac.substr(offset * 2, 8);
            var part3 = hmac.substr(offset * 2 + 8, hmac.length - offset);
            if (part1.length > 0 ) $('#hmac').append($('<span/>').addClass('label label-default').append(part1));
            $('#hmac').append($('<span/>').addClass('label label-primary').append(part2));
            if (part3.length > 0) $('#hmac').append($('<span/>').addClass('label label-default').append(part3));
        }

        var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';//验证码
        otp = (otp).substr(otp.length - 6, 6);
        oneTimeCode = otp;
        //$('#otp').text(otp);//在网页上显示验证码
       
    }

function timer()
{
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var countDown = 30 - (epoch % 30);
    if (epoch % 30 == 0) updateOtp();
   // $('#updatingIn').text(countDown);//在页面上显示倒数
}
    $(function () {
        updateOtp();

        $('#update').click(function (event) {
            updateOtp();
            event.preventDefault();
        });

        $('#secret').keyup(function () {
            updateOtp();
        });
        
        setInterval(timer, 1000);
    });

function verifyAccount(){//验证账户是否合法
    if($('#userid').val()==userId && $('#password').val()==password){
        if($('#vcode').val()==oneTimeCode){
            window.location.href = "./admin_page.html";
        }
        else{
            alert("Invalid digit");
        }
    }
    else{
        alert("Invalid account");
    }
}
function addAccount(){//注册账户
    if($('#newUserId').val()!='' && $('#newPassword').val()!=''){

        userId = $('#newUserId').val();
        password = $('#newPassword').val();
        sk  = makeid();//随机生成16位密钥
        //生成二维码
        $('#qrImg').attr('src', 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/'+userId+'%3Fsecret%3D' + sk);
        alert("Sign up successfully!");
    }
    else{
        alert("You must enter a complete account!");
    }
    
}
function makeid() {//随机生成16位密钥
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";//可能出现的字符
  
    for (var i = 0; i < 16; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}