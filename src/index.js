function prefixize(prefix, str) {
	return prefix + 
		str.substr(0, 1).toUpperCase() + 
		str.substr(1)
}

function set(namespace, key) {
	const actionName = prefixize('set', key)
	const ACTION_TYPE = `${namespace}/${actionName}`
	const Action = value => ({
		type: ACTION_TYPE,
		value,
	})
	const subReducer = (state, action) => {
		if(action.type === ACTION_TYPE)
			return Object.assign({}, state, {
				[key]: action.value,
			})
	}

	return {
		actionName,
		ACTION_TYPE,
		Action,
		subReducer,
	}
}

function reset(namespace, key, DEFAULT_STATE) {
	const actionName = prefixize('reset', key)
	const ACTION_TYPE = `${namespace}/${actionName}`
	const Action = () => ({ type: ACTION_TYPE })
	const subReducer = (state, action) => {
		if(action.type === ACTION_TYPE)
			return Object.assign({}, state, {
				[key]: DEFAULT_STATE[key],
			})
	}

	return {
		actionName,
		ACTION_TYPE,
		Action,
		subReducer,
	}
}

function inc(namespace, key) {
	const actionName = prefixize('inc', key)
	const ACTION_TYPE = `${namespace}/${actionName}`
	const Action = value => ({
		type: ACTION_TYPE,
		value,
	})
	const subReducer = (state, action) => {
		if(action.type === ACTION_TYPE) {
			return Object.assign({}, state, {
				[key]: state[key] + action.value,
			})
		}
	}
	return {
		actionName,
		ACTION_TYPE,
		Action,
		subReducer,
	}
}

function concat(namespace, key) {
	const actionName = prefixize('concat', key)
	const ACTION_TYPE = `${namespace}/${actionName}`
	const Action = array => ({
		type: ACTION_TYPE,
		array,
	})
	const subReducer = (state, action) => {
		if(action.type === ACTION_TYPE) {
			return Object.assign({}, state, {
				[key]: state[key].concat(action.array),
			})
		}
	}
	return {
		actionName,
		ACTION_TYPE,
		Action,
		subReducer,
	}
}

function revConcat(namespace, key) {
	const actionName = prefixize('revConcat', key)
	const ACTION_TYPE = `${namespace}/${actionName}`
	const Action = array => ({
		type: ACTION_TYPE,
		array,
	})
	const subReducer = (state, action) => {
		if(action.type === ACTION_TYPE) {
			return Object.assign({}, state, {
				[key]: action.array.concat(state[key]),
			})
		}
	}
	return {
		actionName,
		ACTION_TYPE,
		Action,
		subReducer,
	}
}

function slice(namespace, key) {
	const actionName = prefixize('slice', key)
	const ACTION_TYPE = `${namespace}/${actionName}`
	const Action = (from, to) => ({
		type: ACTION_TYPE,
		from, to,
	})
	const subReducer = (state, action) => {
		if(action.type === ACTION_TYPE) {
			return Object.assign({}, state, {
				[key]: state[key].slice(action.from, action.to),
			})
		}
	}
	return {
		actionName,
		ACTION_TYPE,
		Action,
		subReducer,
	}
}

function splice(namespace, key) {
	const actionName = prefixize('splice', key)
	const ACTION_TYPE = `${namespace}/${actionName}`
	const Action = (...args) => ({
		type: ACTION_TYPE,
		args,
	})
	const subReducer = (state, action) => {
		if(action.type === ACTION_TYPE) {
			const newArray = state[key].slice(0)
			newArray.splice.apply(newArray, action.args)
			return Object.assign({}, state, {
				[key]: newArray,
			})
		}
	}
	return {
		actionName,
		ACTION_TYPE,
		Action,
		subReducer,
	}
}

function merge(main, sub, extend) {
	if(extend.ACTION_TYPES[sub.actionName])
		return null
	main.ACTION_TYPES[sub.actionName] = sub.ACTION_TYPE
	main.Actions[sub.actionName] = sub.Action
	main.subReducers.push(sub.subReducer)
}

module.exports = function(namespace, DEFAULT_STATE, extend) {
	extend = extend || {}
	extend.ACTION_TYPES = extend.ACTION_TYPES || {}
	extend.Actions = extend.Actions || {}

	const result = {
		ACTION_TYPES: {},
		Actions: {},
		subReducers: [],
	}

	for(const key in DEFAULT_STATE) {
		const value = DEFAULT_STATE[key]

		merge(result, set(namespace, key), extend)
		merge(result, reset(namespace, key, DEFAULT_STATE), extend)

		if(typeof value === 'number') {
			merge(result, inc(namespace, key), extend)
		}

		if(Array.isArray(value)) {
			merge(result, concat(namespace, key), extend)
			merge(result, revConcat(namespace, key), extend)
			merge(result, slice(namespace, key), extend)
			merge(result, splice(namespace, key), extend)
		}
	}

	result.ACTION_TYPES = Object.assign({}, result.ACTION_TYPES, extend.ACTION_TYPES)
	result.Actions = Object.assign({}, result.Actions, extend.Actions)
	if( extend.subReducer )
		result.subReducers.push(extend.subReducer)

	if( !result.ACTION_TYPES.reset ) {
		result.ACTION_TYPES.reset = `${namespace}/reset`
		result.Actions.reset = () => ({ type: result.ACTION_TYPES.reset })
		result.subReducers.push((state, action) => {
			if( action.type === result.ACTION_TYPES.reset )
				return Object.assign({}, DEFAULT_STATE)
		})
	}

	result.reducer = (state = DEFAULT_STATE, action) => {
		for(const subReducer of result.subReducers) {
			let nextState = subReducer(state, action)
			if( nextState !== undefined )
				return nextState
		}
		return state
	}

	return result
}
