import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Graph from "../graph/Graph"
import { colors } from "../../constants/colors"
import { MOCK_DATA } from "../../constants/mock-data"
import { TYPE, DATE_OF_PUBLICATION } from "../../constants/properties.js"
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
  border: 1px solid #aaa;
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

const NetLongShort = () => {
  const [limit, setLimit] = useState(10000)
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
    </Wrapper>
  )
}

export default NetLongShort
