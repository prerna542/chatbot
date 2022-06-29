/**
 * @module Chat DOM Maninpulation
 * @description Functions that access the DOM to insert and create the text and bot messages
 */
import formatOutgoingMessage from './socketMessages';

/**
 * @const contains a DOM to reference to the object that contains the messages
 */
const MESSAGES_CONTAINER = document.getElementById(
  process.env.MESSAGES_CONTAINER,
);

/**
 * Clears all the quick reply nuggets when the user sends a response
 */
export function clearQuickReplies() {
  let nodes = document.querySelectorAll(`div.px-1.pt-4.pb-2`);
  if (nodes.length) nodes[nodes.length - 1].innerHTML = '';
}

/**
 * Scrolls a given elements content to the bottom
 * @param {HTMLElement} element The element whose content is to be scrolled
 */
export function scrollToBottom(element) {
  element.scrollTo({ behaviour: 'smooth', top: element.scrollHeight });
}

/**
 * Attaches a child element to a parent element
 * @param {HTMLElement} childElement The element to attach i.e. the child element
 * @param {HTMLElement} parentElement The element to which the child should be attached i.e. the parent element
 */
function _attachNodeTo(childElement, parentElement) {
  parentElement.append(childElement);
}

/**
 * Creates a HTML Element with given classnames
 * @param {keyof HTMLElementTagNameMap} elementType The element to create
 * @param {string} classNames A string of classes sepereated by space
 * @returns {HTMLElement}
 * @example
 * _createElementWithGivenClassNames('div','class1 class2')
 * // produces <div class="class1 class2"></div>
 */
function _createElementWithGivenClassNames(elementType, classNames = '') {
  const element = document.createElement(elementType);
  element.setAttribute(
    'class',
    typeof classNames === 'string' ? classNames : classNames.join(' '),
  );
  return element;
}

/**
 * Creates and displays the total content of bot message. Content includes bot card, quick replies
 * @param {Object} websocketParsedResponseObject The object containing the bot message
 */
export function displayBotMessage(websocketParsedResponseObject) {
  const { data, quickReplies } = websocketParsedResponseObject;

  if (data.length > 1) displayCarouselCardAndQuickReplies(data, quickReplies);
  else displaySingleCardAndQuickReplies(data, quickReplies);
}

/**
 * Creates a bot card and quick replies together and attached them to the messages container.
 * This works only if there is single message. This is the used method in the `displayBotMessage` function
 * @param {Object} data The data to be displayed on the card
 * @param {Array<Object>} quickReplies The quick replies data to be displayed
 */
function displaySingleCardAndQuickReplies(data, quickReplies) {
  const quickRepliesDiv = _createQuickRepliesDivAndSpan(quickReplies);
  const card = _createBotCard(data[0]);
  const messageSection = _createMessageSection(true);

  _attachNodeTo(card, messageSection);
  _attachNodeTo(quickRepliesDiv, messageSection);
  _attachNodeTo(messageSection, MESSAGES_CONTAINER);
  scrollToBottom(MESSAGES_CONTAINER);
}

/**
 * Creates a div for holding quick replies and also adds the quick reply spans to the div.
 * Used in `displaySingleCardAndQuickReplies`
 * @param {Array<Object>} quickReplies The quick replies data needed to display on screen
 * @returns {HTMLDivElement}
 */
function _createQuickRepliesDivAndSpan(quickReplies) {
  const quickRepliesDiv = _createElementWithGivenClassNames(
    'div',
    'px-1 pt-4 pb-2',
  );

  if (quickReplies.length == 0) return quickRepliesDiv;

  quickReplies.forEach((reply) => {
    const spanClasses =
      'hover:cursor-pointer hover:bg-gray-300 inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2';

    const span = _createElementWithGivenClassNames('span', spanClasses);

    // Attach Event Listener
    if (reply.type === 'payload') {
      span.innerText = reply.title || 'SomeTitle';
      span.addEventListener('click', (clickEvent) => {
        displayUserMessage(span.innerText);
        scrollToBottom(MESSAGES_CONTAINER);
        quickRepliesDiv.innerText = '';
        window.GLOBAL_WEBSOCKET.sendJSONMessage(
          formatOutgoingMessage(reply.payload || 'somemessage'),
        );
      });
    } else span.innerHTML = `<a href="${reply.payload}">${reply.title}</a>`;

    _attachNodeTo(span, quickRepliesDiv);
  });

  return quickRepliesDiv;
}

/**
 * Creates a container that contains the bot message or user message
 * @param {boolean} isBotMessage Indicates whether the message is a bot message or not
 * @returns {HTMLDivElement}
 */
function _createMessageSection(isBotMessage = false) {
  return _createElementWithGivenClassNames(
    'div',
    isBotMessage
      ? 'card bot_message_container flex flex-col justify-start mb-10 section'
      : 'card user_message_container flex justify-end first:mt-10 mb-10 section',
  );
}

/**
 * Creates the user message bubble with the given text
 * @param {string} message The message to display
 * @returns {HTMLDivElement}
 */
function _createUserMessageDiv(message) {
  const messageDiv = _createElementWithGivenClassNames(
    'div',
    'user_message p-3',
  );
  messageDiv.innerText = message;
  return messageDiv;
}

/**
 * Creates and attaches the user message to the chat area
 * @param {string} userMessage The user message to display
 */
export function displayUserMessage(userMessage) {
  const messageSection = _createMessageSection();
  const messageDiv = _createUserMessageDiv(userMessage);

  _attachNodeTo(messageDiv, messageSection);
  _attachNodeTo(messageSection, MESSAGES_CONTAINER);
}

/**
 * Creates the body of the bot card. Created content includes card title, card paragraph
 * card image, card buttons etc
 * @param {string} title The title of the card
 * @param {string} subtitle The subtitle of the card
 * @param {Array<Object>} buttons The data of the buttons
 * @returns {HTMLDivElement}
 */
function _createBotText(title, subtitle, buttons) {
  let flexDiv;
  const contentDiv = _createElementWithGivenClassNames('div', 'px-6 py-4');
  const cardHeading = _createElementWithGivenClassNames(
    'div',
    'font-bold text-xl mb-2',
  );
  const cardParagraph = _createElementWithGivenClassNames(
    'div',
    'text-gray-700 text-base',
  );

  cardHeading.innerText = title;
  cardParagraph.innerText = subtitle;

  if (buttons && buttons.length >= 1) {
    // Create a flex div
    flexDiv = _createElementWithGivenClassNames(
      'div',
      'flex flex-col justify-center items-center shadow-md hover:shadow-lg focus:shadow-lg mt-2',
    );
    flexDiv.setAttribute('role', 'group');

    buttons.forEach((buttonObject) => {
      let element;
      if (buttonObject.type === 'payload') {
        element = _createElementWithGivenClassNames(
          'button',
          'rounded-l w-full mb-2 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out',
        );
        element.innerText = buttonObject.title;
        element.addEventListener('click', (clickEvent) => {
          window.GLOBAL_WEBSOCKET.sendJSONMessage(
            formatOutgoingMessage(clickEvent.target.innerText),
          );
          displayUserMessage(clickEvent.target.innerText);
          scrollToBottom(MESSAGES_CONTAINER);
          clearQuickReplies();
        });
      } else {
        element = _createElementWithGivenClassNames(
          'a',
          'rounded-l w-full mb-2 text-center inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out',
        );
        element.href = buttonObject.payload;
        element.innerText = buttonObject.title;
      }

      _attachNodeTo(element, flexDiv);
    });
  }

  _attachNodeTo(cardHeading, contentDiv);
  _attachNodeTo(cardParagraph, contentDiv);
  if (flexDiv) _attachNodeTo(flexDiv, contentDiv);

  return contentDiv;
}

/**
 * Creates a card from the given bot message. It uses the following keys from the bot message:
 * 1. title
 * 2. subtitle
 * 3. buttons
 * 4. image_url
 * @param {Object} dataObject The response object from the server containing information about the bot message
 * @returns {HTMLDivElement}
 */
function _createBotCard(dataObject) {
  const cardDiv = _createElementWithGivenClassNames(
    'div',
    'max-w-sm h-min rounded overflow-hidden shadow-lg',
  );
  const image = _createElementWithGivenClassNames('img', 'w-full h-max');
  const body = _createBotText(
    dataObject.title,
    dataObject.subtitle,
    dataObject.buttons,
  );

  image.src = dataObject.image_url;

  _attachNodeTo(image, cardDiv);
  _attachNodeTo(body, cardDiv);

  return cardDiv;
}

/**
 * Toggles the popper menu that shows different inputs when clicked on the ellipsis button
 */
export function menuToggler() {
  document.querySelector('#dropdown').classList.toggle('hidden');
}

/**
 * A utitlity function to automatically add ListItems to the menu
 * (Chatbot input menu. The button with ellipsis) based on the configuration object
 * @param {string} type The icon needed for the button
 * @returns {HTMLLIElement}
 */
export function createWidgetButton(type) {
  const button = _createElementWithGivenClassNames(
    'button',
    'footer_btn text-sky-500',
  );
  const span = _createElementWithGivenClassNames('span');
  const i = _createElementWithGivenClassNames('i', `fa-solid fa-${type}`);
  const li = _createElementWithGivenClassNames('li');

  button.addEventListener('click', menuToggler);

  _attachNode(i, span);
  _attachNode(span, button);
  _attachNode(button, li);
  return li;
}
