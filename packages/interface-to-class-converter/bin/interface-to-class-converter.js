#!/usr/bin/env node
const { generateClassesFromFile } = require('../dist/interface-to-class-converter.cjs.js');

// Command line execution handling
const [inputFilePath, outputFilePath, excludeNamespacesArg, excludeInterfacesArg] = process.argv.slice(2);
if (!inputFilePath || !outputFilePath) {
  console.error('Usage: interface-to-class-converter <inputFilePath> <outputFilePath> [excludeNamespaces] [excludeInterfaces]');
  process.exit(1);
}

const excludeNamespaces = excludeNamespacesArg ? excludeNamespacesArg.split(',').map((item) => item.trim()) : [];
const excludeInterfaces = excludeInterfacesArg ? excludeInterfacesArg.split(',').map((item) => item.trim()) : [];

generateClassesFromFile(inputFilePath, outputFilePath, excludeNamespaces, excludeInterfaces);
