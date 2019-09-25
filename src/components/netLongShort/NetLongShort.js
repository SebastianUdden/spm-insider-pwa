import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Graph from "../graph/Graph"
import { colors } from "../../constants/colors"
import { MOCK_DATA } from "../../constants/mock-data"
import {
  TYPE,
  DATE_OF_PUBLICATION,
  NAME,
  TITLE,
  INSTRUMENT,
  VOLUME,
  PRICE,
  CURRENCY,
  STATE,
} from "../../constants/properties.js"
import { BUY, SELL } from "../../constants/values.js"
import netLongShortParser from "./netLongShortParser"
import {
  groupBy,
  getDateList,
  getPriceSum,
  numberWithSpaces,
  getTotalSum,
} from "../common/utils"
import { COMPANY } from "../../constants/properties"
import api from "../common/api"

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto 1rem;
  border: ${p => (p.border ? `1px solid ${colors.darkestWhite}` : "none")};
`
const Input = styled.input`
  padding: 0.8rem;
  margin: 1rem 0;
  background-color: ${colors.brightGrey};
  color: ${colors.white};
  width: 100%;
  border: 1px solid ${colors.darkestWhite};
  border-radius: 0.3rem;
`
const Select = styled.select`
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
  height: 3rem;
  background-color: ${colors.brightGrey};
  color: ${colors.white};
  cursor: pointer;
`
const Option = styled.option``
const Header = styled.h2``
const BuySell = styled.div`
  border: ${p => (p.noBorder ? "none" : `1px solid ${colors.darkestWhite}`)};
  padding: 0.5rem 2rem;
`
const Info = styled.p`
  color: ${colors.darkestWhite};
  font-size: larger;
  margin: 0.1rem;
`
const Value = styled.span`
  color: ${p =>
    p.color !== undefined
      ? p.color
        ? colors.green
        : colors.red
      : colors.orange};
`
const FlexInfo = styled(Info)`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
`
const Box = styled.div`
  width: 100%;
`

const getSEKPriceSum = (value, exchangeRates) =>
  getPriceSum(value) / exchangeRates[value[CURRENCY]]

const sortOnMarketValue = (a, b, exchangeRates) => {
  let comparison = 0
  if (getSEKPriceSum(a, exchangeRates) > getSEKPriceSum(b, exchangeRates)) {
    comparison = -1
  } else if (
    getSEKPriceSum(a, exchangeRates) < getSEKPriceSum(b, exchangeRates)
  ) {
    comparison = 1
  }
  return comparison
}

const sortOnMarketValueSEK = (a, b) => {
  let comparison = 0
  if (a.marketValueSEK > b.marketValueSEK) {
    comparison = -1
  } else if (b.marketValueSEK > a.marketValueSEK) {
    comparison = 1
  }
  return comparison
}

const NetLongShort = () => {
  const [startDate, setStartDate] = useState("2019-09-12")
  const [endDate, setEndDate] = useState("2019-09-15")
  const [limit, setLimit] = useState(100000000)
  const [companies, setCompanies] = useState([])
  const [companyDateList, setCompanyDateList] = useState([])
  const [companyXY, setCompanyXY] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(undefined)
  const [selectedCompanyPoint, setSelectedCompanyPoint] = useState(0)
  const [exchangeRates, setExchangeRates] = useState(undefined)
  const [dateSummary, setDateSummary] = useState([])

  useEffect(() => {
    api
      .get("https://api.exchangeratesapi.io/latest?base=SEK")
      .then(res => {
        setExchangeRates(res.rates)
      })
      .catch(res => {
        console.error(res)
      })
  }, [])

  useEffect(() => {
    if (!exchangeRates) return
    netLongShortParser()
      .then(response => {
        const buyOrSell = response.filter(
          x =>
            x[TYPE].toLowerCase().includes(SELL) ||
            x[TYPE].toLowerCase().includes(BUY)
        )
        const filteredBuyOrSell = buyOrSell.filter(
          x => x[STATE] !== "Makulerad" && x[STATE] !== "Reviderad"
        )

        const companiesGroup = groupBy(filteredBuyOrSell, COMPANY)
        setCompanies(["National", ...Object.keys(companiesGroup).sort()])

        const national = {
          National: groupBy(filteredBuyOrSell, DATE_OF_PUBLICATION),
        }
        const datesSummarized = Object.keys(national.National).map(date => {
          const uniqueCompanies = [
            ...new Set(
              national.National[date].map(transaction => transaction[COMPANY])
            ),
          ]
          const valuation = uniqueCompanies
            .map(company => {
              const companyTransactions = national.National[date].filter(
                x => x[COMPANY] === company
              )
              return {
                name: company,
                marketValueSEK: Number(
                  getTotalSum(companyTransactions, exchangeRates)
                ),
              }
            })
            .sort(sortOnMarketValueSEK)
          return {
            date,
            valuation,
          }
        })
        setDateSummary(datesSummarized)

        setCompanyDateList([
          national,
          ...Object.keys(companiesGroup)
            .sort()
            .map(company => ({
              [company]: groupBy(companiesGroup[company], DATE_OF_PUBLICATION),
            }))
            .reverse(),
        ])
        setSelectedCompany(national)
      })
      .catch(res => {
        console.error("Something went wrong...\n\nRUN FOR THE HILLS! \n", res)
        const buyOrSell = MOCK_DATA.filter(
          x =>
            x[TYPE].toLowerCase().includes(SELL) ||
            x[TYPE].toLowerCase().includes(BUY)
        )
        const companiesGroup = groupBy(buyOrSell, COMPANY)
        setCompanies(["National", ...Object.keys(companiesGroup).sort()])

        const national = { National: groupBy(buyOrSell, DATE_OF_PUBLICATION) }
        setCompanyDateList([
          national,
          ...Object.keys(companiesGroup)
            .sort()
            .map(company => ({
              [company]: groupBy(companiesGroup[company], DATE_OF_PUBLICATION),
            }))
            .reverse(),
        ])
        setSelectedCompany(national)
      })
  }, [exchangeRates])

  useEffect(() => {
    if (!selectedCompany) return
    const company = selectedCompany[Object.keys(selectedCompany)[0]]
    const lists = exchangeRates ? getDateList(company, exchangeRates) : []
    setCompanyXY(lists)
    setSelectedCompanyPoint(company.length > 1 ? company.length - 1 : 0)
  }, selectedCompany)

  useEffect(() => {
    console.log(startDate)
    console.log(endDate)
    const results = companyXY
      .slice()
      .filter(
        date =>
          new Date(date.x) > new Date(startDate) &&
          new Date(date.x) < new Date(endDate)
      )
    console.log("Results: ", results)
    setCompanyXY(results)
  }, [startDate, endDate])

  return (
    <Wrapper>
      <Input
        type="number"
        value={limit}
        onChange={e => setLimit(e.target.value)}
      />
      {companies && (
        <Select
          onChange={e =>
            setSelectedCompany(
              companyDateList.find(c => c.hasOwnProperty(e.target.value))
            )
          }
        >
          {companies.map(c => (
            <Option value={c}>{c}</Option>
          ))}
        </Select>
      )}
      <Wrapper>
        <Input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </Wrapper>
      <Header>
        Insider trading, {selectedCompany && Object.keys(selectedCompany)[0]}{" "}
        trend (SEK)
      </Header>
      {exchangeRates && (
        <>
          <Graph
            id={"insider-graph"}
            positions={companyXY}
            selectedPoint={selectedCompanyPoint}
            setSelectedPoint={setSelectedCompanyPoint}
            showZeroLine
            minValue={-limit}
            maxValue={limit}
          />{" "}
          <>
            {selectedCompany && Object.keys(selectedCompany)[0] === "National" && (
              <>
                <Wrapper border>
                  <BuySell>
                    <FlexInfo>
                      <Box>Name of company</Box>
                      <Box>Market value of net bought-sold</Box>
                    </FlexInfo>
                  </BuySell>
                  {dateSummary[selectedCompanyPoint].valuation.slice(0, 5).map(
                    company =>
                      company.marketValueSEK > 0 && (
                        <BuySell noBorder>
                          <FlexInfo>
                            <Box>
                              <Value>{company.name}</Value>
                            </Box>
                            <Box>
                              <Value color={company.marketValueSEK > 0}>
                                {numberWithSpaces(
                                  company.marketValueSEK.toFixed(0)
                                )}{" "}
                                SEK
                              </Value>
                            </Box>
                          </FlexInfo>
                          <Info></Info>
                        </BuySell>
                      )
                  )}
                </Wrapper>
                <Wrapper border>
                  <BuySell>
                    <FlexInfo>
                      <Box>Name of company</Box>
                      <Box>Market value of net bought-sold</Box>
                    </FlexInfo>
                  </BuySell>
                  {dateSummary &&
                    dateSummary[selectedCompanyPoint].valuation
                      .slice(
                        dateSummary[selectedCompanyPoint].valuation.length - 5,
                        dateSummary[selectedCompanyPoint].valuation.length
                      )
                      .reverse()
                      .map(
                        company =>
                          company.marketValueSEK < 0 && (
                            <BuySell noBorder>
                              <FlexInfo>
                                <Box>
                                  <Value>{company.name}</Value>
                                </Box>
                                <Box>
                                  <Value color={company.marketValueSEK > 0}>
                                    {numberWithSpaces(
                                      company.marketValueSEK.toFixed(0)
                                    )}{" "}
                                    SEK
                                  </Value>
                                </Box>
                              </FlexInfo>
                              <Info></Info>
                            </BuySell>
                          )
                      )}
                </Wrapper>
              </>
            )}
            {selectedCompany && Object.keys(selectedCompany)[0] !== "National" && (
              <Wrapper>
                {selectedCompanyPoint &&
                  selectedCompany &&
                  selectedCompany[Object.keys(selectedCompany)[0]] &&
                  Object.keys(
                    selectedCompany[Object.keys(selectedCompany)[0]]
                  ).map(point => (
                    <>
                      {selectedCompany[Object.keys(selectedCompany)[0]][point]
                        .sort((a, b) => sortOnMarketValue(a, b, exchangeRates))
                        .map(trade => (
                          <>
                            {companyXY[selectedCompanyPoint] &&
                              trade[DATE_OF_PUBLICATION] ===
                                companyXY[selectedCompanyPoint].x && (
                                <BuySell>
                                  <Info>
                                    Datum:{" "}
                                    <Value>{trade[DATE_OF_PUBLICATION]}</Value>
                                  </Info>
                                  <Info>
                                    Namn: <Value>{trade[NAME]}</Value>
                                  </Info>
                                  <Info>
                                    Befattning: <Value>{trade[TITLE]}</Value>
                                  </Info>
                                  <Info>
                                    Typ: <Value>{trade[TYPE]}</Value>
                                  </Info>
                                  <Info>
                                    Status: <Value>{trade[STATE]}</Value>
                                  </Info>
                                  <Info>
                                    Instrumentnamn:{" "}
                                    <Value>{trade[INSTRUMENT]}</Value>
                                  </Info>
                                  <Info>
                                    Volym:{" "}
                                    <Value>
                                      {numberWithSpaces(trade[VOLUME])}
                                    </Value>
                                  </Info>
                                  <Info>
                                    Pris:{" "}
                                    <Value>
                                      {numberWithSpaces(trade[PRICE])}{" "}
                                      {trade[CURRENCY]}
                                    </Value>
                                  </Info>
                                  <Info>
                                    Lokalt Marknadsvärde (volym x pris):{" "}
                                    <Value>
                                      {numberWithSpaces(
                                        getPriceSum(trade).toFixed(0)
                                      )}{" "}
                                      {trade[CURRENCY]}
                                    </Value>
                                  </Info>
                                  <Info>
                                    Marknadsvärde SEK (volym x pris):{" "}
                                    <Value>
                                      {numberWithSpaces(
                                        (
                                          getPriceSum(trade) /
                                          exchangeRates[trade[CURRENCY]]
                                        ).toFixed(0)
                                      )}{" "}
                                      SEK
                                    </Value>
                                  </Info>
                                </BuySell>
                              )}
                          </>
                        ))}
                    </>
                  ))}
              </Wrapper>
            )}
          </>
        </>
      )}
    </Wrapper>
  )
}

export default NetLongShort

// {/* <p>
//         {selectedCompany &&
//           JSON.stringify(selectedCompany[Object.keys(selectedCompany)[0]])}
//       </p> */}
//       {/* <p>
//         {selectedCompanyPoint &&
//         selectedCompany &&
//         selectedCompany[Object.keys(selectedCompany)[0]] === 0
//           ? "Not found"
//           : JSON.stringify(
//               Object.keys(selectedCompany[Object.keys(selectedCompany)[0]])
//             )}
//       </p> */}
//       {/* <p>{companyXY && JSON.stringify(companyXY)}</p>
//       <p>{selectedCompanyPoint && JSON.stringify(selectedCompanyPoint)}</p> */}
