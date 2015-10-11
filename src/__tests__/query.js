jest.dontMock('../query.js')

describe('Query', () => {
  it('should store the passed query string', () => {
    const Query = require('../query')

    const QUERY_STRING = "query"
    const query = new Query(QUERY_STRING)

    expect(query.queryString).toEqual(QUERY_STRING)
  })
})
