class ResultFromResponses {
  constructor() {
    this.sellers = [];
    this.results = {};
  }

  parseNewResponse(resultName, response) {
    if (!resultName) {
      console.error('Result name cannot be null!');
      return;
    }
    if (!response) {
      console.error('Response cannot be null!');
      return;
    }
    if (!response.items) {
      console.error('Response must have items!');
      return;
    }
    this.parseResponseOffers(resultName, response.items.promoted);
    this.parseResponseOffers(resultName, response.items.regular);
  }

  parseResponseOffers(resultName, offers) {
    if (!resultName) {
      console.error('Result name cannot be null!');
      return;
    }
    if (!offers) {
      console.error('Offers cannot be null!');
      return;
    }
    if (!this.results[resultName]) {
      this.results[resultName] = [];
    }
    offers.forEach((offer) => {
      const parsedOffer = this.getParsedOffer(offer);
      if (parsedOffer) {
        this.updateSellers(parsedOffer.sellerId);
        this.results[resultName].push(parsedOffer);
      }
    });
  }

  getParsedOffer(offer) {
    if (!offer) {
      console.error('Offer cannot be null!');
      return null;
    }
    if (!offer.seller) {
      console.error('Offer does not have seller');
      return null;
    }
    if (!offer.sellingMode || !offer.sellingMode.price) {
      console.error('Offer does not have selling mode or price');
      return null;
    }
    return {
      offerId: offer.id,
      sellerId: offer.seller.id,
      price: offer.sellingMode.price.amount
    }
  }

  updateSellers(sellerId) {
    if (!sellerId) {
      console.error('Seller cannot be null!');
      return;
    }
    if (this.sellers.indexOf(sellerId) === -1) {
      this.sellers.push(sellerId);
    }
  }
}

module.exports = ResultFromResponses;
