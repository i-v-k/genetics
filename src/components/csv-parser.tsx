import { type ChangeEvent, useCallback, useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import classes from './csv-parser.module.css'

type CSVData = string[][]

const genesMap: Record<string, string[]> = {
  CC: ['CC', 'GG'],
  CT: ['CT', 'TC', 'GA', 'AG'],
  TC: ['TC', 'CT', 'AG', 'GA'],
  TT: ['TT', 'AA'],
  GG: ['GG', 'CC'],
  GA: ['GA', 'AG', 'CT', 'TC'],
  AG: ['AG', 'GA', 'TC', 'CT'],
  AA: ['AA', 'TT'],
}

export const CSVParser = () => {
  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [baseData, setBaseData] = useState<CSVData | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [fileName1, setFileName1] = useState<string>('')
  const [fileName2, setFileName2] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [resultFinal, setResultFinal] = useState<string[][]>([])

  const handleFileUpload1 = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Пожалуйста, загрузите файл в формате CSV')

      return
    }

    setFileName1(file.name)
    setError('')

    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string
      parseCSV(text)
    }

    reader.readAsText(file)
  }

  const handleFileUpload2 = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!(file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setError('Пожалуйста, загрузите файл в формате XLSX или XLS')
      return
    }

    setFileName2(file.name)
    setError('')

    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })

        // Берем первый лист из книги
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Преобразуем в массив массивов
        const parsedData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as string[][]

        // Фильтруем пустые строки
        const filteredData = parsedData.filter(
          (row) =>
            row.length > 0 && row.some((cell) => cell !== undefined && cell !== ''),
        )

        // Удаляем первую строку (заголовки столбцов)
        const dataWithoutHeaders = filteredData.slice(1)

        // Устанавливаем данные как базовые (не клиентские)
        setBaseData(dataWithoutHeaders)
      } catch (error) {
        setError('Ошибка при парсинге XLSX файла')
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.error('Parsing error:', error)
      }
    }

    reader.readAsArrayBuffer(file)
  }

  const parseCSV = (text: string, isClient = true) => {
    try {
      const lines = text.split('\n')
      const parsedData = lines
        .map((line) => line.split(',').map((value) => value.trim()))
        .filter((row) => row.some((cell) => cell !== '')) // Фильтрация пустых строк

      if (isClient) {
        setCsvData(parsedData)
        setResult('')

        return
      }

      setBaseData(parsedData)
    } catch (error) {
      setError('Ошибка при парсинге CSV файла')
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Parsing error:', error)
    }
  }

  const handleSearch = (): void => {
    // biome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
    if (!csvData || !searchValue) {
      setError('Пожалуйста, загрузите CSV файл и введите значение для поиска')

      return
    }

    setError('')

    // Find row where first cell matches search value
    const matchingRow = csvData.find(
      (row) => row.length > 0 && row[0].toLowerCase() === searchValue.toLowerCase(),
    )

    if (matchingRow && matchingRow.length > 1) {
      setResult(`${matchingRow[1]}, ${matchingRow[2]}, ${matchingRow[3]}`)
    } else {
      setResult('')
      setError('Совпадений не найдено')
    }
  }

  const getData = useCallback((): void => {
    if (!(csvData && baseData)) {
      setError('Пожалуйста, загрузите CSV файл и введите значение для поиска')

      return
    }

    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(baseData)

    const lines: string[][] = []

    for (const item of baseData) {
      const [
        gene,
        geneName,
        geneDesc,
        genotypeV1,
        genotypeV1Desc,
        genotypeV2,
        genotypeV2Desc,
        genotypeV3,
        genotypeV3Desc,
      ] = item

      const matchingRow = csvData.find(
        (row) => row.length > 0 && row[0].toLowerCase() === gene.toLowerCase(),
      )

      if (matchingRow) {
        const genotype = matchingRow?.[3]
        const genesArray = genesMap[genotype]

        let matchingGenotype = ''

        if (genesArray.length > 0) {
          for (const gene of genesArray) {
            if (gene === genotypeV1) {
              matchingGenotype = genotypeV1Desc
            } else if (gene === genotypeV2) {
              matchingGenotype = genotypeV2Desc
            } else if (gene === genotypeV3) {
              matchingGenotype = genotypeV3Desc
            }
          }
        }

        lines.push([
          gene,
          `${geneName}, ${geneDesc.charAt(0).toLowerCase()}${geneDesc.slice(1)}`,
          genotype,
          matchingGenotype,
        ])
      } else {
        lines.push([gene, geneName, 'Не найдено', 'Не найдено'])
      }
    }

    setResultFinal(lines)
  }, [csvData, baseData])

  useEffect(() => {
    if (baseData === null) {
      return
    }

    getData()
  }, [baseData, getData])

  return (
    <div className={classes.csvParser}>
      <div className={classes.fileUpload}>
        <h2>Шаг 1: Загрузите файлы</h2>
        <div className={classes.uploadButtons}>
          <div>
            <p>Загрузить данные клиента (CSV):</p>
            <input type="file" accept=".csv" onChange={handleFileUpload1} />
            {fileName1 && <p>Данные клиента: {fileName1}</p>}
          </div>
          <div>
            <p>Загрузить базу знаний (XLSX):</p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload2}
              disabled={!fileName1}
            />
            {fileName2 && <p>База знаний: {fileName2}</p>}
          </div>
        </div>
      </div>

      {csvData && csvData.length > 0 && (
        <div className={classes.preview}>
          <h3>Предпросмотр данных (первые 5 строк):</h3>
          <table>
            <tbody>
              {csvData.slice(0, 5).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p>Всего строк: {csvData.length}</p>
        </div>
      )}

      {resultFinal && resultFinal.length > 0 && (
        <div className={classes.result}>
          <h3>Результаты по клиенту:</h3>
          <table>
            <tbody>
              {resultFinal.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {csvData && (
        <div className={classes.searchSection}>
          <h2>Шаг 2: Введите значение для поиска</h2>
          <p>Введите значение, которое нужно найти в первой колонке:</p>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Введите значение для поиска"
          />
          <button type="submit" onClick={handleSearch}>
            Найти
          </button>
        </div>
      )}

      {error && <div className={classes.error}>{error}</div>}

      {result && (
        <div className={classes.searchResult}>
          <h2>Результат: {result}</h2>
        </div>
      )}
    </div>
  )
}
