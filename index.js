var dust = require('dust')();
var serand = require('serand');

var profile = require('accounts-profile');
var signup = require('accounts-signup');

var ready = false;

var user;

var context;

serand.on('user', 'ready', function (usr) {
    user = usr;
    ready = true;
    if (!context) {
        return;
    }
    user ? profile(context.sandbox, context.done, user) : signup(context.sandbox, context.done, user);
});

serand.on('user', 'logged in', function (usr) {
    user = usr;
    if (!context) {
        return;
    }
    context.destroy();
    profile(context.sandbox, function (err, destroy) {
        context.destroy = err ? serand.none : destroy;
    }, user);
});

serand.on('user', 'logged out', function () {
    user = null;
    if (!context) {
        return;
    }
    context.destroy();
    signup(context.sandbox, function (err, destroy) {
        context.destroy = err ? serand.none : destroy;
    }, user);
});

module.exports = function (sandbox, fn, options) {
    context = {
        sandbox: sandbox,
        done: function (err, destroy) {
            context.destroy = destroy;
            fn(err, function () {
                destroy();
                context = null;
            });
        },
        options: options
    };
    if (!ready) {
        return;
    }
    user ? profile(context.sandbox, context.done, user) : signup(context.sandbox, context.done, user);
};
