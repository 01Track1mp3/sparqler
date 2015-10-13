jest.dontMock('../ResultSet')

describe('Resultset', () => {
  const ResultSet = require('../ResultSet')

  it('should throw when no object is passed', () => {
    expect(() => { new ResultSet(null) }).toThrow(new Error('ResultSet requires an object as constructor parameter.'))
  })
})
