export default class OutputTable {
  static typeFields = new Map([
    ['id', {
      format: field => `#${field}`,
      isString: false,
    }],
    ['title', {
      format: field => field,
      isString: true,
    }],
    ['year', {
      format: field => `(${field})`,
      isString: false,
    }],
    ['imdb', {
      format: field => `imdb: ${field.toFixed(2)}`,
      isString: false,
    }]
  ]);

  constructor(data) {
    this.table = this.createTable(data)
  }

  createTable(data) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    for (const nameField of OutputTable.typeFields.keys()) {
      const th = document.createElement('th');
      th.textContent = nameField;
      tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    for (const item of data) {
      const tr = document.createElement('tr');
      for (const nameField of OutputTable.typeFields.keys()) {
        tr.dataset[nameField] = item[nameField];
        const td = document.createElement('td');
        td.textContent = OutputTable.typeFields.get(nameField).format(item[nameField]);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    document.documentElement.children[1].appendChild(table);
    return table;
  }

  sortingTable(sortField, ascending) {    
    const listItem = [...this.table.children[1].children];
    if (ascending) {
      if (OutputTable.typeFields.get(sortField).isString) {
        listItem.sort((a, b) => a.dataset[sortField].localeCompare(b.dataset[sortField]));
      } else {
        listItem.sort((a, b) => a.dataset[sortField] - b.dataset[sortField]);
      }
    } else {
      if (OutputTable.typeFields.get(sortField).isString) {
        listItem.sort((a, b) => b.dataset[sortField].localeCompare(a.dataset[sortField]));
      } else {
        listItem.sort((a, b) => b.dataset[sortField] - a.dataset[sortField]);
      }
    }  
    for (let i = 0; i < this.table.children[1].children.length; i++) {
      if (this.table.children[1].children[i] != listItem[i]) {
        this.table.children[1].insertBefore(listItem[i], this.table.children[1].children[i]);
      }      
    }
    const headlines = this.table.children[0].children[0].children;
    for (const item of headlines) {
      item.classList.remove('sort-ascending', 'sort-descending');
      if (item.textContent === sortField) {
        ascending ? item.classList.add('sort-ascending') : item.classList.add('sort-descending')
      }
    };
  }

  *sortDisplayGenerator() {
    while (true) {
      for (const nameField of OutputTable.typeFields.keys()) {
        this.sortingTable(nameField, true);
        yield;
        this.sortingTable(nameField, false);
        yield;
      }
    }   
  }
}