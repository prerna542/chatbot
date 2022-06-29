# AmigoChatbot

## Features to add
- [ ] Drag and Drop to drop files in the chatbox  
- [ ] Carousel Card for displaying multiple bot messages

## Required Environment Vars
The enviroment variables for local development are kept in the `.env` file. The webpack script uses `dotenv` to load the variables. In production, the variables can be put into the enviroment directly without any file.  

1. `WEBSOCKET_URL`: The URL of the websocket server.
2. `TENANT_ID`: The tenant ID of the bot.
3. `INPUT_ID`: The ID of the HTML Input element where messages are entered.
4. `SEND_BUTTON_ID`: The ID of the HTML Button element that sends messages.
5. `MIC_ICON_ID`: The ID of the HTML Button element that starts and stops recording.
6. `MESSAGES_CONTAINER`: The ID of the HTML element which should contain all the messages
7. `BOT_IMAGE`: The ID of the HTML image element that displays the bot logo
8. `BOT_HEADING`: The ID of the element which displays the bot heading
9. `BOT_SUBHEADING`: The ID of the element which displays the bot subheading
10. `WIDGETS_LIST_UL`: The ID of the element that is shown as a tray that contains various input buttons
11. `DROPDOWN_BUTTON`: The ID of the element that is clicked to show the `WIDGETS_LIST_UL` tray.

## Scripts
1. `dev-build`: Produces development build in `dist/`.
2. `prod-build`: Produces production build in `dist/`.
3. `document`: Produces documentation in a folder named `out` that is not tracked by `git`
4. `dev-server`: Starts a development server.


## Project Structure
1. `src`: The source code.
   1. `audioVideo`: Code for accessing microphone and camera.
   2. `dom`: Code for manipulating the DOM and programatically creating and attaching user and both messages
   3. `fingerprint`: Code for computing the fingerprint of the user from FingerprintJS
   4. `index`: Entry point for the application
   5. `socketMessages`: Utility for formatting and parsing messages send over the websocket
   6. `utils`: Utility functions
   7. `ws`: Websocket client
   8. `style.css`: Custom styles that are not achievable using TailwindCSS defaults
2. `vendors`: Third party JS and CSS which don't have an NPM package
3. `.eslintrc.json`: ESLint configuration
4. `.gitignore`: Git ignore file
5. `babel.config.json`: Babel configuration
6. `index.ejs`: The template for the index.html file
7. `jest-puppeteer.config.js`: Puppeteer configuration for Jest
8. `jest.config.js`: Jest configuration
9. `jsdoc.json`: JSDoc configuration
10. `package.json`: NPM package configuration
11. `postcss.config.js`: PostCSS configuration
12. `prettier.config.js`: Prettier configuration
13. `README.md`: The README
14. `tailwind.config.js`: The config file for TailwindCSS. Recommended by TailwindCSS documentation
15. `webpack.config.js`: Webpack configuration
