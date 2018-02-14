```javascript
const reduxAutoGenerate = require('redux-auto-generate')

const DEFAULT_STATE = {
  title: '',
  count: 0,
  items: [],
}

const extend = {
  ACTION_TYPES: {
    randomCount: 'something/randomCount'
  },

  Actions: {
    randomCount: () => ({ type: 'something/randomCount' })
  },

  subReducer: (state = DEFAULT_STATE, action) => {
    if(action.type === 'something/randomCount')
      return {...state, ...{ count: Math.floor(Math.random() * 100) }}

    return state
  }
}

const result = reduxAutoGenerate('something', DEFAULT_STATE, extend)

console.log(result)
/*****
{
  DEFAULT_STATE: {
    title: '',
    count: 0,
    items: [],
  },

  ACTION_TYPES: {
    setTitle: 'something/setTitle',
    resetTitle: 'something/resetTitle',

    setCount: 'something/setCount',
    resetCount: 'something/resetCount',
    incCount: 'something/incCount',

    setItems: 'something/setItems',
    resetItems: 'something/resetItems',
    concatItems: 'something/concatItems',
    revConcatItems: 'something/revConcatItems',
    sliceItems: 'something/sliceItems',
    spliceItems: 'something/spliceItems',

    randomCount: 'something/randomCount',

    reset: 'something/reset'
  },

  Actions: {
    setTitle: [function],
    resetTitle: [function],

    setCount: [function],
    resetCount: [function],
    incCount: [function],

    setItems: [function],
    resetItems: [function],
    concatItems: [function],
    revConcatItems: [function],
    sliceItems: [function],
    spliceItems: [function],

    randomCount: [function],

    reset: [function]
  },

  reducer: [function]
}
*****/

```
