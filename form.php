<?php

include 'ldap_details.php';


//function taken from https://stackoverflow.com/questions/18305789/correctly-using-crypt-with-sha512-in-php
function cryptPassword($password, $salt = "", $rounds = 20000){
   if ($salt == ""){
      // Generate random salt
      $salt = substr(bin2hex(openssl_random_pseudo_bytes(16)),0,16);
   }
   // $6$ specifies SHA512
   $hash = crypt($password, sprintf('$6$rounds=%d$%s$', $rounds, $salt));
   return '{CRYPT}' . $hash;
}

$return_array = [];

$username = ldap_escape($_POST['username'],null,LDAP_ESCAPE_DN);
$current_password = $_POST['current_password'];
$new_password = $_POST['new_password'];
$DN="uid=$username,$user_base_dn";
$ldapconn = ldap_connect($ldap_url);
ldap_set_option($ldapconn,LDAP_OPT_NETWORK_TIMEOUT,5);
ldap_set_option($ldapconn,LDAP_OPT_PROTOCOL_VERSION,3);
ldap_start_tls($ldapconn);

//If we can bind with the credentials supplied then we can bind with the admin credentials to change
//the password 

$ldapbind = ldap_bind($ldapconn,"uid=$username,$user_base_dn",$current_password);
if ($ldapbind){
   $ldapbind = ldap_bind($ldapconn, $admin_base_dn, $admin_ldap_pass);
   if ($ldapbind){
      $password_hash = cryptPassword($new_password);
      $return_array['password hash'] = $password_hash;
      if(ldap_mod_replace($ldapconn, $DN, array('userPassword' => $password_hash))){
         $return_array['success'] = 1;
      }
      else{
         $return_array['success'] = 0;
         $return_array['message'] = 'Unable to change password, but did bind to the ldap server.: ' . ldap_error($ldapconn);
      }
   }
   else{
      $return_array['success'] = 0;
      $return_array['message'] = 'Unable to bind to LDAP server as admin: ' . ldap_error($ldapconn);
   }
}
else{
   $return_array['success'] = 0;
   $return_array['message'] = "Unable to bind to LDAP server: " . ldap_error($ldapconn);
}

echo json_encode($return_array);

?>
