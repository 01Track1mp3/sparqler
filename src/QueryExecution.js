import _ from 'lodash';
import querystring from 'querystring'
import fetch from 'isomorphic-fetch'

export default class QueryExecution {

  defaultParams = {
    timeout: 30000,
    format: 'application/sparql-results+json'
  }

  options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/sparql-results+json'
    }
  }

  constructor(queryString) {
    this.query = queryString
  }

  execute(endpointUrl, params) {
    return this.privateExecute(endpointUrl, params)
      .then(response => response.json())
      // .then(json => new ResultSet(json))
  }

  privateExecute(endpointUrl, params = {}) {
    if (typeof endpointUrl != 'string') {
      throw new Error('Endpoint must be a string')
    }
    const queryParams = {...this.defaultParams, ...params, query: this.query}
    const url = this.buildQuery(endpointUrl, queryParams)

    if (url.length > 2000) {
      throw new Error('Url is too long, pls shorten your query')
    }

    return this.privateFetch(url, this.options)
  }

  // for testing purpose
  privateFetch(...params) {
    return fetch(...params)
  }

  buildQuery(base, params) {
    // const paramStrings = _.map(params, (value, key) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    // return base + '?' + paramStrings.join('&')
    return base + '?' + querystring.stringify(params)
  }
}
