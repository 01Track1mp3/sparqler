import _ from 'lodash'
import Query from './Query'


export default class Endpoint {
  constructor(configs = {}) {
    const { url = '', prefixes = {}, graph = '' } = configs

    if (!_.isString(url)) {
      throw new Error('Endpoint requires url to be a string.')
    }

    if (url.length === 0) {
      throw new Error('Endpoint requires an url.')
    }

    if (!_.isString(graph)) {
      throw new Error('Endpoint requires graph to be a string.')
    }

    if (!_.isObject(prefixes)) {
      throw new Error('Endpoint requires prefixes to be an object.')
    }

    this.configs = { url, prefixes, graph }
  }


  //== MUTATING

  setUrl(url) {
    return new Endpoint({ ...this.configs, url })
  }

  setGraph(graph) {
    return new Endpoint({ ...this.configs, graph })
  }

  setPrefixes(prefixes) {
    return new Endpoint({ ...this.configs, prefixes })
  }

  addPrefixes(prefixes) {
    const _prefixes = { ...this.configs.prefixes, ...prefixes }
    return this.setPrefixes(_prefixes)
  }

  addPrefix(prefix, uri) {
    return this.addPrefixes({ [prefix]: uri })
  }


  //== RUN QUERIES

  createQuery(aString) {
    return new Query(aString)
  }

  execute(query) {
    let _query = query
    if (_.isString(query)) {
      _query = this.createQuery(query)
    }

    if (!_query || !_.isFunction(_query.execute)) {
      throw new Error('Endpoint requires a query which supports an execute-method or a query string.')
    }

    const { url, graph, prefixes } = this.configs
    return _query.execute(url, prefixes, { graph })
  }
}
