<script>
import XLSX from 'xlsx'


// NOTE: exportToXLSX example
// workbookData = [{
//     wb_name: 'animals',
//     wb_data: [
//       {"name": "cat", "category": "animal"},
//       {"name": "dog", "category": "animal"},
//       {"name": "pig", "category": "animal"}
//     ]
//   },
//   {
//     wb_name: 'pokemons',
//     wb_data: [
//       {"name": "pikachu", "category": "pokemon"},
//       {"name": "Arbok", "category": "pokemon"},
//       {"name": "Eevee", "category": "pokemon"}
//     ]
//   }]

const exportToXLSX = (fileName, workbookData) => {
  if (workbookData.length === 0 || fileName === '')
    return

  var wb = XLSX.utils.book_new()
  for (let workbook of workbookData) {
    let wbName = workbook.wb_name
    let wbData = workbook.wb_data
    var wbSheet = XLSX.utils.json_to_sheet(wbData)
    XLSX.utils.book_append_sheet(wb, wbSheet, wbName)
  }
  XLSX.writeFile(wb, `${ fileName }.xlsx`)
}

export default {
  exportTo: {
    xlsx: exportToXLSX,
  },
}
</script>
