const ObjectsToCsv = require('objects-to-csv');

class ResultToCsv {
  constructor(sellers, results, domainProtocol, domainAddress) {
    if (!sellers) {
      throw new Error('Sellers cannot be null!');
    }
    if (!results) {
      throw new Error('Results cannot be null!');
    }
    this.domainAddress = domainProtocol + domainAddress;
    this.result = this.parseResult(sellers, results);
  }

  parseResult(sellers, results) {
    const result = [];

    if (!sellers) {
      console.error('Sellers cannot be null!');
      return result;
    }
    if (!results) {
      console.error('Results cannot be null!');
      return result;
    }

    for (const [key, value] of Object.entries(results)) {
      const resultItem = this.parseResultItem(sellers, key, value);
      if (resultItem) {
        result.push(resultItem);
      }
    }
    return result;
  }

  parseResultItem(sellers, itemName, itemValues) {
    if (!sellers) {
      console.error('Sellers cannot be null!');
      return null;
    }
    if (!itemName) {
      console.error('Item name cannot be null!');
      return null;
    }
    if (!itemValues) {
      console.error('Item values cannot be null!');
      return null;
    }
    
    const resultItem = {
      name: itemName
    }
    sellers.forEach((seller) => {
      const matchingValue = itemValues.find((value) => {
        if(!value) {
          return false;
        }
        return value.sellerId === seller;
      });
      resultItem[seller] = matchingValue ? this.generateCellHyperlinkValue(matchingValue) : '';
    });
    return resultItem;
  }

  generateCellHyperlinkValue(cellValue) {
    if (!cellValue) {
      return '';
    }

    const label = cellValue.price + ' ' + cellValue.currency;
    const hyperlink = this.domainAddress + '/oferta/' + this.parseOfferNameAndIdIntoUrl(cellValue.offerId, cellValue.offerName);
    return '=HYPERLINK(\"' + hyperlink + '\";\"' + label + '\")';
  }

  parseOfferNameAndIdIntoUrl(id, name) {
    if (!id || !name) {
      return null;
    }
    const parsedName = name.replace(/[^a-zA-Z ]/g, "").replace(/\s+/g, '-').toLowerCase();
    return parsedName + '-' + id;
  }

  async saveCsvFile(filename) {
    if (!filename) {
      throw new Error('Filename cannot be null!');
    }

    const csv = new ObjectsToCsv(this.result);
    await csv.toDisk(filename);
  }
}

module.exports = ResultToCsv;
