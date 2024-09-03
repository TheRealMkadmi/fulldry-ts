# Interface to Class Converter

Convert TypeScript interfaces to classes with ease. This CLI tool allows you to quickly generate TypeScript classes from your interfaces, including handling inheritance, constructor generation, and property typing.

## Installation

You can install the package globally or use it with `npx`.

### Global Installation

```bash
npm install -g interface-to-class-converter
```

### Usage with npx

```bash
npx interface-to-class-converter <inputFilePath> <outputFilePath> [excludeNamespaces] [excludeInterfaces]
```

## Usage

### Basic Usage

You can use `interface-to-class-converter` to generate classes from a TypeScript file containing interfaces. Simply provide the input file path and the output file path.

```bash
npx interface-to-class-converter src/interfaces.ts dist/classes.ts
```

### Excluding Specific Namespaces

If you want to exclude certain namespaces from the conversion process, you can provide a comma-separated list of namespaces to exclude.

```bash
npx interface-to-class-converter src/interfaces.ts dist/classes.ts "namespace1,namespace2"
```

### Excluding Specific Interfaces

Similarly, you can exclude specific interfaces that are not within namespaces.

```bash
npx interface-to-class-converter src/interfaces.ts dist/classes.ts "" "Interface1,Interface2"
```

## Example

### Input (interfaces.ts)

```typescript
export namespace std {
  export interface BaseObject {
    id: string;
  }
  export interface $Object extends BaseObject {}
  export interface FreeObject extends BaseObject {}
}
```

### Output (classes.ts)

```typescript
class BaseObject {
  public id: string;

  constructor(id: string) {
    this.id = id;
  }
}

class $Object extends BaseObject {
  public id: string;

  constructor(id: string) {
    super(id);
    this.id = id;
  }
}

class FreeObject extends BaseObject {
  public id: string;

  constructor(id: string) {
    super(id);
    this.id = id;
  }
}
```

## Advanced Usage

You can integrate this tool into your build process or use it as part of a larger TypeScript code generation workflow.

### Adding to package.json scripts

```json
{
  "scripts": {
    "generate-classes": "interface-to-class-converter src/interfaces.ts dist/classes.ts"
  }
}
```

Run it with:

```bash
npm run generate-classes
```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/TheRealMkadmi/interface-to-class-converter/issues).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, feel free to open an issue on [GitHub](https://github.com/TheRealMkadmi/interface-to-class-converter/issues) or reach out to me directly.

## Author

- GitHub: [@TheRealMkadmi](https://github.com/TheRealMkadmi)
- Twitter: [@TheRealMkadmi](https://twitter.com/TheRealMkadmi)
