const fs = require("fs").promises;
const path = require("node:path");

const contactsPath = path.format({
	root: "/ignored",
	dir: "db",
	base: "contacts.json",
});

function listContacts() {
	fs.readFile(contactsPath).then((contacts) => console.table(JSON.parse(contacts)));
}

function getContactById(contactID) {
	fs.readFile(contactsPath)
		.then((contacts) => JSON.parse(contacts).find((contact) => contact.id === contactID))
		.then((contact) => console.table(contact));
}

async function removeContact(contactID) {
	let content = null;
	await fs
		.readFile(contactsPath)
		.then((contacts) => JSON.parse(contacts))
		.then((contacts) => contacts.filter((contact) => contact.id !== contactID))
		.then((contacts) => (content = JSON.stringify(contacts)));
	await fs.writeFile(contactsPath, content);
	listContacts();
}

async function addContact(name, email, phone) {
	let content = null;
	await fs
		.readFile(contactsPath)
		.then((contacts) => JSON.parse(contacts))
		.then((contacts) => {
			let id = Number(contacts[contacts.length - 1].id) + 1;
			let newContacts = [...contacts, { id: id.toString(), name, email, phone }];
			return newContacts;
		})
		.then((contacts) => (content = JSON.stringify(contacts)));
	await fs.writeFile(contactsPath, content);
	listContacts();
}

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
};
