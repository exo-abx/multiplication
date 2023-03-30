const tbody = document.querySelector("#pythagore-table");
const hideButton = document.getElementById("hide-button");
const showButton = document.getElementById("show-button");
const values = {};

// Remplir le tableau
for (let i = 2; i < 10; i++) {
    const row = document.createElement("tr");
    const header = document.createElement("th");
    header.setAttribute("scope", "row");
    header.classList.add("table-primary")
    header.textContent = i;
    row.appendChild(header);

    for (let j = 2; j < 10; j++) {
        const cell = document.createElement("td");
        const value = i * j;
        cell.textContent = value;
        row.appendChild(cell);

        if (values[value] === undefined) {
            values[value] = 1;
        } else {
            values[value] += 1;
        }
    }

    tbody.appendChild(row);
}

showButton.addEventListener("click", function () {
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.opacity = "1";
    }
});
hideButton.addEventListener("click", function () {
    const cells = document.getElementsByTagName("td");
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.opacity = "0";
        clearTable();
    }
});

// Ajouter la classe "bg-success" lorsqu'un bouton est cliqué
const highlightBtn = document.querySelector("#highlight-btn");
highlightBtn.addEventListener("click", function () {
    const cells = document.querySelectorAll("#pythagore-table td");
    clearTable()
    for (let i = 0; i < cells.length; i++) {
        const value = parseInt(cells[i].textContent);

        if (values[value] > 2) {
            cells[i].classList.toggle("bg-primary");
        }
        if (values[value] > 3) {
            cells[i].classList.toggle("bg-success");
        }
    }
});

function clearTable() {
    const rows = document.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < cells.length; j++) {
            cells[j].className = "";
        }
    }
    const ths = document.getElementsByTagName("th");
    for (let i = 0; i < ths.length; i++) {
        ths[i].classList.remove("table-dark")
        ths[i].classList.add("table-primary");
    }
}
function highlightRowAndColumn(row, col) {
    clearTable();
    const rows = document.getElementsByTagName("tr");
    const thead = document.getElementsByTagName("thead")[0];
    const ths = thead.getElementsByTagName("th");

    // Changer la couleur des th de la colonne
    ths[col + 1].classList.add("table-dark");

    // Changer la couleur du th de la ligne
    rows[row].getElementsByTagName("th")[0].classList.add("table-dark");

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < cells.length; j++) {
            if ((i === row && j <= col) || (j === col && i <= row)) {
                cells[j].classList.add("table-secondary");
            }
        }
    }
}

const cells = tbody.querySelectorAll("td");

cells.forEach((cell) => {
    cell.addEventListener("click", () => {
        if (cell.style.opacity === "0") {
            cell.style.opacity = "1";
        } else {
            const row = cell.parentNode.rowIndex;
            const col = cell.cellIndex - 1;
            highlightRowAndColumn(row, col);
        }
    });
});