<?PHP

include 'ldap_details.php';

//check for method
if(!$method = $_POST['method']) exit;

$ldapconn = ldap_connect($ldap_url);
ldap_set_option($ldapconn,LDAP_OPT_NETWORK_TIMEOUT,5);
ldap_set_option($ldapconn,LDAP_OPT_PROTOCOL_VERSION,3);
//uncomment the following line if you don't want to check the ssl cert
//ldap_set_option($ldapconn,LDAP_OPT_X_TLS_REQUIRE_CERT,0);
//if you struggle to connect with tls I'd recommend this stack-overflow page
// https://stackoverflow.com/questions/2689629/how-do-i-solve-ldap-start-tls-unable-to-start-tls-connect-error-in-php/5880238
ldap_start_tls($ldapconn);

switch($method){

	case 'checkUsername':
		//returns number of records matching username which should be 1
		if(!isset($_POST['username'])) exit;
		$username = ldap_escape($_POST['username'],null,LDAP_ESCAPE_DN);
		$filter = "uid=$username";
		$sr=ldap_search($ldapconn,$user_base_dn,$filter);
		$info = ldap_get_entries($ldapconn,$sr);
		//echo $info["count"];
		echo json_encode(['matches' => $info["count"]]);
		break;
		
	case 'checkPassword':
		if(!$username = $_POST['username']) exit;
		if(!$password = $_POST['password']) exit;
		$ldapbind= ldap_bind($ldapconn,"uid=$username,$user_base_dn",$password);
		if($ldapbind){
			$valid_password = 1;
		}else{
			$valid_password = 0;
		}
		echo json_encode(['valid_password' => $valid_password]);
		break;
}




?>
