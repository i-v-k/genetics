import { type ChangeEvent, useCallback, useEffect, useState } from 'react'
import classes from './csv-parser.module.css'

type CSVData = string[][]

interface DataItem {
  gene: string
  geneName: string
  geneDesc: string
  genotypeV1: string
  genotypeV1Desc: string
  genotypeV2: string
  genotypeV2Desc: string
  genotypeV3: string
  genotypeV3Desc: string
}

const data: DataItem[] = [
  {
    gene: 'rs4988235',
    geneName: 'Лактаза',
    geneDesc: 'Расщепляет лактозу до глюкозы и галактозы (молочные продукты).',
    genotypeV1: 'CC',
    // genotypeV1: 'GG',
    genotypeV1Desc:
      'Активность фермента лактазы снижена на 70–100%, лактазная недостаточность. Рекомендуется безлактозная диета, ограничение молочных продуктов. Иногда возможен прием фермента лактаза. Необходимо принимать на постоянной основе кальций и витамин D3, так как исключаются молочные продукты.',
    genotypeV2: 'CT',
    // genotypeV2: 'GA',
    genotypeV2Desc:
      'Активность фермента лактазы снижена на 30–50%. Рекомендуется диета с ограничением молочных продуктов. Иногда возможен прием фермент лактаза, а также курс пробиотиков. Необходимо следить за уровнем кальция.',
    genotypeV3: 'TT',
    // genotypeV3: 'AA',
    genotypeV3Desc: 'Нет мутации в гене фермента лактазы, коррекция не требуется.',
  },
  {
    gene: 'rs182549',
    geneName: 'Лактаза',
    geneDesc: 'Расщепляет лактозу до глюкозы и галактозы (молочные продукты).',
    genotypeV1: 'CC',
    genotypeV1Desc:
      'Активность фермента лактазы снижена на 70%, лактазная недостаточность. Рекомендуется безлактозная диета, ограничение молочных продуктов. Иногда возможен прием фермента лактаза. Необходимо принимать на постоянной основе кальций и витамин D3, так как исключаются молочные продукты.',
    genotypeV2: 'CT',
    genotypeV2Desc:
      'Активность фермента лактазы снижена на 30–50%. Рекомендуется диета с ограничением молочных продуктов. Иногда возможен прием фермент лактаза, а также курс пробиотиков. Необходимо следить за уровнем кальция.',
    genotypeV3: 'TT',
    genotypeV3Desc: 'Нет мутации в гене фермента лактазы, коррекция не требуется.',
  },
  {
    gene: 'rs4244372',
    geneName: 'Амилаза слюны',
    geneDesc: 'Начинает гидролиз крахмала во рту.',
    genotypeV1: 'AA',
    genotypeV1Desc:
      'Высокая активность амилазы слюны. Ниже концентрация глюкозы в крови после употребления крахмала. Коррекция не требуется.',
    genotypeV2: 'AT',
    genotypeV2Desc:
      'Сниженная активность амилазы слюны. Следить за количеством потребляемых крахмалов, отслеживать реакцию в ЖКТ после употребления. Добавить в рацион больше клетчатки, тщательно пережёвывать, добавить пробиотики.',
    genotypeV3: 'TT',
    genotypeV3Desc:
      'Низкая активность амилазы слюны, зависимостью от жирных кислот для получения энергии. Риск диабета и ожирения. Снизить употребление крахмалов, добавить в рацион больше клетчатки, тщательно пережёвывать. Контроль ГИ, добавить пробиотики.',
  },
  {
    gene: 'rs11185098',
    geneName: 'Амилаза поджелудочная',
    geneDesc: 'Продолжает расщепление крахмала в кишечнике.',
    genotypeV1: 'GG',
    genotypeV1Desc:
      'Более низкая активность амилазы, хуже расщипляются углеводы, выше риск гипергликемии, инсулинорезистентности и ожирения при диете с большим количеством крахмала. Необходима снижение углеводов (белый хлеб, рис, картофель), увеличение клетчатки и  жиров. Медленное пережевывание.',
    genotypeV2: 'GA',
    genotypeV2Desc:
      'Промежуточная активность (иногда обозначается как «нормальная»), но необходимо соблюдать баланс - не стоит употреблять завышенное количество углеводов. Коррекция не требуется.',
    genotypeV3: 'AA',
    genotypeV3Desc:
      'Более высокая активность амилазы. Отлично расщепляются углеводы, быстрее расщепляется крахмал, после крахмалистой пищи ниже гликемический ответ. Коррекция не требуется. ',
  },
  {
    gene: 'rs3131972',
    geneName: 'Амилаза поджелудочная',
    geneDesc: 'Продолжает расщепление крахмала в кишечнике.',
    genotypeV1: 'GG',
    genotypeV1Desc: 'Test GG',
    genotypeV2: 'GA',
    genotypeV2Desc: 'Test GA !!!',
    genotypeV3: 'AA',
    genotypeV3Desc: 'Test AA',
  },
]

export const CSVParser = () => {
  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [resultFinal, setResultFinal] = useState<string[][]>([])

  console.log('!!!!!!!!!!!!!! 2')

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Пожалуйста, загрузите файл в формате CSV')

      return
    }

    setFileName(file.name)
    setError('')

    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string
      parseCSV(text)
    }

    reader.readAsText(file)
  }

  const parseCSV = (text: string) => {
    try {
      const lines = text.split('\n')
      const parsedData = lines.map((line) => line.split(',').map((value) => value.trim()))

      setCsvData(parsedData)
      setResult('')
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
    if (!csvData) {
      setError('Пожалуйста, загрузите CSV файл и введите значение для поиска')

      return
    }

    const lines: string[][] = []

    for (const item of data) {
      const matchingRow = csvData.find(
        (row) => row.length > 0 && row[0].toLowerCase() === item.gene.toLowerCase(),
      )

      if (matchingRow) {
        const genotype = matchingRow?.[3]
        const matchingGenotype =
          item.genotypeV1.toLowerCase() === genotype.toLowerCase()
            ? item.genotypeV1Desc
            : item.genotypeV2.toLowerCase() === genotype.toLowerCase() ||
                item.genotypeV2.toLowerCase() ===
                  [...genotype].reverse().join('').toLowerCase()
              ? item.genotypeV2Desc
              : item.genotypeV3.toLowerCase() === genotype.toLowerCase()
                ? item.genotypeV3Desc
                : 'пусто'

        lines.push([item.gene, item.geneName, genotype, matchingGenotype])
      } else {
        lines.push([item.gene, item.geneName, 'Не найдено', 'Не найдено'])
      }
    }

    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.dir(lines, { depth: null })
    setResultFinal(lines)
  }, [csvData])

  useEffect(() => {
    if (csvData === null) {
      return
    }

    getData()
  }, [csvData, getData])

  return (
    <div className={classes.csvParser}>
      <div className={classes.fileUpload}>
        <h2>Шаг 1: Загрузите CSV файл</h2>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        {fileName && <p>Загружен файл: {fileName}</p>}
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

      <p>!!!!!!!!!!!!!!!!!!!!</p>

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
