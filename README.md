# AmigoChatbot

## Required Environment Vars
The enviroment variables for local development are kept in the `.env` file. The webpack script uses `dotenv` to load the variables. In production, the variables can be put into the enviroment directly without any file.  

1. `WEBSOCKET_URL`: The URL of the websocket server.

## Scripts
1. `dev-build`: Produces development build in `dist/`.
2. `prod-build`: Produces production build in `dist/`.
3. `document`: Produces documentation in a folder named `out` that is not tracked by `git`
4. `dev-server`: Starts a development server.


## Project Structure
1. `src`: The source code.
   1. `audioVideo`: Code for accessing microphone and camera.
   2. `fingerprint`: Code for computing the fingerprint of the user from FingerprintJS
   3. `index`: Entry point for the application
   4. `socketMessages`: Utility for formatting and parsing messages send over the websocket
   5. `utils`: Utility functions
   6. `ws`: Websocket client
2. `vendors`: Third party JS and CSS which don't have an NPM package
3. `.eslintrc.json`: ESLint configuration
4. `.gitignore`: Git ignore file
5. `babel.config.json`: Babel configuration
6. `index.ejs`: The template for the index.html file
7. `jest-puppeteer.config.js`: Puppeteer configuration for Jest
8. `jest.config.js`: Jest configuration
9. `jsdoc.config.js`: JSDoc configuration
10. `package.json`: NPM package configuration
11. `postcss.config.js`: PostCSS configuration
12. `prettier.config.js`: Prettier configuration
13. `README.md`: The README
14. `webpack.config.js`: Webpack configuration
