'use strict'
import idb from 'idb';

export default class {

	constructor() {
		this.DB_NAME = 'pwa-news';
		this.DB_VERSION = 2;
		this.SUBSCRIPTIONS_STORE = 'subscriptions';
		this.USER_STORE = 'user'
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
		this.dbConnection = idb.open(this.DB_NAME, this.DB_VERSION, upgradeDb => {
			switch (upgradeDb.oldVersion) {
				case 0:
				upgradeDb.createObjectStore(this.USER_STORE, {
					keyPath: 'id'
				});
				case 1:
					upgradeDb.createObjectStore(this.SUBSCRIPTIONS_STORE, {
						keyPath: 'publisherId'
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
			});
	}

	getItemFromStore(itemPK, storeName) {
		if (!this.isSupported()) return;
		return this.dbConnection.then(db => {
			const tx = db.transaction(storeName, 'readonly');
			const store = tx.objectStore(storeName);
			return store.get(itemPK);
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

	clearStore(storeName) {
		if (!this.isSupported()) return;
		return this.dbConnection.then(db => {
			const tx = db.transaction(storeName, 'readwrite');
			const store = tx.objectStore(storeName);
			store.clear();
			return tx.complete;
		});
	}
}