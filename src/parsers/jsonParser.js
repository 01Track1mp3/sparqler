import _ from 'lodash'

export const defaultTypeTransforms = {
  'http://www.w3.org/2001/XMLSchema#integer': parseInt,
  'http://www.w3.org/2001/XMLSchema#decimal': parseFloat,
  'http://www.w3.org/2001/XMLSchema#string': (_string) => _string,
  'http://www.w3.org/2001/XMLSchema#date': (datestring) => new Date(datestring),
  'http://www.w3.org/2001/XMLSchema#dateTime': (datestring) => new Date(datestring),
  'http://www.w3.org/2001/XMLSchema#time': (_string) => _string
}

export class JSONSelectParser {
  constructor(data) {
    this.data = JSON.parse(data)
  }

  parse() {
    return {
      furtherInfo: this.data.head.link,
      variables: this.data.head.vars,
      results: this.flattenBindings(this.data.results.bindings)
    }
  }

  resolveUriSolution(solution) {
    return {
      language: 'unknown',
      datatype: 'uri',
      value: solution.value
    }
  }

  resolveLiteralSolution(solution) {
    return {
      language: solution['xml:lang'] || 'unknown',
      value: defaultTypeTransforms[solution.datatype]
        ? defaultTypeTransforms[solution.datatype](solution.value)
        : solution.value,
      datatype: solution.datatype || 'unknown'
    }
  }

  resolveQuerySolution(solution) {
    if (solution.type === 'uri') {
      return this.resolveUriSolution(solution)
    }

    if (solution.type === 'literal') {
      return this.resolveLiteralSolution(solution)
    }
  }

  flattenBinding(binding) {
    return _(binding)
      .mapValues(this.resolveQuerySolution, this)
      .omit(_.isUndefined)
      .value()
  }

  flattenBindings(bindings) {
    return bindings.map(this.flattenBinding, this)
  }
}


export class JSONAskParser {
  constructor(data) {
    this.data = JSON.parse(data)
  }

  parse() {
    return {
      furtherInfo: this.data.head.link,
      results: this.data.boolean
    }
  }
}
