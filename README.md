<h1 align="center">
  Rhapso - The file organizer
</h1>
<p align="center">
<img alt="npm" src="https://img.shields.io/npm/dy/npkill.svg">
<a href="https://www.codacy.com/app/zaldih/npkill?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=zaldih/npkill&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/b8ba5eb6cba4413eb474921dcc460f34"/></a>
<a href="#donations"><img  src="https://yourdonation.rocks/images/badge.svg" alt="Donations Badge"></a>
<img alt="npm version" src="https://img.shields.io/npm/v/npkill.svg">
<img alt="NPM" src="https://img.shields.io/npm/l/npkill.svg">
</p>

### Easily <font color="red">**organize**</font> all your files on **MacOS and Windows** :sparkles:

<p align="center">
  <img src="https://cdn-std.dprcdn.net/files/acc_750556/VngQ2w" alt="rhapso demo gif" />
</p>

This tool allows you to list, rename, remove, delete any files and folders based on anything you want.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Options](#options)
  - [Examples](#examples)
- [Set Up Locally](#setup-locally)
- [Roadmap](#roadmap)
- [Known bugs](#known-bugs)
- [Contributing](#contributing)
- [Buy us a coffee](#donations)
- [License](#license)

<a name="features"></a>

# :heavy_check_mark: Features

- **Clear space:** Get rid of old and dusty files cluttering up your machine.

- **Super customizable:** Choose your preferred language and theme, save any rules you want.

- **Easy to use:** Say goodbye to manual actions or rusty UI from another decades

<a name="installation"></a>

# :cloud: Installation

Simply use the following command:

```bash
$ npm run install
```

Or if for some reason you really want to install it:

```bash
$ yarn
```

<a name="usage"></a>

# :clipboard: Usage

```bash
$ npx npkill
# or just npkill if installed globally
```

By default, npkill will scan for node_modules starting at the path where `npkill` command is executed.

Move between the listed folders with <kbd>↓</kbd> <kbd>↑</kbd>, and use <kbd>Space</kbd> to delete the selected folder.
You can also use <kbd>j</kbd> and <kbd>k</kbd> to move between the results

To exit, <kbd>Q</kbd> or <kbd>Ctrl</kbd> + <kbd>c</kbd> if you're brave.

<a name="options"></a>

## Options

| ARGUMENT               | DESCRIPTION                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| -c, --bg-color         | Change row highlight color. _(Available: **blue**, cyan, magenta, white, red and yellow)_ |
| -d, --directory        | Set the directory from which to begin searching. By default, starting-point is .          |
| -D, --delete-all       | CURRENTLY DISABLED. Automatically delete all node_modules folders that are found          |
| -e, --show-errors      | Show error messages related to the search if any                                          |
| -f, --full             | Start searching from the home of the user (example: "/home/user" in linux)                |
| -gb                    | Show folders in Gigabytes instead of Megabytes.                                           |
| -h, --help, ?          | Show this help page and exit                                                              |
| -nu, --no-check-update | Dont check for updates on startup                                                         |
| -s, --sort             | Sort results by: size or path _[ beta ]_                                                  |
| -t, --target           | Specify the name of the directories you want to search (by default, is node_modules)      |
| -v, --version          | Show npkill version                                                                       |

**Warning:** _In future versions some commands may change_

<a name="examples"></a>

## Examples

- Search **node_modules** directories in your _projects_ directory:

```bash
npkill -d ~/projects

# other alternative:
cd ~/projects
npkill
```

- List directories called "dist" and and show errors if any occur:

```bash
npkill --target dist -e
```

- Displays the magenta color cursor... because I like magenta!

```bash
npkill --color magenta
```

- List **vendor** directories in your _projects_ directory, sort by size, and show that in gb:

```bash
npkill -d '~/more projects' -gb --sort size --target vendor
```

- Automatically delete all node_modules that have sneaked into your backups:

```bash
# Disabled for security reasons (you can use it in version 0.2.4 at your risk)
npkill -d ~/backups/ --delete-all
```

<a name="setup-locally"></a>

# :pager: Set Up Locally

```bash
# -- First, clone the repository
git clone https://github.com/voidcosmos/npkill.git

# -- Navigate to the dir
cd npkill

# -- Install dependencies
npm install

# -- And run!
npm run start


# -- If you want to run it with some parameter, you will have to add "--" as in the following example:
npm run start -- -f -e
```

<a name="roadmap"></a>

# :crystal_ball: Roadmap

- [x] Release 0.1.0 !
- [x] Improve code
  - [x] Improve performance
  - [ ] Improve performance even more!
- [x] Sort results by size and path
- [x] Allow the search for other types of directories (targets)
- [ ] Reduce dependencies to be a more minimalist module
- [ ] Allow to filter by directories that have not been used in a period of time
- [ ] Create option for displaying directories in tree format
- [ ] Add some menus
- [ ] Periodic and automatic cleaning (?)

<a name="known-bugs"></a>

# :bug: Known bugs :bug:

- Sometimes, CLI is blocked while folder is deleting.
- Some terminals that do not use TTY (like git bash in windows) do not work.
- Sorting, especially by routes, can slow down the terminal when there are many results at the same time.
- (SOLVED) Performance issues when searching from high level directories (like / in linux).
- (SOLVED) Sometimes text collapses when updating the cli.
- (SOLVED) Analyzing the size of the directories takes longer than it should.

> If you find any bugs, don't hesitate and open an issue :)

<a name="contributing"></a>

# :revolving_hearts: Contributing

If you want to contribute check the [CONTRIBUTING.md](.github/CONTRIBUTING.md)

<a name="donations"></a>

# :coffee: Buy us a coffee

<img align="right" width="300" src="https://npkill.js.org/img/cat-donation-cup.png">
I have developed Rhapso in our free time, because I am passionate about the programming sector and want to contribute to the open source world.
Tomorrow I would like to dedicate myself to this, but first, I have a long way to go.

I will continue to do things anyway, but donations are one of the many ways to support what I do.

<span class="badge-opencollective"><a href="https://opencollective.com/npkill/contribute" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-green.svg" alt="Open Collective donate button" /></a></span>

### Thanks!!

---

### Crypto alternative

- btc: 14KXSryVBLMiJ6dseib4LUgZjkB2pRpTkh

<a name="license"></a>

# :scroll: License

MIT © [Antoine Mesnil](https://github.com/sakymar)

:cat::baby_chick:

---
