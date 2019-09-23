import { PRICE, VOLUME, TYPE } from "../../constants/properties.js"
import { SELL } from "../../constants/values.js"

export const groupBy = (arr, property) => {
  return arr.reduce(function(memo, x) {
    if (!memo[x[property]]) {
      memo[x[property]] = []
    }
    memo[x[property]].push(x)
    return memo
  }, {})
}

export const getTotalPrice = list =>
  list.map(x =>
    x[TYPE].toLowerCase().includes(SELL)
      ? -(
          parseFloat(x[PRICE].replace(",", ".")) *
          parseFloat(x[VOLUME].replace(",", "."))
        )
      : parseFloat(x[PRICE].replace(",", ".")) *
        parseFloat(x[VOLUME].replace(",", "."))
  )

export const getSum = list => list.reduce((a, b) => a + b, 0).toFixed(2)

export const numberWithSpaces = x => {
  var parts = x.toString().split(".")
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return parts.join(".")
}

export const getDateList = dateLists =>
  Object.keys(dateLists)
    .map(date => ({
      x: date,
      y: parseFloat(getSum(getTotalPrice(dateLists[date]))),
    }))
    .reverse()
