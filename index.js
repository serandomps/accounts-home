var dust = require('dust')();
var serand = require('serand');

var profile = require('accounts-profile');
var register = require('user-register');

var user;

var context;

serand.on('user', 'logged in', function (usr) {
    user = usr;
    if (context.destroy) {
        context.destroy();
    }
    profile(context.sandbox, function (err, destroy) {
        context.destroy = destroy;
    }, user);
});

serand.on('user', 'logged out', function () {
    user = null;
    if (context.destroy) {
        context.destroy();
    }
    register(context.sandbox, function (err, destroy) {
        context.destroy = destroy;
    }, context.options);
});

module.exports = function (sandbox, fn, options) {
    context = {
        sandbox: sandbox,
        options: options
    };
    var done = function (err, destroy) {
        context.destroy = destroy;
        fn(err, destroy);
    };
    user ? profile(sandbox, done, user) : register(sandbox, done, options);
};