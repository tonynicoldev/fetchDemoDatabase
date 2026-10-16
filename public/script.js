// Set an event handler on the dropdown to trigger anonymous function when an item changes.
// Use the provided event object to get the target (dropdown) value - i.e. the item name for load data 
document.getElementById('itemFilter').addEventListener('change', (event) => loadData(event.target.value))

// Same thing for button but purchase needs no args
document.getElementById('btnPurchase').addEventListener('click', purchase)

// Load items calls the GET /products/{items} endpoint. Use an async function so we can use await
async function loadItems() {
  const res = await fetch('/products/items')
  const items = await res.json()

  // Using the returned items list, create the dropdown content
  const select = document.getElementById('itemFilter')
  select.innerHTML = '<option value="all">All</option>' // Add the first option as it's fixed

  // Add the rest by iterating the items array
  items.forEach(index => {
    const option = document.createElement('option')
    option.value = index.item
    option.textContent = index.item
    select.appendChild(option) // Add the option element to the select parent
  })
}

// Request the data from the server based on item type or all of them if item is 'all'
async function loadData(item) {
  const res = await fetch(`/products/${item}`)
  const data = await res.json()

  const thead = document.querySelector('#productTable thead') // Using productTable id, find a child thead
  const tbody = document.querySelector('#productTable tbody')
  const headings = data.headings; // Get the object attribute names to use for the heading. e.g. item make etc
  const products = data.products; // Get product data. These are returned as two objects, headings and products so pull them out of the response

  document.getElementById('response').textContent = '' // Clear any previous purchase response

  let html = `<tr><th>Select</th>`

  // Now add the rest dynamically in case they ever change in the data stream. Start at 1 as column 0 is the ID
  for (i = 1; i < headings.length; i++) {
    html += `<th>${headings[i]}</th>`
  }
  html += '</tr>'
  thead.innerHTML = html // Create the heading row

  // Create the body rows from the array. The first column has a checkbox added with no label or text
  // but its value is set to the product ID so when checked we know which product it refers to
  tbody.innerHTML = ''
  products.forEach(index => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td><input type="checkbox" value="${index.id}"></td>
      <td>${index.item}</td>
      <td>${index.make}</td>
      <td>${index.model}</td>
      <td>£${index.price}</td>
        `
    tbody.appendChild(tr) // Add the child row to the parent body
  })
}

// This function posts the IDs of the selected products to the server to buy so items are looked up in the database by id
// The response is a text string with the total cost charged - e.g. the server would call a payment API if this was real
// querySelectorAll will create a list of all checkbox elements that are checked
// Array.from will convert the list (which looks like an array) into a real array with all its methods 
async function purchase() {
  const checked = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
  const ids = checked.map(element => parseInt(element.value)) // Create a new array with all IDs converted to numbers

  // Call the API and pass the array of IDs as a json data structure
  const res = await fetch('/products/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }) // Convert the array into to JSON string for sending
  })

  const message = await res.text() // We expect text not json to be returned with a basic message and price total
  document.getElementById('response').textContent = message // Update the page element with the response
}

loadItems()     // On first load, populate the dropdown
loadData('all') // On first load, populate table with all products