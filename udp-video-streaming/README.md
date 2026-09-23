<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="center">
  <a href="https://github.com/jerichd4c/web-protocols-cohen/tree/main/udp-video-streaming">
    <img src="https://raw.githubusercontent.com/jerichd4c/ReflexJDBC/main/javascript_logo.svg" alt="Logo" width="80" height="80">
  </a>
</div>

<div align="center">

<h3 align="center">UDP Video Streaming</h3>

  <p align="center">
    A web video player streamed end-to-end over raw UDP, relayed through an HTTP bridge for the browser.
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
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#known-limitations">Known Limitations</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Browsers can't speak raw UDP, so this project splits the job across two servers: `udp_server.js` does the actual video streaming over a UDP socket, and `web_server.js` sits in front of it as an HTTP bridge that the browser can talk to normally, translating each HTTP request into a UDP command and streaming the response back as it arrives.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Protocol

The UDP server understands three plain-text commands:

* **`LIST`** → replies with a JSON array of the `.mp4` files available in `videos/`.
* **`GET <filename>`** → streams the file in 32KB chunks; the client (the HTTP bridge) sends back an `ACK` after each chunk before the next one is sent, and the stream ends with an `EOF` message.

Chunk delivery waits on a real `Promise` resolved by the incoming `ACK`, instead of a fixed `setTimeout` — so transfer speed adapts to the network instead of assuming a fixed delay that would behave differently machine to machine.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Node.js][Node-badge]][Node-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* Node.js — no external dependencies, only built-in `http`, `dgram`, `fs`, and `path` modules.

### Installation

1. Start the UDP streaming server:
   ```sh
   node udp_server.js
   ```
2. In a separate terminal, start the HTTP bridge:
   ```sh
   node web_server.js
   ```
3. Open `http://localhost:3000`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

The page lists every `.mp4` file found in `videos/`; click one to load and play it. Selecting a video triggers a `GET` request through the HTTP bridge, which relays it over UDP to `udp_server.js` and streams the chunks straight into the `<video>` element as they arrive.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- KNOWN LIMITATIONS -->
## Known Limitations

* **No seeking:** the video is streamed progressively with no HTTP `Range` support, so scrubbing back/forward in the player isn't reliable — only linear playback from the start.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* Sample video (`videos/mario64.mp4`): clipped from ["Super Mario 64 (TAS) 0 star run in 1:21.54"](https://www.youtube.com/watch?v=W-MrhVPEqRo) by [SuperLuigiGlitchy4](https://www.youtube.com/@SuperLuigiGlitchy), used here only as sample streaming content for this class project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[Node-badge]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
