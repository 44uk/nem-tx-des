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
          const json = JSON.parse(this.serialized);
          const parsed = nemTxDes.parse(json['data'])
          this.signature = json['signature']
          this.message = null
          return parsed
        } catch(err) {
          console.error(err.message)
          this.message = err.message
          return {}
        }
      }
    }
  })
})
