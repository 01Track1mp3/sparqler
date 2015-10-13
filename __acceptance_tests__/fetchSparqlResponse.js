describe('fetch sparql response', () => {
  pit('should fetch results from DBpedia.org', () => {
    const queryExecution = new QueryExecution('select ?p where { dbr:Carl_Friedrich_Gauss dbo:birthDate ?p }')
    const _ = require('lodash')

    return queryExecution
      .privateExecute('http://dbpedia.org/sparql', { format: 'application/json' })
      .then((response) => {
        console.log(response)
      })
  })
})
