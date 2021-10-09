import { functionProxyHandler, objWithKeys, Pattern, reactProxyHandler } from './pattern_match';
import Pipe from './pipe';

const Fraktal = (opts = { react: false }) => {
	if (opts.react) {
		return new Proxy({}, reactProxyHandler)
	}

	return new Proxy({}, functionProxyHandler)
}

export {
	objWithKeys,
	Pattern,
	Pipe,
  Fraktal,
};