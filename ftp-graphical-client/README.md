<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="center">
  <a href="https://github.com/jerichd4c/web-protocols/tree/main/ftp-graphical-client">
    <img src="https://raw.githubusercontent.com/jerichd4c/ReflexJDBC/main/javascript_logo.svg" alt="Logo" width="80" height="80">
  </a>
</div>

<div align="center">

<h3 align="center">FTP Graphical Client</h3>

  <p align="center">
    A FileZilla-style graphical FTP client, built with Express and a real FTP connection between two physical computers.
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
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#fixed-issues">Fixed Issues</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

A browser-based FTP client, inspired by FileZilla's dual-panel layout: a **Local Site** panel and a **Remote Site** panel side by side, with connect/upload/download/edit/disconnect actions between them. It was built and tested over a real FTP connection between two separate physical machines.

<div align="center">
  <img src="mockup inicial ftp grafico.png" alt="Initial mockup" width="500">
</div>

Besides moving files, it supports opening a remote or local **text file directly in an in-browser editor** and pushing the changes back to either side.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Node.js][Node-badge]][Node-url]
* [![Express][Express-badge]][Express-url]
* [basic-ftp](https://www.npmjs.com/package/basic-ftp) — FTP client library

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* Node.js and npm
* An FTP server running on the remote machine (e.g. FileZilla Server or IIS FTP) — this app is the **client** only, it doesn't implement an FTP server.
* No `package.json` is committed; install the dependencies manually:
  ```sh
  npm install express basic-ftp
  ```

### Installation

1. Install the dependencies above.
2. Run the client:
   ```sh
   node client_ftp.js
   ```
3. Open `http://localhost:3000` and connect using the remote machine's IP, port, user, and password.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Fill in the server, port, user, and password fields and click **Connect**. Once connected, both panels populate with the local and remote file listings. Select a file on either side to enable its available actions — **Upload** (local → remote), **Download** (remote → local), or **Edit** (opens `.txt` files in an in-browser editor that saves back to whichever side it came from). A local and a remote file can be selected at the same time, independently.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- FIXED ISSUES -->
## Fixed Issues

* **Simultaneous selection:** selecting a file on one panel used to clear the selection on the other — each panel now tracks its own selection independently.
* **Remote → local download button:** the download endpoint used to also read the file back as UTF-8 immediately after writing it, which could fail on Windows even after a successful download. The plain download and the "download to edit" flow are now two separate endpoints (`/api/download` and `/api/download_edit`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[Node-badge]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express-badge]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
