<div id="top"></div>
<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/xatellite/netex-deckplan-editor">
    <img src="doc/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h2 align="center">NeTEx Deckplan Editor</h3>

  <p align="center">
    Create and edit public transport vehicle layouts. Recieve interoperable NeTEx deckplans.
    <br />
    <a href="https://xatellite.github.io/netex-deckplan-editor"><strong>Check out the Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/xatellite/netex-deckplan-editor/issues">Report Bug</a>
    ·
    <a href="https://github.com/xatellite/netex-deckplan-editor/issues">Request Feature</a>
    ·
    <a href="mailto:hi@xatellite.space?subject=%5BDeckplan%5D">Send Feedback</a>
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
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#calculation-methods">Calculation Methods</a></li>
      </ul>
    </li>
    <li>
      <a href="#setting-up-developing-environment">Setting up Developing Environment</a>
      <ul>
        <li><a href="#backend-setup">Backend Setup</a></li>
        <li><a href="#frontend-setup">Frontend Setup</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![Deckplan editor annotate screen screenshot][annotate-screenshot]

This repository houses the NeTEx deckplan editor library and a usage demo.
The library aims to provide reference for working with NeTEx deckplans and is used for research accelerating the use of NeTEx data exchange for vehicle information.

It also is used as part of [OpenTrainTicketing](https://opentrainticketing.com/en)

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

This project was build with:

[![Vue][Vue.js]][Vue-url]
[![Vite][Vite]][Vite-url]

and serves vue and webcomponents for better interoperable use with other webframeworks.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

This project allows you to

... define **accurate representations of vehicle interior** <br>
... edit each element within the deckplan <br>
... define deckspaces <br>
... place locatable spots within the deck <br>
... arrange elements within a **grid**<br>
... produce accurate representations of decks<br>
... render NeTEx deckplans as exact **svg** representations for use in booking and management flows<br>
... (future) render NeTEx deckplans as grid **svg** representations for use in booking and management flows<br>

<p align="right">(<a href="#top">back to top</a>)</p>

## Screenshots

![XML view of demo editor][xml-screenshot]
![Build view of demo editor][build-screenshot]
![Exact build view of demo editor][build-exact-screenshot]

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Setting up Developing Environment

This is a short guide to setup your own development environment of this project.

1. To start of clone the Repo:

   ```sh
   $ git clone https://github.com/xatellite/netex-deckplan-editor.git
   ```

2. Install all NPM packages

   ```sh
   $ npm install
   ```

3. Start development server with demo application
   ```js
   $ npm run dev
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this project better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
If this project brings you any value or inspires you don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Email: [hi@xatellite.space](mailto:hi@xatellite.space)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

The following pages and resources have been very helpful in the creation of the project:

- [README Template - @OthneilDrew](https://github.com/othneildrew/Best-README-Template)
- [Choose an Open Source License - @ChooseaLicense](https://choosealicense.com)
- [Img Shields - @ShieldIO](https://shields.io)

<p align="right">(<a href="#top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/xatellite/netex-deckplan-editor.svg?style=for-the-badge
[contributors-url]: https://github.com/xatellite/netex-deckplan-editor/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/xatellite/netex-deckplan-editor.svg?style=for-the-badge
[forks-url]: https://github.com/xatellite/netex-deckplan-editor/network/members
[stars-shield]: https://img.shields.io/github/stars/xatellite/netex-deckplan-editor.svg?style=for-the-badge
[stars-url]: https://github.com/xatellite/netex-deckplan-editor/stargazers
[issues-shield]: https://img.shields.io/github/issues/xatellite/netex-deckplan-editor.svg?style=for-the-badge
[issues-url]: https://github.com/xatellite/netex-deckplan-editor/issues
[license-shield]: https://img.shields.io/github/license/xatellite/netex-deckplan-editor.svg?style=for-the-badge
[license-url]: https://github.com/xatellite/netex-deckplan-editor/blob/master/LICENSE
[annotate-screenshot]: ./doc/images/editor_01.png
[xml-screenshot]: ./doc/images/editor_02.png
[build-screenshot]: ./doc/images/editor_03.png
[build-exact-screenshot]: ./doc/images/editor_04.png
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Vite]: https://img.shields.io/badge/Vite-35495E?style=for-the-badge&logo=Vite&logoColor=646CFF
[Vite-url]: https://vitejs.dev/
