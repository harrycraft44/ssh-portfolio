// server.js
const blessed = require('blessed');

function startApp(stream, ptyInfo) {
  console.log('Starting blessed app with ptyInfo:', ptyInfo);
  
  const screen = blessed.screen({
    smartCSR: true,
    input: stream,
    output: stream,
    terminal: ptyInfo.term || 'xterm-256color',
    fullUnicode: true,
    width: ptyInfo.cols || 80,
    height: ptyInfo.rows || 24
  });

  console.log('Screen created successfully');

  const header = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: '{center}{bold}Harry Rogers{/bold}{/center}',
    tags: true,
    border: { type: 'line' },
    style: { fg: 'white', bg: 'blue', border: { fg: 'cyan' } }
  });

  const content = blessed.box({
    top: 3,
    left: 0,
    width: '100%',
    height: '70%',
    content: '{center}Welcome!{/center}\n\nPress [A] About, [S] Skills, [P] Projects, [C] Contact, [ESC] Quit.',
    tags: true,
    border: { type: 'line' },
    style: { fg: 'white', bg: 'black', border: { fg: 'green' } }
  });

  const footer = blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: '{center}[A] About • [S] Skills • [P] Projects • [C] Contact • [ESC] Quit{/center}',
    tags: true,
    border: { type: 'line' },
    style: { fg: 'white', bg: 'black', border: { fg: 'yellow' } }
  });


  screen.on('error', (err) => {
    console.error('Blessed screen error:', err);
    stream.end();
  });

  let skillCardsAppended = false;

  function forceRender() {
    screen.render();
    if (stream && stream.flush) {
      try { stream.flush(); } catch (e) {}
    }
  }

  const aboutText = '{center}Hi, I\'m Harry Rogers!{/center}\n\nA passionate developer with anything you can name\n\nFind me on GitHub: https://github.com/harrycraft44\n\n..................................................................\n..................................................................\n....................@@@@@@@@@@@@@@@@@@@@..........................\n.................@@@@@@@@@@@@@@@@@@@@@@@@@@@......................\n................@@@@@........@........@@@@@@@@....................\n..............@@@@...@@@@@@@@..@@@...@...@@@@@@...................\n..............@@..@@.....@@@@.....@@........@@@@..................\n.............@@@.@..@@@@@@@@@@@@@@@@@@..@@@..@@@@.................\n............@@...@@@@@@@@@.....@....@@@@..@@@..@@@................\n...........@@..@@..@@@.....@@.@@......@@@@..@@@.@@................\n...........@@...@.@@@....@@@.@@.........@@....@@@@@...............\n..........@@.@...@@@...@@@..@@...........@@.@.@@.@@...............\n..........@@.@.@.@@@.@@@@.@@@@...........@@@...@@@@@..............\n..........@..@@..@@@...@..................@@...@@.@@..............\n.........@@..@@..@@@..@......@@@@@@@@@@@@@@@@...@.@@@.............\n.........@@..@@..@@@@@@@@@@@@@@@@@@@@@@@@@@@@...@@.@@@............\n.........@@..@@..@@@@@@@@@@@@@..............@....@@.@@............\n.........@@..@....@..........@@@@@@@@@@@@@@@@@...@@.@@............\n.........@@..@......@@@@@@@@@@@@.@@@@@@@@@@@@@...@..@@............\n.........@@...@..@@@@@@@@@@@@@@@.@@@@@@@@@..@@...@.@@@............\n.........@@.@.@..@@@@..@@@..................@@@...@@@@............\n..........@@.@....@@@.......@@@@@@@@@@@@@@@@.@@...@@..............\n...........@@..@..@@@@..@@...@@@@@@@.....@@..@...@@...............\n............@@@.@..@@@.@@.............@@....@@@@@@@...............\n..............@.@..@@...@@@@@@@@@@@@@@@@....@@.@@@................\n...........@@@@.@..@@.@....................@@@@@..................\n...........@@..@..@@@..@@.@@@@@@@@@@.....@@@....@@................\n...........@@@@@.@@@@@@..@....@@...@@@.@@@@..@@@@@@@@.............\n.......@@@@..@@.@@@...@@@..@@.........@@@@.@@@....@@@@............\n..@@@@@@...@.....@@@...@@@@.@@@@@@@@@.@@@...@@...@@.@@@...........\n.@@.....@@@.......@@@@...@@@..........@@..@........@.@@...........\n.@..@@@@.....@@....@@@@@...@@@@@@@.@.@@@..@.....@....@@...........\n..........@.........@@@@@@...........@@.......@@......@@..........\n....@@@@@@....@@......@@@@@@@@@@@@@@@@@......@@.....@.@@..........\n..........@@.@..@@......@@@@@@@@@@@@@@...@@@@@....@.@..@@.........\n.................................................................\n';
  const skillsText = '{center}Skills{/center}\n\n{bold}{cyan-fg}Programming Languages:{/cyan-fg}{/bold}\n  - Node.js\n  - JavaScript\n  - Bash\n  - Python\n  - C#\n  - C++\n  - C\n  - PHP\n  - VB\n  - HTML\n  - CSS\n  - Visual Basic .NET\n  - Rust\n\n{bold}{green-fg}Frameworks & Libraries:{/green-fg}{/bold}\n  - Express.js\n  - .NET\n  - .NET Core\n  - Pygame\n  - Torque2D\n  - Unreal Engine 4 (UE4)\n\n{bold}{yellow-fg}Tools & Platforms:{/yellow-fg}{/bold}\n  - Linux\n  - Git\n  - VS Code\n  - SQLite\n  - fs-extra\n  - busboy\n  - Project templates\n  - Config management\n\n{bold}{magenta-fg}Other:{/magenta-fg}{/bold}\n  - Game Development\n  - Minecraft Modding\n  - 3D Modeling\n  - API Development (REST, Node.js, JavaScript)\n  - Ad-blocking (browser extensions)\n  - File uploaders\n  - Sorting algorithms\n  - Malware research\n  - Web scraping/crawling\n  - HTML5 Media Players\n  - Automation\n  - Cross-language development\n  - Linux Server Management\n  - Custom console development (UE4)\n  - IP/Network utilities (UE4 plugin)\n  - Cross-platform development (Windows, Linux, web)\n  - Security research';
  const contactText = '{center}{bold}Contact{/bold}{/center}\n\n{cyan-fg}Email:{/cyan-fg} harryayiotis1@gmail.com\n{cyan-fg}LinkedIn:{/cyan-fg} https://www.linkedin.com/in/harry-rogers-380904370/\n{cyan-fg}Discord:{/cyan-fg} exclamation_mark.\n';
  const projects = [
    {
      name: 'Secure file storage',
      details: 'a secure file storage solution built with node js and sql lite, featuring encryption that only can be accessed by the user.'
    },
    {
      name: 'Retro search engine',
      details: 'a retro search engine that allows you to search the web like before google, it uses custom crawlers and indexes using bm25 and nodejs server. with realtime stats on news built using 2000 rss feeds and stock market data using yahoo finance api and MaxMind for geolocation to get the location for the news and the weather.'
    },
    {
      name: 'Satellite Tracking site',
      details: 'A web application for tracking satellites using propagation with old data and deck.gl for visualizations and satellite.js for propagation.'
    },
    {
      name: 'Nolife.uk',
      details: 'Nolife.uk is a platform for messaging and connecting with others, I spent about 2 years on that project, with 4 rewrites and moving around technologies. The current version uses websockets and is soon going to be a SPA, with calling features coming soon.'
    },
    {
      name: 'channel4-ad-blocker',
      details: 'Ad-blocker chrome extension for Channel 4 catchup tv using manifest v3 done by redirecting ad videos to a blank mp4 file.'
    },
    {
      name: 'amongus-ventr',
      details: 'a plugin for the lyntr(by facedev) that adds features to the lyntr like custom css and hover effect on user names. sad that lyntr is shut down now'
    },
    {
      name: 'RunFirst',
      details: 'C# tool for troubleshooting for my friends. that would allways as me to help so i get them to run this tool to check issues. story one of my friends had 1002 malware and that why i made this tool because im lazy.'
    },
    {
      name: 'BadImageFormat',
      details: 'C# project based on facedev it a image format that stores data in the most unefficient way possible. it uses a custom format that is not used by any other program.'
    },
    {
      name: 'number-guess-game',
      details: 'simple number guessing game written in all languages i know, it is a simple game that asks you to guess a number between 1 and 100. reason why i made this i was bored.'
    },
    {
      name: 'sorting_algo',
      details: 'the most useless and worse sorting algorithm project ever, it has sorting algorithms that are not used by anyone and are not efficient at all. its an npm package so use it ig lol.'
    },
    {
      name: 'media-player-html',
      details: 'Custom HTML media player, inspired by netflix it a simple html and css and js media player made for my project it was pain to make.'
    },
    {
      name: 'file-uploader-demo',
      details: 'really really simple file uploader written in node js.'
    },
    {
      name: 'pong-',
      details: 'pong game written in .net c# called blong on ms store. enjoy the game its free and open source.'
    },
    {
      name: 'doggo-malware',
      details: 'C++ malware research project it was made on request of a friend.'
    },
    {
      name: 'right-click-avoider-Bored-Ape-images',
      details: 'All Bored Ape Yacht Club images it has the most stars and forks by crypto bros.'
    },
    {
      name: 'Rock-Paper-Scissors-API',
      details: 'simple rock paper scissors api written in node js i dont remember making this.'
    },
    {
      name: 'Password-Generator-Api',
      details: 'simple password generator written in node js.'
    },
    {
      name: 'basic-text-with-associate-file-extension-',
    details: 'simple text editor with custom file extension support written in c#.'
    },
    {
      name: 'node-easy-simple-server',
      details: 'smallest nodejs template i knew how to make.'
    },
    {
      name: 'virus',
      details: 'Source code for a virus written in python and c#. i was generating viruses. I WAS A BAD BOY back then (for research/educational purposes).'
    },
    {
      name: 'spammer',
      details: 'C# spam tool for sending repeated messages. again i was a bad boy. i was spamming my friends. not a good idea they were not happy lol.'
    },
    {
      name: 'custom_user_console',
      details: 'Custom console implementation for Unreal Engine 4. built moduler so you can add your own commands and features easily using blueprints or c++. i loved this project and i want to remake it for UE5.'
    },
    {
      name: 'get-ip-ue4-plugin',
      details: 'C++ plugin for Unreal Engine 4 to retrieve user IP address it was a simple plugin that that was apart of anticheat project i was making. the anticheat is lost to time and also was closed source.'
    },
    {
      name: '3d-models-for-old-projects',
      details: 'Free 3D models for use in old projects, unoptimized and awful i was like 12 or something like that. but free and you can use them without any issues. or credit me if you want to.'
    },
    {
      name: 'gamett',
      details: 'Zombie fighting game with multiple levels, dynamic spawning, and few levels. made in 2 weeks as part of challange with a friend and it is Available on Microsoft Store.'
    },
    {
      name: 'gamett2',
      details: 'A zombie shooter with ai, skill tree, EOS online, many weapons, skins, ui and cool suprises. Available on Microsoft Store.'
    },
    {
      name: 'Cognitive Arcade',
      details: 'A game that test reaction speed and memory skills made quickly in dotnet c#. Available on Microsoft Store.'
    },
    {
      name: 'blong',
      details: 'Paddle ball game (pong-like) with AI or two-player mode. Available on Microsoft Store.'
    }
  ];
  
  const sidebar = blessed.list({
    top: 3,
    left: '80%',
    width: '20%',
    height: '70%',
    label: ' Projects ',
    items: projects.map(p => p.name),
    style: {
      selected: {
        bg: 'magenta',
        fg: 'white',
        bold: true
      },
      item: {
        fg: 'white',
        bg: 'blue'
      },
      border: {
        fg: 'yellow'
      }
    },
    border: {
      type: 'line'
    },
    keys: true,
    mouse: true,
    vi: true
  });
  
  const skillCards = [
    blessed.box({
      top: 3,
      left: '5%',
      width: '32%',
      height: '70%',
      label: ' Programming Languages ',
      content: 'Node.js\nJavaScript\nBash\nPython\nC#\nC++\nC\nPHP\nVB\nHTML\nCSS\nVisual Basic .NET\nRust',
      tags: true,
      border: { type: 'line' },
      style: { fg: 'cyan', bg: 'black', border: { fg: 'cyan' } }
    }),
    blessed.box({
      top: 3,
      left: '34%',
      width: '32%',
      height: '70%',
      label: ' Frameworks & Libraries ',
      content: 'Express.js\n.NET\n.NET Core\nPygame\nTorque2D\nUnreal Engine 4 (UE4)\nLinux\nGit\nVS Code\nSQLite\nfs-extra\nbusboy\nProject templates\nConfig management',
      tags: true,
      border: { type: 'line' },
      style: { fg: 'green', bg: 'black', border: { fg: 'green' } }
    }),
    blessed.box({
      top: 3,
      left: '66%',
      width: '32%',
      height: '70%',
      label: ' Tools & Other ',
      content: 'Game Development\nMinecraft Modding\n3D Modeling\nAPI Development (REST, Node.js, JavaScript)\nAd-blocking (browser extensions)\nFile uploaders\nSorting algorithms\nMalware research\nWeb scraping/crawling\nHTML5 Media Players\nAutomation\nCross-language development\nLinux Server Management\nCustom console development (UE4)\nIP/Network utilities (UE4 plugin)\nCross-platform development (Windows, Linux, web)\nSecurity research',
      tags: true,
      border: { type: 'line' },
      style: { fg: 'magenta', bg: 'black', border: { fg: 'magenta' } }
    })
  ];
  
  screen.append(header);
  screen.append(content);
  screen.append(footer);
  screen.append(sidebar);
  sidebar.hide();
  skillCards.forEach(card => card.hide());

  screen.key(['a', 'A'], (ch, key) => {
    content.setContent(aboutText);
    content.width = '100%';
    content.height = '90%'; 
    content.show();
    sidebar.hide();
    skillCards.forEach(card => card.hide());
    forceRender();
  });

  screen.key(['s', 'S'], (ch, key) => {
    content.hide();
    if (!skillCardsAppended) {
      skillCards.forEach(card => screen.append(card));
      skillCardsAppended = true;
    }
    skillCards.forEach(card => card.show());
    sidebar.hide();
    forceRender();
  });

  screen.key(['p', 'P'], (ch, key) => {
    content.setContent('{center}Select a project from the sidebar!{/center}');
    content.width = '80%';
    content.height = '70%';
    content.show();
    sidebar.show();
    sidebar.focus();
    skillCards.forEach(card => card.hide());
    forceRender();
  });

  screen.key(['c', 'C'], (ch, key) => {
    content.setContent(contactText);
    content.width = '100%';
    content.height = '70%';
    content.show();
    sidebar.hide();
    skillCards.forEach(card => card.hide());
    forceRender();
  });

  screen.key(['escape', 'C-c'], (ch, key) => {
    screen.destroy();
    return false;
  });
  
  sidebar.on('select', (item, index) => {
    const project = projects[index];
    content.setContent(`{center}${project.name}{/center}\n\n${project.details}`);
    content.width = '80%';
    content.height = '70%';
    forceRender();
  });

  forceRender();

  screen.on('destroy', () => {
    stream.end();
  });
}

module.exports = startApp;