var app = new Vue({
  el: '#app',
  data: {
    serialized: null,
    message: null
  },
  filters: {
    uxem2xem: function (uxem) {
      return uxem ? uxem / 1000000 : ''
    },
    nemtime2time: function (nemtime) {
      return nemtime ?
        new Date(Date.UTC(2015, 2, 29, 0, 6, 25, 0) + (nemtime * 1000)) :
        ''
    }
  },
  computed: {
    deserialized: function () {
      if (this.serialized == '' || this.serialized == null) { return {} }
      try {
        const json = JSON.parse(this.serialized);
        const parsed = nemTxDes.parse(json['data'])
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
