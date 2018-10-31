'use strict'
import idb from 'idb';

export default class {

	constructor() {
		this.dbName = 'pwa-news';
		this.dbVersion = 1;
		this.subscriptionStore = 'subscriptions';
		this.dbConnection = null;
	}

	isSupported() {
		if (!('indexedDB' in window)) {
			console.log('This browser doesn\'t support IndexedDB');
			return false;
		} else return true;
	}

	openConnection() {
		if (!this.isSupported()) return;
		this.dbConnection = idb.open(this.dbName, this.dbVersion, upgradeDb => {
			switch (upgradeDb.oldVersion) {
				case 0:
					upgradeDb.createObjectStore(this.subscriptionStore, {
						keyPath: 'id'
					});
			}
		});
	}

	addItemToStore(item, storeName) {
		if (!this.isSupported()) return;
		return this.dbConnection.then(db => {
				const tx = db.transaction(storeName, 'readwrite');
				const store = tx.objectStore(storeName);
				store.add(item);
				return tx.complete;
			}).then(console.log('added item to store'))
			.catch('Something went wrong when adding item')
	}

	getItemFromStore(item, storeName) {
		if (!this.isSupported()) return;
		return this.dbConnection.then(db => {
			const tx = db.transaction(storeName, 'readonly');
			const store = tx.objectStore(storeName);
			return store.get(item);
		});
	}

	getAllItemsFromStore(storeName) {
		if (!this.isSupported()) return;
		return this.dbConnection.then(db => {
			const tx = db.transaction(storeName, 'readonly');
			const store = tx.objectStore(storeName);
			return store.getAll()
		})
	}

	updateItemInStore(item, storeName) {
		if (!this.isSupported()) return;
		return this.dbConnection.then(db => {
			const tx = db.transaction(storeName, 'readwrite');
			const store = tx.objectStore(storeName);
			store.put(item);
			return tx.complete;
		})
	}

	deleteItemFromStore(itemPK, storeName) {
		if (!this.isSupported()) return;
		return this.dbConnection.then(db => {
			const tx = db.transaction(storeName, 'readwrite');
			const store = tx.objectStore(storeName);
			store.delete(itemPK);
			return tx.complete;
		});
	}
}