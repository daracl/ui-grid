export const exportField = {
  name: 'fileFormat',
  label: '',
  width: 280,
  defaultValue: 'excel',
  renderer: {
    type: 'exportFile',
    listItem: {
      list: [
        { label: '엑셀 (.xlsx)', value: 'excel' },
        { label: 'CSV (.csv)', value: 'csv' },
        { label: 'JSON (.json)', value: 'json' },
        { label: 'PDF (.pdf)', value: 'pdf' },
      ],
    },
    exportOptions: {
      excel: { fileName: 'toolbar-sales.xlsx', sheetName: '매출' },
      csv: { fileName: 'toolbar-sales.csv' },
      json: { fileName: 'toolbar-sales.json' },
      pdf: { fileName: 'toolbar-sales.pdf', orientation: 'landscape' },
    },
  },
};
