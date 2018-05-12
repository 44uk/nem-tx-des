window.addEventListener('DOMContentLoaded', function () {
  // copy from http://phiary.me/javascript-url-parameter-query-string-parse-stringify/
  var QueryString = {
    parse: function(text, sep, eq, isDecode) {
      text = text || location.search.substr(1);
      sep = sep || '&';
      eq = eq || '=';
      var decode = (isDecode) ? decodeURIComponent : function(a) { return a; };
      return text.split(sep).reduce(function(obj, v) {
        var pair = v.split(eq);
        obj[pair[0]] = decode(pair[1]);
        return obj;
      }, {});
    },
    stringify: function(value, sep, eq, isEncode) {
      sep = sep || '&';
      eq = eq || '=';
      var encode = (isEncode) ? encodeURIComponent : function(a) { return a; };
      return Object.keys(value).map(function(key) {
        return key + eq + encode(value[key]);
      }).join(sep);
    },
  };
  var params = QueryString.parse()
  var serialized = params['data'] ? JSON.stringify(params) : null

  var TYPES = {
    257:   'TRANSFER',
    2049:  'IMPORTANCE_TRANSFER',
    4097:  'MULTISIG_AGGREGATE_MODIFICATION',
    4098:  'MULTISIG_SIGNATURE',
    4100:  'MULTISIG',
    8193:  'PROVISION_NAMESPACE',
    16385: 'MOSAIC_DEFINITION_CREATION',
    16386: 'MOSAIC_SUPPLY_CHANGE'
  }

  var app = new Vue({
    el: '#app',
    data: {
      serialized: serialized,
      signature: null,
      message: null
    },
    filters: {
      uxem2xem: function (uxem) {
        return Number.isInteger(uxem) ? uxem / 1000000 : ''
      },
      nemtime2time: function (nemtime) {
        return nemtime ?
          new Date(Date.UTC(2015, 2, 29, 0, 6, 25, 0) + (nemtime * 1000)) :
          ''
      },
      messageType2str: function (type) {
        return type === 1 ? 'Plain' : 'Encrypted'
      },
      mosaicId2str: function (mosaicId) {
        return `${mosaicId['namespaceId']}:${mosaicId['name']}`
      },
      type2str: function (type) {
        var typeStr = TYPES[type]
        return typeStr ? typeStr : 'UnknownType'
      },
      version2str: function (version) {
        // TODO:
        var versionStr = version
        return versionStr ? versionStr : 'UnknownVersion'
      }
    },
    computed: {
      deserialized: function () {
        if (this.serialized == '' || this.serialized == null) { return {} }
        try {
          let result = {}
          var json = JSON.parse(this.serialized);
          var parsed = nemTxDes.parse(json['data'])
          this.signature = json['signature']
          this.message = null
          result = parsed['otherTrans'] ? parsed['otherTrans'] : parsed
          result['multisig'] = parsed['otherTrans'] ? parsed : null
          return result
        } catch(err) {
          console.error(err.message)
          this.message = err.message
          return {}
        }
      }
    },
    methods: {
      change_file: function () {
        var file = this.$refs.file.files[0]
        if (!/^image\/(jpe?g|png|gif)/.test(file.type)) {
          console.error('Allowed only image file.')
          this.message = 'Allowed only image file.'
          return false
        }
        var self = this
        var reader = new FileReader()
        reader.onload = function (_ev) {
          var img = new Image()
          var cvs = document.createElement('canvas')
          var ctx = cvs.getContext('2d')
          img.onload = function (_ev) {
            cvs.width = img.width
            cvs.height = img.height
            ctx.drawImage(img, 0, 0)
            imgData = ctx.getImageData(0, 0, cvs.width, cvs.height)
            var qr = jsQR(imgData.data, imgData.width, imgData.height)
            self.serialized = qr.data
            self.message = null
          }
          img.src = reader.result
        }
        reader.readAsDataURL(file)
      }
    }
  })
})
