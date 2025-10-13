# Use Cases

pipel is suitable for reactive programming scenarios. Compared to reactive data, organizing code with streams offers the following advantages:

- Easier to build reactive logic, reducing business complexity
- More declarative programming paradigm, greatly reducing code volume
- Easier to read code, with clear upstream and downstream relationships

![image](/structure.drawio.svg)

## Building Reactive Logic

For Vue or React developers, using reactive data to trigger view updates brings huge improvements in development efficiency, but reactive data in the logic layer hasn't realized its full potential.

In business logic, reactive data is typically used with watch to listen for data changes (or useEffect to listen for data changes), then trigger logic updates based on data changes. However, this approach has the following problems:

- Poor semantics
- Unclear data flow
- Timing issues are difficult to manage

So its use cases are quite limited, but using pipel's stream programming paradigm allows you to build the entire logic reactively, thus achieving improved development efficiency!
