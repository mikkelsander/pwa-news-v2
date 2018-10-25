'use strict';
import {
    newsApiKey
} from '../secrets.js';



export async function getSources() {
    const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${newsApiKey}`)
    const json = await res.json();
    return json.sources;
}

export async function getTopHeadlinesFromSource(source) {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${newsApiKey}`)
    const json = await res.json();
    return json.articles;
}

export async function getTopHeadlinesFromCountry(country) {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${newsApiKey}`)
    const json = await res.json()
    return json.articles;
}

export async function getHeadlinesFromPublishers(publishers) {
    if (publishers.count < 1) return;

    const sources = publishers.toString();
    console.log("sources: " + sources)
    const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${sources}&apiKey=${newsApiKey}`)
    const json = await res.json()
    return json.articles;
}