<img src="icon.svg" width="64">

```
My general-purpose frontend library for web applications.
```

### Usage
Run `build.js` to bundle whalelib as a self-contained file. Then include this file into your public directory to make it accessable on client-side.

Check [tests](./tests) folder as an example of common usage of this lib.

### Vision
I see the web-development process as self-contained scenes with a bunch of stuff including scripts/resources/styles and etc.

My general frontend is usually `/scns/` folder with sub-folders, which are scenes. Scenes store everything they need to work independently in frontend, so there is a main goal. Deleting a scene folder means you won't break anything beyond it. So I really like this kind of implementation.

Average scene folder have to include:
```
.../scns/scene_folder/
  > layout.html
  > main.js
```

`layout.html` - a main layout file, so it will be loaded as [innerHtml](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) into parent specified.

`main.js` - a main script file, so the lib will attempt to [evaluate](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) it during scene loading process.

You can use `.css` files as well, but you need to `<link>` them in `layout.html` file.
