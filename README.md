# Table Sort
Open source JavaScript snippet that scans tabular data, appends arrow links to the header of sortable tables, and binary sorts the table by the data contained in that column when its sort link is clicked.

[Demo](https://charlesstover.github.io/table-sort/)

## About
The Table Sort code snippet will automatically append ↑ (up) and ↓ (down) arrows next to `<th>` text in the `<thead>` of any table with the class name `.table-sort`. Clicking on the up arrow will sort the rows alphanumerically by that column's values. Clicking on the down arrow will, in contrast, sort the rows in reverse alphanumeric order.

If the `<th>` has the class name `.table-sort-default`, then it is assumed the table is already sorted by that column. The default arrow for that column will then be ↓ (down) to reverse sort.

## Use
To use this script, you must append the `.table-sort` class names to any `<table>`s to be sortable. You may optionally give any `<th>`s the `.table-sort-default` class name. Once you have one or more tables with the aforementioned class name, add the following script to the end of your document, just before `</body>`:

`<script src="https://raw.githubusercontent.com/CharlesStover/table-sort/master/table-sort.min.js" type="text/javascript"></script>`
