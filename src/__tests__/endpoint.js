jest.dontMock('../endpoint.js')

describe('Endpoint', () => {
  it('constructs with correct endpointUrl', () => {
    const Endpoint = require('../endpoint')

    const ENDPOINT_URL = "myendpointurl"
    const endpoint = new Endpoint({ endpointUrl: ENDPOINT_URL })

    expect(endpoint.endpointUrl).toEqual(ENDPOINT_URL)
  })
})
