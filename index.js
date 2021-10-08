import { functionProxyHandler, objWithKeys, Pattern } from './pattern_match';
import Pipe from './pipe';

const Fraktal = () => {
  return new Proxy({}, functionProxyHandler)
}

export {
	objWithKeys,
	Pattern,
	Pipe,
  Fraktal,
};