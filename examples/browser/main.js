window.addEventListener('DOMContentLoaded', function () {
  var app = new Vue({
    el: '#app',
    data: {
      serialized: null,
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
        return type
      },
      version2str: function (version) {
        return version
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
