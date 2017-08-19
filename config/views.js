// Below configuration was taken from https://github.com/mozilla/nunjucks/issues/472
let dateFilter = require('nunjucks-date-filter');

const staticFilesConfig = require('./staticFiles');


const resolveStaticFile = (staticPath) => {
    if (typeof staticPath === 'string' && staticPath[0] !== '/') {
        return `${staticFilesConfig()}/${staticPath}`;
    } else {
        throw new Error('Static file path should be a string and must NOT begin with a "/".');
    }
};


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

    // Add global values
    env.addGlobal('static', resolveStaticFile);

    // Third-party template tags/filters configurations here
    dateFilter.setDefaultFormat('D/M/YYYY, HH.mm');

};