import { functionProxyHandler } from './pattern_match';
import { Pattern } from './pattern';
import Pipe from './pipe';

const Fraktal = () => {
  return new Proxy({}, functionProxyHandler)
}

export {
	Pattern,
	Pipe,
  Fraktal,
};