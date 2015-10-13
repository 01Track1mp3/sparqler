import _ from 'lodash'


export default class ResultSet {
  constructor(responseJson) {
    if (!_.isObject(responseJson)) {
      throw new Error('ResultSet requires an object as constructor parameter.')
    }

    this.responseJson = responseJson
  }
}
