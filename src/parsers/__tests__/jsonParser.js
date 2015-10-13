jest.dontMock('../jsonParser')
jest.dontMock('lodash')


const ASK_RESPONSE = {
  head: {
    link: [ 'additional info' ]
  },
  boolean: true
}

describe('JSONAskParser', () => {
  const { JSONAskParser } = require('../jsonParser')

  let parsedData = null
  beforeEach(() => {
    const parser = new JSONAskParser(ASK_RESPONSE)
    parsedData = parser.parse()
  })

  it('should return ask further info', () => {
    expect(parsedData.furtherInfo).toEqual(['additional info'])
  })

  it('should return ask boolean', () => {
    expect(parsedData.results).toBe(true)
  })
})


const SELECT_RESPONSE = {
  head: {
    link: [ 'additional info' ],
    vars: [
      'x',
      'hpage',
      'name',
      'mbox',
      'age',
      'blurb',
      'friend'
    ]
  },
  results: {
    bindings: [
      {
        x: { 'type': 'bnode', 'value': 'r1' },
        hpage: { 'type': 'uri', 'value': 'http://work.example.org/alice/' },
        name: {  'type': 'literal', 'value': 'Alice' } ,
  		  mbox: {  'type': 'literal', 'value': '' } ,
        blurb: {
          datatype: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral',
          type: 'literal',
          value: '<p xmlns=\"http://www.w3.org/1999/xhtml\">My name is <b>alice</b></p>'
        }
      },
      {
        x: { "type": "bnode", "value": "r2" },
        hpage: { "type": "uri", "value": "http://work.example.org/bob/" },
        name: { "type": "literal", "value": "Bob", "xml:lang": "en" },
        mbox: { "type": "uri", "value": "mailto:bob@work.example.org" }
      }
    ]
  }
}


describe('defaultTypeTransforms', () => {
  const { defaultTypeTransforms } = require('../jsonParser')

  it('should parse string', () => {
    expect(defaultTypeTransforms['http://www.w3.org/2001/XMLSchema#string']('string'))
      .toBe('string')
  })

  it('should parse integer', () => {
    expect(defaultTypeTransforms['http://www.w3.org/2001/XMLSchema#integer']('12'))
      .toBe(12)
  })

  it('should parse decimal', () => {
    expect(defaultTypeTransforms['http://www.w3.org/2001/XMLSchema#decimal']('3.5'))
      .toBe(3.5)
  })

  it('should parse date', () => {
    const date = defaultTypeTransforms['http://www.w3.org/2001/XMLSchema#date']('1777-04-30')
    expect(date.getFullYear()).toBe(1777)
    expect(date.getMonth()).toBe(3)
    expect(date.getDate()).toBe(30)
  })

  it('should parse datetime', () => {
    const date = defaultTypeTransforms['http://www.w3.org/2001/XMLSchema#dateTime']('2009-02-15 15:16:17')
    expect(date.getFullYear()).toBe(2009)
    expect(date.getMonth()).toBe(1)
    expect(date.getDate()).toBe(15)
    expect(date.getHours()).toBe(15)
    expect(date.getMinutes()).toBe(16)
    expect(date.getSeconds()).toBe(17)
  })
})


describe('JSONSelectParser', () => {
  const { JSONSelectParser } = require('../jsonParser')

  let parser = null
  let parsedData = null
  beforeEach(() => {
    parser = new JSONSelectParser(SELECT_RESPONSE)
  })

  it('should return select vars', () => {
    expect(parser.parse().variables).toEqual(SELECT_RESPONSE.head.vars)
  })

  it('should return further info', () => {
    expect(parser.parse().furtherInfo).toEqual(SELECT_RESPONSE.head.link)
  })

  it('should parse literal solutions', () => {
    const defaultLiteral = { type: 'literal', value: 'abc' }
    const defaultLangLiteral = { type: 'literal', value: 'abc', 'xml:lang': 'de' }
    const intLiteral = { type: 'literal', value: '12', datatype: 'http://www.w3.org/2001/XMLSchema#integer' }
    const decLiteral = { type: 'literal', value: '3.4', datatype: 'http://www.w3.org/2001/XMLSchema#decimal' }

    const resolvedDefaultLiteral = { value: 'abc', language: 'unknown', datatype: 'unknown' }
    const resolvedDefaultLangLiteral = { value: 'abc', language: 'de', datatype: 'unknown' }
    const resolvedIntLiteral = { value: 12, language: 'unknown', datatype: 'http://www.w3.org/2001/XMLSchema#integer' }
    const resolvedDecLiteral = { value: 3.4, language: 'unknown', datatype: 'http://www.w3.org/2001/XMLSchema#decimal' }

    expect(parser.resolveLiteralSolution(defaultLiteral)).toEqual(resolvedDefaultLiteral)
    expect(parser.resolveLiteralSolution(defaultLangLiteral)).toEqual(resolvedDefaultLangLiteral)
    expect(parser.resolveLiteralSolution(intLiteral)).toEqual(resolvedIntLiteral)
    expect(parser.resolveLiteralSolution(decLiteral)).toEqual(resolvedDecLiteral)
  })

  it('should parse uri solution', () => {
    expect(parser.resolveUriSolution({ type: 'uri', value: 'abc'}))
      .toEqual({ value: 'abc', language: 'unknown', datatype: 'uri' })
  })

  it('should resolve literal solution', () => {
    expect(parser.resolveQuerySolution({ type: 'literal', value: 'abc' }))
      .toEqual({ value: 'abc', language: 'unknown', datatype: 'unknown' })
  })

  it('should flatten a binding', () => {
    expect(parser.flattenBinding(SELECT_RESPONSE.results.bindings[0]))
      .toEqual({
        hpage: { value: 'http://work.example.org/alice/', language: 'unknown', datatype: 'uri' },
        name: { value: 'Alice', language: 'unknown', datatype: 'unknown' },
        mbox: { value: '', language: 'unknown', datatype: 'unknown' },
        blurb: {
          datatype: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral',
          language: 'unknown',
          value: '<p xmlns=\"http://www.w3.org/1999/xhtml\">My name is <b>alice</b></p>'
        }
      })
  })

  it('should flatten bindings', () => {
    expect(parser.flattenBindings(SELECT_RESPONSE.results.bindings).length).toBe(2)
  })

  it('should parse response', () => {
    expect(parser.parse().results).toEqual([
      {
        hpage: { value: 'http://work.example.org/alice/', language: 'unknown', datatype: 'uri' },
        name: { value: 'Alice', language: 'unknown', datatype: 'unknown' },
        mbox: { value: '', language: 'unknown', datatype: 'unknown' },
        blurb: {
          datatype: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral',
          language: 'unknown',
          value: '<p xmlns=\"http://www.w3.org/1999/xhtml\">My name is <b>alice</b></p>'
        }
      },
      {
        hpage: { value: 'http://work.example.org/bob/', language: 'unknown', datatype: 'uri' },
        name: { value: 'Bob', language: 'en', datatype: 'unknown' },
        mbox: { value: 'mailto:bob@work.example.org', language: 'unknown', datatype: 'uri' },
      }
    ])
  })
})

describe('JSONParser', () => {
  const { JSONParser, JSONAskParser, JSONSelectParser } = require('../jsonParser')

  it('should parse json string', () => {
    const objectData = (new JSONParser('{"foo": "bar"}')).data

    expect(objectData).toEqual({ foo: 'bar' })
  })

  it('should detect an ask response', () => {
    console.log(JSONParser.isAskResponse(ASK_RESPONSE))
    expect(JSONParser.isAskResponse(ASK_RESPONSE)).toBe(true)
  })

  it('should detect a select response', () => {
    expect(JSONParser.isAskResponse(SELECT_RESPONSE)).toBe(false)
  })

  it('should use ask parser when ask response', () => {
    const parser = new JSONParser(JSON.stringify(ASK_RESPONSE))

    expect(parser._responseParser instanceof JSONAskParser).toBe(true)
  })

  it('should use select parser when select response', () => {
    const parser = new JSONParser(JSON.stringify(SELECT_RESPONSE))

    expect(parser._responseParser instanceof JSONSelectParser).toBe(true)
  })

  it('should pass data correctly to response parser', () => {
    const parser = new JSONParser(JSON.stringify(ASK_RESPONSE))

    expect(parser.data).toBe(parser._responseParser.data)
  })

  it('should parse via response parser', () => {
    const parser = new JSONParser(JSON.stringify(ASK_RESPONSE))
    parser._responseParser = { parse: jest.genMockFunction() }
    parser.parse()

    expect(parser._responseParser.parse.mock.calls.length).toBe(1)
  })
})
