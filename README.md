# Minecraft Armorstand

## [Try it out](http://haselkern.github.io/Minecraft-ArmorStand)

In Minecraft 1.8 armorstands were introduced. Unfortunately, the syntax to summon one is quite confusing and not very intuitive, especially when you're trying to create an awesome pose. This tool provides a graphical interface so that you can focus on the looks and not worry about the code.

If you would like to see a feature implemented, feel free to open an issue or submit a pull request.

## Development

To install all required dependencies run:

```sh
npm install
```

Run this when developing. It will automatically rebuild the project on changes.

```sh
npm run serve
```

The project will automatically build on pushes on the master branch. If you want to build the production build locally, you can run this to generate the `dist` directory.

```sh
npm run build
```

Run the linter to check for mistakes:

```sh
npm run lint
```

## TODO
Currently Vue does not support Postcss 8, so we use a compatibility build of it. Some time in the future, [this should be upgraded](https://tailwindcss.com/docs/installation#post-css-7-compatibility-build).
