const _ = require('lodash')
const QueryExecution = require('../src/QueryExecution')


describe('fetch sparql response', () => {
  pit('should fetch json results from DBpedia.org', () => {
    const queryExecution = new QueryExecution('select ?p where { dbr:Carl_Friedrich_Gauss dbo:birthDate ?p }')
    return queryExecution
      .privateExecute('http://dbpedia.org/sparql', { format: 'application/json' })
      .then(response => {
        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Type')).toBe('application/json')
        expect('body' in response).toBe(true)

        return response.json()
      })
      .then(responseJson => {
        expect(responseJson.results.bindings[0].p.value).toBe('1777-04-30')
      })
  })
})
