import {
  PRICE,
  VOLUME,
  VOLUME_UNIT,
  TYPE,
  CURRENCY,
} from "../../constants/properties.js"
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

export const getPriceSum = value =>
  value[VOLUME_UNIT].toLowerCase() === "belopp"
    ? Number(value[VOLUME])
    : Number(value[PRICE].replace(",", ".")) * Number(value[VOLUME])

export const getTotalPrice = (list, exchangeRates) =>
  list.map(
    x =>
      (x[TYPE].toLowerCase().includes(SELL)
        ? -getPriceSum(x)
        : getPriceSum(x)) / exchangeRates[x[CURRENCY]]
  )

export const getSum = list => list.reduce((a, b) => a + b, 0).toFixed(2)

export const getTotalSum = (list, exchangeRates) =>
  getSum(getTotalPrice(list, exchangeRates))

export const numberWithSpaces = x => {
  var parts = x.toString().split(".")
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return parts.join(".")
}

export const getDateList = (dateLists, exchangeRates) =>
  Object.keys(dateLists)
    .map(date => ({
      x: date,
      y: parseFloat(getSum(getTotalPrice(dateLists[date], exchangeRates))),
    }))
    .reverse()
