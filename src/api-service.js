'use strict';

// const baseUrl = 'https://pwa-news-api.azurewebsites.net/api';
const baseUrl = 'https://localhost:44355/api';

export async function authenticate(username, password) {
	console.log("authenticating user");
	const response = await fetch(baseUrl + '/authenticate', {
		method: 'post',
		body: JSON.stringify({
			username,
			password
		}),
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	})
	if (!response.ok) {
		throw Error(response.statusText)
	}
	return await response.json();
}

export async function fetchPublishers() {
	console.log("fetching all publishers");
	const response = await fetch(`${baseUrl}/publishers`)
	if (!response.ok) {
		throw Error(response.statusText)
	}
	return await response.json();
}

export async function fetchPublisher(id) {
	console.log("fetching publisher: " + id);
	const response = await fetch(`${baseUrl}/publishers/${id}`)
	if (!response.ok) {
		throw Error(response.statusText)
	}
	return await response.json();
}

export async function fetchArticles(authToken, from = "", offset = 0, size = 10) {
	console.log("fetching articles. from: " + from + " Offset: " + offset + " Size: " + size );
	const response = await fetch(`${baseUrl}/articles?from=${from}&offset=${offset}&size=${size}`, {
		headers: {
			'Authorization': `Bearer ${authToken}`,
		},
	})
	if (!response.ok) {
		throw Error(response.statusText)
	}
	return await response.json();
}

export async function fetchUser(authToken) {
	console.log("fetching user");
	const response = await fetch(`${baseUrl}/users`, {
		headers: {
			'Authorization': `Bearer ${authToken}`,
		},
	})
	if (!response.ok) {
		throw Error(response.statusText)
	}
	return await response.json();
};

export async function createUser(username, password) {
	console.log("creating user: " + username);
	const response = await fetch(`${baseUrl}/users`, {
		method: 'post',
		body: JSON.stringify({
			username,
			password
		}),
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	})
	if (!response.ok) {
		throw Error(response.statusText)
	}
	return await response.json();
};

export async function updateUser(authToken, user) {
	console.log("updating user: " + id);
	const response = await fetch(`${baseUrl}/users/${id}`, {
		method: 'put',
		body: JSON.stringify(user),
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Authorization': `Bearer ${authToken}`,
		},
	});

	if (!response.ok) {
		throw Error(response.statusText)
	}
	return await response.json();
}

export async function deleteUser(authToken) {
	console.log("deleting user");
	const response = await fetch(`${baseUrl}/users`, {
		method: 'delete',
		headers: {
			'Authorization': `Bearer ${authToken}`,
		},
	});

	if (!response.ok) {
		throw Error(response.statusText)
	}

	return response;
}

export async function fetchSubscriptions(authToken) {
	console.log("fetching subscriptions");
	const response = await fetch(`${baseUrl}/subscriptions`, {
		headers: {
			'Authorization': `Bearer ${authToken}`,
		},
	});
	if (!response.ok) {
		throw Error(response.statusText)
	}
	return await response.json();
}

export async function createSubscription(publisherId, authToken) {
	console.log("creating subscription to: " + publisherId);
	const response = await fetch(`${baseUrl}/subscriptions`, {
		method: 'post',
		body: JSON.stringify({
			publisherId
		}),
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Authorization': `Bearer ${authToken}`,
		},
	});

	if (!response.ok) {
		throw Error(response.statusText)
	}
	return await response.json();
}

export async function deleteSubscription(publisherId, authToken) {
	console.log("deleting subscription: " + publisherId);
	const response = await fetch(`${baseUrl}/subscriptions`, {
		method: 'delete',
		body: JSON.stringify({
			publisherId
		}),
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Authorization': `Bearer ${authToken}`,
		},
	});

	if (!response.ok) {
		throw Error(response.statusText)
	}
	return response;
}