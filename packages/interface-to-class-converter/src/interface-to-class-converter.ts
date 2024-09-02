import * as fs from 'fs';
import * as ts from 'typescript';

// Read the Interfaces File
function readInterfacesFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

// Traverse Namespaces and Collect Interfaces
function collectInterfaces(
  node: ts.Node,
  checker: ts.TypeChecker,
  namespacePrefix: string = '',
  excludeNamespaces: string[] = [],
  excludeInterfaces: string[] = []
): string[] {
  const classes: string[] = [];

  node.forEachChild((childNode) => {
    if (ts.isModuleDeclaration(childNode) && childNode.body && ts.isModuleBlock(childNode.body)) {
      const currentNamespace = namespacePrefix
        ? `${namespacePrefix}.${childNode.name.text}`
        : childNode.name.text;

      // Skip this namespace if it's in the exclude list
      if (excludeNamespaces.includes(currentNamespace)) {
        console.log(`Excluding namespace: ${currentNamespace}`);
        return;
      }

      // Recursively collect classes from nested namespaces
      classes.push(
        ...collectInterfaces(childNode.body, checker, currentNamespace, excludeNamespaces, excludeInterfaces)
      );
    } else if (ts.isInterfaceDeclaration(childNode)) {
      const fullName = namespacePrefix ? `${namespacePrefix}.${childNode.name.text}` : childNode.name.text;

      // Skip this interface if it's in the exclude list and not in a namespace
      if (!namespacePrefix && excludeInterfaces.includes(childNode.name.text)) {
        console.log(`Excluding interface: ${childNode.name.text}`);
        return;
      }

      classes.push(generateClass(childNode, checker, fullName));
    }
  });

  return classes;
}

// Recursively gather constructor parameters from inheritance chain
function collectInheritedConstructorParams(
  interfaceNode: ts.InterfaceDeclaration,
  checker: ts.TypeChecker,
  accumulatedParams: string[] = []
): string[] {
  if (interfaceNode.heritageClauses) {
    for (const clause of interfaceNode.heritageClauses) {
      for (const type of clause.types) {
        const baseType = checker.getTypeAtLocation(type.expression);
        const baseSymbol = baseType.getSymbol();
        if (baseSymbol) {
          const baseDeclaration = baseSymbol.declarations![0] as ts.InterfaceDeclaration;
          const baseProperties = baseDeclaration.members
            .filter(ts.isPropertySignature)
            .map((member) => {
              const name = (member.name as ts.Identifier).text;
              const typeNode = member.type ? checker.getTypeAtLocation(member.type) : null;
              const type = typeNode ? checker.typeToString(typeNode) : 'any';
              return `${name}: ${type}`;
            });

          // Accumulate base properties and recursively collect from parent interfaces
          accumulatedParams.push(...baseProperties);
          collectInheritedConstructorParams(baseDeclaration, checker, accumulatedParams);
        }
      }
    }
  }
  return accumulatedParams;
}

// Generate Class Code from Interface
function generateClass(interfaceNode: ts.InterfaceDeclaration, checker: ts.TypeChecker, fullName: string): string {
  const className = fullName.split('.').pop(); // Use only the interface name for the class, ignoring namespaces

  // Handle inheritance
  const heritageClauses = interfaceNode.heritageClauses
    ? interfaceNode.heritageClauses.map((clause) => {
      const types = clause.types.map((type) => {
        const typeName = type.getText().split('.').pop(); // Only take the base name of the type
        return typeName;
      }).join(', ');
      return `extends ${types}`;
    })
    : [];

  // Collect constructor parameters from inheritance chain
  const inheritedConstructorParams = collectInheritedConstructorParams(interfaceNode, checker);

  // Collect properties of the current interface
  const properties = interfaceNode.members
    .filter(ts.isPropertySignature)
    .map((member) => {
      const name = (member.name as ts.Identifier).text;
      let type = 'any'; // Default to 'any' if the type cannot be determined

      if (member.type) {
        try {
          const typeNode = checker.getTypeAtLocation(member.type);
          type = checker.typeToString(typeNode);
        } catch (error) {
          console.error(`Failed to resolve type for property ${name} in ${className}, defaulting to 'any'`);
        }
      }
      return `${name}: ${type}`;
    });

  // Combine inherited and current constructor parameters
  const constructorArgs = [...inheritedConstructorParams, ...properties].join(', ');

  // Prepare constructor body and super call
  const constructorBody = properties.map((prop) => {
    const propName = prop.split(':')[0].trim();
    return `    this.${propName} = ${propName};`;
  }).join('\n');

  const superCallArgs = inheritedConstructorParams.map(param => param.split(':')[0].trim()).join(', ');
  const superCall = heritageClauses.length > 0 && superCallArgs ? `super(${superCallArgs});` : '';

  return `
class ${className} ${heritageClauses.join(' ')} {
  ${properties.map(prop => `public ${prop};`).join('\n')}

  constructor(${constructorArgs}) {
    ${superCall}
${constructorBody}
  }
}`;
}

// Generate the Output File
function generateClassesFile(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  outputFilePath: string,
  excludeNamespaces: string[],
  excludeInterfaces: string[]
): void {
  const classes = collectInterfaces(sourceFile, checker, '', excludeNamespaces, excludeInterfaces).join('\n\n');
  fs.writeFileSync(outputFilePath, classes);
  console.log(`Classes generated and written to ${outputFilePath}`);
}

// Main function to generate classes from an input file
export function generateClassesFromFile(
  inputFilePath: string,
  outputFilePath: string,
  excludeNamespaces: string[] = [],
  excludeInterfaces: string[] = []
): void {
  const program = ts.createProgram([inputFilePath], {});
  const checker = program.getTypeChecker();

  const sourceFile = program.getSourceFile(inputFilePath);
  if (!sourceFile) {
    throw new Error(`Cannot find source file: ${inputFilePath}`);
  }

  generateClassesFile(sourceFile, checker, outputFilePath, excludeNamespaces, excludeInterfaces);
}

// Command line execution handling
if (require.main === module) {
  const [inputFilePath, outputFilePath, excludeNamespacesArg, excludeInterfacesArg] = process.argv.slice(2);
  if (!inputFilePath || !outputFilePath) {
    console.error('Usage: interface-to-class-converter <inputFilePath> <outputFilePath> [excludeNamespaces] [excludeInterfaces]');
    process.exit(1);
  }

  const excludeNamespaces = excludeNamespacesArg ? excludeNamespacesArg.split(',').map((item) => item.trim()) : [];
  const excludeInterfaces = excludeInterfacesArg ? excludeInterfacesArg.split(',').map((item) => item.trim()) : [];

  console.log(`Excluding namespaces: ${excludeNamespaces.join(', ')}`);
  console.log(`Excluding interfaces: ${excludeInterfaces.join(', ')}`);

  generateClassesFromFile(inputFilePath, outputFilePath, excludeNamespaces, excludeInterfaces);
}
