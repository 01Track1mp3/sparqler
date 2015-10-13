jest.dontMock('../Query.js')

describe('Query', () => {
  const Query = require('../Query')

  it('should throw an exception if no string is passed to the constructor', () => {
    expect(() => { new Query() }).toThrow(new Error('No valid queryString passed to Query constructor'))
    expect(() => { new Query(null) }).toThrow(new Error('No valid queryString passed to Query constructor'))
    expect(() => { new Query(undefined) }).toThrow(new Error('No valid queryString passed to Query constructor'))
    expect(() => { new Query(() => {}) }).toThrow(new Error('No valid queryString passed to Query constructor'))
    expect(() => { new Query({foo: 'bar'}) }).toThrow(new Error('No valid queryString passed to Query constructor'))
  })

  it('should store the passed query string', () => {
    const QUERY_STRING = 'query'
    const query = new Query(QUERY_STRING)

    expect(query.queryString).toEqual(QUERY_STRING)
  })

  it('should replace a parameter after a call to setParameter', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `

    const QUERY_STRING_EXPECTED =
      `
        SELECT * WHERE {
          ?s rdf:type ?o
        }
      `

    const query = new Query(QUERY_STRING)
      .setParameter('p', 'rdf:type')

    expect(query.queryString).toEqual(QUERY_STRING_EXPECTED)
  })

  it('should replace multiple parameters after a call to setParameters', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `

    const QUERY_STRING_EXPECTED =
      `
        SELECT * WHERE {
          ?s rdf:type dbo:Person
        }
      `

    const query = new Query(QUERY_STRING)
      .setParameters({
        p: 'rdf:type',
        o: 'dbo:Person'
      })

    expect(query.queryString).toEqual(QUERY_STRING_EXPECTED)
  })

  it('should replace a parameter with an uri after call to setUri', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `

    const QUERY_STRING_EXPECTED =
      `
        SELECT * WHERE {
          <http://example.com> ?p ?o
        }
      `

    const query = new Query(QUERY_STRING)
      .setUri('s', 'http://example.com')

    expect(query.queryString).toEqual(QUERY_STRING_EXPECTED)
  })

  it('should replace multiple parameters with an uri after call to setUris', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `

    const QUERY_STRING_EXPECTED =
      `
        SELECT * WHERE {
          <http://example.com/foo> ?p <http://example.com/bar>
        }
      `

    const query = new Query(QUERY_STRING)
      .setUris({
        s: 'http://example.com/foo',
        o: 'http://example.com/bar',
      })

    expect(query.queryString).toEqual(QUERY_STRING_EXPECTED)
  })


  it('should set a string literal', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `

    const QUERY_STRING_EXPECTED =
      `
        SELECT * WHERE {
          ?s ?p 'Berlin'
        }
      `

    const query = new Query(QUERY_STRING)
      .setLiteral('o', 'Berlin')

    expect(query.queryString).toEqual(QUERY_STRING_EXPECTED)
  })


  it('should set a string literal with the passed language', () => {
    const Language = require('./../Language')
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `

    const QUERY_STRING_EXPECTED =
      `
        SELECT * WHERE {
          ?s ?p 'Berlin'@en
        }
      `

    const query = new Query(QUERY_STRING)
      .setLiteralWithLanguage('o', 'Berlin', Language.English)

    expect(query.queryString).toEqual(QUERY_STRING_EXPECTED)
  })


  it('should set an int literal', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `
    const QUERY_STRING_EXPECTED =
      `
        SELECT * WHERE {
          ?s ?p 10
        }
      `

    const query = new Query(QUERY_STRING)
      .setLiteral('o', 10)

    expect(query.queryString).toEqual(QUERY_STRING_EXPECTED)
  })


  it('should set a float literal', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `
    const QUERY_STRING_EXPECTED =
      `
        SELECT * WHERE {
          ?s ?p 3.14
        }
      `

    const query = new Query(QUERY_STRING)
      .setLiteral('o', 3.14)

    expect(query.queryString).toEqual(QUERY_STRING_EXPECTED)
  })


  it('should set a boolean literal', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `
    const QUERY_STRING_EXPECTED =
      `
        SELECT * WHERE {
          ?s ?p true
        }
      `

    const query = new Query(QUERY_STRING)
      .setLiteral('o', true)

    expect(query.queryString).toEqual(QUERY_STRING_EXPECTED)
  })


  it('should set literals with different types', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?string .
          ?s ?p ?int .
          ?s ?p ?float .
          ?s ?p ?boolean .
        }
      `
    const QUERY_STRING_EXPECTED =
      `
        SELECT * WHERE {
          ?s ?p 'string' .
          ?s ?p 42 .
          ?s ?p 3.14 .
          ?s ?p false .
        }
      `

    const query = new Query(QUERY_STRING)
      .setLiterals({
        string: 'string',
        int: 42,
        float: 3.14,
        boolean: false
      })

    expect(query.queryString).toEqual(QUERY_STRING_EXPECTED)
  })


  it('should set a literal with a passed datatype', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `
    const QUERY_STRING_EXPECTED =
      `
        SELECT * WHERE {
          ?s ?p 'xyz'^^<http://example.org/ns/userDatatype>
        }
      `

    const query = new Query(QUERY_STRING)
      .setLiteralWithDatatype('o', 'xyz', 'http://example.org/ns/userDatatype')

    expect(query.queryString).toEqual(QUERY_STRING_EXPECTED)
  })


  it('should throw an exception for unsupported literal types', () => {
    expect(() => {new Query('').setLiteral('foo', {})}).toThrow(new Error('Unsupported literal type'))
    expect(() => {new Query('').setLiteral('foo', () => {})}).toThrow(new Error('Unsupported literal type'))
    expect(() => {new Query('').setLiteral('foo', null)}).toThrow(new Error('Unsupported literal type'))
    expect(() => {new Query('').setLiteral('foo', undefined)}).toThrow(new Error('Unsupported literal type'))
  })


  it('should add a prefix', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `
    const EXPECTED ='PREFIX dbo: <http://dbpedia.org/ontology>.'

    const query = new Query(QUERY_STRING)
      .addPrefix('dbo', 'http://dbpedia.org/ontology')

    expect(query.queryString.split('\n')[0]).toEqual(EXPECTED)
  })


  it('should add multiple prefixes', () => {
    const QUERY_STRING =
      `
        SELECT * WHERE {
          ?s ?p ?o
        }
      `
    const EXPECTED_FIRST = 'PREFIX dbo: <http://dbpedia.org/ontology>.'
    const EXPECTED_SECOND = 'PREFIX dbr: <http://dbpedia.org/resource>.'

    const query = new Query(QUERY_STRING)
      .addPrefixes({
        dbo: 'http://dbpedia.org/ontology',
        dbr: 'http://dbpedia.org/resource'
      })

      expect(query.queryString.split('\n')[0]).toEqual(EXPECTED_FIRST)
      expect(query.queryString.split('\n')[1]).toEqual(EXPECTED_SECOND)
  })



  describe('immutability', () => {
    it('setParameter should return a new Query object', () => {
      const query = new Query('')
      const newQuery = query.setParameter('foo', 'bar')
      expect(query).not.toBe(newQuery)
    })

    it('setParameters should return a new Query object', () => {
      const query = new Query('')
      const newQuery = query.setParameters({foo: 'bar'})
      expect(query).not.toBe(newQuery)
    })

    it('setUri should return a new Query object', () => {
      const query = new Query('')
      const newQuery = query.setUri('foo', 'bar')
      expect(query).not.toBe(newQuery)
    })

    it('setUris should return a new Query object', () => {
      const query = new Query('')
      const newQuery = query.setUris({foo: 'bar'})
      expect(query).not.toBe(newQuery)
    })
  })

})
