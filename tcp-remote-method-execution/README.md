<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="center">
  <a href="https://github.com/jerichd4c/web-protocols-cohen/tree/main/tcp-remote-method-execution">
    <img src="https://raw.githubusercontent.com/jerichd4c/ReflexJDBC/main/javascript_logo.svg" alt="Node.js Logo" width="70" height="70">
    <img src="https://raw.githubusercontent.com/jerichd4c/ReflexJDBC/main/java_logo.svg" alt="Java Logo" width="70" height="70">
  </a>
</div>

<div align="center">

<h3 align="center">TCP Remote Method Execution</h3>

  <p align="center">
    A TCP server that executes a method of a class living on the server machine, on request from a remote client — implemented twice, in Node.js and in Java.
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#protocol">Protocol</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#nodejs">Node.js</a></li>
        <li><a href="#java">Java</a></li>
      </ul>
    </li>
    <li><a href="#fixed-issues">Fixed Issues</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

A raw TCP socket server that exposes a small set of classes (`Calculator`, `TextModifier`, `CurrencyConverter`) and executes any of their methods on request, using **reflection** to resolve the class and method dynamically at runtime instead of hardcoding a route per operation. The same command-line menu and wire protocol are implemented twice — once in **Node.js** (loading classes dynamically from a `classes/` folder) and once in **Java** (using `java.lang.reflect`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Protocol

The client sends a single pipe-delimited line: `ClassName|methodName|types|values`, and the server replies with the plain result.

```
Select a class
1. Calculator   2. Text Modifier   3. Currency Converter   4. Exit
Choice: 1

Select an operation
1. Add   2. Subtract   3. Divide   4. Exit
Choice: 1
Enter first number: 1
Enter second number: 2

[CLIENT] sending: Calculator|add|int,int|1,2
[SERVER] receiving: Calculator|add|int,int|1,2
Result: 3
```

Argument types (`int`, `float`, `string`) are auto-detected client-side from the raw input and sent alongside the values so the server knows how to parse and invoke the method with the right parameter types.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Node.js][Node-badge]][Node-url]
* [![Java][Java-badge]][Java-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Node.js

No external dependencies — only Node's built-in `net` and `readline` modules.

```sh
cd NodeJS
node server.js      # in one terminal
node client.js      # in another
```

Classes are loaded dynamically from `NodeJS/classes/` at server startup — adding a new class there (with a matching `module.exports`) makes it available without touching `server.js`.

### Java

```sh
cd Java
javac -d out classes/*.java Client.java Server.java
java -cp out Server   # in one terminal
java -cp out Client   # in another
```

The server resolves classes via `Class.forName("classes." + className)`, so it must be run from the `Java/` directory (where the `classes/` source folder lives).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- FIXED ISSUES -->
## Fixed Issues

* **Java — "Conversor" menu was broken:** the client sent the class name as `"Conversor"`, but the actual class is `CurrencyConverter` — the server couldn't find it via reflection. Fixed by sending the correct class name.
* **Java — currency conversion still failed after that fix:** `CurrencyConverter.dollarToEuro`/`bolivarToDollar` only accepted `float`, but the client classifies whole-number input (e.g. `100`) as `int`, so the reflection lookup still failed for the most common input. Fixed by changing both methods to accept `int`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[Node-badge]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Java-badge]: https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white
[Java-url]: https://www.java.com/
