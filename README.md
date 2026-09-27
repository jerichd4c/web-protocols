<a id="readme-top"></a>

<br />
<div align="center">
  <img src="https://img.shields.io/badge/Web%20Protocols-URU-blue?style=for-the-badge" alt="Web Protocols" width="320" height="40">

<h3 align="center">Web Protocols - Sebastian Cohen</h3>

  <p align="center">
    Repository for the Web Protocols course at URU. It gathers the final versions of the class exercises and projects built around TCP, UDP, and higher-level protocols on top of them.
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-repository">About The Repository</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#repository-structure">Repository Structure</a></li>
    <li><a href="#main-projects">Main Projects</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>

## About The Repository

This repository brings together the material covered in the **Web Protocols** course. Its purpose is to keep the final, working version of each class exercise and project in one organized place — everything from raw TCP/UDP sockets to a full FTP client and a UDP-based video streaming service.

Each project folder is self-contained and has its own README with setup instructions and implementation details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Node.js][Node-badge]][Node-url]
* [![Java][Java-badge]][Java-url]
* [![Python][Python-badge]][Python-url]
* [![C][C-badge]][C-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

Each project has its own dependencies and run instructions — see its individual README linked in [Main Projects](#main-projects).

### Prerequisites

* Node.js and npm
* A JDK (for the TCP project's Java implementation)
* Python 3 (for the WebSocket example, the serial image bridge, and the UDS project)
* A C compiler and a Unix-like environment (Linux/WSL) for the UDS project's C implementation

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jerichd4c/web-protocols.git
   ```
2. Open the folder for the project you want to run.
3. Follow that project's own README.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Repository Structure

These are the practices and projects currently available in the repository:

* `ftp-graphical-client/`: FileZilla-style graphical FTP client between two physical machines.
* `tcp-remote-method-execution/`: TCP server that executes methods of server-side classes via reflection, implemented in both Node.js and Java.
* `udp-video-streaming/`: web video player streamed over raw UDP through an HTTP bridge.
* `serial-image-bridge/`: desktop app that transmits images to a microcontroller byte-by-byte over serial.
* `unix-domain-socket-messaging/`: local client/server chat over a Unix Domain Socket, implemented in both C and Python.
* `websocket-example/`: small in-class WebSocket demo in Python (client/server "hello world").

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Main Projects

These are the most substantial works developed during the course. Each one has its own internal documentation.

### [FTP Graphical Client](ftp-graphical-client/README.md)
A dual-panel FTP client (local/remote), built with Express and `basic-ftp`, tested over a real connection between two physical computers.
* **Features**: connect/upload/download, in-browser text file editing on either side, independent local+remote selection.
* **Documentation**: [Project README](ftp-graphical-client/README.md)

### [TCP Remote Method Execution](tcp-remote-method-execution/README.md)
A TCP server that resolves a class and method by reflection and executes it on request — implemented twice, in Node.js and in Java.
* **Features**: dynamic class loading, a shared pipe-delimited wire protocol, matching CLI menus in both languages.
* **Documentation**: [Project README](tcp-remote-method-execution/README.md)

### [UDP Video Streaming](udp-video-streaming/README.md)
A browser video player backed by a custom UDP streaming protocol (`LIST`/`GET`/`ACK`/`EOF`), bridged to HTTP for the browser.
* **Features**: chunked UDP transfer with promise-based ACK flow control, video listing and playback in the browser.
* **Documentation**: [Project README](udp-video-streaming/README.md)

### [Serial Image Bridge](serial-image-bridge/README.md)
A CustomTkinter desktop app that sends an image to a microcontroller byte-by-byte over serial, with a handshake protocol, and reconstructs whatever comes back.
* **Features**: grayscale + downsampling pipeline, serial handshake, live transmission log.
* **Documentation**: [Project README](serial-image-bridge/README.md)

### [Unix Domain Socket Messaging](unix-domain-socket-messaging/README.md)
A local client/server chat over a Unix Domain Socket (a filesystem-path pipe instead of an IP/port) — implemented twice, in C and in Python.
* **Features**: matching wire protocol in both languages, graceful shutdown and cleanup of the socket file on both server implementations.
* **Documentation**: [Project README](unix-domain-socket-messaging/README.md)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

This roadmap summarizes the course progress and can keep growing as new units or assignments are added.

- [x] Raw TCP sockets and remote method execution via reflection.
- [x] Raw UDP sockets and a UDP-backed video streaming service.
- [x] A full FTP client between two physical machines.
- [x] Serial communication with a microcontroller (Arduino/ESP32).
- [x] Unix Domain Sockets (UDS) client/server for local message passing.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[Node-badge]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Java-badge]: https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white
[Java-url]: https://www.java.com/
[Python-badge]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/
[C-badge]: https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=c&logoColor=black
[C-url]: https://en.wikipedia.org/wiki/C_(programming_language)
