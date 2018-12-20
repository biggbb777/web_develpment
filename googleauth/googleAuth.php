<!DOCTYPE html>
<html lang="en">
<head>
	<title>Goole Authenticator</title>
	<meta name="viewport" content="width=device-width,initial-scale=1.0">
	<link rel="stylesheet" type="text/css" href="https://cdn.bootcss.com/bootstrap/4.1.0/css/bootstrap.min.css" rel="stylesheet" media="screen">
	<link rel="stylesheet" type="text/css" href="googleAuth.css">
</head>

 <!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<!-- popper.min.js 用于弹窗、提示、下拉菜单 -->
<script src="https://cdn.bootcss.com/popper.js/1.12.5/umd/popper.min.js"></script>
<!-- 最新的 Bootstrap4 核心 JavaScript 文件 -->
<script src="https://cdn.bootcss.com/bootstrap/4.1.0/js/bootstrap.min.js"></script>
<!-- 谷歌认证器-->
<script src="googleAuth.js"></script>
<!-- sha-->
<script src="sha.js"></script>

<?php 
    require_once ('connectvars.php');   
    $error_msg = '';
    $login_page = 'http://'. $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/googleAuth.php';
        if(isset($_POST['sign_in'])){
          $dbc=mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);
          mysqli_query($dbc,'set names utf8');
          $user_userid = mysqli_real_escape_string($dbc,trim($_POST['userid']));
          $user_password = mysqli_real_escape_string($dbc, trim($_POST['password']));
        //获取数据
          $user_vcode = mysqli_real_escape_string($dbc, trim($_POST['vcode']));
          $correct_vcode = $_GET['text'];
          if(!empty($user_userid) && !empty($user_password) && !empty($user_vcode)){
              if($correct_vcode == $user_vcode){
                $query = "
                      SELECT id,password FROM account WHERE id = '$user_userid'
                             AND password = '$user_password';
                             ";
                $data=mysqli_query($dbc,$query);
                $row=mysqli_fetch_array($data);
                if(mysqli_num_rows($data) >= 1)
                {//检查是否有满足条件的记录
                  $url = 'http://'. $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/admin_page.html';
                  header('Location:'.$url);
                }
                else
                {
                    echo "<script>alert('User ID or Password error!');</script>";
                    header('Location:'.$login_page);
                }
              }
              else{
                  echo "<script>alert('Verification code error!');</script>";
                  header('Location:'.$login_page);
              }
          }
          else{
            echo "<script>alert('You must enter a valid account!');</script>";
            header('Location:'.$login_page);
          }
          
      }
?>
<body>
<div class="container">
	<h1 class="text-center">Welcome!</h1>
	<hr>
	<form class="form-signin" method="post">
		<h2 class="form-signin-heading">Sign in</h2>
		<input id="userid" name="userid" type="text" class="input-block-level" placeholder="User ID">
		<input id="password" name="password" type="password" class="input-block-level" placeholder="Password">
		<input name="vcode" id="vcode" type="text" class="input-block-level" placeholder="
6-digit code">
		<br>
		<button type="submit" class="btn btn-large btn-success" id="sign_in" name="sign_in">Sign in</button>
	</form>
		<form class="form-signin">
		<form>
                <fieldset>
                     <div class="clearfix">	
                        <label for="secret">Secret</label>
                        <div class="input"><input type="text" size="30" name="secret" id="secret" class="xlarge" value="JBSWY3DPEHPK3PXP" /></div>
                        <!-- JBSWY3DPEHPK3PXP -->
                    </div>
             
                    <div class="clearfix">
                        <label>QR Code</label>  
                        <div class="input"><img id="qrImg" src="" /></div>
                    </div>
                 
                    <div class="clearfix">
                        <label>One-time Password</label>
                        <div class="input"><span class="label label-primary" id='otp' name='otp'></span></div>
                    </div>
    
                    <div class="clearfix">
                        <label>Updating in</label>
                        <div class="input"><span id='updatingIn'></span></div>
                    </div>
                </fieldset>
                </form>
		
	</form>
	<hr>


</div>
</body>
</html>