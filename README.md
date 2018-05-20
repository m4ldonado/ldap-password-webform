# ldap-password-webform

A webfrom for a user to change their ldap password, based off of a webform created by Chris Steurer at https://codepen.io/chrissteurer/pen/oqjul

The new Password is validated by the isPasswordValid() function in index.js which is currently set to anything over eight characters.  The current password and username are validated by an ajax call to validate.php which looks like this: 

[![Screenshot_from_2018-04-10_15-13-03.png](https://s31.postimg.cc/hmf9slxsr/Screenshot_from_2018-04-10_15-13-03.png)](https://postimg.cc/image/cnrre2tzr/)

When all the fields are valid the form becomes submittable.  After submitting the form a [Sweet Alert](https://sweetalert.js.org/) message is generated to show if the action was successful or not:

[![Screenshot_from_2018-04-10_15-13-44.png](https://s31.postimg.cc/wwf505vzf/Screenshot_from_2018-04-10_15-13-44.png)](https://postimg.cc/image/9uyjuewbr/)

The form looks like this:

[![Screenshot_from_2018-04-10_15-36-34.png](https://s31.postimg.cc/wjnqu1yaz/Screenshot_from_2018-04-10_15-36-34.png)](https://postimg.cc/image/eguo2u2g7/)

You'll want to edit the details in ldap_details.php to fit your ldap server
