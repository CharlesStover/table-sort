var tables2sort = document.getElementsByClassName("table-sort"),
	x;

// For every table,
for (x = 0; x < tables2sort.length; x++) {

	// If it has a header,
	var thead = tables2sort.item(x).getElementsByTagName("thead");
	if (thead.length) {
		thead = thead.item(0);

		// Append a sort link to each TH
		var cells = thead.getElementsByTagName("tr").item(0).childNodes,
			th = 0,
			y;
		for (y = 0; y < cells.length; y++) {
			var nodeName = cells.item(y).nodeName.toLowerCase();
			if (nodeName == "td")
				th++;
			else if (nodeName == "th") {
				th++;
				var a = document.createElement("a");
				a.className = "table-sort-link";

				// If this is the default sort, make the link reverse sort.
				var s = document.createElement("span");
				if (cells.item(y).className.match(/table\-sort\-default/)) {
					s.appendChild(document.createTextNode("\u2193")); // v
					a.className += " table-sort-link-reverse";
					a.setAttribute("href", "#reverse-sort-" + th);
					a.setAttribute("title", "Sort Reverse Alphanumerically");
				}
				else {
					s.appendChild(document.createTextNode("\u2191")); // ^
					a.className += " table-sort-link-obverse";
					a.setAttribute("href", "#sort-" + th);
					a.setAttribute("title", "Sort Alphanumerically");
				}
				a.appendChild(s);

				// Sort!
				a.addEventListener(
					"click",
					function(event) {
						event.preventDefault();
						var sort      = this.getAttribute("href").match(/\#(reverse\-)?sort\-(\d+)$/);
						var column    = sort[2] - 1,
							reverse   = !!sort[1], // "reverse-" => true, "" => false
							sorted    = [],
							sortLinks = this.parentNode.parentNode.getElementsByClassName("table-sort-link"),
							tbody     = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("tbody").item(0),
							x, y, z;

						// Reset other sort links to normal instead of reverse.
						for (x = 0; x < sortLinks.length; x++) {
							sortLinks.item(x).firstChild.removeChild(sortLinks.item(x).firstChild.firstChild); // remove ^/v
							sortLinks.item(x).firstChild.appendChild(document.createTextNode("\u2191")); // append ^
							sortLinks.item(x).className = "table-sort-link table-sort-link-obverse";
							sortLinks.item(x).setAttribute("href", sortLinks.item(x).getAttribute("href").replace(/\#reverse\-/, "#")); // #reverse-sort => #sort
							sortLinks.item(x).setAttribute("title", "Sort Alphanumerically");
						}

						// For each row,
						var trs = tbody.getElementsByTagName("tr");
						for (x = 0; x < trs.length; x++) {

							// Get the cell to be sorted.
							// var cell = trs.item(x).getElementsByTagName("*").item(column);
							var cells = trs.item(x).childNodes,
								z = 0;
							for (y = 0; y < cells.length; y++) {
								if (cells.item(y).nodeName != "#text") {
									if (z == column) {
										var cell = cells.item(y);
										break;
									}
									z++;
								}
							}

							// If it's the first cell being sorted, just add it.
							if (!sorted.length)
								sorted.push(cell);

							// If there are other cells to sort it with, compare it to each one.
							else {

								// the cell being inserted
								var insert = (money = cell.innerText.match(/^\$?(\d*(?:\.\d*)?)$/)) ?
									parseFloat(money[1]) :
									cell.innerText;

								// Loop through previously sorted cells to find where this one belongs.
								for (y = sorted.length - 1; y >= -1; y--) {

									// reset to float in case converted to string for comparisoons
									var insertComparison = insert;

									// Goes before all others.
									if (y == -1) {
										sorted[0] = cell;
										break;
									}

									// the cell being compared
									var comparison = (money = sorted[y].innerText.match(/^\$?(\d*(?:\.\d*)?)$/)) ?
										parseFloat(money[1]) :
										sorted[y].innerText;

									// Number is neither greater than nor less than string.
									// Compare apples to apples.
									if (
										typeof(comparison)       != "number" ||
										typeof(insertComparison) != "number"
									) {
										comparison       = comparison.toString();
										insertComparison = insertComparison.toString();
									}

									// If reversed, insert < comparison; otherwise, comparison < insert
									if ((reverse ? insertComparison : comparison) < (reverse ? comparison : insertComparison)) {
										sorted[y + 1] = cell;
										break;
									}
									else
										sorted[y + 1] = sorted[y];
								}
							}
						}

						// In order, append the rows.
						for (x = 0; x < sorted.length; x++)
							tbody.appendChild(sorted[x].parentNode);

						// Reverse the sort button.
						this.firstChild.removeChild(this.firstChild.firstChild);
						if (reverse) {
							this.firstChild.appendChild(document.createTextNode("\u2191"));
							this.className = "table-sort-link table-sort-link-obverse";
							this.setAttribute("href", "#sort-" + (column + 1));
							this.setAttribute("title", "Sort Alphanumerically");
						}
						else {
							this.firstChild.appendChild(document.createTextNode("\u2193"));
							this.className = "table-sort-link table-sort-link-reverse";
							this.setAttribute("href", "#reverse-sort-" + (column + 1));
							this.setAttribute("title", "Sort Reverse Alphanumerically");
						}
					}
				);
				cells.item(y).appendChild(document.createTextNode(" "));
				cells.item(y).appendChild(a);
			}
		}
	}
}
