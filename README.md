# Minecraft Armor Stand

This project is currently being rewritten. This document should be changed to include help for users and then help for contributors, especially translators.

## TODO
The following things still have to be done.
- [X] Equipment
- [X] Equipment locking
  - [ ] Can we scrape the MC wiki for a searchable dropdown list? https://minecraft.fandom.com/api.php ?
    * Only items that are available in a given minecraft version should show up
  - [ ] Colors for leather pieces
  - [X] Helmet: player name
  - [ ] Helmet: Image URL
  - [ ] Helmet: https://minecraft-heads.com -> but use Minecraft-URL or Player name and skip the give code thing, that was confusing anyways. Have a help popup that explains this functionality with a few screenshots.
- [X] Custom name with styling options
- [X] Code generation
- [ ] Hide controls that are not relevant for the chosen minecraft version
- [X] **Proper rotation conversion between Minecraft and ThreeJS**
- [ ] /summon or /give
- [ ] Hint for command block
- [ ] Design
- [ ] Save and load
- [ ] Tips and tricks section?
  - Double click a slider to reset
  - You can save and load
  - How to remove an invulnerable armor stand
- [ ] Ask before exit
- [X] vue i18n
- [ ] vue element transitions

## Development
For first time setup a `npm install` is required once. After that you can run `npm run dev` to start the hot-reloading development server.

## Translating
Translations are located in `src/locales`. To add a new translation, copy `en.yaml` to a new file `xy.yaml`, add it as an option in `src/App.vue` and then translate your new file. The file `en.yaml` (the english version) serves as the truth from which other files should be derived.