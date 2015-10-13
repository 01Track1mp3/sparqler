jest.dontMock('../Endpoint.js')
jest.dontMock('lodash')


describe('Endpoint', () => {
  const Endpoint = require('../Endpoint')

  let instance = null
  beforeEach(() => {
    instance = new Endpoint({ url: 'myurl' })
  })

  it('sets configs correctly', () => {
    const endpoint = new Endpoint({
      url: 'myurl',
      graph: 'mygraph',
      prefixes: { 'pre': 'fix' }
    })

    expect(endpoint.configs.url).toEqual('myurl')
    expect(endpoint.configs.graph).toEqual('mygraph')
    expect(endpoint.configs.prefixes).toEqual({ 'pre': 'fix' })
  })

  it('sets url', () => {
    const i = instance.setUrl('myurl')

    expect(i.configs.url).toEqual('myurl')
  })

  it('sets graph', () => {
    const i = instance.setGraph('mygraph')

    expect(i.configs.graph).toEqual('mygraph')
  })

  it('sets prefixes', () => {
    const i = instance.setPrefixes({ 'pre': 'fix' })

    expect(i.configs.prefixes).toEqual({ 'pre': 'fix' })
  })

  it('adds prefixes', () => {
    const i = instance
      .addPrefixes({ 'pre': 'fix' })
      .addPrefixes({ 'foo': 'bar' })

    expect(i.configs.prefixes).toEqual({ 'pre': 'fix', 'foo': 'bar' })
  })

  it('adds a prefix', () => {
    const i = instance.addPrefix('pre', 'fix')

    expect(i.configs.prefixes.pre).toBe('fix')
  })

  it('throws when invalid url', () => {
    expect(() => { new Endpoint({ url: null }) }).toThrow(new Error('Endpoint requires url to be a string.'))
    expect(() => { new Endpoint({ url: '' }) }).toThrow(new Error('Endpoint requires an url.'))
  })

  it('throws when invalid graph', () => {
    expect(() => { new Endpoint({ url: 'myurl', graph: null }) }).toThrow(new Error('Endpoint requires graph to be a string.'))
  })

  it('throws when invalid prefixes', () => {
    expect(() => { new Endpoint({ url: 'myurl', prefixes: null }) }).toThrow(new Error('Endpoint requires prefixes to be an object.'))
  })

  it('throws when query does not support execute method', () => {
    expect(() => { instance.execute(null) }).toThrow(new Error('Endpoint requires a query which supports an execute-method or a query string.'))
  })

  describe('execute', () => {
    it('executes a query', () => {
      const Query = require('../Query')
      const queryString = 'select * where { ?s ?p ?o}'
      const query = new Query(queryString)

      instance
        .setGraph('mygraph')
        .setPrefixes([{ 'foo': 'bar' }])
        .execute(query)

      expect(query.execute).toBeCalledWith('myurl', [{ 'foo':'bar' }], {graph: 'mygraph'})
    })

    it ('call createQuery with passed queryString', () => {
      const queryString = 'select * where { ?s ?p ?o}'
      const Query = require('../Query')

      Endpoint.prototype.createQuery = jest.genMockFunction().mockImplementation(() => new Query(''))
      instance.execute(queryString)
      expect(Endpoint.prototype.createQuery).toBeCalledWith(queryString)
    })

    it('executes a query string', () => {
      const queryString = 'select * where { ?s ?p ?o}'
      const Query = require('../Query')

      let query
      Endpoint.prototype.createQuery = jest.genMockFunction().mockImplementation((aString) => {
        query = new Query(aString)
        return query
      })

      instance
        .setGraph('mygraph')
        .setPrefixes([{ 'foo': 'bar' }])
        .execute(queryString)

      expect(query.execute).toBeCalledWith('myurl', [{ 'foo':'bar' }], {graph: 'mygraph'})
    })

  })

})
