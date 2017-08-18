// Below configuration was taken from https://github.com/mozilla/nunjucks/issues/472
let dateFilter = require('nunjucks-date-filter');


module.exports = function (app, nunjucks) {

    // app.set('views', dir.views);
    app.set('view engine', 'nunj');
    // app.set('view cache', app.get('env') === 'production');
    let env = nunjucks.configure('views', {
        autoescape: true,
        express: app
    });

    // Add custom filters here: env.addFilter('filter name', function)
    env.addFilter('date', dateFilter);
    dateFilter.setDefaultFormat('D/M/YYYY, HH.mm');

};