import { Pattern } from './index'

describe('Pattern', () => {
  describe('string', () => {
    const testCases = [
      { arg: "", expectedValue: true },
      { arg: "test", expectedValue: true },
      { arg: new Date(), expectedValue: false },
      { arg: null, expectedValue: false },
      { arg: undefined, expectedValue: false },
    ]

    test.each(testCases)('.string($arg, $expectedValue)', ({ arg, expectedValue }) => 
      expect(Pattern.string(arg)).toEqual(expectedValue) 
    )
  })
  
  describe('integer', () => {
    const testCases = [
      { arg: "", expectedValue: false },
      { arg: 1, expectedValue: true },
      { arg: 1.5, expectedValue: false },
      { arg: 6e10, expectedValue: true },
    ]

    test.each(testCases)('.integer($arg, $expectedValue)', ({ arg, expectedValue }) => 
      expect(Pattern.integer(arg)).toEqual(expectedValue) 
    )
  })
  
  describe('number', () => {
    const testCases = [
      { arg: "", expectedValue: false },
      { arg: 1, expectedValue: true },
      { arg: 1.5, expectedValue: true },
      { arg: 6e10, expectedValue: true },
      { arg: 3.14, expectedValue: true },
      { arg: Math.PI, expectedValue: true },
    ]

    test.each(testCases)('.number($arg, $expectedValue)', ({ arg, expectedValue }) => 
      expect(Pattern.number(arg)).toEqual(expectedValue) 
    )
  })
  
  describe('anyValue', () => {
    const testCases = [
      { arg: "", expectedValue: true },
      { arg: 1, expectedValue: true },
      { arg: {}, expectedValue: true },
      { arg: null, expectedValue: false },
      { arg: undefined, expectedValue: false },
      { arg: false, expectedValue: true },
    ]

    test.each(testCases)('.anyValue($arg, $expectedValue)', ({ arg, expectedValue }) => 
      expect(Pattern.anyValue(arg)).toEqual(expectedValue) 
    )
  })
  
  describe('objWithKeys', () => {
    const testCases = [
      { patternObj: {}, argObj: {},  expectedValue: true },
      { patternObj: { hello: "world" }, argObj: {},  expectedValue: false },
      { patternObj: { hello: "world" }, argObj: { hello: "there" },  expectedValue: false },

      { patternObj: { hello: Pattern.string }, argObj: { hello: 1 },  expectedValue: false },
      { patternObj: { hello: Pattern.string }, argObj: { hello: "there" },  expectedValue: true },

      { patternObj: { hello: true }, argObj: { hello: true },  expectedValue: true },
      { patternObj: { hello: true }, argObj: { hello: false },  expectedValue: false },

      { patternObj: { student: { name: Pattern.string } }, argObj: { student: {} },  expectedValue: false },
      { patternObj: { student: { name: Pattern.string } }, argObj: { student: { name: undefined } },  expectedValue: false },
      { patternObj: { student: { name: Pattern.string } }, argObj: { student: { name: "Jacob" } },  expectedValue: true },
    ]

    test.each(testCases)('.anyValue($patternObj, $argObj, $expectedValue)', ({ patternObj, argObj, expectedValue }) => 
      expect(Pattern.objWithKeys(patternObj)(argObj)).toEqual(expectedValue) 
    )
  })
})