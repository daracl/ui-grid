# DaraGrid (@daracl/grid)

[한국어](./README.md) | **English**

A framework-agnostic data grid library written in pure TypeScript.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/daracl/ui-grid/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/@daracl%2Fgrid.svg)](https://badge.fury.io/js/@daracl%2Fgrid)
[![npm](https://img.shields.io/npm/d18m/%40daracl%2Fgrid)](https://github.com/daracl/ui-grid/releases)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@daracl%2Fgrid)](https://bundlephobia.com/package/@daracl%2Fgrid)
[![Documentation](https://img.shields.io/badge/docs-daracl.github.io-4c9aff)](https://daracl.github.io/ui-grid/)

## Documentation

📖 **<https://daracl.github.io/ui-grid/>**

The documentation site covers every option, renderer, and API method, along with live examples.
That URL always points to the newest release; to open a specific version, use `https://daracl.github.io/ui-grid/<version>/` (for example, [0.0.12](https://daracl.github.io/ui-grid/0.0.12/)).

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

<p>
<img src="https://github.com/daracl/daracl.grid/blob/main/demo.gif?raw=true"/>
</p>

## Key Features

- List and Tree data modes
- Cell/row inline editing with value validation
- Sorting, column resizing, multi-level headers (colspan/rowspan), left/right fixed columns
- Row/cell selection (single & multiple), row drag & drop
- Search (simple/full mode), paging, summary rows
- Toolbar, context menu, header help/tooltips
- Undo/redo history, copy & paste
- Light/dark themes and style presets (`default`, `striped`, `borderless`, `list`)
- A wide range of cell renderers (text, number, dropdown, checkbox, switch, date, image, link, sparkline, and more)

## Installation

```sh
yarn add @daracl/grid
# or
npm install @daracl/grid
```

## Quick Start

```ts
import { DaraGrid } from '@daracl/grid';
import '@daracl/grid/style/daracl.grid.css';

const grid = DaraGrid.create(document.getElementById('grid'), {
  height: 400,
  editable: true,
  selectionMode: 'multiCell', // row, cell, multiRow, multiCell, none
  theme: 'light', // light, dark
  style: 'striped', // default, striped, borderless, list

  aside: {
    lineNumber: { enabled: true },
    rowCheckbox: { enabled: true },
  },

  header: {
    sort: { enabled: true },
    resize: { enabled: true },
  },

  fields: [
    { name: 'name', label: 'Name', width: 100 },
    { name: 'age', label: 'Age', width: 60, align: 'right', renderer: { type: 'number' } },
    {
      name: 'position',
      label: 'Position',
      width: 120,
      editRenderer: {
        type: 'dropdown',
        listItem: {
          labelField: 'label',
          valueField: 'value',
          list: [
            { label: 'Developer', value: 'dev' },
            { label: 'Designer', value: 'design' },
          ],
        },
      },
    },
  ],

  items: [
    { name: 'John Smith', age: 34, position: 'dev' },
    { name: 'Jane Doe', age: 29, position: 'design' },
  ],
});
```

You can also use it directly via a `<script>` tag with the UMD build.

```html
<link rel="stylesheet" href="./node_modules/@daracl/grid/style/daracl.grid.min.css" />
<script src="./node_modules/@daracl/grid/dist/daracl.grid.min.umd.js"></script>
<script>
  const grid = Daracl.grid.create(document.getElementById('grid'), {
    fields: [{ name: 'name', label: 'Name' }],
    items: [{ name: 'John Smith' }],
  });
</script>
```

## Grid Options

| key | Description | Default |
|-----|------|-----|
| rowIdField | Field name used as the unique row identifier | `''` |
| theme | Grid theme (`light`, `dark`) | `light` |
| height, width | Grid height/width (`auto` or a pixel number) | `auto` |
| style | Body style preset (`default`, `striped`, `borderless`, `list`) | `default` |
| selectionMode | Selection mode (`row`, `cell`, `multiRow`, `multiCell`, `none`) | `row` |
| hoverMode | Hover mode (`row`, `cell`, `none`) | Derived from `selectionMode` |
| deleteMode | Delete mode (`hard`, `soft`) | `hard` |
| editable | Enable cell editing | `false` |
| enableWidthFixed | Fix column widths | `false` |
| enableTooltip | Enable cell tooltips | `false` |
| fixedLeftIndex / fixedRightIndex | Left/right fixed column index (`-1` disables it) | `-1` |
| fields | Column definitions (see [Field options](#field-column-options)) | `[]` |
| items | Grid row data | `[]` |
| header | Header options (`view`, `height`, `sort`, `resize`, `help`, `drag`, etc.) | - |
| aside | Left-side auxiliary columns (`lineNumber`, `rowCheckbox`, `modifyInfo`) | - |
| body | Body options (`row.height`, `cellClick`, `cellDblClick`, `rowMove`, `keyNavHandler`, `pasteBefore/After`, etc.) | - |
| scroll | Scroll options (`vertical`, `horizontal`) | - |
| search | Search options (`enabled`, `mode: simple|full`, `useRememberValue`, etc.) | disabled |
| toolbar | Toolbar options (`enabled`, `items`) | disabled |
| summary | Summary row options (`position`, `items`) | - |
| footer | Footer paging/selection-info display options | disabled |
| paging | Paging info (`totalCount`, `currPage`, `countPerPage`, `unitPage`) | - |
| contextMenu | Right-click context menu options | - |
| tree | Tree mode options (`idField`, `parentIdField`, `childrenField`, `isFlatData`, etc.). Omit it to use list mode | `undefined` |
| dataTypeFormatter | Default formatting (prefix/suffix/fixed) for `money` and `number` types | - |
| i18n | Localization message resources | - |

See [`src/types/GridOptions.d.ts`](./src/types/GridOptions.d.ts) for the full type definitions.

## Field (Column) Options

| key | Description | Default |
|-----|------|-----|
| name | Data field name | - |
| label | Header label | - |
| width | Column width (px) | - |
| align | Text alignment (`left`, `center`, `right`) | `center` |
| hidden | Hide the column | `false` |
| sort | Allow sorting | `false` |
| editable | Whether the column is editable (applies when the grid's `editable` is `true`) | `true` |
| renderer | View renderer type/options (`type` plus renderer-specific options) | `{ type: 'text' }` |
| editRenderer | Edit renderer type/options | `{ type: 'text' }` |
| defaultValue | Default value used when adding a row | `''` |
| displayFormat | Value display format (e.g. `{ type: 'number', format: '0,0' }`) | - |
| cellClassName | Cell class name, or a `(rowInfo) => string` callback | - |
| tooltip | Cell tooltip (`enabled`, `content`) | disabled |
| headerHelp | Header help text or callback | - |
| children | Sub-columns used to build multi-level headers | - |

See [`src/types/GridField.d.ts`](./src/types/GridField.d.ts) for the full type definitions.

## Renderer Types

| Category | Available `type` values |
|-----|-----|
| view (`renderer.type`) | `text`, `number`, `password`, `dropdown`, `checkbox`, `bar`, `button`, `html`, `image`, `link`, `sparkline`, `sparklineBar`, `tree`, `custom` |
| edit (`editRenderer.type`) | `text`, `number`, `password`, `textarea`, `dropdown`, `checkbox`, `switch`, `range`, `date`, `custom` |
| aside | `lineNumber`, `rowCheckbox`, `modifyInfo`, `rowDragHandle` |

Renderers are registered in [`src/constantRenders.ts`](./src/constantRenders.ts), with per-type implementations under `src/renderer/view`, `src/renderer/edit`, and `src/renderer/toolbar`.

## Main API (`DaraGrid` instance)

| Method | Description |
|-----|-----|
| `DaraGrid.create(element, options, message?)` | Create a grid instance |
| `DaraGrid.instance(elementOrId)` | Look up an existing grid instance |
| `getItems()` / `setItems(items)` / `clearItems()` | Get/set/clear all row data |
| `addItems(items, opts?)` / `createItem(item, opts?)` / `removeItems(ids)` | Add/remove rows |
| `getChangedItems()` | Get only added, modified, or deleted rows |
| `getSelection()` / `getSelectedRows()` / `getSelectedRowIds()` | Get selection info |
| `getCheckedItems(names?)` / `setAllCheckedItems(checked)` | Get/set checkbox state |
| `search(keyword, opts)` | Search the data |
| `setTheme(themeName)` / `setStyle(styleName)` | Change theme/style |
| `expandAll()` / `collapseAll()` | Expand/collapse all nodes in tree mode |
| `copyData()` | Copy the current selection to the clipboard |
| `destroy()` | Destroy the grid instance |

See [`src/DaraGrid.ts`](./src/DaraGrid.ts) and the [typedoc API docs](https://ui.daracl.com) for the full API.

## Development

```sh
yarn install
yarn dev        # start the vite dev server, auto-opens /uitest/index.html
yarn test       # run Jest unit tests
yarn build      # production build (ESM/CJS + UMD)
yarn docs:gen   # generate typedoc API docs
```

Manual/visual test pages for each feature are available under `uitest/*.html` (editing, tree, sorting, search, paging, context menu, row move, and more).

## License

Daracl is under [MIT License](./LICENSE).
