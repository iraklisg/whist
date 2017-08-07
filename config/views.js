// Below configuration was taken from https://github.com/mozilla/nunjucks/issues/472

module.exports = function (app, nunjucks) {

    // app.set('views', dir.views);
    app.set('view engine', 'nunj');
    // app.set('view cache', app.get('env') === 'production');
    nunjucks.configure('views', {
        autoescape: true,
        express: app
    });

    // app.use(function (req, res, next) {
    //     res.locals.user = req.session.user || false;
    //     next();
    // });

};