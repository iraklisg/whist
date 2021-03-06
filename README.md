# App Structure
    .
    ├── config
    |   └── auth.js             # will hold all our client secret keys (facebook, twitter, google)
    |   ├── database.js         # will hold our database connection settings
    |   └── passport.js         # configuring the strategies for passport
    ├── controllers
    |   └── users.js             # our user controller
    ├── libs                    # our custom classes/functions/modules
    ├── models
    |   └── User
    |       ├── index.js        # our user model (mongoose Schema)
    |       └── validate.js     # our model validation
    ├── public
    |   ├── css                 # contains style sheets (or compiled output by a css engine)
    |   ├── js                  # contains client side JavaScript
    |   └── images
    ├── services
    |   └── users.js             # our user service
    ├── tests
    |   └── user.test.js        # our user tests
    ├── views
    |   ├── index.ejs           # show our home page with login links
    |   ├── login.ejs           # show our login form
    |   ├── signup.ejs          # show our signup form
    |   └── dashboard.ejs       # after a user logs in, they will see their profile
    ├── app.js                  # our entry point
    ├── package.json            # handle our npm packages
    └── routes.js               # all the routes for our application

## Alternative folder structure (per resource)

    .
    ├── config
    |   └── auth.js                 # will hold all our client secret keys (facebook, twitter, google)
    |   ├── database.js             # will hold our database connection settings
    |   └── passport.js             # configuring the strategies for passport
    ├── libs                        # our custom classes/functions/modules
    ├── public
    |   ├── css                     # contains style sheets (or compiled output by a css engine)
    |   ├── js                      # contains client side JavaScript
    |   └── images
    ├── User
    |   ├── controllers             # We typically have a controller per resource
    |   |   └── userController.js
    |   ├── models                  # We typically have a controller per resource
    |   |   └── User
    |   |       ├── index.js        # our user model (mongoose Schema)
    |   |       └── validate.js     # our model validation 
    |   ├── seeds
    |   |   └── users.js             # our user seeds
    |   ├── services
    |   |   └── users.js             # our user service
    |   ├── tests
    |   |   └── user.test.js        # our user tests
    |   ├── views
    |   |   ├── index.ejs           # show our home page with login links
    |   |   ├── login.ejs           # show our login form
    |   |   ├── signup.ejs          # show our signup form
    |   |   └── dashboard.ejs       # after a user logs in, they will see their profile
    |   └── routes.js               # our user routes
    ├── app.js                      # our entry point
    └── package.json                # handle our npm packages