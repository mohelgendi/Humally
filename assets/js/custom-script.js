$(document).ready(function () {

  $('.faqwrap button').click(function () {
    //  $(this).toggleClass("open");
    //   $(this).parent(".faqwrap").toggleClass("border");
  });
  var btndf = $('.faqwrap button.btndf');
  btndf.click(function () {
    btndf.siblings(".faqtext").slideUp();
    btndf.removeClass("open");
    btndf.parent(".faqwrap").removeClass("border");
    $(this).siblings(".faqtext").slideToggle();
    $(this).toggleClass("open");
    $(this).parent(".faqwrap").toggleClass("border");
  });

  $(".list").click(function (e) {
    e.preventDefault();
    window.location.href = $(this).children("a").attr('href');
    $(".detailfleg").toggle();
    $(".flgmain").toggle();
  });
  if (navigator.userAgent.indexOf('Safari') !== -1) {
    //i.e. apply safari clclass via jquery
    $(".planmain p").css('font-weight', 'normal')
  }

  $('.close').on('click', function () {
    $('.collapse').hide();
    $('.collapsing').hide();
    $('.close').hide();
    $('img[alt=menu]').show();
  })
  $('#testBtn').on('click', function () {
    $('.collapse').show();
    $('.collapsing').hide();
    $('.close').show();
    $('img[alt=menu]').hide();
  })


  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function handleVerifyEmail(auth, actionCode, continueUrl) {
    auth.applyActionCode(actionCode).then(function (resp) {
      renderMessage('Your email is verified', 'You can now sign in with your new account');
    }).catch(function (error) {
      renderMessage('Try verifying your email again', 'Your request to verify your email has expired or the link has already been used');
    });
  }

  function handleRecoverEmail(auth, actionCode) {
    var restoredEmail = null;
    auth.checkActionCode(actionCode).then(function (info) {
      restoredEmail = info['data']['email'];
      return auth.applyActionCode(actionCode);
    }).then(function () {
      renderMessage('Updated email address', 'Your sign-in email address has been changed back to <strong>' + restoredEmail + '</strong>. If you didnt’t ask to change your sign-in email, It’s possible someone is trying to access your account and you should <span id="change-your-password" style="cursor: pointer"><strong>change your password right away</strong></span>.');
      $('#change-your-password').click(function () {
        auth.sendPasswordResetEmail(restoredEmail).then(function () {
          renderMessage('Check your email', 'Follow the instructions sent to <strong>' + restoredEmail + '</strong> to recover your password')
        }).catch(function (error) {
        });
      });
    }).catch(function (error) {
      renderMessage('Unable to update your email address', 'Your request to recover your email has expired or the link has already been used');
    });
  }

  function handleResetPassword(auth, actionCode, continueUrl) {
    var accountEmail;
    auth.verifyPasswordResetCode(actionCode).then(function (email) {
      var accountEmail = email;
      renderMessage('Reset your password', 'for <strong>' + accountEmail + '</strong>');
      $('#form').html(
        '           <form id="comment_form" method="post" novalidate="">\n' +
        '                <div class="form-field" id="password-form-field">\n' +
        '                    <label>New password</label>\n' +
        '                    <input type="password" placeholder="New Password" id="password" name="password" class="inputfield">' +
        '                </div>\n' +
        '                <div class="form-field">\n' +
        '                    <button type="button" class="formsubmit" id="save">Send</button>\n' +
        '                </div>\n' +
        '            </form>'
      );
      $('#save').click(function () {
        var password = $('#password').val();
        if ($.trim(password) === '') {
          $('#password-error').remove();
          $('#password-form-field').append('<label id="password-error" class="error" for="password">Enter your password</label>');
          return false;
        }
        auth.confirmPasswordReset(actionCode, password).then(function (resp) {
          $('#comment_form').remove();
          renderMessage('Password changed', 'You can now sign in with your new password.');
        }).catch(function (error) {
          console.log(error)
          switch (error.code) {
            case 'auth/weak-password': {
              $('#password-error').remove();
              $('#password-form-field').append('<label id="password-error" class="error" for="password">Strong passwords have at least 6 char and a mix of letters and numbers</label>');
              break;
            }
            case 'auth/invalid-action-code': {
              $('#password-error').remove();
              $('#password-form-field').append('<label id="password-error" class="error" for="password">The code might have expired or the password is too weak.</label>');
              break;
            }
            default: {
              $('#password-error').remove();
              $('#password-form-field').append('<label id="password-error" class="error" for="password">The code might have expired or the password is too weak.</label>');
              break;
            }
          }
        });
      })
    }).catch(function (error) {
      renderMessage('Try resetting your password again', 'Your request to reset your password has expired or the link has already been used');
    });
  }

  function renderMessage(title, content) {
    $("#title").html(title);
    $("#content").html(content);
  }

  function fnSleep() {
    window.location.href = 'https://humally.com';
  }

  document.addEventListener('DOMContentLoaded', function () {
    try {
      var mode = getParameterByName('mode');
      var actionCode = getParameterByName('oobCode');
      var apiKey = getParameterByName('apiKey');
      var continueUrl = getParameterByName('continueUrl');
      var config = {
        'apiKey': apiKey
      };
      var app = firebase.initializeApp(config);
      var auth = app.auth();
      switch (mode) {
        case 'resetPassword':
          handleResetPassword(auth, actionCode, continueUrl);
          break;
        case 'verifyEmail':
          handleVerifyEmail(auth, actionCode, continueUrl);
          break;
        case 'recoverEmail':
          handleRecoverEmail(auth, actionCode);
          break;
        default: {
          renderMessage('Error encountered', 'The selected page mode is invalid');
        }
      }

      setTimeout(fnSleep, 3000);
    } catch (error) {
      renderMessage('Error encountered', 'The selected page mode is invalid');
    }
  }, false);
});
