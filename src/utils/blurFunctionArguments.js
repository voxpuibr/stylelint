import _ from "lodash"
import balancedMatch from "balanced-match"

/**
 * Replace all of the characters that are arguments to a certain
 * CSS function with some innocuous character.
 *
 * This is useful if you need to use a RegExp to find a string
 * but want to ignore matches in certain functions (e.g. `url()`,
 * which might contain all kinds of false positives).
 *
 * For example:
 * blurFunctionArguments("abc url(abc) abc", "url") === "abc url(```) abc"
 *
 * @param {string} source
 * @param {string} functionName
 * @param {[string]} blurChar="`"
 * @return {string} - The result string, with the function arguments "blurred"
 */
export default function (source, functionName, blurChar="`") {
  const nameWithParen = `${functionName}(`
  if (!_.includes(source, nameWithParen)) { return source }

  const functionNameLength = functionName.length

  let result = source
  let searchStartIndex = 0
  while (source.indexOf(nameWithParen, searchStartIndex) !== -1) {
    const openingParenIndex = source.indexOf(nameWithParen, searchStartIndex) + functionNameLength
    const closingParenIndex = balancedMatch("(", ")", source.slice(openingParenIndex)).end + openingParenIndex
    const argumentsLength = closingParenIndex - openingParenIndex - 1
    result = result.slice(0, openingParenIndex + 1) + _.repeat(blurChar, argumentsLength) + result.slice(closingParenIndex)
    searchStartIndex = closingParenIndex
  }
  return result
}
