const argv = require('yargs').argv;

const contactsMethods = require('./contacts');

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      contactsMethods.listContacts();
      break;

    case 'get':
      contactsMethods.getContactById(id);
      break;

    case 'add':
      contactsMethods.addContact(name, email, phone);

    case 'remove':
      contactsMethods.removeContact(id);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);
