import _ from 'lodash'

jest.dontMock('../QueryExecution.js')

describe('QueryExecution', () => {
  const QueryExecution = require('../QueryExecution')

  const DEFAULT_QUERY_STRING =
    `
      SELECT * WHERE {
        ?s ?p ?o
      }
    `
  const DEFAULT_ENDPOINT = 'http://example.com/sparql'

  it('should store the queryString initialized with', () => {
    const qe = new QueryExecution(DEFAULT_QUERY_STRING)
    expect(qe.query).toEqual(DEFAULT_QUERY_STRING)
  })

  describe('execute', () => {
    xit('should return a promise with a ResultSet', () => {
      const qe = new QueryExecution(DEFAULT_QUERY_STRING)
      // todo

      qe.execute(DEFAULT_ENDPOINT).then(result => {
        expect(result).toBe(new ResultSet())
      })

    })
  })

  describe('privateExecute', () => {

    it('should include the query as a queryparam', () => {
      const qe = new QueryExecution(DEFAULT_QUERY_STRING)
      const buildQueryMock = jest.genMockFunction().mockImplementation(() => '')
      qe.buildQuery = buildQueryMock

      qe.privateExecute(DEFAULT_ENDPOINT)
      const params = buildQueryMock.mock.calls[0][1]
      expect(params.query).toBe(DEFAULT_QUERY_STRING)
    })

    it('should call privateFetch once', () => {
      const qe = new QueryExecution(DEFAULT_QUERY_STRING)
      const fetchMock = jest.genMockFunction()
      qe.privateFetch = fetchMock

      qe.privateExecute(DEFAULT_ENDPOINT)
      expect(fetchMock.mock.calls.length).toBe(1)
    })

    it('should execute a query and call fetch with the endpoint uri and default values', () => {
      const qe = new QueryExecution(DEFAULT_QUERY_STRING)
      const fetchMock = jest.genMockFunction()
      qe.privateFetch = fetchMock

      qe.privateExecute(DEFAULT_ENDPOINT)
      expect(fetchMock).toBeCalledWith(qe.buildQuery(DEFAULT_ENDPOINT, {...qe.defaultParams, query: qe.query}), qe.options)
    })

    it('should merge additional parameters', () => {
      const qe = new QueryExecution(DEFAULT_QUERY_STRING)
      const fetchMock = jest.genMockFunction()
      qe.privateFetch = fetchMock
      const testParams = {foo: 'bar'}

      qe.privateExecute(DEFAULT_ENDPOINT, testParams)
      expect(fetchMock).toBeCalledWith(qe.buildQuery(DEFAULT_ENDPOINT, {...qe.defaultParams, ...testParams, query: qe.query}), qe.options)
    })

    it('should throw an error if url is too long', () => {
      const query = _.repeat('q', 2000)
      const qe = new QueryExecution(query)
      expect(() => qe.privateExecute(DEFAULT_ENDPOINT)).toThrow(new Error('Url is too long, pls shorten your query'))
    })
  })

  describe('buildQuery', () => {
    it('should build a correct query', () => {
      const qe = new QueryExecution(DEFAULT_QUERY_STRING)
      const params = {
        query: 'select * where { ?s ?p ?o}',
        graph: 'http://example.com'
      }
      const EXPECTED_URL = DEFAULT_ENDPOINT + `?query=${encodeURIComponent(params.query)}&graph=${encodeURIComponent(params.graph)}`
      expect(qe.buildQuery(DEFAULT_ENDPOINT, params)).toEqual(EXPECTED_URL)
    })

    it('should work without querystring', () => {

      const querystring = require('querystring')

      const qe = new QueryExecution(DEFAULT_QUERY_STRING)
      const params = {
        query: 'select * where { ?s ?p ?o}',
        graph: 'http://example.com'
      }
      const EXPECTED_URL = DEFAULT_ENDPOINT + `?query=${encodeURIComponent(params.query)}&graph=${encodeURIComponent(params.graph)}`
      expect(qe.buildQuery(DEFAULT_ENDPOINT, params)).toEqual(EXPECTED_URL)
    })
  })

})
