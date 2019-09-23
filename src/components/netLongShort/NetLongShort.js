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
} from "../../constants/properties.js"
import { BUY, SELL } from "../../constants/values.js"
import netLongShortParser from "./netLongShortParser"
import { groupBy, getTotalPrice, getSum, getDateList } from "../common/utils"
import { COMPANY } from "../../constants/properties"

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
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
  border: 1px solid ${colors.darkestWhite};
  padding: 0.5rem 2rem;
`
const Info = styled.p`
  color: ${colors.darkestWhite};
  font-size: larger;
  margin: 0.1rem;
`
const Value = styled.span`
  color: orange;
`

const getPriceSum = value =>
  (Number(value[PRICE].replace(",", ".")) * Number(value[VOLUME])).toFixed(0)
const sortOnMarketValue = (a, b) => {
  let comparison = 0
  if (getPriceSum(a) > getPriceSum(b)) {
    comparison = -1
  } else if (getPriceSum(a) < getPriceSum(b)) {
    comparison = 1
  }
  return comparison
}

const NetLongShort = () => {
  const [limit, setLimit] = useState(1000000)
  const [companies, setCompanies] = useState([])
  const [companyDateList, setCompanyDateList] = useState([])
  const [companyXY, setCompanyXY] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(undefined)
  const [selectedCompanyPoint, setSelectedCompanyPoint] = useState(1)

  useEffect(() => {
    netLongShortParser()
      .then(response => {
        const buyOrSell = response.filter(
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
  }, [])

  useEffect(() => {
    if (!selectedCompany) return
    const company = selectedCompany[Object.keys(selectedCompany)[0]]
    const lists = getDateList(company)
    setCompanyXY(lists)
    setSelectedCompanyPoint(company.length > 1 ? company.length - 1 : 0)
  }, selectedCompany)

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
      <Header>
        Insider trading, {selectedCompany && Object.keys(selectedCompany)[0]}{" "}
        trend (SEK)
      </Header>
      <Graph
        id={"insider-graph"}
        positions={companyXY}
        selectedPoint={selectedCompanyPoint}
        setSelectedPoint={setSelectedCompanyPoint}
        showZeroLine
        minValue={-limit}
        maxValue={limit}
      />{" "}
      <Wrapper>
        {/* <p>
          {selectedCompany &&
            JSON.stringify(selectedCompany[Object.keys(selectedCompany)[0]])}
        </p> */}
        {/* <p>
          {selectedCompanyPoint &&
          selectedCompany &&
          selectedCompany[Object.keys(selectedCompany)[0]] === 0
            ? "Not found"
            : JSON.stringify(
                Object.keys(selectedCompany[Object.keys(selectedCompany)[0]])
              )}
        </p> */}
        {/* <p>{companyXY && JSON.stringify(companyXY)}</p>
        <p>{selectedCompanyPoint && JSON.stringify(selectedCompanyPoint)}</p> */}
        {selectedCompanyPoint &&
          selectedCompany &&
          selectedCompany[Object.keys(selectedCompany)[0]] &&
          Object.keys(selectedCompany[Object.keys(selectedCompany)[0]]).map(
            point => (
              <>
                {selectedCompany[Object.keys(selectedCompany)[0]][point]
                  .sort(sortOnMarketValue)
                  .map(trade => (
                    <>
                      {companyXY[selectedCompanyPoint] &&
                        trade[DATE_OF_PUBLICATION] ===
                          companyXY[selectedCompanyPoint].x && (
                          <BuySell>
                            <Info>
                              Datum: <Value>{trade[DATE_OF_PUBLICATION]}</Value>
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
                              Instrumentnamn: <Value>{trade[INSTRUMENT]}</Value>
                            </Info>
                            <Info>
                              Volym: <Value>{trade[VOLUME]}</Value>
                            </Info>
                            <Info>
                              Pris: <Value>{trade[PRICE]} SEK</Value>
                            </Info>
                            <Info>
                              Marknadsvärde (volym x pris):{" "}
                              <Value>
                                {(
                                  Number(trade[PRICE].replace(",", ".")) *
                                  Number(trade[VOLUME])
                                ).toFixed(0)}{" "}
                                SEK
                              </Value>
                            </Info>
                          </BuySell>
                        )}
                    </>
                  ))}
              </>
            )
          )}
      </Wrapper>
    </Wrapper>
  )
}

export default NetLongShort
