module.exports = (input) => ({

  initial : {
    background : 'rgba(255,255,255,.25)',
    transition : '.05s'
  },

  flash : {
    cssOutput : input,
    copied    : true,
    outputBG  : {
      background : 'rgba(255,255,255,.75)',
      transition : '.05s'
    }
  },

  cooldown : {
    outputBG: {
      background : 'rgba(255,255,255,.25)',
      transition : '.5s'
    }
  },

  done: {
    copied: false
  }

})