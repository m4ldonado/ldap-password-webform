//Problem: Hints are shown even when form is valid
//Solution: Hide and show them at appropriate times
var $new_password = $("#new_password");
var $confirm_password = $("#confirm_password");
var $username = $("#username");
var $current_password = $("#current_password");

//Hide hints
$("form span").hide();


//checkUsername_returnValue is outside the function because we want to check it 
//instead of running the function and want it to be set before the function is run
//for the first time
var checkUsername_returnValue = 0;
var changePassword_json;
function checkUsername(){
   //Ajax validation method learnt from www.the-art-of-web.com/javascript/ajax-validate/ 
   $.ajax ({
      async: false,
      url: 'validate.php',
      dataType: 'json',
      data: {"method": "checkUsername", "username": $username.val()},
      type: 'post',
      cache: false,
      success: function(data){
         var checkUsername_json = data;
         if(checkUsername_json.matches === 1){
            $username.next().hide();
            checkUsername_returnValue = 1;
            //if the username is correct we check the password if it's already been entered
            if($current_password.val().length > 0){
               checkPassword();
            }
         }else{
            $username.next().show();
            //if the username is incorrect we shouldn't say anything about the password
            $current_password.next().hide();
         }
      }
   });
   return checkUsername_returnValue;
}

function checkPassword(){
   var checkPassword_returnValue = 0;
   if(checkUsername_returnValue === 1){
      $.ajax ({
         async: false,
         url: 'validate.php',
         dataType: 'json',
         data: {"method": "checkPassword", "username": $username.val(), "password": $current_password.val()},
         type: 'post',
         cache: false,
         success: function(data){
            var checkPassword_json = data;
            if(checkPassword_json.valid_password === 1){
               $current_password.next().hide();
               checkPassword_returnValue = 1;
            }else{
               $current_password.next().show();
               checkPassword_returnValue = 0;
            }
         }
      });
   }
   return checkPassword_returnValue;
}



function isPasswordValid() {
   return $new_password.val().length > 8;
}

function arePasswordsMatching() {
   return $new_password.val() === $confirm_password.val();
}

function canSubmit() {
   return isPasswordValid() && arePasswordsMatching() && checkPassword();
}

function passwordEvent(){
   //Find out if password is valid  
   if(isPasswordValid()) {
      //Hide hint if valid
      $new_password.next().hide();
   } else {
      //else show hint
      $new_password.next().show();
   }
}

function confirmPasswordEvent() {
   //Find out if password and confirmation match
   if(arePasswordsMatching()) {
      //Hide hint if match
      $confirm_password.next().hide();
   } else {
      //else show hint 
      $confirm_password.next().show();
   }
}

function enableSubmitEvent() {
   $("#submit").prop("disabled", !canSubmit());
}

function changePassword() {
   var changed_password;
   $.ajax ({
      async: false,
      url: 'form.php',
      dataType: 'json',
      data: { "username": $username.val(), "current_password": $current_password.val(), "new_password": $new_password.val()},
      type: 'post',
      cache: false,
      success: function(data){
         changePassword_json = data;
         if(changePassword_json.success === 1){
            changed_password = 1;
         }
         else { 
            changed_password = 0;
         }
      }
   });
   return changed_password;
}

$("#password_form").submit(function(event){
   event.preventDefault();
   if(changePassword()){
      swal({
         title: "Password Changed Successfully",
         text: "",
         icon: "success",
         button: "OK",
      }).then(function(){
            location.reload();
            //when I tried just reloading the page on firefox the username
            //entry stuck around so we manually clear it here
            $username.val('');
      });
   }else{
      swal({
         title: "Error",
         text: changePassword_json.message,
         icon: "warning",
         button: "OK"
      });   
   }
});

//When event happens on password input
$new_password.focus(passwordEvent).keyup(passwordEvent).keyup(confirmPasswordEvent).keyup(enableSubmitEvent);

//When event happens on confirmation input
$confirm_password.focus(confirmPasswordEvent).keyup(confirmPasswordEvent).keyup(enableSubmitEvent);

//When event happens on username.  On blur makes less requests but you may prefer on keyup
//$username.focus().keyup(function () {console.log(checkUsername())});
$username.blur(checkUsername);

//When event happens on current_password
$current_password.blur(checkPassword);

enableSubmitEvent();



