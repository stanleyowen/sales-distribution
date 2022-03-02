from win32com import client

excel = client.Dispatch("Excel.Application")
  
sheets = excel.Workbooks.Open('E:/db/excel-template.xlsx')
work_sheets = sheets.Worksheets[0]
work_sheets.ExportAsFixedFormat(0, 'E:/db/tmp/excel-template.html')
