/**
 * jQuery-csv (jQuery Plugin)
 * version: 0.70 (2012-11-04)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Acknowledgements:
 * The original design and influence to implement this library as a jquery
 * plugin is influenced by jquery-json (http://code.google.com/p/jquery-json/).
 * If you're looking to use native JSON.Stringify but want additional backwards
 * compatibility for browsers that don't support it, I highly recommend you
 * check it out.
 *
 * A special thanks goes out to rwk@acm.org for providing a lot of valuable
 * feedback to the project including the core for the new FSM
 * (Finite State Machine) parsers. If you're looking for a stable TSV parser
 * be sure to take a look at jquery-tsv (http://code.google.com/p/jquery-tsv/).

 * For legal purposes I'll include the "NO WARRANTY EXPRESSED OR IMPLIED.
 * USE AT YOUR OWN RISK.". Which, in 'layman's terms' means, by using this
 * library you are accepting responsibility if it breaks your code.
 *
 * Legal jargon aside, I will do my best to provide a useful and stable core
 * that can effectively be built on.
 *
 * Copyrighted 2012 by Evan Plaice.
 */

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

(function (undefined) {
  'use strict';

  var $;

  // to keep backwards compatibility
  if (typeof jQuery !== 'undefined' && jQuery) {
    $ = jQuery;
  } else {
    $ = {};
  }


  /**
   * jQuery.csv.defaults
   * Encapsulates the method paramater defaults for the CSV plugin module.
   */

  $.csv = {
    defaults: {
      separator:',',
      delimiter:'"',
      headers:true
    },

    hooks: {
      castToScalar: function(value, state) {
        var hasDot = /\./;
        if (isNaN(value)) {
          return value;
        } else {
          if (hasDot.test(value)) {
            return parseFloat(value);
          } else {
            var integer = parseInt(value);
            if(isNaN(integer)) {
              return null;
            } else {
              return integer;
            }
          }
        }
      }
    },

    parsers: {
      parse: function(csv, options) {
        // cache settings
        var separator = options.separator;
        var delimiter = options.delimiter;

        // set initial state if it's missing
        if(!options.state.rowNum) {
          options.state.rowNum = 1;
        }
        if(!options.state.colNum) {
          options.state.colNum = 1;
        }

        // clear initial state
        var data = [];
        var entry = [];
        var state = 0;
        var value = '';
        var exit = false;

        function endOfEntry() {
          // reset the state
          state = 0;
          value = '';

          // if 'start' hasn't been met, don't output
          if(options.start && options.state.rowNum < options.start) {
            // update global state
            entry = [];
            options.state.rowNum++;
            options.state.colNum = 1;
            return;
          }
          
          if(options.onParseEntry === undefined) {
            // onParseEntry hook not set
            data.push(entry);
          } else {
            var hookVal = options.onParseEntry(entry, options.state); // onParseEntry Hook
            // false skips the row, configurable through a hook
            if(hookVal !== false) {
              data.push(hookVal);
            }
          }
          //console.log('entry:' + entry);
          
          // cleanup
          entry = [];

          // if 'end' is met, stop parsing
          if(options.end && options.state.rowNum >= options.end) {
            exit = true;
          }
          
          // update global state
          options.state.rowNum++;
          options.state.colNum = 1;
        }

        function endOfValue() {
          if(options.onParseValue === undefined) {
            // onParseValue hook not set
            entry.push(value);
          } else {
            var hook = options.onParseValue(value, options.state); // onParseValue Hook
            // false skips the row, configurable through a hook
            if(hook !== false) {
              entry.push(hook);
            }
          }
          //console.log('value:' + value);
          // reset the state
          value = '';
          state = 0;
          // update global state
          options.state.colNum++;
        }

        // escape regex-specific control chars
        var escSeparator = RegExp.escape(separator);
        var escDelimiter = RegExp.escape(delimiter);

        // compile the regEx str using the custom delimiter/separator
        var match = /(D|S|\r\n|\n|\r|[^DS\r\n]+)/;
        var matchSrc = match.source;
        matchSrc = matchSrc.replace(/S/g, escSeparator);
        matchSrc = matchSrc.replace(/D/g, escDelimiter);
        match = new RegExp(matchSrc, 'gm');

        // put on your fancy pants...
        // process control chars individually, use look-ahead on non-control chars
        csv.replace(match, function (m0) {
          if(exit) {
            return;
          }
          switch (state) {
            // the start of a value
            case 0:
              // null last value
              if (m0 === separator) {
                value += '';
                endOfValue();
                break;
              }
              // opening delimiter
              if (m0 === delimiter) {
                state = 1;
                break;
              }
              // null last value
              if (/^(\r\n|\n|\r)$/.test(m0)) {
                endOfValue();
                endOfEntry();
                break;
              }
              // un-delimited value
              value += m0;
              state = 3;
              break;

            // delimited input
            case 1:
              // second delimiter? check further
              if (m0 === delimiter) {
                state = 2;
                break;
              }
              // delimited data
              value += m0;
              state = 1;
              break;

            // delimiter found in delimited input
            case 2:
              // escaped delimiter?
              if (m0 === delimiter) {
                value += m0;
                state = 1;
                break;
              }
              // null value
              if (m0 === separator) {
                endOfValue();
                break;
              }
              // end of entry
              if (/^(\r\n|\n|\r)$/.test(m0)) {
                endOfValue();
                endOfEntry();
                break;
              }
              // broken paser?
              throw new Error('CSVDataError: Illegal State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');

            // un-delimited input
            case 3:
              // null last value
              if (m0 === separator) {
                endOfValue();
                break;
              }
              // end of entry
              if (/^(\r\n|\n|\r)$/.test(m0)) {
                endOfValue();
                endOfEntry();
                break;
              }
              if (m0 === delimiter) {
              // non-compliant data
                throw new Error('CSVDataError: Illegal Quote [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
              }
              // broken parser?
              throw new Error('CSVDataError: Illegal Data [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
            default:
              // shenanigans
              throw new Error('CSVDataError: Unknown State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
          }
          //console.log('val:' + m0 + ' state:' + state);
        });

        // submit the last entry
        // ignore null last line
        if(entry.length !== 0) {
          endOfValue();
          endOfEntry();
        }

        return data;
      },

      // a csv-specific line splitter
      splitLines: function(csv, options) {
        // cache settings
        var separator = options.separator;
        var delimiter = options.delimiter;

        // set initial state if it's missing
        if(!options.state.rowNum) {
          options.state.rowNum = 1;
        }

        // clear initial state
        var entries = [];
        var state = 0;
        var entry = '';
        var exit = false;

        function endOfLine() {          
          // reset the state
          state = 0;
          
          // if 'start' hasn't been met, don't output
          if(options.start && options.state.rowNum < options.start) {
            // update global state
            entry = '';
            options.state.rowNum++;
            return;
          }
          
          if(options.onParseEntry === undefined) {
            // onParseEntry hook not set
            entries.push(entry);
          } else {
            var hookVal = options.onParseEntry(entry, options.state); // onParseEntry Hook
            // false skips the row, configurable through a hook
            if(hookVal !== false) {
              entries.push(hookVal);
            }
          }

          // cleanup
          entry = '';

          // if 'end' is met, stop parsing
          if(options.end && options.state.rowNum >= options.end) {
            exit = true;
          }
          
          // update global state
          options.state.rowNum++;
        }

        // escape regex-specific control chars
        var escSeparator = RegExp.escape(separator);
        var escDelimiter = RegExp.escape(delimiter);

        // compile the regEx str using the custom delimiter/separator
        var match = /(D|S|\n|\r|[^DS\r\n]+)/;
        var matchSrc = match.source;
        matchSrc = matchSrc.replace(/S/g, escSeparator);
        matchSrc = matchSrc.replace(/D/g, escDelimiter);
        match = new RegExp(matchSrc, 'gm');

        // put on your fancy pants...
        // process control chars individually, use look-ahead on non-control chars
        csv.replace(match, function (m0) {
          if(exit) {
            return;
          }
          switch (state) {
            // the start of a value/entry
            case 0:
              // null value
              if (m0 === separator) {
                entry += m0;
                state = 0;
                break;
              }
              // opening delimiter
              if (m0 === delimiter) {
                entry += m0;
                state = 1;
                break;
              }
              // end of line
              if (m0 === '\n') {
                endOfLine();
                break;
              }
              // phantom carriage return
              if (/^\r$/.test(m0)) {
                break;
              }
              // un-delimit value
              entry += m0;
              state = 3;
              break;

            // delimited input
            case 1:
              // second delimiter? check further
              if (m0 === delimiter) {
                entry += m0;
                state = 2;
                break;
              }
              // delimited data
              entry += m0;
              state = 1;
              break;

            // delimiter found in delimited input
            case 2:
              // escaped delimiter?
              var prevChar = entry.substr(entry.length - 1);
              if (m0 === delimiter && prevChar === delimiter) {
                entry += m0;
                state = 1;
                break;
              }
              // end of value
              if (m0 === separator) {
                entry += m0;
                state = 0;
                break;
              }
              // end of line
              if (m0 === '\n') {
                endOfLine();
                break;
              }
              // phantom carriage return
              if (m0 === '\r') {
                break;
              }
              // broken paser?
              throw new Error('CSVDataError: Illegal state [Row:' + options.state.rowNum + ']');

            // un-delimited input
            case 3:
              // null value
              if (m0 === separator) {
                entry += m0;
                state = 0;
                break;
              }
              // end of line
              if (m0 === '\n') {
                endOfLine();
                break;
              }
              // phantom carriage return
              if (m0 === '\r') {
                break;
              }
              // non-compliant data
              if (m0 === delimiter) {
                throw new Error('CSVDataError: Illegal quote [Row:' + options.state.rowNum + ']');
              }
              // broken parser?
              throw new Error('CSVDataError: Illegal state [Row:' + options.state.rowNum + ']');
            default:
              // shenanigans
              throw new Error('CSVDataError: Unknown state [Row:' + options.state.rowNum + ']');
          }
          //console.log('val:' + m0 + ' state:' + state);
        });

        // submit the last entry
        // ignore null last line
        if(entry !== '') {
          endOfLine();
        }

        return entries;
      },

      // a csv entry parser
      parseEntry: function(csv, options) {
        // cache settings
        var separator = options.separator;
        var delimiter = options.delimiter;
        
        // set initial state if it's missing
        if(!options.state.rowNum) {
          options.state.rowNum = 1;
        }
        if(!options.state.colNum) {
          options.state.colNum = 1;
        }

        // clear initial state
        var entry = [];
        var state = 0;
        var value = '';

        function endOfValue() {
          if(options.onParseValue === undefined) {
            // onParseValue hook not set
            entry.push(value);
          } else {
            var hook = options.onParseValue(value, options.state); // onParseValue Hook
            // false skips the value, configurable through a hook
            if(hook !== false) {
              entry.push(hook);
            }
          }
          // reset the state
          value = '';
          state = 0;
          // update global state
          options.state.colNum++;
        }

        // checked for a cached regEx first
        if(!options.match) {
          // escape regex-specific control chars
          var escSeparator = RegExp.escape(separator);
          var escDelimiter = RegExp.escape(delimiter);
          
          // compile the regEx str using the custom delimiter/separator
          var match = /(D|S|\n|\r|[^DS\r\n]+)/;
          var matchSrc = match.source;
          matchSrc = matchSrc.replace(/S/g, escSeparator);
          matchSrc = matchSrc.replace(/D/g, escDelimiter);
          options.match = new RegExp(matchSrc, 'gm');
        }

        // put on your fancy pants...
        // process control chars individually, use look-ahead on non-control chars
        csv.replace(options.match, function (m0) {
          switch (state) {
            // the start of a value
            case 0:
              // null last value
              if (m0 === separator) {
                value += '';
                endOfValue();
                break;
              }
              // opening delimiter
              if (m0 === delimiter) {
                state = 1;
                break;
              }
              // skip un-delimited new-lines
              if (m0 === '\n' || m0 === '\r') {
                break;
              }
              // un-delimited value
              value += m0;
              state = 3;
              break;

            // delimited input
            case 1:
              // second delimiter? check further
              if (m0 === delimiter) {
                state = 2;
                break;
              }
              // delimited data
              value += m0;
              state = 1;
              break;

            // delimiter found in delimited input
            case 2:
              // escaped delimiter?
              if (m0 === delimiter) {
                value += m0;
                state = 1;
                break;
              }
              // null value
              if (m0 === separator) {
                endOfValue();
                break;
              }
              // skip un-delimited new-lines
              if (m0 === '\n' || m0 === '\r') {
                break;
              }
              // broken paser?
              throw new Error('CSVDataError: Illegal State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');

            // un-delimited input
            case 3:
              // null last value
              if (m0 === separator) {
                endOfValue();
                break;
              }
              // skip un-delimited new-lines
              if (m0 === '\n' || m0 === '\r') {
                break;
              }
              // non-compliant data
              if (m0 === delimiter) {
                throw new Error('CSVDataError: Illegal Quote [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
              }
              // broken parser?
              throw new Error('CSVDataError: Illegal Data [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
            default:
              // shenanigans
              throw new Error('CSVDataError: Unknown State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
          }
          //console.log('val:' + m0 + ' state:' + state);
        });

        // submit the last value
        endOfValue();

        return entry;
      }
    },

    helpers: {

      /**
       * $.csv.helpers.collectPropertyNames(objectsArray)
       * Collects all unique property names from all passed objects.
       *
       * @param {Array} objects Objects to collect properties from.
       *
       * Returns an array of property names (array will be empty,
       * if objects have no own properties).
       */
      collectPropertyNames: function (objects) {

        var o, propName, props = [];
        for (o in objects) {
          for (propName in objects[o]) {
            if ((objects[o].hasOwnProperty(propName)) &&
                (props.indexOf(propName) < 0) && 
                (typeof objects[o][propName] !== 'function')) {

              props.push(propName);
            }
          }
        }
        return props;
      }
    },

    /**
     * $.csv.toArray(csv)
     * Converts a CSV entry string to a javascript array.
     *
     * @param {Array} csv The string containing the CSV data.
     * @param {Object} [options] An object containing user-defined options.
     * @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
     * @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
     *
     * This method deals with simple CSV strings only. It's useful if you only
     * need to parse a single entry. If you need to parse more than one line,
     * use $.csv2Array instead.
     */
    toArray: function(csv, options, callback) {
      options = (options !== undefined ? options : {});
      var config = {};
      config.callback = ((callback !== undefined && typeof(callback) === 'function') ? callback : false);
      config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
      config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
      var state = (options.state !== undefined ? options.state : {});

      // setup
      options = {
        delimiter: config.delimiter,
        separator: config.separator,
        onParseEntry: options.onParseEntry,
        onParseValue: options.onParseValue,
        state: state
      };

      var entry = $.csv.parsers.parseEntry(csv, options);

      // push the value to a callback if one is defined
      if(!config.callback) {
        return entry;
      } else {
        config.callback('', entry);
      }
    },

    /**
     * $.csv.toArrays(csv)
     * Converts a CSV string to a javascript array.
     *
     * @param {String} csv The string containing the raw CSV data.
     * @param {Object} [options] An object containing user-defined options.
     * @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
     * @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
     *
     * This method deals with multi-line CSV. The breakdown is simple. The first
     * dimension of the array represents the line (or entry/row) while the second
     * dimension contains the values (or values/columns).
     */
    toArrays: function(csv, options, callback) {
      options = (options !== undefined ? options : {});
      var config = {};
      config.callback = ((callback !== undefined && typeof(callback) === 'function') ? callback : false);
      config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
      config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;

      // setup
      var data = [];
      options = {
        delimiter: config.delimiter,
        separator: config.separator,
        onPreParse: options.onPreParse,
        onParseEntry: options.onParseEntry,
        onParseValue: options.onParseValue,
        onPostParse: options.onPostParse,
        start: options.start,
        end: options.end,
        state: {
          rowNum: 1,
          colNum: 1
        }
      };

      // onPreParse hook
      if(options.onPreParse !== undefined) {
        options.onPreParse(csv, options.state);
      }

      // parse the data
      data = $.csv.parsers.parse(csv, options);

      // onPostParse hook
      if(options.onPostParse !== undefined) {
        options.onPostParse(data, options.state);
      }

      // push the value to a callback if one is defined
      if(!config.callback) {
        return data;
      } else {
        config.callback('', data);
      }
    },

    /**
     * $.csv.toObjects(csv)
     * Converts a CSV string to a javascript object.
     * @param {String} csv The string containing the raw CSV data.
     * @param {Object} [options] An object containing user-defined options.
     * @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
     * @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
     * @param {Boolean} [headers] Indicates whether the data contains a header line. Defaults to true.
     *
     * This method deals with multi-line CSV strings. Where the headers line is
     * used as the key for each value per entry.
     */
    toObjects: function(csv, options, callback) {
      options = (options !== undefined ? options : {});
      var config = {};
      config.callback = ((callback !== undefined && typeof(callback) === 'function') ? callback : false);
      config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
      config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
      config.headers = 'headers' in options ? options.headers : $.csv.defaults.headers;
      options.start = 'start' in options ? options.start : 1;
      
      // account for headers
      if(config.headers) {
        options.start++;
      }
      if(options.end && config.headers) {
        options.end++;
      }

      // setup
      var lines = [];
      var data = [];

      options = {
        delimiter: config.delimiter,
        separator: config.separator,
        onPreParse: options.onPreParse,
        onParseEntry: options.onParseEntry,
        onParseValue: options.onParseValue,
        onPostParse: options.onPostParse,
        start: options.start,
        end: options.end,
        state: {
          rowNum: 1,
          colNum: 1
        },
        match: false,
        transform: options.transform
      };

      // fetch the headers
      var headerOptions = {
        delimiter: config.delimiter,
        separator: config.separator,
        start: 1,
        end: 1,
        state: {
          rowNum:1,
          colNum:1
        }
      };

      // onPreParse hook
      if(options.onPreParse !== undefined) {
        options.onPreParse(csv, options.state);
      }

      // parse the csv
      var headerLine = $.csv.parsers.splitLines(csv, headerOptions);
      var headers = $.csv.toArray(headerLine[0], options);

      // fetch the data
      lines = $.csv.parsers.splitLines(csv, options);

      // reset the state for re-use
      options.state.colNum = 1;
      if(headers){
        options.state.rowNum = 2;
      } else {
        options.state.rowNum = 1;
      }
      
      // convert data to objects
      for(var i=0, len=lines.length; i<len; i++) {
        var entry = $.csv.toArray(lines[i], options);
        var object = {};
        for(var j=0; j <headers.length; j++) {
          object[headers[j]] = entry[j];
        }
        if (options.transform !== undefined) {
          data.push(options.transform.call(undefined, object));
        } else {
          data.push(object);
        }
        
        // update row state
        options.state.rowNum++;
      }

      // onPostParse hook
      if(options.onPostParse !== undefined) {
        options.onPostParse(data, options.state);
      }

      // push the value to a callback if one is defined
      if(!config.callback) {
        return data;
      } else {
        config.callback('', data);
      }
    },

     /**
     * $.csv.fromArrays(arrays)
     * Converts a javascript array to a CSV String.
     *
     * @param {Array} arrays An array containing an array of CSV entries.
     * @param {Object} [options] An object containing user-defined options.
     * @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
     * @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
     *
     * This method generates a CSV file from an array of arrays (representing entries).
     */
    fromArrays: function(arrays, options, callback) {
      options = (options !== undefined ? options : {});
      var config = {};
      config.callback = ((callback !== undefined && typeof(callback) === 'function') ? callback : false);
      config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
      config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;

      var output = '',
          line,
          lineValues,
          i, j;

      for (i = 0; i < arrays.length; i++) {
        line = arrays[i];
        lineValues = [];
        for (j = 0; j < line.length; j++) {
          var strValue = (line[j] === undefined || line[j] === null) ? '' : line[j].toString();
          if (strValue.indexOf(config.delimiter) > -1) {
            strValue = strValue.replace(config.delimiter, config.delimiter + config.delimiter);
          }

          var escMatcher = '\n|\r|S|D';
          escMatcher = escMatcher.replace('S', config.separator);
          escMatcher = escMatcher.replace('D', config.delimiter);

          if (strValue.search(escMatcher) > -1) {
            strValue = config.delimiter + strValue + config.delimiter;
          }
          lineValues.push(strValue);
        }
        output += lineValues.join(config.separator) + '\r\n';
      }

      // push the value to a callback if one is defined
      if(!config.callback) {
        return output;
      } else {
        config.callback('', output);
      }
    },

    /**
     * $.csv.fromObjects(objects)
     * Converts a javascript dictionary to a CSV string.
     *
     * @param {Object} objects An array of objects containing the data.
     * @param {Object} [options] An object containing user-defined options.
     * @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
     * @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
     * @param {Character} [sortOrder] Sort order of columns (named after
     *   object properties). Use 'alpha' for alphabetic. Default is 'declare',
     *   which means, that properties will _probably_ appear in order they were
     *   declared for the object. But without any guarantee.
     * @param {Character or Array} [manualOrder] Manually order columns. May be
     * a strin in a same csv format as an output or an array of header names
     * (array items won't be parsed). All the properties, not present in
     * `manualOrder` will be appended to the end in accordance with `sortOrder`
     * option. So the `manualOrder` always takes preference, if present.
     *
     * This method generates a CSV file from an array of objects (name:value pairs).
     * It starts by detecting the headers and adding them as the first line of
     * the CSV file, followed by a structured dump of the data.
     */
    fromObjects: function(objects, options, callback) {
      options = (options !== undefined ? options : {});
      var config = {};
      config.callback = ((callback !== undefined && typeof(callback) === 'function') ? callback : false);
      config.separator = 'separator' in options ? options.separator : $.csv.defaults.separator;
      config.delimiter = 'delimiter' in options ? options.delimiter : $.csv.defaults.delimiter;
      config.headers = 'headers' in options ? options.headers : $.csv.defaults.headers;
      config.sortOrder = 'sortOrder' in options ? options.sortOrder : 'declare';
      config.manualOrder = 'manualOrder' in options ? options.manualOrder : [];
      config.transform = options.transform;

      if (typeof config.manualOrder === 'string') {
        config.manualOrder = $.csv.toArray(config.manualOrder, config);
      }

      if (config.transform !== undefined) {
        var origObjects = objects;
        objects = [];

        var i;
        for (i = 0; i < origObjects.length; i++) {
          objects.push(config.transform.call(undefined, origObjects[i]));
        }
      }

      var props = $.csv.helpers.collectPropertyNames(objects);

      if (config.sortOrder === 'alpha') {
        props.sort();
      } // else {} - nothing to do for 'declare' order

      if (config.manualOrder.length > 0) {

        var propsManual = [].concat(config.manualOrder);
        var p;
        for (p = 0; p < props.length; p++) {
          if (propsManual.indexOf( props[p] ) < 0) {
            propsManual.push( props[p] );
          }
        }
        props = propsManual;
      }

      var o, p, line, output = [], propName;
      if (config.headers) {
        output.push(props);
      }

      for (o = 0; o < objects.length; o++) {
        line = [];
        for (p = 0; p < props.length; p++) {
          propName = props[p];
          if (propName in objects[o] && typeof objects[o][propName] !== 'function') {
            line.push(objects[o][propName]);
          } else {
            line.push('');
          }
        }
        output.push(line);
      }

      // push the value to a callback if one is defined
      return $.csv.fromArrays(output, options, config.callback);
    }
  };

  // Maintenance code to maintain backward-compatibility
  // Will be removed in release 1.0
  $.csvEntry2Array = $.csv.toArray;
  $.csv2Array = $.csv.toArrays;
  $.csv2Dictionary = $.csv.toObjects;

  // CommonJS module is defined
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = $.csv;
  }

}).call( this );

/*! jquery.selectBoxIt - v3.8.1 - 2013-10-17
* http://www.selectboxit.com
* Copyright (c) 2013 Greg Franko; Licensed MIT*/

// Immediately-Invoked Function Expression (IIFE) [Ben Alman Blog Post](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) that calls another IIFE that contains all of the plugin logic.  I used this pattern so that anyone viewing this code would not have to scroll to the bottom of the page to view the local parameters that were passed to the main IIFE.

;(function (selectBoxIt) {

    //ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calls the second IIFE and locally passes in the global jQuery, window, and document objects
    selectBoxIt(window.jQuery, window, document);

}

// Locally passes in `jQuery`, the `window` object, the `document` object, and an `undefined` variable.  The `jQuery`, `window` and `document` objects are passed in locally, to improve performance, since javascript first searches for a variable match within the local variables set before searching the global variables set.  All of the global variables are also passed in locally to be minifier friendly. `undefined` can be passed in locally, because it is not a reserved word in JavaScript.

(function ($, window, document, undefined) {

    // ECMAScript 5 Strict Mode: [John Resig Blog Post](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/)
    "use strict";

    // Calling the jQueryUI Widget Factory Method
    $.widget("selectBox.selectBoxIt", {

        // Plugin version
        VERSION: "3.8.1",

        // These options will be used as defaults
        options: {

            // **showEffect**: Accepts String: "none", "fadeIn", "show", "slideDown", or any of the jQueryUI show effects (i.e. "bounce")
            "showEffect": "none",

            // **showEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
            "showEffectOptions": {},

            // **showEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
            "showEffectSpeed": "medium",

            // **hideEffect**: Accepts String: "none", "fadeOut", "hide", "slideUp", or any of the jQueryUI hide effects (i.e. "explode")
            "hideEffect": "none",

            // **hideEffectOptions**: Accepts an object literal.  All of the available properties are based on the jqueryUI effect options
            "hideEffectOptions": {},

            // **hideEffectSpeed**: Accepts Number (milliseconds) or String: "slow", "medium", or "fast"
            "hideEffectSpeed": "medium",

            // **showFirstOption**: Shows the first dropdown list option within the dropdown list options list
            "showFirstOption": true,

            // **defaultText**: Overrides the text used by the dropdown list selected option to allow a user to specify custom text.  Accepts a String.
            "defaultText": "",

            // **defaultIcon**: Overrides the icon used by the dropdown list selected option to allow a user to specify a custom icon.  Accepts a String (CSS class name(s)).
            "defaultIcon": "",

            // **downArrowIcon**: Overrides the default down arrow used by the dropdown list to allow a user to specify a custom image.  Accepts a String (CSS class name(s)).
            "downArrowIcon": "",

            // **theme**: Provides theming support for Twitter Bootstrap and jQueryUI
            "theme": "default",

            // **keydownOpen**: Opens the dropdown if the up or down key is pressed when the dropdown is focused
            "keydownOpen": true,

            // **isMobile**: Function to determine if a user's browser is a mobile browser
            "isMobile": function() {

                // Adapted from http://www.detectmobilebrowsers.com
                var ua = navigator.userAgent || navigator.vendor || window.opera;

                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);

            },

            // **native**: Triggers the native select box when a user interacts with the drop down
            "native": false,

            // **aggressiveChange**: Will select a drop down item (and trigger a change event) when a user navigates to the item via the keyboard (up and down arrow or search), before a user selects an option with a click or the enter key
            "aggressiveChange": false,

            // **selectWhenHidden: Will allow a user to select an option using the keyboard when the drop down list is hidden and focused
            "selectWhenHidden": true,

            // **viewport**: Allows for a custom domnode used for the viewport. Accepts a selector.  Default is $(window).
            "viewport": $(window),

            // **similarSearch**: Optimizes the search for lists with many similar values (i.e. State lists) by making it easier to navigate through
            "similarSearch": false,

            // **copyAttributes**: HTML attributes that will be copied over to the new drop down
            "copyAttributes": [

                "title",

                "rel"

            ],

            // **copyClasses**: HTML classes that will be copied over to the new drop down.  The value indicates where the classes should be copied.  The default value is 'button', but you can also use 'container' (recommended) or 'none'.
            "copyClasses": "button",

            // **nativeMousedown**: Mimics native firefox drop down behavior by opening the drop down on mousedown and selecting the currently hovered drop down option on mouseup
            "nativeMousedown": false,

            // **customShowHideEvent**: Prevents the drop down from opening on click or mousedown, which allows a user to open/close the drop down with a custom event handler.
            "customShowHideEvent": false,

            // **autoWidth**: Makes sure the width of the drop down is wide enough to fit all of the drop down options
            "autoWidth": true,

            // **html**: Determines whether or not option text is rendered as html or as text
            "html": true,

            // **populate**: Convenience option that accepts JSON data, an array, a single object, or valid HTML string to add options to the drop down list
            "populate": "",

            // **dynamicPositioning**: Determines whether or not the drop down list should fit inside it's viewport
            "dynamicPositioning": true,

            // **hideCurrent**: Determines whether or not the currently selected drop down option is hidden in the list
            "hideCurrent": false

        },

        // Get Themes
        // ----------
        //      Retrieves the active drop down theme and returns the theme object
        "getThemes": function() {

            var self = this,
                theme = $(self.element).attr("data-theme") || "c";

            return {

                // Twitter Bootstrap Theme
                "bootstrap": {

                    "focus": "active",

                    "hover": "",

                    "enabled": "enabled",

                    "disabled": "disabled",

                    "arrow": "caret",

                    "button": "btn",

                    "list": "dropdown-menu",

                    "container": "bootstrap",

                    "open": "open"

                },

                // jQueryUI Theme
                "jqueryui": {

                    "focus": "ui-state-focus",

                    "hover": "ui-state-hover",

                    "enabled": "ui-state-enabled",

                    "disabled": "ui-state-disabled",

                    "arrow": "ui-icon ui-icon-triangle-1-s",

                    "button": "ui-widget ui-state-default",

                    "list": "ui-widget ui-widget-content",

                    "container": "jqueryui",

                    "open": "selectboxit-open"

                },

                // jQuery Mobile Theme
                "jquerymobile": {

                    "focus": "ui-btn-down-" + theme,

                    "hover": "ui-btn-hover-" + theme,

                    "enabled": "ui-enabled",

                    "disabled": "ui-disabled",

                    "arrow": "ui-icon ui-icon-arrow-d ui-icon-shadow",

                    "button": "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + theme,

                    "list": "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + theme,

                    "container": "jquerymobile",

                    "open": "selectboxit-open"

                },

                "default": {

                    "focus": "selectboxit-focus",

                    "hover": "selectboxit-hover",

                    "enabled": "selectboxit-enabled",

                    "disabled": "selectboxit-disabled",

                    "arrow": "selectboxit-default-arrow",

                    "button": "selectboxit-btn",

                    "list": "selectboxit-list",

                    "container": "selectboxit-container",

                    "open": "selectboxit-open"

                }

            };

        },

        // isDeferred
        // ----------
        //      Checks if parameter is a defered object      
        isDeferred: function(def) {
            return $.isPlainObject(def) && def.promise && def.done;
        },

        // _Create
        // -------
        //      Sets the Plugin Instance variables and
        //      constructs the plugin.  Only called once.
        _create: function(internal) {

            var self = this,
                populateOption = self.options["populate"],
                userTheme = self.options["theme"];

            // If the element calling SelectBoxIt is not a select box or is not visible
            if(!self.element.is("select")) {

                // Exits the plugin
                return;

            }

            // Stores a reference to the parent Widget class
            self.widgetProto = $.Widget.prototype;

            // The original select box DOM element
            self.originalElem = self.element[0];

            // The original select box DOM element wrapped in a jQuery object
            self.selectBox = self.element;

            if(self.options["populate"] && self.add && !internal) {

                self.add(populateOption);

            }

            // All of the original select box options
            self.selectItems = self.element.find("option");

            // The first option in the original select box
            self.firstSelectItem = self.selectItems.slice(0, 1);

            // The html document height
            self.documentHeight = $(document).height();

            self.theme = $.isPlainObject(userTheme) ? $.extend({}, self.getThemes()["default"], userTheme) : self.getThemes()[userTheme] ? self.getThemes()[userTheme] : self.getThemes()["default"];

            // The index of the currently selected dropdown list option
            self.currentFocus = 0;

            // Keeps track of which blur events will hide the dropdown list options
            self.blur = true;

             // Array holding all of the original select box options text
            self.textArray = [];

            // Maintains search order in the `search` method
            self.currentIndex = 0;

            // Maintains the current search text in the `search` method
            self.currentText = "";

            // Whether or not the dropdown list opens up or down (depending on how much room is on the page)
            self.flipped = false;

            // If the create method is not called internally by the plugin
            if(!internal) {

                // Saves the original select box `style` attribute within the `selectBoxStyles` plugin instance property
                self.selectBoxStyles = self.selectBox.attr("style");

            }

            // Creates the dropdown elements that will become the dropdown
            // Creates the ul element that will become the dropdown options list
            // Add's all attributes (excluding id, class names, and unselectable properties) to the drop down and drop down items list
            // Hides the original select box and adds the new plugin DOM elements to the page
            // Adds event handlers to the new dropdown list
            self._createDropdownButton()._createUnorderedList()._copyAttributes()._replaceSelectBox()._addClasses(self.theme)._eventHandlers();

            if(self.originalElem.disabled && self.disable) {

                // Disables the dropdown list if the original dropdown list had the `disabled` attribute
                self.disable();

            }

            // If the Aria Accessibility Module has been included
            if(self._ariaAccessibility) {

                // Adds ARIA accessibillity tags to the dropdown list
                self._ariaAccessibility();

            }

            self.isMobile = self.options["isMobile"]();

            if(self._mobile) {

                // Adds mobile support
                self._mobile();

            }

            // If the native option is set to true
            if(self.options["native"]) {

                // Triggers the native select box when a user is interacting with the drop down
                this._applyNativeSelect();

            }

            // Triggers a custom `create` event on the original dropdown list
            self.triggerEvent("create");

            // Maintains chainability
            return self;

        },

        // _Create dropdown button
        // -----------------------
        //      Creates new dropdown and dropdown elements to replace
        //      the original select box with a dropdown list
        _createDropdownButton: function() {

            var self = this,
                originalElemId = self.originalElemId = self.originalElem.id || "",
                originalElemValue = self.originalElemValue = self.originalElem.value || "",
                originalElemName = self.originalElemName = self.originalElem.name || "",
                copyClasses = self.options["copyClasses"],
                selectboxClasses = self.selectBox.attr("class") || "";

            // Creates a dropdown element that contains the dropdown list text value
            self.dropdownText = $("<span/>", {

                // Dynamically sets the dropdown `id` attribute
                "id": originalElemId && originalElemId + "SelectBoxItText",

                "class": "selectboxit-text",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on",

                // Sets the dropdown `text` to equal the original select box default value
                "text": self.firstSelectItem.text()

            }).

            // Sets the HTML5 data attribute on the dropdownText `dropdown` element
            attr("data-val", originalElemValue);

            self.dropdownImageContainer = $("<span/>", {

                "class": "selectboxit-option-icon-container"

            });

            // Creates a dropdown element that contains the dropdown list text value
            self.dropdownImage = $("<i/>", {

                // Dynamically sets the dropdown `id` attribute
                "id": originalElemId && originalElemId + "SelectBoxItDefaultIcon",

                "class": "selectboxit-default-icon",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on"

            });

            // Creates a dropdown to act as the new dropdown list
            self.dropdown = $("<span/>", {

                // Dynamically sets the dropdown `id` attribute
                "id": originalElemId && originalElemId + "SelectBoxIt",

                "class": "selectboxit " + (copyClasses === "button" ? selectboxClasses: "") + " " + (self.selectBox.prop("disabled") ? self.theme["disabled"]: self.theme["enabled"]),

                // Sets the dropdown `name` attribute to be the same name as the original select box
                "name": originalElemName,

                // Sets the dropdown `tabindex` attribute to 0 to allow the dropdown to be focusable
                "tabindex": self.selectBox.attr("tabindex") || "0",

                // IE specific attribute to not allow the element to be selected
                "unselectable": "on"

            }).

            // Appends the default text to the inner dropdown list dropdown element
            append(self.dropdownImageContainer.append(self.dropdownImage)).append(self.dropdownText);

            // Create the dropdown container that will hold all of the dropdown list dom elements
            self.dropdownContainer = $("<span/>", {

                "id": originalElemId && originalElemId + "SelectBoxItContainer",

                "class": 'selectboxit-container ' + self.theme.container + ' ' + (copyClasses === "container" ? selectboxClasses: "")

            }).

            // Appends the inner dropdown list dropdown element to the dropdown list container dropdown element
            append(self.dropdown);

            // Maintains chainability
            return self;

        },

        // _Create Unordered List
        // ----------------------
        //      Creates an unordered list element to hold the
        //        new dropdown list options that directly match
        //        the values of the original select box options
        _createUnorderedList: function() {

            // Storing the context of the widget
            var self = this,

                dataDisabled,

                optgroupClass,

                optgroupElement,

                iconClass,

                iconUrl,

                iconUrlClass,

                iconUrlStyle,

                // Declaring the variable that will hold all of the dropdown list option elements
                currentItem = "",

                originalElemId = self.originalElemId || "",

                // Creates an unordered list element
                createdList = $("<ul/>", {

                    // Sets the unordered list `id` attribute
                    "id": originalElemId && originalElemId + "SelectBoxItOptions",

                    "class": "selectboxit-options",

                    //Sets the unordered list `tabindex` attribute to -1 to prevent the unordered list from being focusable
                    "tabindex": -1

                }),

                currentDataSelectedText,

                currentDataText,

                currentDataSearch,

                currentText,

                currentOption,

                parent;

            // Checks the `showFirstOption` plugin option to determine if the first dropdown list option should be shown in the options list.
            if (!self.options["showFirstOption"]) {

                // Disables the first select box option
                self.selectItems.first().attr("disabled", "disabled");

                // Excludes the first dropdown list option from the options list
                self.selectItems = self.selectBox.find("option").slice(1);

            }

            // Loops through the original select box options list and copies the text of each
            // into new list item elements of the new dropdown list
            self.selectItems.each(function(index) {

                currentOption = $(this);

                optgroupClass = "";

                optgroupElement = "";

                dataDisabled = currentOption.prop("disabled");

                iconClass = currentOption.attr("data-icon") || "";

                iconUrl = currentOption.attr("data-iconurl") || "";

                iconUrlClass = iconUrl ? "selectboxit-option-icon-url": "";

                iconUrlStyle = iconUrl ? 'style="background-image:url(\'' + iconUrl + '\');"': "";

                currentDataSelectedText = currentOption.attr("data-selectedtext");

                currentDataText = currentOption.attr("data-text");

                currentText = currentDataText ? currentDataText: currentOption.text();

                parent = currentOption.parent();

                // If the current option being traversed is within an optgroup

                if(parent.is("optgroup")) {

                    optgroupClass = "selectboxit-optgroup-option";

                    if(currentOption.index() === 0) {

                         optgroupElement = '<span class="selectboxit-optgroup-header ' + parent.first().attr("class") + '"data-disabled="true">' + parent.first().attr("label") + '</span>';

                    }

                }

                currentOption.attr("value", this.value);

                // Uses string concatenation for speed (applies HTML attribute encoding)
                currentItem += optgroupElement + '<li data-id="' + index + '" data-val="' + this.value + '" data-disabled="' + dataDisabled + '" class="' + optgroupClass + " selectboxit-option " + ($(this).attr("class") || "") + '"><a class="selectboxit-option-anchor"><span class="selectboxit-option-icon-container"><i class="selectboxit-option-icon ' + iconClass + ' ' + (iconUrlClass || self.theme["container"]) + '"' + iconUrlStyle + '></i></span>' + (self.options["html"] ? currentText: self.htmlEscape(currentText)) + '</a></li>';

                currentDataSearch = currentOption.attr("data-search");

                // Stores all of the original select box options text inside of an array
                // (Used later in the `searchAlgorithm` method)
                self.textArray[index] = dataDisabled ? "": currentDataSearch ? currentDataSearch: currentText;

                // Checks the original select box option for the `selected` attribute
                if (this.selected) {

                    // Replaces the default text with the selected option text
                    self._setText(self.dropdownText, currentDataSelectedText || currentText);

                    //Set the currently selected option
                    self.currentFocus = index;

                }

            });

            // If the `defaultText` option is being used
            if ((self.options["defaultText"] || self.selectBox.attr("data-text"))) {

                var defaultedText = self.options["defaultText"] || self.selectBox.attr("data-text");

                // Overrides the current dropdown default text with the value the user specifies in the `defaultText` option
                self._setText(self.dropdownText, defaultedText);

                self.options["defaultText"] = defaultedText;

            }

            // Append the list item to the unordered list
            createdList.append(currentItem);

            // Stores the dropdown list options list inside of the `list` instance variable
            self.list = createdList;

            // Append the dropdown list options list to the dropdown container element
            self.dropdownContainer.append(self.list);

            // Stores the individual dropdown list options inside of the `listItems` instance variable
            self.listItems = self.list.children("li");

            self.listAnchors = self.list.find("a");

            // Sets the 'selectboxit-option-first' class name on the first drop down option
            self.listItems.first().addClass("selectboxit-option-first");

            // Sets the 'selectboxit-option-last' class name on the last drop down option
            self.listItems.last().addClass("selectboxit-option-last");

            // Set the disabled CSS class for select box options
            self.list.find("li[data-disabled='true']").not(".optgroupHeader").addClass(self.theme["disabled"]);

            self.dropdownImage.addClass(self.selectBox.attr("data-icon") || self.options["defaultIcon"] || self.listItems.eq(self.currentFocus).find("i").attr("class"));

            self.dropdownImage.attr("style", self.listItems.eq(self.currentFocus).find("i").attr("style"));

            //Maintains chainability
            return self;

        },

        // _Replace Select Box
        // -------------------
        //      Hides the original dropdown list and inserts
        //        the new DOM elements
        _replaceSelectBox: function() {

            var self = this,
                height,
                originalElemId = self.originalElem.id || "",
                size = self.selectBox.attr("data-size"),
                listSize = self.listSize = size === undefined ? "auto" : size === "0" || "size" === "auto" ? "auto" : +size,
                downArrowContainerWidth,
                dropdownImageWidth;

            // Hides the original select box
            self.selectBox.css("display", "none").

            // Adds the new dropdown list to the page directly after the hidden original select box element
            after(self.dropdownContainer);

            self.dropdownContainer.appendTo('body').

            addClass('selectboxit-rendering');

            // The height of the dropdown list
            height = self.dropdown.height();

            // The down arrow element of the dropdown list
            self.downArrow = $("<i/>", {

                // Dynamically sets the dropdown `id` attribute of the dropdown list down arrow
                "id": originalElemId && originalElemId + "SelectBoxItArrow",

                "class": "selectboxit-arrow",

                // IE specific attribute to not allow the dropdown list text to be selected
                "unselectable": "on"

            });

            // The down arrow container element of the dropdown list
            self.downArrowContainer = $("<span/>", {

                // Dynamically sets the dropdown `id` attribute for the down arrow container element
                "id": originalElemId && originalElemId + "SelectBoxItArrowContainer",

                "class": "selectboxit-arrow-container",

                // IE specific attribute to not allow the dropdown list text to be selected
                "unselectable": "on"

            }).

            // Inserts the down arrow element inside of the down arrow container element
            append(self.downArrow);

            // Appends the down arrow element to the dropdown list
            self.dropdown.append(self.downArrowContainer);

            // Adds the `selectboxit-selected` class name to the currently selected drop down option
            self.listItems.removeClass("selectboxit-selected").eq(self.currentFocus).addClass("selectboxit-selected");

            // The full outer width of the down arrow container
            downArrowContainerWidth = self.downArrowContainer.outerWidth(true);

            // The full outer width of the dropdown image
            dropdownImageWidth = self.dropdownImage.outerWidth(true);

            // If the `autoWidth` option is true
            if(self.options["autoWidth"]) {

                // Sets the auto width of the drop down
                self.dropdown.css({ "width": "auto" }).css({

                    "width": self.list.outerWidth(true) + downArrowContainerWidth + dropdownImageWidth

                });

                self.list.css({

                    "min-width": self.dropdown.width()

                });

            }

            // Dynamically adds the `max-width` and `line-height` CSS styles of the dropdown list text element
            self.dropdownText.css({

                "max-width": self.dropdownContainer.outerWidth(true) - (downArrowContainerWidth + dropdownImageWidth)

            });

            // Adds the new dropdown list to the page directly after the hidden original select box element
            self.selectBox.after(self.dropdownContainer);

            self.dropdownContainer.removeClass('selectboxit-rendering');

            if($.type(listSize) === "number") {

                // Stores the new `max-height` for later
                self.maxHeight = self.listAnchors.outerHeight(true) * listSize;

            }

            // Maintains chainability
            return self;

        },

        // _Scroll-To-View
        // ---------------
        //      Updates the dropdown list scrollTop value
        _scrollToView: function(type) {

            var self = this,

                currentOption = self.listItems.eq(self.currentFocus),

                // The current scroll positioning of the dropdown list options list
                listScrollTop = self.list.scrollTop(),

                // The height of the currently selected dropdown list option
                currentItemHeight = currentOption.height(),

                // The relative distance from the currently selected dropdown list option to the the top of the dropdown list options list
                currentTopPosition = currentOption.position().top,

                absCurrentTopPosition = Math.abs(currentTopPosition),

                // The height of the dropdown list option list
                listHeight = self.list.height(),

                currentText;

            // Scrolling logic for a text search
            if (type === "search") {

                // Increases the dropdown list options `scrollTop` if a user is searching for an option
                // below the currently selected option that is not visible
                if (listHeight - currentTopPosition < currentItemHeight) {

                    // The selected option will be shown at the very bottom of the visible options list
                    self.list.scrollTop(listScrollTop + (currentTopPosition - (listHeight - currentItemHeight)));

                }

                // Decreases the dropdown list options `scrollTop` if a user is searching for an option above the currently selected option that is not visible
                else if (currentTopPosition < -1) {

                    self.list.scrollTop(currentTopPosition - currentItemHeight);

                }
            }

            // Scrolling logic for the `up` keyboard navigation
            else if (type === "up") {

                // Decreases the dropdown list option list `scrollTop` if a user is navigating to an element that is not visible
                if (currentTopPosition < -1) {

                    self.list.scrollTop(listScrollTop - absCurrentTopPosition);

                }
            }

            // Scrolling logic for the `down` keyboard navigation
            else if (type === "down") {

                // Increases the dropdown list options `scrollTop` if a user is navigating to an element that is not fully visible
                if (listHeight - currentTopPosition < currentItemHeight) {

                    // Increases the dropdown list options `scrollTop` by the height of the current option item.
                    self.list.scrollTop((listScrollTop + (absCurrentTopPosition - listHeight + currentItemHeight)));

                }
            }

            // Maintains chainability
            return self;

        },

        // _Callback
        // ---------
        //      Call the function passed into the method
        _callbackSupport: function(callback) {

            var self = this;

            // Checks to make sure the parameter passed in is a function
            if ($.isFunction(callback)) {

                // Calls the method passed in as a parameter and sets the current `SelectBoxIt` object that is stored in the jQuery data method as the context(allows for `this` to reference the SelectBoxIt API Methods in the callback function. The `dropdown` DOM element that acts as the new dropdown list is also passed as the only parameter to the callback
                callback.call(self, self.dropdown);

            }

            // Maintains chainability
            return self;

        },

        // _setText
        // --------
        //      Set's the text or html for the drop down
        _setText: function(elem, currentText) {

            var self = this;

            if(self.options["html"]) {

                elem.html(currentText);

            }

            else {

                elem.text(currentText);

            }

            return self;

        },

        // Open
        // ----
        //      Opens the dropdown list options list
        open: function(callback) {

            var self = this,
                showEffect = self.options["showEffect"],
                showEffectSpeed = self.options["showEffectSpeed"],
                showEffectOptions = self.options["showEffectOptions"],
                isNative = self.options["native"],
                isMobile = self.isMobile;

            // If there are no select box options, do not try to open the select box
            if(!self.listItems.length || self.dropdown.hasClass(self.theme["disabled"])) {

                return self;

            }

            // If the new drop down is being used and is not visible
            if((!isNative && !isMobile) && !this.list.is(":visible")) {

                // Triggers a custom "open" event on the original select box
                self.triggerEvent("open");

                if (self._dynamicPositioning && self.options["dynamicPositioning"]) {

                    // Dynamically positions the dropdown list options list
                    self._dynamicPositioning();

                }

                // Uses `no effect`
                if(showEffect === "none") {

                    // Does not require a callback function because this animation will complete before the call to `scrollToView`
                    self.list.show();

                }

                // Uses the jQuery `show` special effect
                else if(showEffect === "show" || showEffect === "slideDown" || showEffect === "fadeIn") {

                    // Requires a callback function to determine when the `show` animation is complete
                    self.list[showEffect](showEffectSpeed);

                }

                // If none of the above options were passed, then a `jqueryUI show effect` is expected
                else {

                    // Allows for custom show effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/show/)
                    self.list.show(showEffect, showEffectOptions, showEffectSpeed);

                }

                self.list.promise().done(function() {

                    // Updates the list `scrollTop` attribute
                    self._scrollToView("search");

                    // Triggers a custom "opened" event when the drop down list is done animating
                    self.triggerEvent("opened");

                });

            }

            // Provide callback function support
            self._callbackSupport(callback);

            // Maintains chainability
            return self;

        },

        // Close
        // -----
        //      Closes the dropdown list options list
        close: function(callback) {

            var self = this,
                hideEffect = self.options["hideEffect"],
                hideEffectSpeed = self.options["hideEffectSpeed"],
                hideEffectOptions = self.options["hideEffectOptions"],
                isNative = self.options["native"],
                isMobile = self.isMobile;

            // If the drop down is being used and is visible
            if((!isNative && !isMobile) && self.list.is(":visible")) {

                // Triggers a custom "close" event on the original select box
                self.triggerEvent("close");

                // Uses `no effect`
                if(hideEffect === "none") {

                    // Does not require a callback function because this animation will complete before the call to `scrollToView`
                    self.list.hide();

                }

                // Uses the jQuery `hide` special effect
                else if(hideEffect === "hide" || hideEffect === "slideUp" || hideEffect === "fadeOut") {

                    self.list[hideEffect](hideEffectSpeed);

                }

                // If none of the above options were passed, then a `jqueryUI hide effect` is expected
                else {

                    // Allows for custom hide effects via the [jQueryUI core effects](http://http://jqueryui.com/demos/hide/)
                    self.list.hide(hideEffect, hideEffectOptions, hideEffectSpeed);

                }

                // After the drop down list is done animating
                self.list.promise().done(function() {

                    // Triggers a custom "closed" event when the drop down list is done animating
                    self.triggerEvent("closed");

                });

            }

            // Provide callback function support
            self._callbackSupport(callback);

            // Maintains chainability
            return self;

        },

        toggle: function() {

            var self = this,
                listIsVisible = self.list.is(":visible");

            if(listIsVisible) {

                self.close();

            }

            else if(!listIsVisible) {

                self.open();

            }

        },

        // _Key Mappings
        // -------------
        //      Object literal holding the string representation of each key code
        _keyMappings: {

            "38": "up",

            "40": "down",

            "13": "enter",

            "8": "backspace",

            "9": "tab",

            "32": "space",

            "27": "esc"

        },

        // _Key Down Methods
        // -----------------
        //      Methods to use when the keydown event is triggered
        _keydownMethods: function() {

            var self = this,
                moveToOption = self.list.is(":visible") || !self.options["keydownOpen"];

            return {

                "down": function() {

                    // If the plugin options allow keyboard navigation
                    if (self.moveDown && moveToOption) {

                        self.moveDown();

                    }

                },

                "up": function() {

                     // If the plugin options allow keyboard navigation
                    if (self.moveUp && moveToOption) {

                        self.moveUp();

                    }

                },

                "enter": function() {

                    var activeElem = self.listItems.eq(self.currentFocus);

                    // Updates the dropdown list value
                    self._update(activeElem);

                    if (activeElem.attr("data-preventclose") !== "true") {

                        // Closes the drop down list options list
                        self.close();

                    }

                    // Triggers the `enter` events on the original select box
                    self.triggerEvent("enter");

                },

                "tab": function() {

                    // Triggers the custom `tab-blur` event on the original select box
                    self.triggerEvent("tab-blur");

                    // Closes the drop down list
                    self.close();

                },

                "backspace": function() {

                    // Triggers the custom `backspace` event on the original select box
                    self.triggerEvent("backspace");

                },

                "esc": function() {

                    // Closes the dropdown options list
                    self.close();

                }

            };

        },


        // _Event Handlers
        // ---------------
        //      Adds event handlers to the new dropdown and the original select box
        _eventHandlers: function() {

            // LOCAL VARIABLES
            var self = this,
                nativeMousedown = self.options["nativeMousedown"],
                customShowHideEvent = self.options["customShowHideEvent"],
                currentDataText,
                currentText,
                focusClass = self.focusClass,
                hoverClass = self.hoverClass,
                openClass = self.openClass;

            // Select Box events
            this.dropdown.on({

                // `click` event with the `selectBoxIt` namespace
                "click.selectBoxIt": function() {

                    // Used to make sure the dropdown becomes focused (fixes IE issue)
                    self.dropdown.trigger("focus", true);

                    // The `click` handler logic will only be applied if the dropdown list is enabled
                    if (!self.originalElem.disabled) {

                        // Triggers the `click` event on the original select box
                        self.triggerEvent("click");

                        if(!nativeMousedown && !customShowHideEvent) {

                            self.toggle();

                        }

                    }

                },

                // `mousedown` event with the `selectBoxIt` namespace
                "mousedown.selectBoxIt": function() {

                    // Stores data in the jQuery `data` method to help determine if the dropdown list gains focus from a click or tabstop.  The mousedown event fires before the focus event.
                    $(this).data("mdown", true);

                    self.triggerEvent("mousedown");

                    if(nativeMousedown && !customShowHideEvent) {

                        self.toggle();

                    }

                },

                // `mouseup` event with the `selectBoxIt` namespace
                "mouseup.selectBoxIt": function() {

                    self.triggerEvent("mouseup");

                },

                // `blur` event with the `selectBoxIt` namespace.  Uses special blur logic to make sure the dropdown list closes correctly
                "blur.selectBoxIt": function() {

                    // If `self.blur` property is true
                    if (self.blur) {

                        // Triggers both the `blur` and `focusout` events on the original select box.
                        // The `focusout` event is also triggered because the event bubbles
                        // This event has to be used when using event delegation (such as the jQuery `delegate` or `on` methods)
                        // Popular open source projects such as Backbone.js utilize event delegation to bind events, so if you are using Backbone.js, use the `focusout` event instead of the `blur` event
                        self.triggerEvent("blur");

                        // Closes the dropdown list options list
                        self.close();

                        $(this).removeClass(focusClass);

                    }

                },

                "focus.selectBoxIt": function(event, internal) {

                    // Stores the data associated with the mousedown event inside of a local variable
                    var mdown = $(this).data("mdown");

                    // Removes the jQuery data associated with the mousedown event
                    $(this).removeData("mdown");

                    // If a mousedown event did not occur and no data was passed to the focus event (this correctly triggers the focus event), then the dropdown list gained focus from a tabstop
                    if (!mdown && !internal) {

                        setTimeout(function() {

                            // Triggers the `tabFocus` custom event on the original select box
                            self.triggerEvent("tab-focus");

                        }, 0);

                    }

                    // Only trigger the `focus` event on the original select box if the dropdown list is hidden (this verifies that only the correct `focus` events are used to trigger the event on the original select box
                    if(!internal) {

                        if(!$(this).hasClass(self.theme["disabled"])) {

                            $(this).addClass(focusClass);

                        }

                        //Triggers the `focus` default event on the original select box
                        self.triggerEvent("focus");

                    }

                },

                // `keydown` event with the `selectBoxIt` namespace.  Catches all user keyboard navigations
                "keydown.selectBoxIt": function(e) {

                    // Stores the `keycode` value in a local variable
                    var currentKey = self._keyMappings[e.keyCode],

                        keydownMethod = self._keydownMethods()[currentKey];

                    if(keydownMethod) {

                        keydownMethod();

                        if(self.options["keydownOpen"] && (currentKey === "up" || currentKey === "down")) {

                            self.open();

                        }

                    }

                    if(keydownMethod && currentKey !== "tab") {

                        e.preventDefault();

                    }

                },

                // `keypress` event with the `selectBoxIt` namespace.  Catches all user keyboard text searches since you can only reliably get character codes using the `keypress` event
                "keypress.selectBoxIt": function(e) {

                    // Sets the current key to the `keyCode` value if `charCode` does not exist.  Used for cross
                    // browser support since IE uses `keyCode` instead of `charCode`.
                    var currentKey = e.charCode || e.keyCode,

                        key = self._keyMappings[e.charCode || e.keyCode],

                        // Converts unicode values to characters
                        alphaNumericKey = String.fromCharCode(currentKey);

                    // If the plugin options allow text searches
                    if (self.search && (!key || (key && key === "space"))) {

                        // Calls `search` and passes the character value of the user's text search
                        self.search(alphaNumericKey, true, true);

                    }

                    if(key === "space") {

                        e.preventDefault();

                    }

                },

                // `mousenter` event with the `selectBoxIt` namespace .The mouseenter JavaScript event is proprietary to Internet Explorer. Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser.
                "mouseenter.selectBoxIt": function() {

                    // Trigger the `mouseenter` event on the original select box
                    self.triggerEvent("mouseenter");

                },

                // `mouseleave` event with the `selectBoxIt` namespace. The mouseleave JavaScript event is proprietary to Internet Explorer. Because of the event's general utility, jQuery simulates this event so that it can be used regardless of browser.
                "mouseleave.selectBoxIt": function() {

                    // Trigger the `mouseleave` event on the original select box
                    self.triggerEvent("mouseleave");

                }

            });

            // Select box options events that set the dropdown list blur logic (decides when the dropdown list gets
            // closed)
            self.list.on({

                // `mouseover` event with the `selectBoxIt` namespace
                "mouseover.selectBoxIt": function() {

                    // Prevents the dropdown list options list from closing
                    self.blur = false;

                },

                // `mouseout` event with the `selectBoxIt` namespace
                "mouseout.selectBoxIt": function() {

                    // Allows the dropdown list options list to close
                    self.blur = true;

                },

                // `focusin` event with the `selectBoxIt` namespace
                "focusin.selectBoxIt": function() {

                    // Prevents the default browser outline border to flicker, which results because of the `blur` event
                    self.dropdown.trigger("focus", true);

                }

            });

            // Select box individual options events bound with the jQuery `delegate` method.  `Delegate` was used because binding indropdownidual events to each list item (since we don't know how many there will be) would decrease performance.  Instead, we bind each event to the unordered list, provide the list item context, and allow the list item events to bubble up (`event bubbling`). This greatly increases page performance because we only have to bind an event to one element instead of x number of elements. Delegates the `click` event with the `selectBoxIt` namespace to the list items
            self.list.on({

                "mousedown.selectBoxIt": function() {

                    self._update($(this));

                    self.triggerEvent("option-click");

                    // If the current drop down option is not disabled
                    if ($(this).attr("data-disabled") === "false" && $(this).attr("data-preventclose") !== "true") {

                        // Closes the drop down list
                        self.close();

                    }

                    setTimeout(function() {

                        self.dropdown.trigger('focus', true);

                    }, 0);

                },

               // Delegates the `focusin` event with the `selectBoxIt` namespace to the list items
               "focusin.selectBoxIt": function() {

                    // Removes the hover class from the previous drop down option
                    self.listItems.not($(this)).removeAttr("data-active");

                    $(this).attr("data-active", "");

                    var listIsHidden = self.list.is(":hidden");

                    if((self.options["searchWhenHidden"] && listIsHidden) || self.options["aggressiveChange"] || (listIsHidden && self.options["selectWhenHidden"])) {

                        self._update($(this));

                    }

                    // Adds the focus CSS class to the currently focused dropdown list option
                   $(this).addClass(focusClass);

                },

                // Delegates the `focus` event with the `selectBoxIt` namespace to the list items
                "mouseup.selectBoxIt": function() {

                    if(nativeMousedown && !customShowHideEvent) {

                        self._update($(this));

                        self.triggerEvent("option-mouseup");

                        // If the current drop down option is not disabled
                        if ($(this).attr("data-disabled") === "false" && $(this).attr("data-preventclose") !== "true") {

                            // Closes the drop down list
                            self.close();

                        }

                    }

                },

                // Delegates the `mouseenter` event with the `selectBoxIt` namespace to the list items
                "mouseenter.selectBoxIt": function() {

                    // If the currently moused over drop down option is not disabled
                    if($(this).attr("data-disabled") === "false") {

                        self.listItems.removeAttr("data-active");

                        $(this).addClass(focusClass).attr("data-active", "");

                        // Sets the dropdown list indropdownidual options back to the default state and sets the focus CSS class on the currently hovered option
                        self.listItems.not($(this)).removeClass(focusClass);

                        $(this).addClass(focusClass);

                        self.currentFocus = +$(this).attr("data-id");

                    }

                },

                // Delegates the `mouseleave` event with the `selectBoxIt` namespace to the list items
                "mouseleave.selectBoxIt": function() {

                    // If the currently moused over drop down option is not disabled
                    if($(this).attr("data-disabled") === "false") {

                        // Removes the focus class from the previous drop down option
                        self.listItems.not($(this)).removeClass(focusClass).removeAttr("data-active");

                        $(this).addClass(focusClass);

                        self.currentFocus = +$(this).attr("data-id");

                    }

                },

                // Delegates the `blur` event with the `selectBoxIt` namespace to the list items
                "blur.selectBoxIt": function() {

                    // Removes the focus CSS class from the previously focused dropdown list option
                    $(this).removeClass(focusClass);

                }

            }, ".selectboxit-option");

            // Select box individual option anchor events bound with the jQuery `delegate` method.  `Delegate` was used because binding indropdownidual events to each list item (since we don't know how many there will be) would decrease performance.  Instead, we bind each event to the unordered list, provide the list item context, and allow the list item events to bubble up (`event bubbling`). This greatly increases page performance because we only have to bind an event to one element instead of x number of elements. Delegates the `click` event with the `selectBoxIt` namespace to the list items
            self.list.on({

                "click.selectBoxIt": function(ev) {

                    // Prevents the internal anchor tag from doing anything funny
                    ev.preventDefault();

                }

            }, "a");

            // Original dropdown list events
            self.selectBox.on({

                // `change` event handler with the `selectBoxIt` namespace
                "change.selectBoxIt, internal-change.selectBoxIt": function(event, internal) {

                    var currentOption,
                        currentDataSelectedText;

                    // If the user called the change method
                    if(!internal) {

                        currentOption = self.list.find('li[data-val="' + self.originalElem.value + '"]');

                        // If there is a dropdown option with the same value as the original select box element
                        if(currentOption.length) {

                            self.listItems.eq(self.currentFocus).removeClass(self.focusClass);

                            self.currentFocus = +currentOption.attr("data-id");

                        }

                    }

                    currentOption = self.listItems.eq(self.currentFocus);

                    currentDataSelectedText = currentOption.attr("data-selectedtext");

                    currentDataText = currentOption.attr("data-text");

                    currentText = currentDataText ?  currentDataText: currentOption.find("a").text();

                    // Sets the new dropdown list text to the value of the current option
                    self._setText(self.dropdownText, currentDataSelectedText || currentText);

                    self.dropdownText.attr("data-val", self.originalElem.value);

                    if(currentOption.find("i").attr("class")) {

                        self.dropdownImage.attr("class", currentOption.find("i").attr("class")).addClass("selectboxit-default-icon");

                        self.dropdownImage.attr("style", currentOption.find("i").attr("style"));
                    }

                    // Triggers a custom changed event on the original select box
                    self.triggerEvent("changed");

                },

                // `disable` event with the `selectBoxIt` namespace
                "disable.selectBoxIt": function() {

                    // Adds the `disabled` CSS class to the new dropdown list to visually show that it is disabled
                    self.dropdown.addClass(self.theme["disabled"]);

                },

                // `enable` event with the `selectBoxIt` namespace
                "enable.selectBoxIt": function() {

                    // Removes the `disabled` CSS class from the new dropdown list to visually show that it is enabled
                    self.dropdown.removeClass(self.theme["disabled"]);

                },

                // `open` event with the `selectBoxIt` namespace
                "open.selectBoxIt": function() {

                    var currentElem = self.list.find("li[data-val='" + self.dropdownText.attr("data-val") + "']"),
                        activeElem;

                    // If no current element can be found, then select the first drop down option
                    if(!currentElem.length) {

                        // Sets the default value of the dropdown list to the first option that is not disabled
                        currentElem = self.listItems.not("[data-disabled=true]").first();

                    }

                    self.currentFocus = +currentElem.attr("data-id");

                    activeElem = self.listItems.eq(self.currentFocus);

                    self.dropdown.addClass(openClass).

                    // Removes the focus class from the dropdown list and adds the library focus class for both the dropdown list and the currently selected dropdown list option
                    removeClass(hoverClass).addClass(focusClass);

                    self.listItems.removeClass(self.selectedClass).

                    removeAttr("data-active").not(activeElem).removeClass(focusClass);

                    activeElem.addClass(self.selectedClass).addClass(focusClass);

                    if(self.options.hideCurrent) {

                        self.listItems.show();

                        activeElem.hide();

                    }

                },

                "close.selectBoxIt": function() {

                    // Removes the open class from the dropdown container
                    self.dropdown.removeClass(openClass);

                },

                "blur.selectBoxIt": function() {

                    self.dropdown.removeClass(focusClass);

                },

                // `mousenter` event with the `selectBoxIt` namespace
                "mouseenter.selectBoxIt": function() {

                    if(!$(this).hasClass(self.theme["disabled"])) {
                        self.dropdown.addClass(hoverClass);
                    }

                },

                // `mouseleave` event with the `selectBoxIt` namespace
                "mouseleave.selectBoxIt": function() {

                    // Removes the hover CSS class on the previously hovered dropdown list option
                    self.dropdown.removeClass(hoverClass);

                },

                // `destroy` event
                "destroy": function(ev) {

                    // Prevents the default action from happening
                    ev.preventDefault();

                    // Prevents the destroy event from propagating
                    ev.stopPropagation();

                }

            });

            // Maintains chainability
            return self;

        },

        // _update
        // -------
        //      Updates the drop down and select box with the current value
        _update: function(elem) {

            var self = this,
                currentDataSelectedText,
                currentDataText,
                currentText,
                defaultText = self.options["defaultText"] || self.selectBox.attr("data-text"),
                currentElem = self.listItems.eq(self.currentFocus);

            if (elem.attr("data-disabled") === "false") {

                currentDataSelectedText = self.listItems.eq(self.currentFocus).attr("data-selectedtext");

                currentDataText = currentElem.attr("data-text");

                currentText = currentDataText ? currentDataText: currentElem.text();

                // If the default text option is set and the current drop down option is not disabled
                if ((defaultText && self.options["html"] ? self.dropdownText.html() === defaultText: self.dropdownText.text() === defaultText) && self.selectBox.val() === elem.attr("data-val")) {

                    self.triggerEvent("change");

                }

                else {

                    // Sets the original dropdown list value and triggers the `change` event on the original select box
                    self.selectBox.val(elem.attr("data-val"));

                    // Sets `currentFocus` to the currently focused dropdown list option.
                    // The unary `+` operator casts the string to a number
                    // [James Padolsey Blog Post](http://james.padolsey.com/javascript/terse-javascript-101-part-2/)
                    self.currentFocus = +elem.attr("data-id");

                    // Triggers the dropdown list `change` event if a value change occurs
                    if (self.originalElem.value !== self.dropdownText.attr("data-val")) {

                        self.triggerEvent("change");

                    }

                }

            }

        },

        // _addClasses
        // -----------
        //      Adds SelectBoxIt CSS classes
        _addClasses: function(obj) {

            var self = this,

                focusClass = self.focusClass = obj.focus,

                hoverClass = self.hoverClass = obj.hover,

                buttonClass = obj.button,

                listClass = obj.list,

                arrowClass = obj.arrow,

                containerClass = obj.container,

                openClass = self.openClass = obj.open;

            self.selectedClass = "selectboxit-selected";

            self.downArrow.addClass(self.selectBox.attr("data-downarrow") || self.options["downArrowIcon"] || arrowClass);

            // Adds the correct container class to the dropdown list
            self.dropdownContainer.addClass(containerClass);

            // Adds the correct class to the dropdown list
            self.dropdown.addClass(buttonClass);

            // Adds the default class to the dropdown list options
            self.list.addClass(listClass);

            // Maintains chainability
            return self;

        },

        // Refresh
        // -------
        //    The dropdown will rebuild itself.  Useful for dynamic content.
        refresh: function(callback, internal) {

            var self = this;

            // Destroys the plugin and then recreates the plugin
            self._destroySelectBoxIt()._create(true);

            if(!internal) {
                self.triggerEvent("refresh");
            }

            self._callbackSupport(callback);

            //Maintains chainability
            return self;

        },

        // HTML Escape
        // -----------
        //      HTML encodes a string
        htmlEscape: function(str) {

            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

        },

        // triggerEvent
        // ------------
        //      Trigger's an external event on the original select box element
        triggerEvent: function(eventName) {

            var self = this,
                // Finds the currently option index
                currentIndex = self.options["showFirstOption"] ? self.currentFocus : ((self.currentFocus - 1) >= 0 ? self.currentFocus: 0);

            // Triggers the custom option-click event on the original select box and passes the select box option
            self.selectBox.trigger(eventName, { "selectbox": self.selectBox, "selectboxOption": self.selectItems.eq(currentIndex), "dropdown": self.dropdown, "dropdownOption": self.listItems.eq(self.currentFocus) });

            // Maintains chainability
            return self;

        },

        // _copyAttributes
        // ---------------
        //      Copies HTML attributes from the original select box to the new drop down 
        _copyAttributes: function() {

            var self = this;

            if(self._addSelectBoxAttributes) {

                self._addSelectBoxAttributes();

            }

            return self;

        },

        // _realOuterWidth
        // ---------------
        //      Retrieves the true outerWidth dimensions of a hidden DOM element
        _realOuterWidth: function(elem) {

            if(elem.is(":visible")) {

                return elem.outerWidth(true);

            }

            var self = this,
                clonedElem = elem.clone(),
                outerWidth;

            clonedElem.css({

                "visibility": "hidden",

                "display": "block",

                "position": "absolute"

            }).appendTo("body");

            outerWidth = clonedElem.outerWidth(true);

            clonedElem.remove();

            return outerWidth;
        }

    });

    // Stores the plugin prototype object in a local variable
    var selectBoxIt = $.selectBox.selectBoxIt.prototype;

    // Add Options Module
    // ==================

    // add
    // ---
    //    Adds drop down options
    //    using JSON data, an array,
    //    a single object, or valid HTML string

    selectBoxIt.add = function(data, callback) {

        this._populate(data, function(data) {

            var self = this,
                dataType = $.type(data),
                value,
                x = 0,
                dataLength,
                elems = [],
                isJSON = self._isJSON(data),
                parsedJSON = isJSON && self._parseJSON(data);

            // If the passed data is a local or JSON array
            if(data && (dataType === "array" || (isJSON && parsedJSON.data && $.type(parsedJSON.data) === "array")) || (dataType === "object" && data.data && $.type(data.data) === "array")) {

                // If the data is JSON
                if(self._isJSON(data)) {

                    // Parses the JSON and stores it in the data local variable
                    data = parsedJSON;

                }

                // If there is an inner `data` property stored in the first level of the JSON array
                if(data.data) {

                    // Set's the data to the inner `data` property
                    data = data.data;

                }

                // Loops through the array
                for(dataLength = data.length; x <= dataLength - 1; x += 1) {

                    // Stores the currently traversed array item in the local `value` variable
                    value = data[x];

                    // If the currently traversed array item is an object literal
                    if($.isPlainObject(value)) {

                        // Adds an option to the elems array
                        elems.push($("<option/>", value));

                    }

                    // If the currently traversed array item is a string
                    else if($.type(value) === "string") {

                        // Adds an option to the elems array
                        elems.push($("<option/>", { text: value, value: value }));

                    }

                }

                // Appends all options to the drop down (with the correct object configurations)
                self.selectBox.append(elems);

            }

            // if the passed data is an html string and not a JSON string
            else if(data && dataType === "string" && !self._isJSON(data)) {

                // Appends the html string options to the original select box
                self.selectBox.append(data);

            }

            else if(data && dataType === "object") {

                // Appends an option to the original select box (with the object configurations)
                self.selectBox.append($("<option/>", data));

            }

            else if(data && self._isJSON(data) && $.isPlainObject(self._parseJSON(data))) {

                // Appends an option to the original select box (with the object configurations)
                self.selectBox.append($("<option/>", self._parseJSON(data)));

            }

            // If the dropdown property exists
            if(self.dropdown) {

                // Rebuilds the dropdown
                self.refresh(function() {

                    // Provide callback function support
                    self._callbackSupport(callback);

                }, true);

            } else {

                // Provide callback function support
                self._callbackSupport(callback);

            }

            // Maintains chainability
            return self;

        });

    };

    // parseJSON
    // ---------
    //      Detects JSON support and parses JSON data
    selectBoxIt._parseJSON = function(data) {

        return (JSON && JSON.parse && JSON.parse(data)) || $.parseJSON(data);

    };

    // isjSON
    // ------
    //    Determines if a string is valid JSON

    selectBoxIt._isJSON = function(data) {

        var self = this,
            json;

        try {

            json = self._parseJSON(data);

            // Valid JSON
            return true;

        } catch (e) {

            // Invalid JSON
            return false;

        }

    };

    // _populate
    // --------
    //    Handles asynchronous and synchronous data
    //    to populate the select box

    selectBoxIt._populate = function(data, callback) {

        var self = this;

        data = $.isFunction(data) ? data.call() : data;

        if(self.isDeferred(data)) {

            data.done(function(returnedData) {

                callback.call(self, returnedData);

            });

        }

        else {

            callback.call(self, data);

        }

        // Maintains chainability
        return self;

    };

    // Accessibility Module
    // ====================

    // _ARIA Accessibility
    // ------------------
    //      Adds ARIA (Accessible Rich Internet Applications)
    //      Accessibility Tags to the Select Box

    selectBoxIt._ariaAccessibility = function() {

        var self = this,
            dropdownLabel = $("label[for='" + self.originalElem.id + "']");

        // Adds `ARIA attributes` to the dropdown list
        self.dropdownContainer.attr({

            // W3C `combobox` description: A presentation of a select; usually similar to a textbox where users can type ahead to select an option.
            "role": "combobox",

            //W3C `aria-autocomplete` description: Indicates whether user input completion suggestions are provided.
            "aria-autocomplete": "list",

            "aria-haspopup": "true",

            // W3C `aria-expanded` description: Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
            "aria-expanded": "false",

            // W3C `aria-owns` description: The value of the aria-owns attribute is a space-separated list of IDREFS that reference one or more elements in the document by ID. The reason for adding aria-owns is to expose a parent/child contextual relationship to assistive technologies that is otherwise impossible to infer from the DOM.
            "aria-owns": self.list[0].id

        });

        self.dropdownText.attr({

            "aria-live": "polite"

        });

        // Dynamically adds `ARIA attributes` if the new dropdown list is enabled or disabled
        self.dropdown.on({

            //Select box custom `disable` event with the `selectBoxIt` namespace
            "disable.selectBoxIt" : function() {

                // W3C `aria-disabled` description: Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
                self.dropdownContainer.attr("aria-disabled", "true");

            },

            // Select box custom `enable` event with the `selectBoxIt` namespace
            "enable.selectBoxIt" : function() {

                // W3C `aria-disabled` description: Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
                self.dropdownContainer.attr("aria-disabled", "false");

            }

        });

        if(dropdownLabel.length) {

            // MDN `aria-labelledby` description:  Indicates the IDs of the elements that are the labels for the object.
            self.dropdownContainer.attr("aria-labelledby", dropdownLabel[0].id);

        }

        // Adds ARIA attributes to the dropdown list options list
        self.list.attr({

            // W3C `listbox` description: A widget that allows the user to select one or more items from a list of choices.
            "role": "listbox",

            // Indicates that the dropdown list options list is currently hidden
            "aria-hidden": "true"

        });

        // Adds `ARIA attributes` to the dropdown list options
        self.listItems.attr({

            // This must be set for each element when the container element role is set to `listbox`
            "role": "option"

        });

        // Dynamically updates the new dropdown list `aria-label` attribute after the original dropdown list value changes
        self.selectBox.on({

            // Custom `open` event with the `selectBoxIt` namespace
            "open.selectBoxIt": function() {

                // Indicates that the dropdown list options list is currently visible
                self.list.attr("aria-hidden", "false");

                // Indicates that the dropdown list is currently expanded
                self.dropdownContainer.attr("aria-expanded", "true");

            },

            // Custom `close` event with the `selectBoxIt` namespace
            "close.selectBoxIt": function() {

                // Indicates that the dropdown list options list is currently hidden
                self.list.attr("aria-hidden", "true");

                // Indicates that the dropdown list is currently collapsed
                self.dropdownContainer.attr("aria-expanded", "false");

            }

        });

        // Maintains chainability
        return self;

    };

    // Copy Attributes Module
    // ======================

    // addSelectBoxAttributes
    // ----------------------
    //      Add's all attributes (excluding id, class names, and the style attribute) from the default select box to the new drop down

    selectBoxIt._addSelectBoxAttributes = function() {

        // Stores the plugin context inside of the self variable
        var self = this;

        // Add's all attributes to the currently traversed drop down option
        self._addAttributes(self.selectBox.prop("attributes"), self.dropdown);

        // Add's all attributes to the drop down items list
        self.selectItems.each(function(iterator) {

            // Add's all attributes to the currently traversed drop down option
            self._addAttributes($(this).prop("attributes"), self.listItems.eq(iterator));

        });

        // Maintains chainability
        return self;

    };

    // addAttributes
    // -------------
    //  Add's attributes to a DOM element
    selectBoxIt._addAttributes = function(arr, elem) {

        // Stores the plugin context inside of the self variable
        var self = this,
            whitelist = self.options["copyAttributes"];

        // If there are array properties
        if(arr.length) {

            // Iterates over all of array properties
            $.each(arr, function(iterator, property) {

                // Get's the property name and property value of each property
                var propName = (property.name).toLowerCase(), propValue = property.value;

                // If the currently traversed property value is not "null", is on the whitelist, or is an HTML 5 data attribute
                if(propValue !== "null" && ($.inArray(propName, whitelist) !== -1 || propName.indexOf("data") !== -1)) {

                    // Set's the currently traversed property on element
                    elem.attr(propName, propValue);

                }

            });

        }

        // Maintains chainability
        return self;

    };
// Destroy Module
// ==============

// Destroy
// -------
//    Removes the plugin from the page

selectBoxIt.destroy = function(callback) {

    // Stores the plugin context inside of the self variable
    var self = this;

    self._destroySelectBoxIt();

    // Calls the jQueryUI Widget Factory destroy method
    self.widgetProto.destroy.call(self);

    // Provides callback function support
    self._callbackSupport(callback);

    // Maintains chainability
    return self;

};

// Internal Destroy Method
// -----------------------
//    Removes the plugin from the page

selectBoxIt._destroySelectBoxIt = function() {

    // Stores the plugin context inside of the self variable
    var self = this;

    // Unbinds all of the dropdown list event handlers with the `selectBoxIt` namespace
    self.dropdown.off(".selectBoxIt");

    // If the original select box has been placed inside of the new drop down container
    if ($.contains(self.dropdownContainer[0], self.originalElem)) {

        // Moves the original select box before the drop down container
        self.dropdownContainer.before(self.selectBox);

    }

    // Remove all of the `selectBoxIt` DOM elements from the page
    self.dropdownContainer.remove();

    // Resets the style attributes for the original select box
    self.selectBox.removeAttr("style").attr("style", self.selectBoxStyles);

    // Triggers the custom `destroy` event on the original select box
    self.triggerEvent("destroy");

    // Maintains chainability
    return self;

};

    // Disable Module
    // ==============

    // Disable
    // -------
    //      Disables the new dropdown list

    selectBoxIt.disable = function(callback) {

        var self = this;

        if(!self.options["disabled"]) {

            // Makes sure the dropdown list is closed
            self.close();

            // Sets the `disabled` attribute on the original select box
            self.selectBox.attr("disabled", "disabled");

            // Makes the dropdown list not focusable by removing the `tabindex` attribute
            self.dropdown.removeAttr("tabindex").

            // Disables styling for enabled state
            removeClass(self.theme["enabled"]).

            // Enabled styling for disabled state
            addClass(self.theme["disabled"]);

            self.setOption("disabled", true);

            // Triggers a `disable` custom event on the original select box
            self.triggerEvent("disable");

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Disable Option
    // --------------
    //      Disables a single drop down option

    selectBoxIt.disableOption = function(index, callback) {

        var self = this, currentSelectBoxOption, hasNextEnabled, hasPreviousEnabled, type = $.type(index);

        // If an index is passed to target an indropdownidual drop down option
        if(type === "number") {

            // Makes sure the dropdown list is closed
            self.close();

            // The select box option being targeted
            currentSelectBoxOption = self.selectBox.find("option").eq(index);

            // Triggers a `disable-option` custom event on the original select box and passes the disabled option
            self.triggerEvent("disable-option");

            // Disables the targeted select box option
            currentSelectBoxOption.attr("disabled", "disabled");

            // Disables the drop down option
            self.listItems.eq(index).attr("data-disabled", "true").

            // Applies disabled styling for the drop down option
            addClass(self.theme["disabled"]);

            // If the currently selected drop down option is the item being disabled
            if(self.currentFocus === index) {

                hasNextEnabled = self.listItems.eq(self.currentFocus).nextAll("li").not("[data-disabled='true']").first().length;

                hasPreviousEnabled = self.listItems.eq(self.currentFocus).prevAll("li").not("[data-disabled='true']").first().length;

                // If there is a currently enabled option beneath the currently selected option
                if(hasNextEnabled) {

                    // Selects the option beneath the currently selected option
                    self.moveDown();

                }

                // If there is a currently enabled option above the currently selected option
                else if(hasPreviousEnabled) {

                    // Selects the option above the currently selected option
                    self.moveUp();

                }

                // If there is not a currently enabled option
                else {

                    // Disables the entire drop down list
                    self.disable();

                }

            }

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // _Is Disabled
    // -----------
    //      Checks the original select box for the
    //    disabled attribute

    selectBoxIt._isDisabled = function(callback) {

        var self = this;

        // If the original select box is disabled
        if (self.originalElem.disabled) {

            // Disables the dropdown list
            self.disable();

        }

        // Maintains chainability
        return self;

    };

    // Dynamic Positioning Module
    // ==========================

    // _Dynamic positioning
    // --------------------
    //      Dynamically positions the dropdown list options list

    selectBoxIt._dynamicPositioning = function() {

        var self = this;

        // If the `size` option is a number
        if($.type(self.listSize) === "number") {

            // Set's the max-height of the drop down list
            self.list.css("max-height", self.maxHeight || "none");

        }

        // If the `size` option is not a number
        else {

            // Returns the x and y coordinates of the dropdown list options list relative to the document
            var listOffsetTop = self.dropdown.offset().top,

                // The height of the dropdown list options list
                listHeight = self.list.data("max-height") || self.list.outerHeight(),

                // The height of the dropdown list DOM element
                selectBoxHeight = self.dropdown.outerHeight(),

                viewport = self.options["viewport"],

                viewportHeight = viewport.height(),

                viewportScrollTop = $.isWindow(viewport.get(0)) ? viewport.scrollTop() : viewport.offset().top,

                topToBottom = (listOffsetTop + selectBoxHeight + listHeight <= viewportHeight + viewportScrollTop),

                bottomReached = !topToBottom;

            if(!self.list.data("max-height")) {

              self.list.data("max-height", self.list.outerHeight());

            }

            // If there is room on the bottom of the viewport to display the drop down options
            if (!bottomReached) {

                self.list.css("max-height", listHeight);

                // Sets custom CSS properties to place the dropdown list options directly below the dropdown list
                self.list.css("top", "auto");

            }

            // If there is room on the top of the viewport
            else if((self.dropdown.offset().top - viewportScrollTop) >= listHeight) {

                self.list.css("max-height", listHeight);

                // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
                self.list.css("top", (self.dropdown.position().top - self.list.outerHeight()));

            }

            // If there is not enough room on the top or the bottom
            else {

                var outsideBottomViewport = Math.abs((listOffsetTop + selectBoxHeight + listHeight) - (viewportHeight + viewportScrollTop)),

                    outsideTopViewport = Math.abs((self.dropdown.offset().top - viewportScrollTop) - listHeight);

                // If there is more room on the bottom
                if(outsideBottomViewport < outsideTopViewport) {

                    self.list.css("max-height", listHeight - outsideBottomViewport - (selectBoxHeight/2));

                    self.list.css("top", "auto");

                }

                // If there is more room on the top
                else {

                    self.list.css("max-height", listHeight - outsideTopViewport - (selectBoxHeight/2));

                    // Sets custom CSS properties to place the dropdown list options directly above the dropdown list
                    self.list.css("top", (self.dropdown.position().top - self.list.outerHeight()));

                }

            }

        }

        // Maintains chainability
        return self;

    };

    // Enable Module
    // =============

    // Enable
    // ------
    //      Enables the new dropdown list

    selectBoxIt.enable = function(callback) {

        var self = this;

        if(self.options["disabled"]) {

            // Triggers a `enable` custom event on the original select box
            self.triggerEvent("enable");

            // Removes the `disabled` attribute from the original dropdown list
            self.selectBox.removeAttr("disabled");

            // Make the dropdown list focusable
            self.dropdown.attr("tabindex", 0).

            // Disable styling for disabled state
            removeClass(self.theme["disabled"]).

            // Enables styling for enabled state
            addClass(self.theme["enabled"]);

            self.setOption("disabled", false);

            // Provide callback function support
            self._callbackSupport(callback);

        }

        // Maintains chainability
        return self;

    };

    // Enable Option
    // -------------
    //      Disables a single drop down option

    selectBoxIt.enableOption = function(index, callback) {

        var self = this, currentSelectBoxOption, currentIndex = 0, hasNextEnabled, hasPreviousEnabled, type = $.type(index);

        // If an index is passed to target an indropdownidual drop down option
        if(type === "number") {

            // The select box option being targeted
            currentSelectBoxOption = self.selectBox.find("option").eq(index);

            // Triggers a `enable-option` custom event on the original select box and passes the enabled option
            self.triggerEvent("enable-option");

            // Disables the targeted select box option
            currentSelectBoxOption.removeAttr("disabled");

            // Disables the drop down option
            self.listItems.eq(index).attr("data-disabled", "false").

            // Applies disabled styling for the drop down option
            removeClass(self.theme["disabled"]);

        }

        // Provides callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Keyboard Navigation Module
    // ==========================

    // Move Down
    // ---------
    //      Handles the down keyboard navigation logic

    selectBoxIt.moveDown = function(callback) {

        var self = this;

        // Increments `currentFocus`, which represents the currently focused list item `id` attribute.
        self.currentFocus += 1;

        // Determines whether the dropdown option the user is trying to go to is currently disabled
        var disabled = self.listItems.eq(self.currentFocus).attr("data-disabled") === "true" ? true: false,

            hasNextEnabled = self.listItems.eq(self.currentFocus).nextAll("li").not("[data-disabled='true']").first().length;

        // If the user has reached the top of the list
        if (self.currentFocus === self.listItems.length) {

            // Does not allow the user to continue to go up the list
            self.currentFocus -= 1;

        }

        // If the option the user is trying to go to is disabled, but there is another enabled option
        else if (disabled && hasNextEnabled) {

            // Blur the previously selected option
            self.listItems.eq(self.currentFocus - 1).blur();

           // Call the `moveDown` method again
            self.moveDown();

            // Exit the method
            return;

        }

        // If the option the user is trying to go to is disabled, but there is not another enabled option
        else if (disabled && !hasNextEnabled) {

            self.currentFocus -= 1;

        }

        // If the user has not reached the bottom of the unordered list
        else {

            // Blurs the previously focused list item
            // The jQuery `end()` method allows you to continue chaining while also using a different selector
            self.listItems.eq(self.currentFocus - 1).blur().end().

            // Focuses the currently focused list item
            eq(self.currentFocus).focusin();

            // Calls `scrollToView` to make sure the `scrollTop` is correctly updated. The `down` user action
            self._scrollToView("down");

            // Triggers the custom `moveDown` event on the original select box
            self.triggerEvent("moveDown");

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Move Up
    // ------
    //      Handles the up keyboard navigation logic
    selectBoxIt.moveUp = function(callback) {

        var self = this;

        // Increments `currentFocus`, which represents the currently focused list item `id` attribute.
        self.currentFocus -= 1;

        // Determines whether the dropdown option the user is trying to go to is currently disabled
        var disabled = self.listItems.eq(self.currentFocus).attr("data-disabled") === "true" ? true: false,

            hasPreviousEnabled = self.listItems.eq(self.currentFocus).prevAll("li").not("[data-disabled='true']").first().length;

        // If the user has reached the top of the list
        if (self.currentFocus === -1) {

            // Does not allow the user to continue to go up the list
            self.currentFocus += 1;

        }

        // If the option the user is trying to go to is disabled and the user is not trying to go up after the user has reached the top of the list
        else if (disabled && hasPreviousEnabled) {

            // Blur the previously selected option
            self.listItems.eq(self.currentFocus + 1).blur();

            // Call the `moveUp` method again
            self.moveUp();

            // Exits the method
            return;

        }

        else if (disabled && !hasPreviousEnabled) {

            self.currentFocus += 1;

        }

        // If the user has not reached the top of the unordered list
        else {

            // Blurs the previously focused list item
            // The jQuery `end()` method allows you to continue chaining while also using a different selector
            self.listItems.eq(this.currentFocus + 1).blur().end().

            // Focuses the currently focused list item
            eq(self.currentFocus).focusin();

            // Calls `scrollToView` to make sure the `scrollTop` is correctly updated. The `down` user action
            self._scrollToView("up");

            // Triggers the custom `moveDown` event on the original select box
            self.triggerEvent("moveUp");

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Keyboard Search Module
    // ======================

    // _Set Current Search Option
    // -------------------------
    //      Sets the currently selected dropdown list search option

    selectBoxIt._setCurrentSearchOption = function(currentOption) {

        var self = this;

        // Does not change the current option if `showFirstOption` is false and the matched search item is the hidden first option.
        // Otherwise, the current option value is updated
        if ((self.options["aggressiveChange"] || self.options["selectWhenHidden"] || self.listItems.eq(currentOption).is(":visible")) && self.listItems.eq(currentOption).data("disabled") !== true) {

            // Calls the `blur` event of the currently selected dropdown list option
            self.listItems.eq(self.currentFocus).blur();

            // Sets `currentIndex` to the currently selected dropdown list option
            self.currentIndex = currentOption;

            // Sets `currentFocus` to the currently selected dropdown list option
            self.currentFocus = currentOption;

            // Focuses the currently selected dropdown list option
            self.listItems.eq(self.currentFocus).focusin();

            // Updates the scrollTop so that the currently selected dropdown list option is visible to the user
            self._scrollToView("search");

            // Triggers the custom `search` event on the original select box
            self.triggerEvent("search");

        }

        // Maintains chainability
        return self;

    };

    // _Search Algorithm
    // -----------------
    //      Uses regular expressions to find text matches
    selectBoxIt._searchAlgorithm = function(currentIndex, alphaNumeric) {

        var self = this,

            // Boolean to determine if a pattern match exists
            matchExists = false,

            // Iteration variable used in the outermost for loop
            x,

            // Iteration variable used in the nested for loop
            y,

            // Variable used to cache the length of the text array (Small enhancement to speed up traversing)
            arrayLength,

            // Variable storing the current search
            currentSearch,

            // Variable storing the textArray property
            textArray = self.textArray,

            // Variable storing the current text property
            currentText = self.currentText;

        // Loops through the text array to find a pattern match
        for (x = currentIndex, arrayLength = textArray.length; x < arrayLength; x += 1) {

            currentSearch = textArray[x];

            // Nested for loop to help search for a pattern match with the currently traversed array item
            for (y = 0; y < arrayLength; y += 1) {

                // Searches for a match
                if (textArray[y].search(alphaNumeric) !== -1) {

                    // `matchExists` is set to true if there is a match
                    matchExists = true;

                    // Exits the nested for loop
                    y = arrayLength;

                }

            } // End nested for loop

            // If a match does not exist
            if (!matchExists) {

                // Sets the current text to the last entered character
                self.currentText = self.currentText.charAt(self.currentText.length - 1).

                // Escapes the regular expression to make sure special characters are seen as literal characters instead of special commands
                replace(/[|()\[{.+*?$\\]/g, "\\$0");

                currentText = self.currentText;

            }

            // Resets the regular expression with the new value of `self.currentText`
            alphaNumeric = new RegExp(currentText, "gi");

            // Searches based on the first letter of the dropdown list options text if the currentText < 3 characters
            if (currentText.length < 3) {

                alphaNumeric = new RegExp(currentText.charAt(0), "gi");

                // If there is a match based on the first character
                if ((currentSearch.charAt(0).search(alphaNumeric) !== -1)) {

                    // Sets properties of that dropdown list option to make it the currently selected option
                    self._setCurrentSearchOption(x);

                    if((currentSearch.substring(0, currentText.length).toLowerCase() !== currentText.toLowerCase()) || self.options["similarSearch"]) {

                        // Increments the current index by one
                        self.currentIndex += 1;

                    }

                    // Exits the search
                    return false;

                }

            }

            // If `self.currentText` > 1 character
            else {

                // If there is a match based on the entire string
                if ((currentSearch.search(alphaNumeric) !== -1)) {

                    // Sets properties of that dropdown list option to make it the currently selected option
                    self._setCurrentSearchOption(x);

                    // Exits the search
                    return false;

                }

            }

            // If the current text search is an exact match
            if (currentSearch.toLowerCase() === self.currentText.toLowerCase()) {

                // Sets properties of that dropdown list option to make it the currently selected option
                self._setCurrentSearchOption(x);

                // Resets the current text search to a blank string to start fresh again
                self.currentText = "";

                // Exits the search
                return false;

            }

        }

       // Returns true if there is not a match at all
        return true;

    };

    // Search
    // ------
    //      Calls searchAlgorithm()
    selectBoxIt.search = function(alphaNumericKey, callback, rememberPreviousSearch) {

        var self = this;

        // If the search method is being called internally by the plugin, and not externally as a method by a user
        if (rememberPreviousSearch) {

            // Continued search with history from past searches.  Properly escapes the regular expression
            self.currentText += alphaNumericKey.replace(/[|()\[{.+*?$\\]/g, "\\$0");

        }

        else {

            // Brand new search.  Properly escapes the regular expression
            self.currentText = alphaNumericKey.replace(/[|()\[{.+*?$\\]/g, "\\$0");

        }

        // Searches globally
        var searchResults = self._searchAlgorithm(self.currentIndex, new RegExp(self.currentText, "gi"));

        // Searches the list again if a match is not found.  This is needed, because the first search started at the array indece of the currently selected dropdown list option, and does not search the options before the current array indece.
        // If there are many similar dropdown list options, starting the search at the indece of the currently selected dropdown list option is needed to properly traverse the text array.
        if (searchResults) {

            // Searches the dropdown list values starting from the beginning of the text array
            self._searchAlgorithm(0, self.currentText);

        }

        // Provide callback function support
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Mobile Module
    // =============

    // Set Mobile Text
    // ---------------
    //      Updates the text of the drop down
    selectBoxIt._updateMobileText = function() {

        var self = this,
            currentOption,
            currentDataText,
            currentText;

        currentOption = self.selectBox.find("option").filter(":selected");

        currentDataText = currentOption.attr("data-text");

        currentText = currentDataText ? currentDataText: currentOption.text();

        // Sets the new dropdown list text to the value of the original dropdown list
        self._setText(self.dropdownText, currentText);

        if(self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")) {

           self.dropdownImage.attr("class", self.list.find('li[data-val="' + currentOption.val() + '"]').find("i").attr("class")).addClass("selectboxit-default-icon");

        }

    };

    // Apply Native Select
    // -------------------
    //      Applies the original select box directly over the new drop down

    selectBoxIt._applyNativeSelect = function() {

        // Stores the plugin context inside of the self variable
        var self = this;

        // Appends the native select box to the drop down (allows for relative positioning using the position() method)
        self.dropdownContainer.append(self.selectBox);

        self.dropdown.attr("tabindex", "-1");

        // Positions the original select box directly over top the new dropdown list using position absolute and "hides" the original select box using an opacity of 0.  This allows the mobile browser "wheel" interface for better usability.
        self.selectBox.css({

            "display": "block",

            "visibility": "visible",

            "width": self._realOuterWidth(self.dropdown),

            "height": self.dropdown.outerHeight(),

            "opacity": "0",

            "position": "absolute",

            "top": "0",

            "left": "0",

            "cursor": "pointer",

            "z-index": "999999",

            "margin": self.dropdown.css("margin"),

            "padding": "0",

            "-webkit-appearance": "menulist-button"

        });

        if(self.originalElem.disabled) {

            self.triggerEvent("disable");

        }

        return this;

    };

    // Mobile Events
    // -------------
    //      Listens to mobile-specific events
    selectBoxIt._mobileEvents = function() {

        var self = this;

        self.selectBox.on({

            "changed.selectBoxIt": function() {

                self.hasChanged = true;

                self._updateMobileText();

                // Triggers the `option-click` event on mobile
                self.triggerEvent("option-click");

            },

            "mousedown.selectBoxIt": function() {

                // If the select box has not been changed, the defaultText option is being used
                if(!self.hasChanged && self.options.defaultText && !self.originalElem.disabled) {

                    self._updateMobileText();

                    self.triggerEvent("option-click");

                }

            },

            "enable.selectBoxIt": function() {

                // Moves SelectBoxIt onto the page
                self.selectBox.removeClass('selectboxit-rendering');

            },

            "disable.selectBoxIt": function() {

                // Moves SelectBoxIt off the page
                self.selectBox.addClass('selectboxit-rendering');

            }

        });

    };

    // Mobile
    // ------
    //      Applies the native "wheel" interface when a mobile user is interacting with the dropdown

    selectBoxIt._mobile = function(callback) {

        // Stores the plugin context inside of the self variable
        var self = this;

            if(self.isMobile) {

                self._applyNativeSelect();

                self._mobileEvents();

            }

            // Maintains chainability
            return this;

    };

    // Remove Options Module
    // =====================

    // remove
    // ------
    //    Removes drop down list options
    //    using an index

    selectBoxIt.remove = function(indexes, callback) {

        var self = this,
            dataType = $.type(indexes),
            value,
            x = 0,
            dataLength,
            elems = "";

        // If an array is passed in
        if(dataType === "array") {

            // Loops through the array
            for(dataLength = indexes.length; x <= dataLength - 1; x += 1) {

                // Stores the currently traversed array item in the local `value` variable
                value = indexes[x];

                // If the currently traversed array item is an object literal
                if($.type(value) === "number") {

                    if(elems.length) {

                        // Adds an element to the removal string
                        elems += ", option:eq(" + value + ")";

                    }

                    else {

                        // Adds an element to the removal string
                        elems += "option:eq(" + value + ")";

                    }

                }

            }

            // Removes all of the appropriate options from the select box
            self.selectBox.find(elems).remove();

        }

        // If a number is passed in
        else if(dataType === "number") {

            self.selectBox.find("option").eq(indexes).remove();

        }

        // If anything besides a number or array is passed in
        else {

            // Removes all of the options from the original select box
            self.selectBox.find("option").remove();

        }

        // If the dropdown property exists
        if(self.dropdown) {

            // Rebuilds the dropdown
            self.refresh(function() {

                // Provide callback function support
                self._callbackSupport(callback);

            }, true);

        } else {

            // Provide callback function support
            self._callbackSupport(callback);

        }

        // Maintains chainability
        return self;

    };

    // Select Option Module
    // ====================

    // Select Option
    // -------------
    //      Programatically selects a drop down option by either index or value

    selectBoxIt.selectOption = function(val, callback) {

        // Stores the plugin context inside of the self variable
        var self = this,
            type = $.type(val);

        // Makes sure the passed in position is a number
        if(type === "number") {

            // Set's the original select box value and triggers the change event (which SelectBoxIt listens for)
            self.selectBox.val(self.selectItems.eq(val).val()).change();

        }

        else if(type === "string") {

            // Set's the original select box value and triggers the change event (which SelectBoxIt listens for)
            self.selectBox.val(val).change();

        }

        // Calls the callback function
        self._callbackSupport(callback);

        // Maintains chainability
        return self;

    };

    // Set Option Module
    // =================

    // Set Option
    // ----------
    //      Accepts an string key, a value, and a callback function to replace a single
    //      property of the plugin options object

    selectBoxIt.setOption = function(key, value, callback) {

        var self = this;

        //Makes sure a string is passed in
        if($.type(key) === "string") {

            // Sets the plugin option to the new value provided by the user
            self.options[key] = value;

        }

        // Rebuilds the dropdown
        self.refresh(function() {

            // Provide callback function support
            self._callbackSupport(callback);

        }, true);

        // Maintains chainability
        return self;

    };

    // Set Options Module
    // ==================

    // Set Options
    // ----------
    //      Accepts an object to replace plugin options
    //      properties of the plugin options object

    selectBoxIt.setOptions = function(newOptions, callback) {

        var self = this;

        // If the passed in parameter is an object literal
        if($.isPlainObject(newOptions)) {

            self.options = $.extend({}, self.options, newOptions);

        }

        // Rebuilds the dropdown
        self.refresh(function() {

            // Provide callback function support
            self._callbackSupport(callback);

        }, true);

        // Maintains chainability
        return self;

    };

    // Wait Module
    // ===========

    // Wait
    // ----
    //    Delays execution by the amount of time
    //    specified by the parameter

    selectBoxIt.wait = function(time, callback) {

        var self = this;

        self.widgetProto._delay.call(self, callback, time);

        // Maintains chainability
        return self;

    };
})); // End of all modules
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function aContainsB (a, b) {
    return a.indexOf(b) >= 0;
}

$( document ).ready(function() {
    
    //$('#branch-of-service').change(function(){
    //    $('#job-code').val('');
    //   $('#job-code').prop('disabled',false).removeClass('disabled-input');
    //   $('label[for="job-code"]').removeClass('disabled-input');
    //
    //    if($(this).val() === "Air Force") {
    //        hints = ["2T1X1 Vehicle Operations","11AX Airlift Pilot","11BX Bomber Pilot","11EX Experimental Test Pilot","11FX Fighter Pilot","11GX Generalist Pilot","11HX Helicopter Pilot","11KX Trainer Pilot","11RX Reconnaissance/Surveillance/Electronic Warfare Pilot","11SX Special Operations Pilot","11TX Tanker Pilot","12AX Airlift Navigator","12BX Bomber Navigator","12EX Experimental Test Navigator","12FX Fighter Navigator","12GX Generalist Navigator","12KX Trainer Navigator","12RX Reconnaissance/Surveillance/Electronic Warfare Navigator","12SX Special Operations Navigator","12TX Tanker Navigator","13AX Astronaut","13BX Air Battle Manager","13DX Control and Recovery","13MX Airfield Operation","13SX Space & Missile Operations","14NX Intelligence","15WX Weather","16FX Regional Affairs Strategist","16GX Air Force Operations Staff Officer","16PX Political-Military Affairs Strategist","16RX Planning and Programming","21AX Aircraft Maintenance","21BX Maintenance","21MX Munitions and Missile Maintenance","21RX Logistics Readiness Officer (LRO)","31PX Security Forces","32EX Civil Engineer","33SX Communications & Information","34MX Services","35BX Band","35PX Public Affairs","36MX Mission Support","36PX Personnel","38MX Manpower Field","41AX Health Services Administrator","42BX Physical Therapist","42EX Optometrist","42FX Podiatrist","42GX Physician Assistant","42NX Audiology/Speech Pathologist","42PX Clinical Psychologist","42SX Clinical Social Worker","42TX Occupational Therapist Biomedical Specialists","43AX Aerospace & Operational Physiologist","43BX Biomedical Scientist","43DX Dietitian","43EX Bioenvironmental Engineer","43HX Public Health","43MX Medical Entomologist","43PX Pharmacist","43TX Biomedical Laboratory","43VX Veterinary Clinician","43YX Health Physicist","44AX Chief, Hospital/Clinic Services","44DX Pathologist","44EX Emergency Services Physician","44FX Family Physician","44GX General Practice Physician","44HX Nuclear Medicine Physician","44JX Clinical Geneticist","44KX Pediatrician","44MX Internist","44NX Neurologist","44PX Psychiatrist","44RX Diagnostic Radiologist","44SX Dermatologist","44TX Radiotherapist","44YX Critical Care Medicine","44ZX Allergist","45AX Anesthesiologist","45BX Orthopedic Surgeon","45EX Ophthalmologist","45GX OB/GYN","45NX Otorhinolaryngologist","45PX Physical Medicine Physician","45SX Surgeon","45UX Urologist","46AX Nurse Administrator","46FX Flight Nurse","46GX Nurse-Midwife","46MX Nurse Anesthetist","46NX Clinical Nurse","46PX Mental Health Nurse","46SX Operating Room Nurse","47BX Orthodontist","47DX Oral and Maxillofacial Pathologist","47EX Endodontist","47GX Dentist","47HX Periodontist","47KX Pediatric Dentist","47PX Prosthodontist","47SX Oral and Maxillofacial Surgeon","48AX Aerospace Medicine Specialist","48EX Occupational Medicine Specialist","48FX Family Practice Specialist","48GX Aerospace Medicine Physician","48PX Preventive Medicine Specialist","51JX Judge Advocate","52RX Chaplain","61SX Scientist","62EX Developmental Engineer","63AX Acquisition Manager","64PX Contracting","65AX Audit","65FX Financial Management","65WX Cost Analysis","71SX Special Investigator","80C0 Commander, Cadet Squadron, USAFA","81C0 Training Commander, OTS","81T0 Instructor","82A0 Academic Program Manager","83R0 Recruiting Service","84H0 Historian","85G0 USAF Honor Guard","86M0 Operations Management","86P0 Command and Control","87G0 Installation Inspector General","88A0 Aide-de-Camp","88PO Protocol","8A100 Career Assistance Adviser","8A200 Enlisted Aide","8B000 Military Training Instructor","8B100 Military Training Leader","8B200 Academy Military Training NCO","8C000 Family Support Center","8D000 Linguist Debriefer/Interrogator","8E+00 Research and Development Technician","8F000 First Sergeant","8G000 USAF Honor Guard","8J000 Correctional Custody Supervisor","8M000 Postal","8P000 Courier","8P100 Defense Attache","8R000 Recruiter","8S0X0 Missile Facility Manager","8S100 Sensor Operator","8T000 Professional Military Education Instructor","6C0X1 Contracting","6F0X1 Financial Management and Comptroller","5J0X1 Paralegal","5R0X1 Chaplain Assistant","2A0X1 Avionics Test Station and Components","2A3X1 A-10, F-15 and U-2 Avionics Systems","2A3X2 F-16, F-117, RQ-1 and CV-22 Avionics Systems","2A3X3 Tactical Aircraft Maintenance","2A5X1 Aerospace Maintenance","2A5X2 Helicopter Maintenance","2A5X3 Integrated Avionics Systems","2A6X1 Aerospace Propulsion","2A6X2 Aerospace Ground Equipment","2A6X3 Aircrew Egress Systems","2A6X4 Aircraft Fuel Systems","2A6X5 Aircraft Hydraulic Systems","2A6X6 Aircraft Electrical and Environmental Systems","2A7X1 Aircraft Metals Technology","2A7X2 Nondestructive Inspection","2A7X3 Aircraft Structural Maintenance","2F0X1 Fuels","2G0X1 Logistics Plans","2M0X1 Missile and Space Systems Electronic Maintenance","2M0X2 Missile and Space Systems Maintenance","2M0X3 Missile and Space Facilities","2P0X1 Precision Measurement Equipment Laboratory","2R0X1 Maintenance Management Analysis","2R1X1 Maintenance Management Production","2S0X1 Supply Management","2S0X2 Supply Systems Analysis","2T0X1 Traffic Management","2T2X1 Air Transportation","2T3X1 Vehicle and Vehicular Equipment Maintenance","2T3X2 Special Vehicle Maintenance","2T3X5 Vehicle Body Maintenance","2T3X7 Vehicle Management and Analysis","2W0X1 Munitions Systems","2W1X1 Aircraft Armament Systems","2W2X1 Nuclear Weapons","4A0X1 Health Services Management","4A1X1 Medical Materiel","4A2X1 Biomedical Equipment","4C0X1 Mental Health Service","4D0X1 Diet Therapy","4E0X1 Public Health","4H0X1 Cardiopulmonary Laboratory","4J0X2 Physical Medicine","4M0X1 Aerospace Physiology","4N0X1 Aerospace Medical Service","4N1X1 Surgical Service","4P0X1 Pharmacy","4R0X1 Diagnostic Imaging","4T0X1 Medical Laboratory","4T0X2 Histopathology","4T0X3 Cytotechnology","4V0X1 Optometry","4Y0X1 Dental Assistant","4Y0X2 Dental Laboratory","1A0X1 In-Flight Refueling","1A1X1 Flight Engineer","1A2X1 Aircraft Loadmaster","1A3X1 Airborne Mission Systems","1A4X1 Airborne Battle Management Systems","1A6X1 Flight Attendant","1A7X1 Aerial Gunner","1A8X1 Airborne Cryptologic Linguist","1C0X2 Aviation Resource Management","1C1X1 Air Traffic Control","1C2X1 Combat Control","1C3X1 Command Post","1C4X1 Tactical Air Command and Control","1C5X1 Aerospace Control and Warning Systems","1C6X1 Space Systems Operations","1C7X1 Airfield Management","1N0X1 Operations Intelligence","1N1X1 Imagery Analysis","1N2X1 Communication Signals Intelligence Production","1N3XX Cryptologic Linguist","1N4X1 Network Intelligence Analysis","1N5X1 Electronic Signals Intelligence Exploitation","1N6X1 Electronic System Security Assessment","1P0X1 Aircrew Equipment","1T0X1 Survival, Evasion, Resistance and Escape Operations","1T2X1 Pararescue","1S0X1 Safety","1U0X1 Unmanned Aerospace System (UAS) Sensor Operator","1W0X1 Weather","1W0X2 Special Operations Weather (Combat Weather)","7S0X1 Special Investigations","3D0X1 Knowledge Operations Management","3D0X2 Cyber Systems Operations","3D0X3 Cyber Surety","3D0X4 Computer Systems Programming","3D1X1 Client Systems","3D1X2 Cyber Transport","3D1X3 RF Transmission Systems","3D1X4 Spectrum Operations","3D1X5 Radar","3D1X6 Airfield Systems","3D1X7 Cable and Antenna Systems","3H0X1 Historian","3M0X1 Services","3N0X1 Public Affairs","3N0X2 Radio and Television Broadcasting","3N1X1 Regional Band","3N2X1 Premier Band","3P0X1 Security Forces","3E0X1 Electrical Systems","3E0X2 Electrical Power Production","3E1X1 Heating, Ventilation, Air Conditioning and Refrigeration","3E2X1 Pavements and Construction Equipment","3E3X1 Structural","3E4X2 Water and Fuels Systems Maintenance","3E4X3 Pest Management","3E5X1 Engineering","3E6X1 Operations Management","3E7X1 Fire Protection","3E8X1 Explosive Ordnance Disposal","3E9X1 Emergency Management","3S0X1 Personnel","3S1X1 Military Equal Opportunity","3S2X1 Education and Training","3S3X1 Manpower","3V0X0 Visual Information Services","3V0X1 Visual Information","3V0X2 Still Photography","3V0X3 Visual Information Production-Documentation","4B0X1 Bioenvironmental Engineer"];
    //    }
    //    if($(this).val() === "Army") {
    //        hints = ["88M Motor Transport Operator","88O Transportation Officer","88Z Transportation Senior Sergeant","15R AH-64 Attack Helicopter Repairer","15X AH-64A Armament and Electrical System Repairer","15Y AH-64D Armament/Electrical/Avionics Repairer","14O Air Defense Artillery Officer","14Z Air Defense Artillery Senior Sergeant","94D Air Traffic Control Equipment Repairer","15Q Air Traffic Control Operator","15K Aircraft Components Repair Supervisor","15F Aircraft Electrician","15Z Aircraft Maintenance Senior Sergeant","15H Aircraft Pneudraulics Repairer","15B Aircraft Powerplant Repairer","15D Aircraft Powertrain Repairer","15G Aircraft Structural Repairer","921A Airdrop Systems Technician","350F All Source Intelligence Technician","91E Allied Trades Specialist (Machinist)","89B Ammunition Specialist","890A Ammunition Technician","68T Animal Care Specialist","45K Armament Repairer","19O Armor Officer","19Z Armor Senior Sergeant","63D Artillery Mechanic","92A Automated Logistical Specialist","39B Automatic Test Equipment Operator and Maintainer","915A Automotive Maintenance Warrant Officer","14S AVENGER Crewmember","27T AVENGER System Repairer","15O Aviation Officer","15P Aviation Operations Specialist","94L Avionic Communications Equipment Repairer","15N Avionic Mechanic","94R Avionic Radar Repairer","02Z Bands Senior Sergeant","02C Baritone or Euphonium Player","02K Bassoon Player","68A Biomedical Equipment Specialist","14R Bradley Linebacker Crewmember","21C Bridge Crewmember","46R Broadcast Journalist","25L Cable Systems lnstaller - Maintainer","13B Cannon Crewmember","13E Cannon Fire Direction Specialist","88H Cargo Specialist","21W Carpentry and Masonry Specialist","19D Cavalry Scout","27G CHAPARRAL and REDEYE Repairer","56O Chaplain","56M Chaplain Assistant","74D Chemical Operations Specialist","74O Chemical, Biological, Radiological and Nuclear (CBRN) Officer","38O Civil Affairs Officer","38B Civil Affairs Specialist","02J Clarinet Player","73BO Clinical Psychologist","25V Combat Documentation & Production Specialist","21B Combat Engineer","21Z Combat Engineering Senior Sergeant","35H Common Ground Station Operator","98H Communications Locator/Interceptor","21V Concrete and Asphalt Equipment Operator","21H Construction Engineering Supervisor","91L Construction Equipment Repairer","21N Construction Equipment Supervisor","02B Cornet or Trumpet Player","31E Corrections Specialist","351L Counterintelligence Technician","97Z Counterintelligence/Human Intelligence Senior Sergeant","35L Counterintelligence Agent","21F Crane Operator","31D Criminal Investigation Special Agent","35P Cryptologic Communications","98G Cryptologic Linguist","63O Dental Corps Officer","68E Dental Specialist","21D Diver","14J Early Warning System Operator","02U Electric Bass Guitar Player","98J Electronic Intelligence Interceptor/Analyst","94W Electronic Maintenance Chief","29E Electronic Warfare Specialist","12O Engineer Officer","89D Explosive Ordnance Disposal Specialist","92S Fabric Repair Specialist","13R Field Artillery Firefinder Radar Operator","13W Field Artillery Meteorological Crewmember","13O Field Artillery Officer","13Z Field Artillery Senior Sergeant","13S Field Artillery Surveyor","13D Field Artillery Tactical Data Systems Specialist","131A Field Artillery Targeting Technician","36B Financial Management Technician","45G Fire Control System Repairer","13F Fire Support Specialist","21M Firefighter","61NO Flight Surgeon","02G Flute or Piccolo Player","92G Food Service Specialist","02D French Horn Player","63G Fuel and Electrical Systems Repairer","21J General Construction Equipment Operator","21X General Engineering Supervisor","96R Ground Surveillance Systems Operator","02T Guitar Player","68W Health Care Specialist","21E Heavy Construction Equipment Operator","63S Heavy-Wheel Vehicle Mechanic","68M Hospital Food Service Specialist","351M Human Intelligence Collection Technician","35M Human Intelligence Collector","42BO Human Resources Officer","42A Human Resources Specialist","420A Human Resources Technician","35G Imagery Analyst","350G Imagery Intelligence Technician","11C Indirect Fire Infantryman","11O Infantry Officer","11Z Infantry Senior Sergeant","11B Infantryman","30AO Information Operations Officer","25Y Information Systems Chief","255A Information Systems Technician","25B Information Technologies Specialist","94Y Integrated Family of Test Equipment Operator and Maintainer","35F Intelligence Analyst","96Z Intelligence Senior Sergeant","21R Interior Electrician","27O JAG Corps Attorney","02N Keyboard Player","94A Land Combat Electrician","27E Land Combat Electronic Missile System Repairer","57E Laundry & Shower Specialist","63B Light-Wheel Vehicle Mechanic","21L Lithographer","90AO Logistics Officer","63A M1 Abrams Systems Maintainer","19K M1 Armor Crewman","63M M2/3 Bradley Fighting Vehicle System Maintainer","44E Machinist","63Z Mechanical Maintenance Supervisor","62O Medical Corps Officer","68K Medical Laboratory Specialist","68J Medical Logistics Specialist","70H Medical Operations Officer","67O Medical Service Corps Officer","65O Medical Specialist Corps Officer","15U Medium Helicopter Repairer","68X Mental Health Specialist","44B Metal Worker","25P Microwave Systems Operator - Maintainer","35O Military Intelligence Officer","35T Military Intelligence Systems Maintainer/Integrator","31B Military Police","31O Military Police Officer","882A Mobility Officer","92M Mortuary Affairs Specialist","25Q Multichannel Transmission Systems Operator - Maintainer","25M Multimedia Illustrator","13M Multiple Launch Rocket System (MLRS) Crewmember","13P Multiple Launch Rocket System (MLRS) Operations/Fire Detection Specialist","27M Multiple Launch Rocket System (MLRS) Repairer","25F Network Switching Systems Operator - Maintainer","25N Nodal Network Systems Operator - Maintainer","66O Nurse Corps Officer","02H Oboe Player","15J OH-58D Armament, Electrical, Avionics Sytems Repairer","15S OH-58D Helicopter Repairer","68D Operating Room Specialist","68H Optical Laboratory Specialist","91O Ordnance Officer","92R Parachute Rigger","27D Paralegal Specialist","68G Patient Administration Specialist","14E PATRIOT Fire Control Enhanced Operator and Maintainer","94S PATRIOT System Repairer","02M Percussion Player","92L Petroleum Laboratory Specialist","92F Petroleum Supply Specialist","68Q Pharmacy Specialist","21K Plumber","52D Power Generation Equipment Repairer","68S Preventive Medicine Specialist","21P Prime Power Production Specialist","920A Property Accounting Technician","37F Psychological Operations Specialist","46Z Public Affairs Chief","46Q Public Affairs Specialist","21G Quarrying Specialist","63J Quartermaster and Chemical Equipment Repairer","92O Quartermaster Officer","94M Radar Repairer","94E Radio and Communications Security Repairer","25C Radio Operator - Maintainer","68P Radiology Specialist","79R Recruiter NCO","79T Recruiting and Retention NCO","68V Respiratory Specialist","79S Retention NCO","25S Satellite Communication Systems Operator - Maintainer","25T Satellite/Microwave Systems Chief","02L Saxophone Player","45D Self-propelled Field Artillery Turret Mechanic","94Z Senior Electronic Maintenance Chief","42HO Senior Human Resources Officer","92Z Senior Noncommissioned Logistician","25X Senior Signal Sergeant","25O Signal Officer","25U Signal Support Systems Specialist","98K Signals Collection/Identification Analyst","35N Signals Intelligence Analyst","98C Signals Intelligence Analyst","98Z Signals Intelligence Senior Sergeant","254A Signals Systems Technician","57AO Simulations Operations Officer","45B Small Arms/Artillery Repairer","42S Special Band Member","94F Special Electronic Devices Repairer","18F Special Forces Assistant Operations & Intelligence Sergeant","18E Special Forces Communications Sergeant","18C Special Forces Engineer Sergeant","18D Special Forces Medical Sergeant","18O Special Forces Officer","18Z Special Forces Senior Sergeant","180W Special Forces Warrant Officer","18B Special Forces Weapons Sergeant","52X Special Purpose Equipment Repairer","920B Supply Systems Technician","53AO Systems Automation Management Officer","13C Tactical Automated Fire Control Systems (TAFCS) Specialist","96U Tactical Unmanned Aerial Vehicle Operator","21T Technical Engineering Specialist","94J Telecommunication Terminal Device Repairer","25W Telecommunications Operations Chief","25D Telecommunications Operator - Maintainer","94H Test, Measurement and Diagnostic Equipment Support Specialist","21U Topographic Analyst","21Y Topographic Engineering Supervisor","21S Topographic Surveyor","63Y Track Vehicle Mechanic","63H Track Vehicle Repairer","21Q Transmission and Distribution Specialist","88N Transportation Management Coordinator","02E Trombone Player","02F Tuba Player","52F Turbine Engine Driven Generator Repairer","15T UH-60 Helicopter Repairer","92Y Unit Supply Specialist","52C Utilities Equipment Repairer","15M Utility Helicopter Repairer","64O Veterinary Corps Officer","68R Veterinary Food Inspection Specialist","25Z Visual Information Operations Chief","352P Voice Interception Technician","92W Water Treatment Specialist","88L Watercraft Engineer","88K Watercraft Operator","63W Wheel Vehicle Repairer","94N Wire Systems Equipment Repairer","948B Electronic Systems Maintenance Warrant Officer","96B Intelligence Analyst"];
    //    }
    //    if($(this).val() === "Coast Guard") {
    //        hints = ["AMT Aviation Maintenance Technician ","AST Aviation Survival Technician","AVT Avionics Technician","BM Boatswain's Mate","DC Damage Controlman","EM Electrician's Mate","ET Electronics Technician","FS Food Service Specialist","GM Gunner's Mate","HS Health Services Technician","IT Information Systems Technician","IV Investigator","MK Machinery Technician","MST Marine Science Technician ","MU Musician","OS Operations Specialist ","PA Public Affairs Specialist ","PS Port Security Specialist ","SK Storekeeper","YN Yeoman","ME Maritime Law Enforcement Specialist ","IS Intelligence Specialist ","AE Aviation Electrician's Mate ","AM Aviation Metalsmith ","DP Data Processing Technician ","FT Fire Control Technician ","QM Quartermaster","RD Radarman","RM/TC Radioman/Telecommunications Specialist","TT Telephone Technician "," Aviator"," Aviation Maintenance Officer"," Flight Safety Officer"," Computer Information Systems Management"," Electrical Engineering"," Telecommunications Management"," Engineering Logistics"," Civil Engineering"," Naval Engineering"," Financial Resource Management"," Health Services"," Legal"," Marine Safety"," Operations - Afloat"," Operations - Ashore"," Operations - Intelligence"," Operations - Law Enforcement"];
    //    }
    //    if($(this).val() === "Marines") {
    //        hints = ["3533 Logistics Vehicle System Operator","3538 Licensing Examiner","311 Rifleman","312 Riverine Assault Craft","313 LAV Crewman","314 Rigid Raiding Craft","316 Combat Rubber Reconnaissance Craft","317 Scout Sniper","321 Reconnaissance Man","323 Reconnaissance Man, Parachute Qualified","324 Reconnaissance Man, Combatant Diver Qualified","326 Reconnaissance Man, Parachute and Combatant Diver Qualified","331 Machine Gunner","341 Mortarman","351 Infantry Assaultman","352 Anti-tank Missileman","369 Infantry Unit Leader","121 Personnel Clerk","143 Career Retention Specialist","147 Equal Opportunity Advisor (EOA)","149 Substance Abuse Control Specialist","151 Administrative Clerk","161 Postal Clerk","171 Manpower Information Systems","193 Personnel/Administrative Chief","211 Counterintelligence/HUMINT Specialist","212 Technical Surveillance Countermeasures","231 Intelligence Specialist","241 Imagery Analysis Specialist","261 Geographic Intelligence Specialist","291 Intelligence Chief","411 Maintenance Management Specialist","431 Logistics/Embarkation Specialist","451 Airborne and Air Delivery Specialist","471 Personnel Retrieval and Processing Specialist","472 Personnel Retrieval and Processing Technician","481 Landing Support Specialist","491 Logistics Mobility Chief","511 MAGTF Planning Specialist","521 Psychological Operations Noncommissioned Officer","531 Civil Affairs Noncommissioned Officer","612 Field Wireman","613 Construction Wireman","614 Unit Level Circuit Switch (ULCS) Operator/Maintainer","618 Electronic Switching Operator/Maintainer","619 Wire Chief","621 Field Radio Operator","622 Digital (Multi-channel) Wideband Transmission Equipment Operator","623 Tropospheric Scatter Radio Multi-channel Equipment Operator","627 SHF Satellite Communications Operator-Maintainer","628 EHF Satellite Communications Operator-Maintainer","629 Radio Chief","648 Strategic Spectrum Manager","651 Data Network Specialist","652 Certification Authority Workstation","653 Defense Message System","656 Tactical Network Specialist","658 Tactical Data Network Gateway Systems Administrator","659 Data Chief","681 Information Security Technician","689 Information Assurance Technician","699 Communications Chief","811 Field Artillery Cannoneer","814 High Mobility Artillery Rocket System","842 Field Artillery Radar Operator","844 Field Artillery Fire Control Man","847 Artillery Meteorological Man","848 Field Artillery Operations Man","861 Fire Support Man","911 Drill Instructor","913 Marine Combat Instructor","916 Martial Arts Instructor","917 Martial Arts Instructor-Trainer","918 Water Safety/Survival Instructor","931 Marksmanship Instructor","932 Small Arms Weapons Instructor","933 Marksmanship Coach","1141 Electrician","1142 Engineer Equipment Electrical Systems Technician","1161 Refrigeration and Air Conditioning Technician","1169 Utilities Chief","1171 Water Support Technician","1316 Metal Worker","1341 Engineer Equipment Mechanic","1342 Small Craft Mechanic","1343 Assault Breacher Vehicle/Joint Assault Bridge (JAB) Mechanic","1345 Engineer Equipment Operator","1349 Engineer Equipment Chief","1361 Engineer Assistant","1371 Combat Engineer","1372 Assault Breacher Vehicle","1812 M1A1 Tank Crewman","1833 Assault Amphibious Vehicle (AAV) Crewmember","1834 Expeditionary Fighting Vehicle (EFV) Crewman","2111 Small Arms Repairer/Technician","2112 Precision Weapons Repairer/Technician","2131 Towed Artillery Systems Technician","2141 Assault Amphibious Vehicle (AAV) Repairer/Technician","2146 Main Battle Tank (MBT) Repairer/Technician","2147 Light Armored Vehicle (LAV) Repairer/Technician","2148 Expeditionary Fighting Vehicle (EFV) Repairer/Technician","2149 Ordnance Vehicle Maintenance Chief","2161 Machinist","2171 Electro-Optical Ordnance Repairer","2181 Senior Ground Ordnance Weapons Chief","7312 Fixed-Wing Transport Aircraft Specialist, KC-130J","7313 Helicopter Specialist, AH-1Z/UH-1Y","7314 Unmanned Aerial Vehicle (UAV) Air Vehicle Operator","7374 Vertical Takeoff Unmanned Aerial Vehicle Specialist","7212 Low Altitude Air Defense (LAAD) Gunner","7234 Air Control Electronics Operator","7236 Tactical Air Defense Controller","7242 Air Support Operations Operator","7251 Air Traffic Controller-Trainee","7252 Air Traffic Controller-Tower","7253 Air Traffic Controller-Radar Arrival/Departure Controller","7254 Air Traffic Controller-Radar Approach Controller","7257 Air Traffic Controller","7277 Weapons and Tactics Instructor-Air Control","7291 Senior Air Traffic Controller","7011 Expeditionary Airfield Systems Technician","7041 Aviation Operations Specialist","7051 Aircraft Rescue and Firefighting Specialist","6821 METOC Observer","6842 METOC Analyst Forecaster","6852 METOC Impact Analyst","6617 Enlisted Aviation Logistician","6672 Aviation Supply Specialist","6694 Aviation Information Systems (AIS) Specialist","6312 Aircraft Communications/Navigation/Radar Systems Technician, AV-8","6313 Aircraft Communications/Navigation/Radar Systems Technician, EA-6","6314 Unmanned Aerial System (UAS) Avionics Technician","6316 Aircraft Communications/Navigation Systems Technician, KC-130","6317 Aircraft Communications/Navigation/Radar Systems Technician, F/A-18","6322 Aircraft Communications/Navigation Electrical Systems Technician, CH-46","6323 Aircraft Communications/Navigation/Electrical Systems Technician, CH-53","6324 Aircraft Communications/Navigation/Electrical/Weapon Systems Technician, U/AH-l","6326 Aircraft Communications/Navigation/Electrical/Systems Technician, V-22","6332 Aircraft Electrical Systems Technician, AV-8","6333 Aircraft Electrical Systems Technician, EA-6","6336 Aircraft Electrical Systems Technician, KC-130","6337 Aircraft Electrical Systems Technician, F/A-18","6386 Aircraft Electronic Countermeasures Systems Technician, EA-6B","6391 Avionics Maintenance Chief","6412 Aircraft Communications Systems Technician, IMA","6413 Aircraft Navigation Systems Technician, I FF/RADAR/TACAN , IMA","6414 Advanced Aircraft Communications/Navigation Systems Technician, IMA","6422 Aircraft Cryptographic Systems Technician, IMA","6423 Aviation Electronic Microminiature/Instrument and Cable Repair Technician, IMA","6432 Aircraft Electrical/lnstrument/Flight Control Systems Technician, Fixed Wing, IMA","6433 Aircraft Electrical/Instrument/Flight Control Systems Technician, Helicopter, IMA","6434 Advanced Aircraft Electrical/Instrument/Flight Control Systems Technician, IMA","6461 Hybrid Test Set Technician, IMA","6462 Avionics Test Set (ATS) Technician, IMA","6463 CASS HP Configuration Operator/Maintainer/Technician, IMA","6464 Aircraft Inertial Navigation System Technician, IMA","6466 CASS EO Configuration Operator/Maintainer/Technician/IMA","6467 Consolidated Automatic Support System (CASS) Technician, IMA","6469 CASS Test Station IMA Advanced Maintenance Technician, IMA","6482 Aircraft Electronic Countermeasures Systems Technician, Fixed-Wing, IMA","6483 Aircraft Electronic Countermeasures Systems Technician, Helicopter, IMA","6484 CASS EW Configuration Operator/Maintainer/Technician, IMA","6492 Aviation Precision Measurement Equipment/Calibration and Repair Technician, IMA","6493 Aviation Meteorological Equipment Technician, OMA/IMA","6012 Aviation Maintenance Controller/Production Controller","6018 Aviation Quality Assurance Representative (QAR) , Collateral Duty Quality Assurance Representative (CDQAR), and Collateral Duty Inspector (COI)","6019 Aircraft Maintenance Chief","6023 Aircraft Power Plants Test Cell Operator","6033 Aircraft Nondestructive Inspection Technician","6042 Individual Material Readiness List (IMRS) Asset Manager","6043 Aircraft Welder","6046 Aircraft Maintenance Administration Specialist","6048 Flight Equipment Technician","6049 NALCOMIS Application Administrator/Analyst","6062 Aircraft Intermediate Level Hydraulic/Pneumatic Mechanic","6072 Aircraft Maintenance Support Equipment Hydraulic/Pneumatic/Structures Mechanic","6073 Aircraft Maintenance Support Equipment Electrician/Refrigeration Mechanic","6074 Cryogenics Equipment Operator","6092 Aircraft Intermediate Level Structures Mechanic","6111 Helicopter/Tiltrotor Mechanic-Trainee","6112 Helicopter Mechanic, CH-46","6113 Helicopter Mechanic, CH-53","6114 Helicopter Mechanic, UH/AH-1","6116 Tiltrotor Mechanic, MV-22","6122 Helicopter Power Plants Mechanic, T-5E1","6123 Helicopter Power Plants Mechanic, T-64","6124 Helicopter Power Plants Mechanic, T-400/T-700","6132 Helicopter/Tiltrotor Dynamic Components Mechanic","6152 Helicopter Airframe Mechanic, CH-46","6153 Helicopter Airframe Mechanic, CH-53","6154 Helicopter Airframe Mechanic, UH/AH-1","6156 Tiltrotor Airframe Mechanic, MV-22","6162 Presidential Support Specialist","6172 Helicopter Crew Chief, CH-46","6173 Helicopter Crew Chief, CH-53","6174 Helicopter Crew Chief, UH-1","6176 Tiltrotor Crew Chief, MV-22","6177 Weapons and Tactics Crew Chief Instructor","6178 VH-GON Presidential Helicopter Crew Chief","6179 VH-3D Presidential Helicopter Crew Chief","6199 Enlisted Aircrew/Aerial Observer/Gunner","6212 Fixed-Wing Aircraft Mechanic, AV-8/TAV-S","6213 Fixed-Wing Aircraft Mechanic, EA-6","6214 Unmanned Aerial Vehicle (UAV) Mechanic","6216 Fixed-Wing Aircraft Mechanic, KC-130","6217 Fixed-Wing Aircraft Mechanic, F/A-18","6222 Fixed Wing Aircraft Power Plants Mechanic, F-402","6223 Fixed-Wing Aircraft Power Plants Mechanic, J-52","6226 Fixed-Wing Aircraft Power Plants Mechanic, T-56","6227 Fixed-Wing Aircraft Power Plants Mechanic, F-404","6242 Fixed-Wing Aircraft Flight Engineer, KC-130","6243 Fixed-Wing Transport Aircraft Specialist, C-9","6244 Fixed-Wing Transport Aircraft Specialist, C-12","6246 Fixed-Wing Transport Aircraft Specialist, C-20","6247 Fixed-Wing Transport Aircraft Specialist, UC-35","6251 Fixed-Wing Aircraft Airframe Mechanic-Trainee","6252 Fixed-Wing Aircraft Airframe Mechanic, AV-8/TAV-8","6253 Fixed-Wing Aircraft Airframe Mechanic, EA-6","6256 Fixed-Wing Aircraft Airframe Mechanic, KC-130","6257 Fixed-Wing Aircraft Airframe Mechanic, F/A-18","6276 Fixed-Wing Aircraft Crew Chief, KC-130","6281 Fixed-Wing Aircraft Safety Equipment Mechanic-Trainee","6282 Fixed-Wing Aircraft Safety Equipment Mechanic, AV-8/TJW-B","6283 Fixed-Wing Aircraft Safety Equipment Mechanic, EA-6","6286 Fixed-Wing Aircraft Safety Equipment Mechanic, KC-130","6287 Fixed-Wing Aircraft Safety Equipment Mechanic, F/A-18","5912 Avenger System Maintainer","5939 Aviation Communication Systems Technician","5942 Aviation Radar Repairer","5948 Aviation Radar Technician","5952 Air Traffic Control Navigational Aids Technician","5953 Air Traffic Control Radar Technician","5954 Air Traffic Control Communications Technician","5959 Air Traffic Control Systems Maintenance","5974 Tactical Data Systems Administrator","5979 Tactical Air Operations Module/Air Defense Technician","5993 Electronics Maintenance Chief","5811 Military Police","5812 Working Dog Handler","5813 Accident Investigator","5814 Physical Security Specialist","5816 Special Reaction Team (3RT) Member","5819 Military Police Investigator (MPI)","5821 Criminal Investigator CID Agent","5822 Forensic Psycho-physiologist (Polygraph Examiner)","5831 Correctional Specialist","5832 Correctional Counselor","5711 Chemical, Biological, Radiological, and Nuclear (CBRN) Defense Specialist","5731 Joint Chemical, Biological, Radiological, Nuclear Reconnaissance System Operator (JCBRNRS) LAV Operator","5511 Member, \"The President's Own,\" United States Marine Band","5512 Member, \"The Commandant's Own,\" U.S. Marine Drum & Bugle Corps","5517 Bandmaster","5519 Enlisted Conductor","5521 Drum Major","5522 Small Ensemble Leader","5523 Instrument Repair Technician","5524 Musician","5526 Musician, Oboe","5528 Musician, Bassoon","5534 Musician, Clarinet","5536 Musician, Flute/Piccolo","5537 Musician, Saxophone","5541 Musician, Trumpet","5543 Musician, Euphonium","5544 Musician, Horn","5546 Musician, Trombone","5547 Musician, Tuba/Sousaphone","5548 Musician, Electric Bass","5563 Musician, Percussion (Drums, Tympani, and Mallets)","5566 Musician, Guitar","4611 Combat Illustrator","4612 Combat Lithographer","4641 Combat Photographer","4671 Combat Videographer","4691 Visual Information Chief","4421 Legal Services Specialist","4429 Legal Services Reporter","4313 Broadcast Journalist","4341 Combat Correspondent","4133 Marine Corps Community Services Marine","3521 Automotive Organizational Mechanic","3522 Automotive Intermediate Mechanic","3523 Logistics Vehicle System Mechanic","3524 Fuel and Electrical Systems Mechanic","3526 Crash/Fire/Rescue Vehicle Mechanic","3529 Motor Transport Maintenance Chief","3531 Motor Vehicle Operator","3534 Semitrailer Refueler Operator","3536 Vehicle Recovery Operator","3537 Motor Transport Operations Chief","3432 Finance Technician","3441 NAF Audit Technician","3451 Financial Management Resource Analyst","3372 Marine Aide","3381 Food Service, Specialist","3112 Traffic Management Specialist","3043 Supply Administration and Operations Specialist","3044 Contract Specialist","3051 Warehouse Clerk","3052 Packaging Specialist","2821 Technical Controller Marine","2822 Electronic Switching Equipment Technician","2823 Technical Control Chief","2827 Tactical Electronic Reconnaissance Process/Evaluation Systems (TERPES) Technician","2831 AN/TRC-170 Technician","2834 Satellite Communications (SATCOM) Technician","2844 Ground Communications Organizational Repairer","2846 Ground Radio Intermediate Repairer","2847 Telephone Systems/PersonalComputer Intermediate Repairer","2848 Tactical Remote Sensor System (TRSS) Maintainer","2862 Electronics Maintenance Technician","2871 Test Measurement and Diagnostic Equipment Technician","2874 Metrology Technician","2881 2M/ATE Technician","2887 Artillery Electronics Technician","2891 Electronics Maintenance Chief","2671 Middle East Cryptologic Linguist","2673 Asia-Pacific Cryptologic Linguist","2674 European I (West) Cryptologic Linguist","2676 European II (East) Cryptologic Linguist","2691 Signals Intelligence/Electronic Warfare Chief","2711 Afghan Pashto Linguist (MGySgt-Pvt) EMOS","2712 Arabic (Mod Std) Linguist","2713 Arabic (Egyptian) Linguist","2714 Arabic (Syrian) Linguist","2715 Persian-Afghan (Dari) Linguist","2716 Amharic Linguist","2717 Bengali Linguist","2718 Hebrew Linguist","2719 Hindi Linguist","2721 Kurdish Linguist","2722 Persian-Farsi Linguist","2723 Somali Linguist","2724 Swahili Linguist","2726 Turkish Linguist","2727 Urdu Linguist","2728 Arabic (Iraqi) Linguist","2733 Burmese Linguist","2734 Cambodian Linguist","2736 Chinese (Cant) Linguist","2738 Indonesian Linguist","2739 Japanese Linguist","2741 Korean Linguist","2742 Laotian Linguist","2743 Malay Linguist","2744 Tagalog Linguist","2746 Thai Linguist","2754 Dutch Linguist","2756 Finnish Linguist","2757 French Linguist","2758 German Linguist","2759 Greek Linguist","2761 Haitian-Creole Linguist","2763 Italian Linguist","2764 Norwegian Linguist","2766 Portuguese (BR) Linguist","2767 Portuguese (EU) Linguist","2768 Spanish Linguist","2769 Swedish Linguist","2776 Albanian Linguist","2777 Armenian Linguist","2778 Bulgarian Linguist","2779 Czech Linguist","2781 Estonian Linguist","2782 Georgian Linguist","2783 Hungarian Linguist","2784 Latvian Linguist","2786 Lithuanian Linguist","2787 Macedonian Linguist","2788 Polish Linguist","2789 Romanian Linguist","2791 Russian Linguist","2792 Serb-Croat Linguist","2793 Slovenian Linguist","2794 Ukrainian Linguist","2799 Military Interpreter/Translator","2611 Cryptologic Digital Network Technician/Analyst","2621 Special Communications Signals Collection Operator","2629 Signals Intelligence Analyst","2631 Electronic Intelligence (ELINT) Intercept Operator/Analyst","2651 Special Intelligence System Administrator/Communicator","2311 Ammunition Technician","2336 Explosive Ordnance Disposal","160 Postal Officer","170 Personnel Officer","180 Adjutant","202 Marine Air-Ground Task Force (MAGTF) Intelligence Officer","203 Ground Intelligence Officer","204 Human Source Intelligence Officer","205 Senior All-Source Intelligence Analysis Officer","206 Signals Intelligence/Ground Electronic Warfare Officer","207 Air Intelligence Officer","210 Counterintelligence/Human Source Intelligence (CI/HUMINT) Officer","215 Technical Surveillance Countermeasures Trained Counterintelligence/Human Source Intelligence Officer","220 Surveillance Sensor Officer","277 Weapons and Tactics Instructor/Intelligence Officer","302 Infantry Officer","303 Light-Armored Reconnaissance (LAR) Officer","306 Infantry Weapons Officer","502 Force Deployment Planning and Execution Officer","505 Marine Air-Ground Task Force (MAGTF) Planner","510 Information Operations Staff Officer","520 Psychological Operations Officer","530 Civil Affairs Officer","540 Space Operations Staff Officer","602 Communications Officer","603 C4 Planner","610 Telephone Systems Officer","620 Tactical Communications Planning and Engineer Officer","640 Strategic Spectrum Planner","650 Network Operations and Systems Officer","802 Field Artillery Officer","803 Targeting Effects Officer","840 Naval Surface Fire Support Planner","1302 Combat Engineer Officer","1310 Engineer Equipment Officer","1330 Facilities Management Officer","1390 Bulk Fuel Officer","1802 Tank Officer","1803 Assault Amphibious Vehicle (AAV) Officer","4302 Public Affairs Officer","4305 Mass Communication Specialist","5803 Military Police Officer","5804 Corrections Officer","5805 Criminal Investigation Officer","2102 Ordnance Officer","2110 Ordnance Vehicle Maintenance Officer","2120 Weapons Repair Officer","2125 Electro-Optic Instrument Repair Officer","2305 Explosive Ordnance Disposal Officer","2340 Ammunition Officer","2602 Signals Intelligence/Electronic Warfare Officer ","2802 Electronics Maintenance Officer (Ground)","2805 Data/Communications Maintenance Officer ","4801 Recruiting Officer-Marine Corps Total Force Expert","4802 Recruiting Officer-Operational Expert","4803 Recruiting Officer-Officer Procurement Expert","4804 Recruiting Officer-Multiple Tour Expert","4810 Recruiting Officer ","5502 Band Officer","5505 Director/Assistant Director, \"The President's Own\" U.S. Marine Band ","5506 Staff Officer, \"The President's Own\" U.S. Marine Band ","5507 U.S. Marine Drum and Bugle Corps Officer ","5702 Chemical, Biological, Radiological and Nuclear (CBRN) Defense Officer","5902 Electronics Maintenance Officer (Aviation)","5910 Aviation Radar Maintenance Officer","5950 Air Traffic Control Systems Maintenance Officer","5970 Data Systems Maintenance Officer","6002 Aircraft Maintenance Officer","6004 Aircraft Maintenance Engineer Officer","6302 Avionics Officer ","6502 Aviation Ordnance Officer","6602 Aviation Supply Officer","6604 Aviation Supply Operations Officer","6607 Aviation Logistician","6608 AIRSpeed Officer NMOS","6802 Meteorology and Oceanography (METOC) Officer ","6877 Weapons and Tactics Instructor-METOC ","7002 Expeditionary Airfield and Emergency Services Officer","7202 Air Command and Control Officer ","7204 Low Altitude Air Defense Officer","7208 Air Support Control Officer ","7210 Air Defense Control Officer","7220 Air Traffic Control Officer","7237 Senior Air Director (SAD) ","7502 Forward Air Controller/Air Officer","7503 Billet Designator - Fixed-Wing Pilot","7507 FRS Basic AV-8B Pilot","7508 AV-8A/C Qualified","7509 AV-8B Qualified","7513 Pilot Helicopter AH-1Z/UH-1Y","7521 FRS Basic F/A-18 Pilot","7523 Pilot VMFA F/A-18 Qualified","7524 FRS Basic F/A-18D Weapons Systems Officer (WSO)","7525 Qualified F/A-18D WSO","7527 Pilot VMFA F/A-18D Qualified","7531 FRS Basic V-22 Pilot","7532 Pilot V-22 Qualified","7541 FRS Basic EA-6B Pilot","7542 EA-6A Qualified","7543 EA-6B Qualified","7550 Pilot VMGR Maritime Advance (NATC)","7551 Pilot C-9 Qualified","7552 Pilot TC-4C Qualified","7553 Pilot C-20/C-37 Qualified","7554 Pilot UC-35 Qualified","7555 Pilot UC-128 Qualified","7556 KC-130 Co-Pilot (T2P/T3P)","7557 Pilot KC-130 Aircraft Commander","7558 FRS Basic CH-53D Pilot","7559 Pilot CT-39 Qualified","7560 FRS Basic CH-53E Pilot","7561 FRS Basic CH-46 Pilot","7562 Pilot CH-46 Qualified","7563 Pilot UH-1 Qualified","7564 Pilot CH-53 A/D Qualified","7565 Pilot AH-1 Qualified","7566 Pilot CH-53E Qualified","7567 FRS Basic UH-IN Pilot","7568 FRS Basic AH-1 Pilot","7577 Weapons and Tactics Instructor","7578 NFO Student (TBS)","7580 Tactical Navigator Flight Student (NATC)","7582 FRS Basic EA-68 Electronic Warfare Officer","7588 Qualified EA-68 Electronics Warfare Officer","7589 V/STOL Landing Signal Officer","7594 Landing Signal Officer","7595 Test Pilot/Flight Test Project Officer","7596 Aviation Safety Officer","7597 Basic Rotary-Wing Pilot","7599 Flight Student (TBS)","402 Logistics Officer","930 Range Officer","1120 Utilities Officer","3102 Traffic Management Officer","3302 Food Service Officer","3402 Finance Officer","3404 Financial Management Officer","3408 Financial Management Resource Officer (FMRO)","3410 NAF Auditing Officer","4130 Marine Corps Community Services (MCCS)","4402 Judge Advocate","4405 Master of International Law","4406 Master of Environmental Law","4407 Master of Labor Law","4408 Master of Procurement Law","4409 Master of Criminal Law","4410 Master of Law (General)","4602 Combat Camera (COMCAM) Officer","4606 Combat Artist (Officer)","313 LAV Crewman","323 Reconnaissance Man, Parachute Qualified","8411 Production Recruiter","8412 Career Recruiter","8156 Security Guard","6531 Aircraft Ordnance Technician","6541 Aviation Ordnance Systems Technician","6591 Aviation Ordnance Chief"];
    //    }
    //    if($(this).val() === "Navy") {
    //        hints = ["ABE Aviation Boatswain's Mate - Launch/Recovery ","ABF Aviation Boatswain's Mate - Fuels ","ABH Aviation Boatswain's Mate - Aircraft Handler ","AC Air Traffic Controller ","AD Aviation Machinist's Mate ","PR Aircrew Survival Equipmentman ","AG Aerographer's Mate","AM Aviation Structural Mechanic ","AME Aviation Structural Mechanic Safety Equipment ","AE Aviation Electrician ","AT Aviation Electronics Technician ","AZ Aviation Maintenance Administrationman ","AO Aviation Ordnanceman ","AS Aviation Support Equipment Technician ","EA Engineering Aid ","CM Construction Mechanic ","UT Utilitiesman","EO Equipment Operator ","CE Construction Electrician ","BU Builder","SW Steelworker ","ND Navy Diver ","SO Special Warfare Operator","SB Special Warfare Boat Operator ","EOD Explosive Ordnance Disposal ","RP Religious Program Specialist ","HM Hospital Corpsman ","HMDA Hospital Corpsman - Dental Assistant ","MU Musician","MA Master at Arms ","SH Ship's Serviceman ","MC Mass Communication Specialist ","LS Logistics Specialist ","CS Culinary Specialist ","YN Yeoman","BM Boatswain's Mate ","QM Quartermaster","PS Personnel Specialist ","DC Damage Controlman ","EN Engineman ","EM Electrician's Mate ","IC Interior Communications Electrician ","GSE Gas Turbine Systems Technician - Electrical ","GSM Gas Turbine Systems Technician - Mechanical ","HT Hull Maintenance Technician ","MM Machinist's Mate ","MR Machinery Repairman ","GM Gunner's Mate ","MT Missile Technician ","MN Mineman","IT Information Systems Technician, Surface ","ITS Information Systems Technician, Submarines","OS Operations Specialist ","IS Intelligence Specialist ","STG Sonar Technician, Surface ","STS Sonar Technician, Submarine ","CTM Cryptologic Technician - Maintenance ","CTI Cryptologic Technician - Interpretive ","CTN Cryptologic Technician - Networks ","CTT Cryptologic Technician - Technical ","CTR Cryptologic Technician - Collection ","AWF Naval Aircrewman (Mechanical)","AWO Naval Aircrewman (Operator) ","AWS Naval Aircrewman (Helicopter) ","AWV Naval Aircrewman (Avionics) ","UCT Seabee UCT Diver Challenge","ET Electronics Technician ","FC Fire Controlman ","Nuke ET Electronics Technician (Nuclear)","Nuke MM Machinist's Mate (Nuclear)","Nuke EM Electrician's Mate (Nuclear)","SECF Submarine Electronics/Computer Field ","BDCP Baccalaureate Degree Completion Program","NROTC Navy Reserve Officer Training Corps","AMDO Aerospace Maintenance Duty Officer","AOC Naval Aviation - Pilot","NFOC Naval Aviation - Naval Flight Officer"," Chaplain (Direct Appointment)"," Chaplain (Student Selection Program)"," Civil Engineer"," CEC Collegiate"," Cryptology","EDO Engineering Duty Officer","INTEL Intelligence"," JAG Direct Appointment"," JAG Student Selection"," Physician"," Dentist"," Nurse"," Health Care Administration"," Health Care Sciences"," Medical Support"," Naval Reactors Engineer"," NUPOC Surface"," NUPOC Sub"," Nuclear Power School Instructor"," Oceanography","PAO Public Affairs Officer","UMCM Underwater Mine Countermeasures","ODS Operational Diving and Salvage ","EOM Explosive Ordnance Management "," Supply","SWO Surface Warfare Officer","CRF Career Recruiting Force","CANREC Canvassing Recruiter","Supply Supply Corps"," NUPOC Submarine"];
    //    }
    //    $('#job-code').autocomplete({
    //        source: hints
    //    });
    //});
    //$('#job-code').on('input',function(){
    //    if(hints.indexOf( $(this).val() ) <= 0) {
    //        $('#form-error').text('Please choose from the list of suggestions.');
    //        $('#form-error').removeClass('hidden');
    //        $('input[type="submit"]').prop('disabled',false);
    //    } else {
    //        $('#form-error').addClass('hidden');
    //    }
    //});
    //$('#search-submit').click(function(e, input) {
    //    e.preventDefault();
    //    var input = $('#search-field').val();
    //    location.href= 'https://www.jobs-ups.com/search-jobs/' + encodeURIComponent(input) + '/1187/1';
    //});
    $('.job-search--job-description').submit(function(e){
        e.preventDefault();
        var jobTitle = $(this).closest('.expander__wrapper').find('.expander__parent').text();

        if (jobTitle == 'Driver Helper (October\u2013December)') {
            jobTitle = 'Driver Helper';
        }
        //
        //if( $(this).children('.zip-code').val() ) {
        //    zipCode = $(this).children('.zip-code').val();
        //    radiusOn = 'true';
        //    radius = '50';
        //} else {
        //    zipCode = '-1';
        //    radiusOn = 'false';
        //    radius = '-1';
        //}

        //if (jQuery.browser.mobile) {
        //    forwardURL = 'http://m.jobs-ups.com/search';
        //} else {
        //    forwardURL = 'http://jobs-ups.com/search/' + encodeURIComponent(jobTitle) + '/ASCategory/-1/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/' + radiusOn + '/ASCityStateZipcode/' + encodeURIComponent(zipCode) +'/ASDistance/'+ encodeURIComponent(radius) +'/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';
        //}

        var forwardURL = 'https://www.jobs-ups.com/search-jobs/' + encodeURIComponent(jobTitle) + '/1187/1';
        window.open(
            forwardURL,
            '_blank' // <- This is what makes it open in a new window.
        );
    });

    $('.job-search--military-skills-translator').submit(function(e){
        e.preventDefault();
        jobTitle = $(this).closest('.expander__wrapper').find('.expander__parent').text();

        if (jobTitle == 'Driver Helper (October\u2013December)') {
            jobTitle = 'Driver Helper';
        }
        //
        //if( $(this).children('.zip-code').val() ) {
        //    zipCode = $(this).children('.zip-code').val();
        //    radiusOn = 'true';
        //    radius = '50';
        //} else {
        //    zipCode = '-1';
        //    radiusOn = 'false';
        //    radius = '-1';
        //}
        var forwardURL = 'https://www.jobs-ups.com/search-jobs/' + encodeURIComponent(jobTitle) + '/1187/1';

        window.open(
            forwardURL,
            '_blank' // <- This is what makes it open in a new window.
        );

    });
    
    //$('#military-skills-translator').submit(function(e){
    //    e.preventDefault();
    //    $('.expander__wrapper').addClass('hidden');
    //    $('#side--a').addClass('full-width');
    //    $('#form-error').addClass('hidden');
    //    $('#form-error').text('');
    //    $('#military-job').addClass('hidden');
    //    $('#job-types').addClass('hidden');
    //    $('.component--expander').addClass('hidden');
    //
    //
    //    branch = $('#branch-of-service').val();
    //    jobCode = $('#job-code').val();
    //
    //    /**
    //     * GA TRACKING
    //     */
    //        //ga('send','event','military_skills_translator','translate', branch + '_' + jobCode);
    //
    //    if(hints.indexOf(jobCode) >= 0) {
    //        $.get("/bundles/vcg/data/jobs-data.csv", function(data){
    ////        console.log(data);
    //        allJobs = $.csv.toObjects(data);
    //
    //        })
    //        .done(function(){
    //            var matched = false;
    //            allJobs.some(function(obj){
    //                console.log('first search');
    //
    //                if( obj['Code'] && aContainsB(jobCode, obj['Code']) ) {
    //
    //                    match = obj;
    //                    if(match['Branch'] === branch){
    //                        $('#military-job').removeClass('hidden');
    //                        $('#job-types').removeClass('hidden');
    //                        $('.component--expander').removeClass('hidden');
    //                        $('#military-job-title').text(match["MOS title"]);
    //                        $('#military-job-description').text(match["MOS description"]);
    //                        $('#side--a').removeClass('full-width');
    //                        if (match['Package Handler'] === 'Y') {
    //                            $('.hidden-part[data-id="1"]').parent('.expander__wrapper').removeClass('hidden');
    //                        }
    //                        if (match['Driver Helper'] === 'Y') {
    //                            $('.hidden-part[data-id="2"]').parent('.expander__wrapper').removeClass('hidden');
    //                        }
    //                        if (match['Package Delivery Driver'] === 'Y') {
    //                            $('.hidden-part[data-id="3"]').parent('.expander__wrapper').removeClass('hidden');
    //                        }
    //                        if (match['Warehouse Associate'] === 'Y') {
    //                            $('.hidden-part[data-id="8"]').parent('.expander__wrapper').removeClass('hidden');
    //                        }
    //                        if (match['Automotive Mechanic'] === 'Y') {
    //                            $('.hidden-part[data-id="5"]').parent('.expander__wrapper').removeClass('hidden');
    //                        }
    //                        if (match['Facilities Mechanic'] === 'Y') {
    //                            $('.hidden-part[data-id="6"]').parent('.expander__wrapper').removeClass('hidden');
    //                        }
    //                        if (match['Feeder Driver'] === 'Y') {
    //                            $('.hidden-part[data-id="4"]').parent('.expander__wrapper').removeClass('hidden');
    //                        }
    //                        if (match['UPS Freight Over-the-Road (OTR) Driver'] === 'Y') {
    //                            $('.hidden-part[data-id="9"]').parent('.expander__wrapper').removeClass('hidden');
    //                        }
    //                        if (match['Part-Time Operations Supervisor'] === 'Y') {
    //                            $('.hidden-part[data-id="10"]').parent('.expander__wrapper').removeClass('hidden');
    //                        }
    //                        if (match['Business Analyst'] === 'Y') {
    //                            $('.hidden-part[data-id="11"]').parent('.expander__wrapper').removeClass('hidden');
    //                        }
    //                        if (match['Sales Representative'] === 'Y') {
    //                            $('.hidden-part[data-id="7"]').parent('.expander__wrapper').removeClass('hidden');
    //                        }
    //                    } else {
    //                        $('#form-error').text('Sorry, this job does not match branch of service.');
    //                        $('#form-error').removeClass('hidden');
    //                    }
    //                    matched = true;
    //                    return true;
    //                    console.log(match);
    //                }
    //            });
    //            if (matched === false) {
    //                allJobs.some(function(obj){
    //                    console.log('second search');
    //                    if((obj['Branch'] === branch) && aContainsB(jobCode, obj['MOS title'])) {
    //
    //                        match = obj;
    //                        console.log(match);
    //                        if(match['Branch'] === branch){
    //                            $('#military-job-title').text(match["MOS title"]);
    //                            $('#military-job-description').text(match["MOS description"]);
    //                            console.log(match['Package Handler']);
    //
    //                            if (match['Package Handler'] === 'Y') {
    //                                $('.hidden-part[data-id="1"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Driver Helper'] === 'Y') {
    //                                $('.hidden-part[data-id="2"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Package Delivery Driver'] === 'Y') {
    //                                $('.hidden-part[data-id="3"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Warehouse Associate'] === 'Y') {
    //                                $('.hidden-part[data-id="8"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Automotive Mechanic'] === 'Y') {
    //                                $('.hidden-part[data-id="5"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Facilities Mechanic'] === 'Y') {
    //                                $('.hidden-part[data-id="6"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Feeder Driver'] === 'Y') {
    //                                $('.hidden-part[data-id="4"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['UPS Freight Over-the-Road (OTR) Driver'] === 'Y') {
    //                                $('.hidden-part[data-id="9"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Part-Time Operations Supervisor'] === 'Y') {
    //                                $('.hidden-part[data-id="10"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Business Analyst'] === 'Y') {
    //                                $('.hidden-part[data-id="11"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Sales Representative'] === 'Y') {
    //                                $('.hidden-part[data-id="7"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                        } else {
    //                            $('#form-error').text('Job does not match branch of service.');
    //                            $('#form-error').removeClass('hidden');
    //                        }
    //
    //                        return true;
    //
    //                    }
    //                });
    //            }
    //        });
    //    } else {
    //        $('#form-error').text('Please use a job from the list of suggestions.');
    //        $('#form-error').removeClass('hidden');
    //    }
    //});
});

//
//$(document)
//  .ajaxStart(function () {
//    $('#ajax-spinner').removeClass('hidden');
//  })
//  .ajaxStop(function () {
//    $('#ajax-spinner').addClass('hidden');
//  });

var buckets = [];
buckets[0] = {name: 'No direct match', description: 'No direct match available'};
buckets[1] = {name: 'Drivers', description: 'Full- and part-time jobs moving packages between locations and delivering them to customers, including positions like package delivery drivers, driver helpers, tractor-trailer drivers and hazmat endorsed drivers'};
buckets[2] = {name: 'Logistics', description: 'Full- and part-time jobs ensuring packages are appropriately moved through UPS facilities, including positions like package handlers, dockworkers and warehouse associates'};
buckets[3] = {name: 'Operations', description: 'Full- and part-time jobs ensuring UPS operations run smoothly for our customers, including positions like part-time supervisors and support specialists'};
buckets[4] = {name: 'Mechanics and Technicians', description: 'Full- and part-time jobs ensuring equipment in UPS facilities and vehicles is well maintained, including positions like paint and body mechanics, maintenance mechanics and trailer shop mechanics'};
buckets[5] = {name: 'Administrative Workers', description: 'Full- and part-time jobs ensuring UPS office duties are completed, including positions like data entry personnel, administrative assistants and dispatch associates'};
buckets[6] = {name: 'Professional Workers', description: 'Full- and part-time jobs requiring advanced training or education in a specialized field, including positions like accounting associates, advertising managers, legal personnel, human resources personnel and all professional internships'};
buckets[7] = {name: 'Information Systems', description: 'Full- and part-time jobs using technology to fulfill UPS\' commitment to customers, including positions like business systems analysts, programming analysts and application developers'};
buckets[8] = {name: 'Air Operations', description: 'Full- and part-time jobs within UPS\' own airline, including positions like pilots, first officers, and aircraft maintenance mechanics'};
buckets[9] = {name: 'Engineers', description: 'Full- and part-time jobs improving UPS processes with technology and innovation, including positions like aircraft engineers, industrial engineering specialists, plant engineers and mechanics'};
buckets[10] = {name: 'Sales and Customer Service', description: 'Full- and part-time jobs ensuring the satisfaction of new and existing UPS customers, including positions like customer service associates, onside sales representatives and account executives'};
buckets[11] = {name: 'Part-Time, Hourly and Seasonal Workers', description: 'Part-time and seasonal opportunities at UPS are a great way to get started on a new career while going to school. Includes opportunities available in all UPS employment areas'};

var categories = {
    'Drivers': [
        'Delivery Driver Jobs',
        'Driver Helper Jobs',
        'Driver Jobs',
        'Driver Non-CDL Jobs',
        'Truck Driver CDL Jobs'
    ],
    'Logistics': [
        'Warehousing Jobs',
        'Logistics Jobs',
        'Package Handling Jobs',
        'Dock Worker Jobs'
    ],
    'Operations': [
        'Operations Jobs'
    ],
    'Mechanics and Technicians': [
        'Mechanic Jobs'
    ],
    'Administrative Workers': [
        'Administrative Jobs'
    ],
    'Professional Workers': [
        'Communication Jobs',
        'Finance and Accounting Jobs',
        'Human Resources Jobs',
        'Legal Jobs',
        'Internship Jobs',
        'Marketing & Communication Jobs'
    ],
    'Information Systems': [
        'Information Systems Jobs',
        'Information Technology Jobs',
        'Information Management & Security Jobs',
        'Applications Development Jobs',
        'Infrastructure Jobs'
    ],
    'Air Operations': [
        'Aircraft Jobs'
    ],
    'Engineers': [
        'Industrial Engineering Jobs'
    ],
    'Sales and Customer Service': [
        'Customer Service Jobs',
        'Inside Sales Jobs',
        'Sales Jobs',
        'Business Management Jobs'
    ],
    'Part-Time, Hourly and Seasonal Workers': [
        'Part Time Jobs',
        'Part-Time Hourly and Seasonal Jobs',
        'Seasonal Jobs'
    ]
};

var searchUrls = {};
searchUrls['Delivery Driver Jobs'] = 'https://www.jobs-ups.com/category/delivery-driver-jobs/1187/4674/1';
searchUrls['Driver Helper Jobs'] ='https://www.jobs-ups.com/category/driver-helper-jobs/1187/12132/1';
searchUrls['Driver Jobs'] ='https://www.jobs-ups.com/category/driver-jobs/1187/4624/1';
searchUrls['Driver Non-CDL Jobs'] ='https://www.jobs-ups.com/category/driver-non-cdl-jobs/1187/12116/1';
searchUrls['Truck Driver CDL Jobs'] ='https://www.jobs-ups.com/category/truck-driver-cdl-jobs/1187/12131/1';
searchUrls['Warehousing Jobs'] ='https://www.jobs-ups.com/category/warehousing-jobs/1187/4637/1';
searchUrls['Logistics Jobs'] ='https://www.jobs-ups.com/category/logistics-jobs/1187/4665/1';
searchUrls['Package Handling Jobs'] ='https://www.jobs-ups.com/category/package-handling-jobs/1187/4635/1';
searchUrls['Dock Worker Jobs'] ='https://www.jobs-ups.com/category/dock-worker-jobs/1187/4656/1';
searchUrls['Operations Jobs'] ='https://www.jobs-ups.com/category/operations-jobs/1187/4668/1';
searchUrls['Mechanic Jobs'] ='https://www.jobs-ups.com/category/mechanic-jobs/1187/4666/1';
searchUrls['Administrative Jobs'] ='https://www.jobs-ups.com/category/administrative-jobs/1187/4638/1';
searchUrls['Communication Jobs'] ='https://www.jobs-ups.com/category/communication-jobs/1187/11153/1';
searchUrls['Finance and Accounting Jobs'] ='https://www.jobs-ups.com/category/finance-and-accounting-jobs/1187/4652/1';
searchUrls['Human Resources Jobs'] ='https://www.jobs-ups.com/category/human-resources-jobs/1187/4626/1';
searchUrls['Legal Jobs'] ='https://www.jobs-ups.com/category/legal-jobs/1187/4663/1';
searchUrls['Internship Jobs'] ='https://www.jobs-ups.com/category/internship-jobs/1187/4662/1';
searchUrls['Marketing & Communication Jobs'] ='https://www.jobs-ups.com/category/marketing-and-communication-jobs/1187/12133/1';
searchUrls['Information Systems Jobs'] ='https://www.jobs-ups.com/category/information-systems-jobs/1187/4661/1';
searchUrls['Information Technology Jobs'] ='https://www.jobs-ups.com/category/information-technology-jobs/1187/12138/1';
searchUrls['Information Management & Security Jobs'] ='https://www.jobs-ups.com/category/information-management-and-security-jobs/1187/15057/1';
searchUrls['Applications Development Jobs'] ='https://www.jobs-ups.com/category/applications-development-jobs/1187/15047/1';
searchUrls['Infrastructure Jobs'] ='https://www.jobs-ups.com/category/infrastructure-jobs/1187/15058/1';
searchUrls['Aircraft Jobs'] ='https://www.jobs-ups.com/category/aircraft-jobs/1187/4639/1';
searchUrls['Industrial Engineering Jobs'] ='https://www.jobs-ups.com/category/industrial-engineering-jobs/1187/4633/1';
searchUrls['Customer Service Jobs'] ='https://www.jobs-ups.com/category/customer-service-jobs/1187/4632/1';
searchUrls['Inside Sales Jobs'] ='https://www.jobs-ups.com/category/inside-sales-jobs/1187/12134/1';
searchUrls['Sales Jobs'] ='https://www.jobs-ups.com/category/sales-jobs/1187/4628/1';
searchUrls['Business Management Jobs'] ='https://www.jobs-ups.com/category/business-management-jobs/1187/4642/1';
searchUrls['Part Time Jobs'] ='https://www.jobs-ups.com/category/part-time-jobs/1187/12137/1';
searchUrls['Part-Time Hourly and Seasonal Jobs'] ='https://www.jobs-ups.com/category/part-time-hourly-and-seasonal-jobs/1187/12085/1';
searchUrls['Seasonal Jobs'] ='https://www.jobs-ups.com/category/seasonal-jobs/1187/12811/1';


function aContainsB (a, b) {
    return a.indexOf(b) >= 0;
}

function buildHints(branchKey, myArray){
    var hints = [];
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].Branch === branchKey) {
            hints.push(myArray[i].Search);
        }
    }
    //console.log(hints);
    return hints;
}

function checkBranch(val){
    //console.log('changed');
    if(hints.indexOf( val ) < 0) {
        $('#form-error').text('Please choose from the list of suggestions.');
        $('#form-error').removeClass('hidden');
        $('input[type="submit"]').prop('disabled',false);
    } else {
        $('#form-error').addClass('hidden');
    }
    //console.log('value: ' + val + ' matches item ' + hints.indexOf(val));
}

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].Search === nameKey) {
            return myArray[i];
        }
    }
    return {};
}

function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

function objectLength(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

$( document ).ready(function() {
    $.get("/bundles/vcg/data/translator.csv", function (data) {
        //        console.log(data);
        allJobs = $.csv.toObjects(data);

    });
    //reset form for firefox
    $('#branch-of-service option:contains("Select Branch")').prop('selected',true);
    $('#job-code').val('');

    $('#branch-of-service').change(function () {
        var val = $(this).val();
        $('#job-code').val('');
        $('#job-code').prop('disabled', false).removeClass('disabled-input');
        $('label[for="job-code"]').removeClass('disabled-input');

        hints = buildHints(val, allJobs);
        $('#job-code').autocomplete({
            source: hints,
            select: function (event, ui) {
                checkBranch(ui.item.value);
            }
        });
    });
    $('#job-code').on('input', function () {
        var val = $(this).val();
        checkBranch(val);
    });
    $('#branch-of-service').on('autocompletechange', function () {
        var val = $(this).val();
        checkBranch(val);
    });
    $('#military-skills-translator').submit(function (e) {
        e.preventDefault();
        //hide old search results
        $('#side--a').addClass('full-width');
        $('#form-error').addClass('hidden');
        $('#form-error').text('');
        $('#military-job').addClass('hidden');
        $('#job-types').addClass('hidden');
        //$('.component--expander').addClass('hidden');

        $('.wrap--match-bucket').addClass('hidden');
        $('.wrap--no-match-bucket').addClass('hidden');
        $('.wrap--all-buckets .component--expander').text('');
        $('.wrap--all-buckets').addClass('hidden');
        $('.wrap--match-bucket .expander__child').text('');


        //searh value
        var searchString = $('#job-code').val();

        //search
        var result = search(searchString, allJobs);
        if (!$.isEmptyObject(result)) {
            //we have a result! (not an empty cell)
            //set the military job title
            $('#military-job-title').text(result.Title);
            //show the military job
            $('#military-job').removeClass('hidden');

            //fill in bucket info
            var b = result.Bucket;
            if (b > 0) {
                var bucketTitle = buckets[b].name;

                var bucketDescription = buckets[b].description;

                $('.wrap--match-bucket .expander__parent').text(bucketTitle);
                $('.wrap--match-bucket .expander__parent+p').text(bucketDescription);

                //reveal direct match
                $('.wrap--match-bucket').removeClass('hidden');
                //console.log('direct match with bucket  ' + bucketTitle);


                if (categories.hasOwnProperty(bucketTitle)) {

                    var cats = categories[bucketTitle];
                    //console.log('Bucket Categories: ' + cats);

                    for (j = 0; j < cats.length; j++) {

                        var categoryTitle = categories[bucketTitle][j];

                        //console.log(categoryTitle);

                        var categoryURL = searchUrls[categoryTitle];
                        //var categoryURL = 'http://jobs-ups.com/search/advanced-search/ASCategory/' + encodeURIComponent(categoryTitle) + '/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';

                        $('.hidden-part').attr('data-id', '0').children('.expander__child').append('<div class="job-category"><h3 class="job-category_title">' + categoryTitle + '</h3><a class="search-button" target="_blank" href="' + categoryURL + '"><span>Current Openings</span></a></div>');

                    }
                }

            } else {
                $('.wrap--no-match-bucket').removeClass('hidden');
                $('.wrap--all-buckets .bucket-wrap-label').addClass('hidden');
                //console.log('no direct match');
            }

            //generate other buckets
            var otherBuckets = [];

            for (i = 1; i < buckets.length; i++) {

                //exclude the matched bucket
                if (i != b) {
                    otherBuckets.push(buckets[i]);
                }
            }
            //randomize buckets
            var randBuckets = shuffle(otherBuckets);

            //loop through randomized bucket list
            for (i = 0; i < randBuckets.length; i++) {

                var randBucketTitle = randBuckets[i].name;

                var randBucketDescription = randBuckets[i].description;

                $('.wrap--all-buckets .component--expander').append('<section class="expander__wrapper"><a data-id="' + i + '" class="button expand-button"><h2 class="expander__parent">' + randBucketTitle + '</h2><p class="">' + randBucketDescription + '</p><i class="fa fa-plus fa-2x"></i></a><div data-id="' + i + '" class="hidden-part"><div class="expander__child"></div></div></section>');

                if (categories.hasOwnProperty(randBucketTitle)) {

                    var cats = categories[randBucketTitle];

                    for (j = 0; j < cats.length; j++) {

                        var categoryTitle = categories[randBucketTitle][j];

                        var categoryURL = searchUrls[categoryTitle];
                        //var categoryURL = 'http://jobs-ups.com/search/advanced-search/ASCategory/' + encodeURIComponent(categoryTitle) + '/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';

                        $('.wrap--all-buckets .hidden-part[data-id="' + i + '"]').children('.expander__child').append('<div class="job-category"><h3 class="job-category_title">' + categoryTitle + '</h3><a class="search-button" target="_blank" href="' + categoryURL + '"><span>Current Openings</span></a></div>');
                    }
                }

            }
            //reveal randomized bucket list
            $('.wrap--all-buckets').removeClass('hidden');

        }
    });
});