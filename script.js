document.addEventListener("DOMContentLoaded", function () {
  const addItemBtn = document.getElementById("addItemBtn");
  const itemTable = document.querySelector("#itemTable tbody");
  const totalItemsEl = document.getElementById("totalItems");
  const totalPriceEl = document.getElementById("totalPrice");

  let totalItems = 0;
  let totalPrice = 0;

  let sortOrder = {
    name: "desc",
    price: "desc",
    date: "desc",
    category: "desc",
  };

  loadItemsFromStorage();

  addItemBtn.addEventListener("click", function () {
    const itemName = document.getElementById("itemName").value.trim();
    let itemPrice = parseFloat(document.getElementById("itemPrice").value);

    let itemDate = document.getElementById("itemDate").value;
    const itemCategory = document.getElementById("itemCategory").value;

    if (!itemName || isNaN(itemPrice)) {
      alert("Please enter both item name and price.");
      return;
    }

    if (!itemDate) {
      const today = new Date();
      itemDate = today.toISOString().split("T")[0];
    }

    const itemId = generateUniqueId();

    addItemToTable(itemId, itemName, itemPrice, itemDate, itemCategory);
    saveItemToStorage(itemId, itemName, itemPrice, itemDate, itemCategory);

    document.getElementById("itemName").value = "";
    document.getElementById("itemPrice").value = "";
    document.getElementById("itemDate").value = "";
    document.getElementById("itemCategory").value = "Food";
  });

  function generateUniqueId() {
    return "item-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  }

  function addItemToTable(itemId, itemName, itemPrice, itemDate, itemCategory) {
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", itemId);

    const nameCell = document.createElement("td");
    nameCell.classList.add("name");
    nameCell.textContent = itemName;
    itemPrice = parseFloat(itemPrice);

    console.log(itemPrice, "itemPriceeeeeeeeeeeeeeeeeeee");

    const priceCell = document.createElement("td");
    priceCell.classList.add("price");
    priceCell.textContent = `$${itemPrice.toFixed(2)}`;

    const dateCell = document.createElement("td");
    dateCell.classList.add("date");
    dateCell.textContent = itemDate;

    const categoryCell = document.createElement("td");
    categoryCell.classList.add("category");
    categoryCell.textContent = itemCategory;

    const actionCell = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("deleteBtn");

    actionCell.appendChild(editBtn);
    actionCell.appendChild(deleteBtn);

    newRow.appendChild(nameCell);
    newRow.appendChild(priceCell);
    newRow.appendChild(dateCell);
    newRow.appendChild(categoryCell);
    newRow.appendChild(actionCell);

    itemTable.appendChild(newRow);

    totalItems++;
    totalPrice += itemPrice;

    totalItemsEl.textContent = totalItems;
    totalPriceEl.textContent = totalPrice.toFixed(2);

    deleteBtn.addEventListener("click", function () {
      itemTable.removeChild(newRow);
      totalItems--;
      totalPrice -= itemPrice;
      removeItemFromStorage(itemId);

      totalItemsEl.textContent = totalItems;
      totalPriceEl.textContent = totalPrice.toFixed(2);
    });

    editBtn.addEventListener("click", function () {
      if (editBtn.textContent === "Edit") {
        nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
        priceCell.innerHTML = `<input type="number" value="${priceCell.textContent.replace(
          /[^\d.-]/g,
          ""
        )}">`;
        dateCell.innerHTML = `<input type="date" value="${dateCell.textContent}">`;
        categoryCell.innerHTML = `<select>
                    <option value="Food" ${
                      itemCategory === "Food" ? "selected" : ""
                    }>Food</option>
                    <option value="Tech" ${
                      itemCategory === "Tech" ? "selected" : ""
                    }>Tech</option>
                    <option value="Clothing" ${
                      itemCategory === "Clothing" ? "selected" : ""
                    }>Clothing</option>
                    <option value="Books" ${
                      itemCategory === "Books" ? "selected" : ""
                    }>Books</option>
                    <option value="Other" ${
                      itemCategory === "Other" ? "selected" : ""
                    }>Other</option>
                </select>`;
        editBtn.textContent = "Save";
      } else if (editBtn.textContent === "Save") {
        const nameInput = nameCell.querySelector("input");
        const priceInput = priceCell.querySelector("input");
        const dateInput = dateCell.querySelector("input");
        const categorySelect = categoryCell.querySelector("select");

        const newName = nameInput.value.trim();
        const newPrice = parseFloat(priceInput.value);
        const newDate = dateInput.value;
        const newCategory = categorySelect.value;

        if (!newName || isNaN(newPrice) || !newDate || !newCategory) {
          alert("Please enter valid values for all fields.");
          return;
        }

        nameCell.textContent = newName;
        priceCell.textContent = `$${newPrice.toFixed(2)}`;
        dateCell.textContent = newDate;
        categoryCell.textContent = newCategory;

        totalPrice -= itemPrice;
        totalPrice += newPrice;
        itemPrice = newPrice;

        totalPriceEl.textContent = totalPrice.toFixed(2);

        saveItemToStorage(itemId, newName, newPrice, newDate, newCategory);

        editBtn.textContent = "Edit";
      }
    });
  }

  function saveItemToStorage(itemId, name, price, date, category) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const existingItemIndex = items.findIndex((item) => item.id === itemId);

    if (existingItemIndex !== -1) {
      items[existingItemIndex] = { id: itemId, name, price, date, category };
    } else {
      items.push({ id: itemId, name, price, date, category });
    }

    localStorage.setItem("items", JSON.stringify(items));
  }

  function removeItemFromStorage(itemId) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const updatedItems = items.filter((item) => item.id !== itemId);
    localStorage.setItem("items", JSON.stringify(updatedItems));
  }

  function loadItemsFromStorage() {
    const items = JSON.parse(localStorage.getItem("items")) || [];

    items.forEach((item) => {
      addItemToTable(item.id, item.name, item.price, item.date, item.category);
    });

    totalItems = items.length;
    totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    totalItemsEl.textContent = totalItems;
    totalPriceEl.textContent = totalPrice.toFixed(2);
  }

  document.getElementById("sortByName").addEventListener("click", function () {
    toggleSort("name", "nameArrow");
  });

  document.getElementById("sortByPrice").addEventListener("click", function () {
    toggleSort("price", "priceArrow", true);
  });

  document.getElementById("sortByDate").addEventListener("click", function () {
    toggleSort("date", "dateArrow");
  });

  document
    .getElementById("sortByCategory")
    .addEventListener("click", function () {
      toggleSort("category", "categoryArrow");
    });

  function toggleSort(column, arrowId, isNumeric = false) {
    const arrow = document.getElementById(arrowId);

    sortOrder[column] = sortOrder[column] === "asc" ? "desc" : "asc";

    arrow.textContent = sortOrder[column] === "asc" ? "▼" : "▲";

    sortTable(column, sortOrder[column], isNumeric);
  }

  function sortTable(column, order, isNumeric = false) {
    const rows = Array.from(itemTable.querySelectorAll("tr"));
    rows.sort((a, b) => {
      let aValue = a.querySelector(`.${column}`).textContent.trim();
      let bValue = b.querySelector(`.${column}`).textContent.trim();

      if (isNumeric) {
        aValue = parseFloat(aValue.replace("$", ""));
        bValue = parseFloat(bValue.replace("$", ""));
      }

      if (order === "asc") {
        return isNumeric ? aValue - bValue : aValue.localeCompare(bValue);
      } else {
        return isNumeric ? bValue - aValue : bValue.localeCompare(aValue);
      }
    });
    console.log(itemTable, "itemtable goes here");

    rows.forEach((row) => itemTable.appendChild(row));
  }

  // ------------------------------------------------------------------------------

  function calculateTotalPrice(items) {
    return items.reduce((total, item) => {
      return total + parseFloat(item.price);
    }, 0);
  }

  renderChart();

  function loadItemsFromStorage() {
    const items = JSON.parse(localStorage.getItem("items")) || [];

    items.forEach((item) => {
      addItemToTable(item.id, item.name, item.price, item.date, item.category);
    });

    totalItems = items.length;

    totalPrice = calculateTotalPrice(items);
    console.log(totalPrice, "totall-------");

    totalItemsEl.textContent = totalItems;
    // totalPrice = parseFloat(totalPrice);
    console.log(totalPrice, "totalllllllllllllllllllll");
    totalPriceEl.textContent = totalPrice.toFixed(2);

    renderChart();
  }

  function renderChart() {
    const items = JSON.parse(localStorage.getItem("items")) || [];

    if (items.length === 0) {
      return; // Exit if no items to display
    }

    const data = items
      .map((item) => ({
        date: new Date(item.date),
        price: item.price,
      }))
      .sort((a, b) => a.date - b.date);

    // Set up the SVG container dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width =
      document.getElementById("chart").offsetWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove any existing SVG (for re-rendering)
    d3.select("#chart").select("svg").remove();

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.price)])
      .range([0, width]);

    const yScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat((d) => `$${d}`);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%Y-%m-%d"));

    // Add axes to the chart
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(yAxis);

    // Line generator
    const line = d3
      .line()
      .x((d) => xScale(d.price))
      .y((d) => yScale(d.date));

    // Append the line to the chart
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#6863fe")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add points
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.price))
      .attr("cy", (d) => yScale(d.date))
      .attr("r", 4)
      .attr("fill", "#6863fe")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", 6)
          .attr("fill", "#5750e6");
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip
          .html(
            `Price: $${d.price}<br>Date: ${d3.timeFormat("%Y-%m-%d")(d.date)}`
          )
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", 4)
          .attr("fill", "#6863fe");
        tooltip.transition().duration(100).style("opacity", 0);
      });

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  function updateChart() {
    renderChart();
  }

  renderChart();

  document.getElementById("addItemBtn").addEventListener("click", updateChart);
  document
    .querySelector("#itemTable tbody")
    .addEventListener("click", function (event) {
      if (
        event.target.classList.contains("editBtn") ||
        event.target.classList.contains("deleteBtn")
      ) {
        updateChart();
      }
    });

  function updateChart() {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    if (items.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select("#costChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the date and price
    const parseDate = d3.timeParse("%Y-%m-%d");
    items.forEach((item) => (item.date = parseDate(item.date)));

    // Set up scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(items, (d) => d.date))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(items, (d) => d.price)])
      .nice()
      .range([height, 0]);

    // Define the line generator
    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.price))
      .curve(d3.curveMonotoneX); // Smooth line

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%b %d")))
      .attr("class", "axis");

    // Add Y axis
    svg
      .append("g")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => `$${d}`)
      )
      .attr("class", "axis");

    // Add the line path
    svg
      .append("path")
      .datum(items)
      .attr("fill", "none")
      .attr("stroke", "#007bff")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add points
    svg
      .selectAll(".dot")
      .data(items)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.price))
      .attr("r", 4)
      .attr("fill", "#007bff");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Date");

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Price ($)");
  }

  updateChart();

  document.getElementById("addItemBtn").addEventListener("click", updateChart);
  document
    .querySelector("#itemTable tbody")
    .addEventListener("click", function (event) {
      if (
        event.target.classList.contains("editBtn") ||
        event.target.classList.contains("deleteBtn")
      ) {
        updateChart();
      }
    });

  // ---------------------------------------------------------------------
  let exchangeRates = {};
  let currentCurrency = "AZN";

  async function fetchCurrencyRates() {
    try {
      const response = await fetch(
        "https://api.fxratesapi.com/latest?base=AZN"
      );
      const data = await response.json();

      if (data.success) {
        exchangeRates = data.rates;
        populateCurrencySelect(exchangeRates);
        setInitialCurrency();
      } else {
        console.error("Failed to fetch currency rates.");
      }
    } catch (error) {
      console.error("Error fetching currency rates:", error);
    }
  }

  function populateCurrencySelect(rates) {
    const currencySelect = document.getElementById("currencySelect");

    for (const currency in rates) {
      if (rates.hasOwnProperty(currency)) {
        const option = document.createElement("option");
        option.value = currency;
        option.textContent = currency;
        currencySelect.appendChild(option);
      }
    }
  }

  function convertPrices() {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const newCurrency = document.getElementById("currencySelect").value;
    const conversionRate = exchangeRates[newCurrency];

    items.forEach((item) => {
      const convertedPrice =
        parseFloat(item.price / exchangeRates[currentCurrency]) *
        conversionRate;
      item.price = convertedPrice.toFixed(2);
    });

    localStorage.setItem("items", JSON.stringify(items));
    currentCurrency = newCurrency;
    localStorage.setItem("selectedCurrency", currentCurrency);
    updateTablePrices();
    totalPrice = calculateTotalPrice(items);
    totalPriceEl.textContent = totalPrice.toFixed(2);
  }

  function updateTablePrices() {
    const rows = document.querySelectorAll("#itemTable tbody tr");
    const items = JSON.parse(localStorage.getItem("items")) || [];

    rows.forEach((row, index) => {
      const priceCell = row.querySelector(".price");
      const newPrice = items[index].price;
      priceCell.textContent = `${newPrice} ${currentCurrency}`;
    });
  }

  function setInitialCurrency() {
    const storedCurrency = localStorage.getItem("selectedCurrency");
    if (storedCurrency) {
      currentCurrency = storedCurrency;
      document.getElementById("currencySelect").value = currentCurrency;
      convertPrices(); // Convert prices to the stored currency
    } else {
      currentCurrency = "AZN";
      document.getElementById("currencySelect").value = currentCurrency;
    }
  }

  document
    .getElementById("currencySelect")
    .addEventListener("change", convertPrices);

  fetchCurrencyRates();
});
