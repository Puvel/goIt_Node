const fs = require('fs');

const { promises: fsPromises } = fs;

const path = require('path');

const contactsPath = path.join(__dirname, './db/contacts.json');

function getData(data) {
  return JSON.parse(data);
}
function saveData(data) {
  return JSON.stringify(data, null, 2);
}

// function listContacts() {
//   fs.readFile(contactsPath, 'utf-8', (err, data) => {
//     if (err) throw err;
//     console.table(getData(data));
//   });
// }

async function listContacts() {
  try {
    const data = await fsPromises.readFile(contactsPath, 'utf-8');
    console.table(getData(data));
  } catch (err) {
    throw err;
  }
}

// function getContactById(contactId) {
//   fs.readFile(contactsPath, 'utf-8', (err, data) => {
//     if (err) throw err;
//     const list = getData(data);
//     const findItem = list.find(item => item.id === contactId);
//     console.table(findItem);
//   });
// }

async function getContactById(contactId) {
  try {
    const data = await fsPromises.readFile(contactsPath, 'utf-8');
    const list = getData(data);
    const findItem = list.find(item => item.id === contactId);
    console.table(findItem);
  } catch (err) {
    throw err;
  }
}

// function removeContact(contactId) {
//   fs.readFile(contactsPath, 'utf-8', (err, data) => {
//     if (err) throw err;
//     const list = getData(data);
//     const newList = list.filter(item => item.id !== contactId);
//     const newContacts = saveData(newList);
//     fs.writeFileSync(contactsPath, newContacts);
//   });
// }

async function removeContact(contactId) {
  try {
    const data = await fsPromises.readFile(contactsPath, 'utf-8');
    const list = getData(data);
    const newList = list.filter(item => item.id !== contactId);
    console.table(newList);
    await fsPromises.writeFile(contactsPath, saveData(newList));
  } catch (err) {
    throw err;
  }
}

// function addContact(name, email, phone) {
//   fs.readFile(contactsPath, 'utf-8', (err, data) => {
//     if (err) throw err;
//     const list = getData(data);
//     const allId = list.map(item => item.id);
//     const newContact = {
//       id: Math.max(...allId) + 1,
//       name,
//       email,
//       phone,
//     };
//     const newList = [...list, newContact];
//     fs.writeFileSync(contactsPath, saveData(newList));
// console.table(newList)
//   });
// }

async function addContact(name, email, phone) {
  try {
    const data = await fsPromises.readFile(contactsPath, 'utf-8');
    const list = getData(data);
    const newContact = {
      id: list.length + 1,
      name,
      email,
      phone,
    };
    const newList = [...list, newContact];
    await fsPromises.writeFile(contactsPath, saveData(newList));
    console.table(newList);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
