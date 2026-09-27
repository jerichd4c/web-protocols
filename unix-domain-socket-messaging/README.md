<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="center">
  <a href="https://github.com/jerichd4c/web-protocols-cohen/tree/main/unix-domain-socket-messaging">
    <img src="https://raw.githubusercontent.com/jerichd4c/ReflexJDBC/main/c_logo.svg" alt="C Logo" width="70" height="70">
    <img src="https://raw.githubusercontent.com/jerichd4c/ReflexJDBC/main/python_logo.svg" alt="Python Logo" width="70" height="70">
  </a>
</div>

<div align="center">

<h3 align="center">Unix Domain Socket Messaging</h3>

  <p align="center">
    A local client/server chat over a Unix Domain Socket (a pipe backed by a filesystem path instead of an IP/port) — implemented twice, in C and in Python.
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#c">C</a></li>
        <li><a href="#python">Python</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#fixed-issues">Fixed Issues</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Unlike a regular TCP/UDP socket, a **Unix Domain Socket** doesn't connect over an IP and port — it's bound to a path on the filesystem (`uds_endpoint.socket`) and only reachable by processes on the same machine, acting like a bidirectional pipe between client and server. This project is a minimal chat over that pipe: the client sends a line of text, the server echoes back a confirmation, and either side can end the session with `SALIR`. The same protocol is implemented twice, once in **C** using the raw `sys/socket.h` / `sys/un.h` API, and once in **Python** using the standard `socket` module with `AF_UNIX`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![C][C-badge]][C-url]
* [![Python][Python-badge]][Python-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* A Unix-like environment (Linux or WSL) — `AF_UNIX`/`sys/un.h` are POSIX-specific and this won't run on native Windows.
* A C compiler (`gcc`) for the C version.
* Python 3 for the Python version (no external packages needed).

### C

```sh
gcc -o server server.c
gcc -o client client.c
./server      # in one terminal
./client      # in another
```

### Python

```sh
python3 server.py   # in one terminal
python3 client.py   # in another
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Start the server first — it creates the `uds_endpoint.socket` file and waits for a connection. Then start the client, type a message and press Enter to get a confirmation back from the server. Type `SALIR` (case-insensitive, in either language) on the client to end the session; the server then goes back to waiting for a new client.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- FIXED ISSUES -->
## Fixed Issues

* **C — `SALIR` was case-sensitive:** only the exact strings `"SALIR"` or `"salir"` were recognized, so `"Salir"` (or any other casing) was treated as a regular message instead of ending the session. Both `server.c` and `client.c` now compare with `strcasecmp`, matching the Python version's `.upper()` check.
* **C server — no cleanup on Ctrl+C:** the server had no signal handler, so killing it with Ctrl+C skipped the code that removes the `uds_endpoint.socket` file, leaving it behind until the next run. Added a `SIGINT` handler that closes the socket and deletes the file before exiting, matching the Python server's `except KeyboardInterrupt` cleanup.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[C-badge]: https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=c&logoColor=black
[C-url]: https://en.wikipedia.org/wiki/C_(programming_language)
[Python-badge]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/
