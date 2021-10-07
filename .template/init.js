/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { exception } = require('console');

const DEST_FOLDER = path.join('src');
const UTIL_FOLDER = path.join('src', 'utils');

const TEMPLATE_FOLDER = path.join('.template', 'template');

let MODULE_NAME;

String.prototype.decapitalize = function () {
  return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const copyFileAndReplaceVariable = (DIRECTORY, FILE) => {
  const TARGET_DIRECTORY = path
    .join(DEST_FOLDER, DIRECTORY)
    .replace(/_?template/g, MODULE_NAME);

  const SOURCE_FILE = path.join(TEMPLATE_FOLDER, DIRECTORY, FILE);
  const TARGET_FILE = path
    .join(TARGET_DIRECTORY, FILE)
    .replace(/_?template/g, MODULE_NAME);

  if (!fs.existsSync(TARGET_DIRECTORY)) {
    fs.mkdirSync(TARGET_DIRECTORY);
  }

  fs.readFile(SOURCE_FILE, 'utf8', (readErr, data) => {
    if (readErr) {
      process.exit(1);
    }
    const result = data
      .replace(/\/\/ /g, '')
      .replace(/_?template/g, MODULE_NAME)
      .replace(/Template/g, MODULE_NAME.capitalize());

    fs.writeFile(TARGET_FILE, result, { flag: 'w' }, (writeErr) => {
      if (writeErr) {
        console.log(writeErr);
        process.exit(1);
      }
      console.log('Created: ', TARGET_FILE);
    });
  });
};

const generateObjectTemplate = (PARENT_FOLDER) => {
  const OBJECT_TYPE_TEMPLATE_FOLDER = path.join(TEMPLATE_FOLDER, PARENT_FOLDER);
  const FILES = fs.readdirSync(OBJECT_TYPE_TEMPLATE_FOLDER);

  FILES.forEach((FILE) => {
    if (FILE === 'init.js') return;

    const CURR_FILE_PATH = path.join(OBJECT_TYPE_TEMPLATE_FOLDER, FILE);
    const CURR_FILE = path.join(PARENT_FOLDER, FILE);
    if (fs.lstatSync(CURR_FILE_PATH).isDirectory()) {
      generateObjectTemplate(CURR_FILE);
      return;
    }

    copyFileAndReplaceVariable(PARENT_FOLDER, FILE);
  });
};

const modifyIndex = (source) => {
  const INDEX_FILE = path.join(source, '_index.ts');
  const BUFFER = `export { ${MODULE_NAME.capitalize()} } from './${MODULE_NAME}';\n`;
  fs.readFile(INDEX_FILE, 'utf8', function (err, data) {
    fs.writeFile(INDEX_FILE, BUFFER, { flag: 'a' }, function (err, result) {
      if (err) {
        console.log('error', err);
        process.exit(1);
      } else {
        console.log(`Updated: ${INDEX_FILE}`);
      }
    });
  });
};

const generateModuleTemplate = () => {
  const destFolder = path.join(DEST_FOLDER, 'modules', MODULE_NAME);

  if (fs.existsSync(destFolder)) {
    console.log('Module Already Exist!');
    process.exit(0);
  }
  fs.mkdirSync(destFolder);

  generateObjectTemplate(path.join('modules', '_template'));
  generateObjectTemplate(path.join('database', 'entities'));
  generateObjectTemplate(path.join('database', 'repositories'));
};

const generateUtilsTemplate = (utilType) => {
  generateObjectTemplate(path.join('utils', utilType));
  modifyIndex(path.join(UTIL_FOLDER, utilType));
};

(() => {
  const args = process.argv.slice(2);
  const TYPE = args[0];
  MODULE_NAME = args[1].decapitalize();

  switch (TYPE) {
    case 'module':
      generateModuleTemplate();
      break;
    case 'enums':
      generateUtilsTemplate('enums');
      break;
    // case 'type':
    //   generateUtilsTemplate('types');
    //   break;
    case 'entity':
      generateObjectTemplate(path.join('database', 'entities'));
      generateObjectTemplate(path.join('database', 'repositories'));
      break;
    default:
      throw new exception('Cannot resolve this type!');
  }

  const eslintFolder = path.join('node_modules', '.bin', 'eslint');
  console.log(`Linting Created File...`);
  exec(`${eslintFolder} ./src --ext ts --fix`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`Completed`);
  });
})();
