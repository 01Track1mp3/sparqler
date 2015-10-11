import _ from 'lodash';

/**
 *
 * @param {Sparqler} sparqler
 * @param {String} query
 */
class SparqlerQuery {

  constructor(sparqler, query) {
    this.sparqler = sparqler;
    this.rawQuery = query || '';
    this.parameters = {};
  }

  setParameter(key, value) {
    this.parameters[key] = value;

    return this;
  }

  setParameters(parameters) {
    this.parameters = _.extend(this.parameters, parameters);

    return this;
  }

  execute(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Provide a callback function!');
    }

    var query = this.parseParameters(this.rawQuery, this.parameters);
    this.sparqler.execute(query, callback);

    return this;
  }

  parseParameters(query, parameters) {
    _.forEach(parameters, function(value, key) {
      var pattern = new RegExp('\\$' + key, 'g');
      query = query.replace(pattern, value);
    });

    return query;
  }
}

export default SparqlerQuery;
