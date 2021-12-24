const path = require('path')
const fs = require('fs')

let websiteTemplates = require('../config/website-templates')
let websiteThemes = require('../config/website-themes')


let createFolderFromPath = (path) => {
  let arrDir = path.split('/')
  if (!arrDir)
    return

  let dirPath = ''
  for (let index in arrDir) {
    if (index === 0)
      dirPath = arrDir[index]
    else
      dirPath = `${ dirPath }/${ arrDir[index] }`
    if (dirPath[0] === '/')
      dirPath = dirPath.substring(1)
    if (!fs.existsSync(dirPath)) {
      try {
        fs.mkdirSync(dirPath)
      } catch (err) {
        console.error(err)
      }
    }
  }
}

// NOTE: use https://www.npmjs.com/package/watch for listen changes on directory and regenerate templateFileNames
const generateTemplateFileNames = (templatesPath) => {
  console.log('== templatesPath ==', templatesPath)
  let files = fs.readdirSync(`server-app/view/${ templatesPath }/`)
  let templateFileNames = []
  for (let index in files) {
    let file = files[index]
    let fileExt = path.extname(file)
    let fileName = path.basename(file, fileExt)
    if (fileName.indexOf('template-') >= 0 && fileExt.indexOf('.ejs') >= 0)
      templateFileNames.push({
        id: index,
        template_name: fileName.replace('template-', ''),
        template_full_name: fileName,
      })
  }
  websiteTemplates.templates = templateFileNames
}

const generateThemeNames = () => {
  let files = fs.readdirSync('server-app/view/')
  let themes = []
  for (let ia in files) {
    let fileExt = path.extname(files[ia])
    let fileName = path.basename(files[ia], fileExt)
    if (!fileExt) {
      let dir = fileName
      let subDirFiles = fs.readdirSync(`server-app/view/${ dir }`)
      for (let ib in subDirFiles) {
        let fileExt = path.extname(subDirFiles[ib])
        let fileName = path.basename(subDirFiles[ib], fileExt)
        let fullFileName = `${ fileName }${ fileExt }`
        if (fullFileName === 'theme.json') {
          let jsonFile = JSON.parse(fs.readFileSync(`server-app/view/${ dir }/theme.json`, 'utf8'))
          themes.push(jsonFile)
        }
      }
    }
  }
  websiteThemes.themes = themes
}

module.exports = {
  createFolderFromPath: createFolderFromPath,
  generateTemplateFileNames: generateTemplateFileNames,
  generateThemeNames: generateThemeNames,
}
