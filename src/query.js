import _ from 'lodash'

export default class Query {
  constructor(queryString) {
    if (typeof queryString != 'string') {
      throw new Error("No valid queryString passed to Query constructor")
    }

    this.queryString = queryString
  }


  execute(endpointUrl, prefixes = {}, options) {
    this.addPrefixes(prefixes)
    return new QueryExecution(queryString).execute(endpointUrl, options)
  }

  addPrefix() {

  }

  addPrefixes() {

  }

  replaceParameter(name, value, queryString) {
    const pattern = new RegExp('\\?' + name, 'g');
    return queryString.replace(pattern, value);
  }

  setParameter(name, value) {
    const query = this.replaceParameter(name, value, this.queryString)
    return new Query(query);
  }

  setParameters(nameValueMap) {
    const query = _.reduce(nameValueMap, (acc, value, name) => {
      return this.replaceParameter(name, value, acc)
    }, this.queryString)
    return new Query(query)
  }

  setParametersMapped(nameValueMap, func) {
    const mappedNameValueMap = _.mapValues(nameValueMap, func)
    return this.setParameters(mappedNameValueMap)
  }

  setUri(name, uri) {
    return this.setUris({[name]: uri})
  }

  setUris(nameUriMap) {
    return this.setParametersMapped(nameUriMap, (uri) => `<${uri}>`)
  }

  setLiteral(name, value) {
    return this.setLiterals({[name]: value})
  }

  setLiterals(nameLiteralMap) {
    return this.setParametersMapped(nameLiteralMap, (value) => {
      const typeString = typeof value
      switch(typeString) {
        case 'string':
          return `'${value}'`
          break;
        case 'number':
          return value
          break;
        case 'boolean':
          return value
          break;
        default:
          throw new Error("Unsupported literal type")
          break;
      }
    })
  }

  setLiteralWithLanguage(name, value, languageTag) {
    return this.setLiteralsWithLanguage({[name]: value}, languageTag)
  }

  setLiteralsWithLanguage(nameValueMap, languageTag) {
    return this.setParametersMapped(nameValueMap, (value) => `'${value}'@${languageTag}`)
  }

  setLiteralWithDatatype(name, value, datatype) {
    return this.setLiteralsWithDatatype({[name]: value}, datatype)
  }

  setLiteralsWithDatatype(nameValueMap, datatype) {
    return this.setParametersMapped(nameValueMap, (value) => `'${value}'^^<${datatype}>`)
  }
}
