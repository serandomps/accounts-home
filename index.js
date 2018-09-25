var dust = require('dust')();
var serand = require('serand');

dust.loadSource(dust.compile(require('./template'), 'accounts-home'));

module.exports = function (ctx, sandbox, options, done) {
    options = options || {};
    dust.render('accounts-home', {
        username: options.username
    }, function (err, out) {
        if (err) {
            return done(err);
        }
        sandbox.append(out);
        done(null, {
            clean: function () {
                $('.accounts-home', sandbox).remove();
            }
        });
    });
};
