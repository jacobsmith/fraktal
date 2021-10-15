import { functionProxyHandler } from './pattern_match';
import { Pattern } from './pattern';
import Pipe from './pipe';

const Fraktal = () => {
	return new Proxy({}, functionProxyHandler)
}

const P = Pattern;

export {
	Pattern,
  P,
	Pipe,
	Fraktal,
};