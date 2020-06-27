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

// Функция для получения списка контактов
// Ничего не принемает
// Возвращает массив всех контактов
async function listContacts() {
  try {
    const data = await fsPromises.readFile(contactsPath, 'utf-8');
    console.table(getData(data));
  } catch (err) {
    throw err;
  }
}

// Функция для получения контакта по ID
// Принимает параметр contactId
// Возвращает обьект контакта
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

// Функция для удаления контакта по ID
// Принимает параметр contactId
//Ничего не возвращает
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

// Функция для создания нового контакта
// Принемает параметры name, email, phone
// Возвращает созданый контакт с уникальным ID
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
