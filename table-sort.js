var tableSort = {

		// Up and down arrow codes.
		arrows: {
			down: "\u2193",
			up:   "\u2191"
		},



		// Sort a given array of tables.
		sort: function(tables) {

			// Default tables to sort.
			if (typeof(tables) == "undefined")
				tables = document.getElementsByClassName("table-sort");

			// element => array(element)
			else if (!("length" in tables))
				tables = [tables];

			// For every table,
			for (var x = 0; x < tables.length; x++) {

				// If it has a header,
				var thead = tables.item(x).getElementsByTagName("thead");
				if (thead.length) {
					thead = thead.item(0);

					// Append a sort link to each <th>.
					var columns  = 0,
						rowNodes = thead.getElementsByTagName("tr").item(0).childNodes,
						y;
					for (y = 0; y < rowNodes.length; y++) {
						var nodeName = rowNodes.item(y).nodeName.toLowerCase();
						if (nodeName == "td")
							columns++;
						else if (nodeName == "th") {
							columns++;

							// Create the arrow link.
							var a = this.sortLink(
								document.createElement("a"),
								columns,

								// If this is the default sort, make the link reverse sort.
								!rowNodes.item(y).className.match(/table\-sort\-default/)
							);
							a.addEventListener("click", this.sortColumn);

							// Append the arrow link.
							rowNodes.item(y).appendChild(document.createTextNode(" "));
							rowNodes.item(y).appendChild(a);
						}
					}
				}
			}
		},



		// Binary sort:
		// Place needleElement into haystack using needleComparison to navigate between lower and upper bounds.
		// obverse (or reverse) determines if needleComparison should be greater than or less than the midpoint between lower and upper.
		sortBinary: function(haystack, needleElement, needleComparison, lower, upper, obverse) {

			// We've found its location (0 == 0 is first item being sorted).
			if (lower == upper) {
				for (var x = haystack.length - 1; x >= lower; x--)
					haystack[x + 1] = haystack[x];
				haystack[lower] = needleElement;
				return haystack;
			}

			// Look halfway between lower and upper.
			var mid    = lower + Math.floor((upper - lower) / 2),
				needle = needleComparison;

			// The cell value being compared.
			var hay = (money = haystack[mid].innerText.match(/^\$?(\d*(?:\.\d*)?)$/)) ?
				parseFloat(money[1]) :
				haystack[mid].innerText;

			// Number is neither greater than nor less than string.
			// Compare apples to apples.
			if (
				typeof(hay)    != "number" ||
				typeof(needle) != "number"
			) {
				hay    = hay.toString();
				needle = needle.toString();
			}

			// Compare
			if (hay == needle)
				return this.sortBinary(haystack, needleElement, null, mid, mid, obverse);

			// If we're going in order but haven't gone far enough, keep going.
			// If we're going in reverse and haven't gone far enough, keep going.
			var bounds = (obverse && hay < needle) || (!obverse && hay > needle) ? [mid + 1, upper] : [lower, mid];
			return this.sortBinary(haystack, needleElement, needleComparison, bounds[0], bounds[1], obverse);
		},

		// Sort a column.
		sortColumn: function(event) {
			event.preventDefault();

			// Get direction and column to sort.
			var sort      = this.getAttribute("href").match(/\#(reverse\-)?sort\-(\d+)$/);
			var column    = sort[2],
				obverse   = !sort[1], // "reverse-" => false, "" => true
				sorted    = [],
				sortLinks = this.parentNode.parentNode.getElementsByClassName("table-sort-link"),
				tbody     = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("tbody").item(0);

			// Reset other sort links to obverse.
			for (var x = 0; x < sortLinks.length; x++)
				tableSort.sortLink(
					sortLinks.item(x),
					sortLinks.item(x).getAttribute("href").match(/\-(\d+)$/)[1],
					true
				);

			// For each row,
			var trs = tbody.getElementsByTagName("tr");
			for (var x = 0; x < trs.length; x++) {

				// Get the cell to be sorted.
				var cells = trs.item(x).childNodes,
					z = 0,
					cell;
				for (var y = 0; y < cells.length; y++) {
					var nodeName = cells.item(y).nodeName.toLowerCase();
					if (
						nodeName == "td" ||
						nodeName == "th"
					) {
						z++;
						if (z == column) {
							cell = cells.item(y);
							break;
						}
					}
				}
				sorted = tableSort.sortBinary(
					sorted, cell,
					(money = cell.innerText.match(/^\$?(\d*(?:\.\d*)?)$/)) ? parseFloat(money[1]) : cell.innerText,
					0, sorted.length, obverse
				);
			}

			// In order, append the <tr>s.
			for (x = 0; x < sorted.length; x++)
				tbody.appendChild(sorted[x].parentNode);

			// Reverse the sort button.
			tableSort.sortLink(this, column, !obverse);
		},



		// Turn an <a> into a sort link.
		// Clicking this <a> element will cause column number to sort obverse.
		sortLink: function(a, column, obverse) {

			// Remove existing text.
			if (a.firstChild)
				a.firstChild.removeChild(a.firstChild.firstChild);
			else
				a.appendChild(document.createElement("span"));

			a.firstChild.appendChild(document.createTextNode(this.arrows[obverse ? "up" : "down"]));
			a.className = "table-sort-link table-sort-link-" + (obverse ? "ob" : "re") + "verse";
			a.setAttribute("href", "#" + (obverse ? "" : "reverse-") + "sort-" + column);
			a.setAttribute("title", "Sort " + (obverse ? "" : "Reverse ") + "Alphanumerically");
			return a;
		}

	};

tableSort.sort();
