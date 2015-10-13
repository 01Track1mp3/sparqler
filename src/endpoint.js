import _ from 'lodash'
import Query from './Query'


export default class Endpoint {
  constructor(configs = {}) {
    const { url = '', prefixes = [], graph = '' } = configs

    if (!_.isString(url)) {
      throw new Error('Endpoint requires url to be a string.')
    }

    if (url.length === 0) {
      throw new Error('Endpoint requires an url.')
    }

    if (!_.isString(graph)) {
      throw new Error('Endpoint requires graph to be a string.')
    }

    if (!_.isArray(prefixes)) {
      throw new Error('Endpoint requires prefixes to be an array.')
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
    return this.setPrefixes(this.configs.prefixes.concat(prefixes))
  }

  addPrefix(prefix) {
    return this.addPrefixes([ prefix ])
  }


  //== RUN QUERIES

  execute(query) {
    if (!query || !_.isFunction(query.execute)) {
      throw new Error('Endpoint requires a query which supports an execute-method.')
    }

    const { url, graph, prefixes } = this.configs
    return query.execute(url, prefixes, { graph })
  }
}
