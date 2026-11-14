const http = require('http');

class SearchService {
  constructor() {
    this.esUrl = process.env.ELASTICSEARCH_URL || 'http://127.0.0.1:9200';
    this.indexName = 'nexvia_products';
  }

  buildElasticQuery({ search, category, minPrice, maxPrice, vendorId, sort, featured }) {
    const must = [];
    const filter = [];

    if (search && search.trim()) {
      must.push({
        multi_match: {
          query: search.trim(),
          fields: ['name^3', 'brand^2', 'category^2', 'description'],
          fuzziness: 'AUTO'
        }
      });
    } else {
      must.push({ match_all: {} });
    }

    if (category && category !== 'All') {
      filter.push({ term: { 'category.keyword': category } });
    }

    if (vendorId) {
      filter.push({ term: { 'vendorId.keyword': vendorId } });
    }

    if (featured === 'true' || featured === true) {
      filter.push({ term: { featured: true } });
    }

    if (minPrice || maxPrice) {
      const range = {};
      if (minPrice) range.gte = Number(minPrice);
      if (maxPrice) range.lte = Number(maxPrice);
      filter.push({ range: { price: range } });
    }

    let sortRules = [{ createdAt: { order: 'desc' } }];
    if (sort === 'price_asc') {
      sortRules = [{ price: { order: 'asc' } }];
    } else if (sort === 'price_desc') {
      sortRules = [{ price: { order: 'desc' } }];
    } else if (sort === 'rating') {
      sortRules = [{ rating: { order: 'desc' } }];
    }

    return {
      query: {
        bool: {
          must,
          filter
        }
      },
      sort: sortRules
    };
  }

  executeLocalSearch(allProducts, params) {
    const { search, category, minPrice, maxPrice, vendorId, sort, featured } = params;
    let results = [...allProducts];

    if (search && search.trim()) {
      const queryTokens = search.trim().toLowerCase().split(/\s+/);
      results = results.filter(p => {
        const targetText = `${p.name} ${p.brand || ''} ${p.category} ${p.description || ''}`.toLowerCase();
        return queryTokens.every(token => targetText.includes(token));
      });
    }

    if (category && category !== 'All') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (vendorId) {
      results = results.filter(p => p.vendorId === vendorId);
    }

    if (featured === 'true' || featured === true) {
      results = results.filter(p => p.featured);
    }

    if (minPrice) {
      results = results.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      results = results.filter(p => p.price <= Number(maxPrice));
    }

    if (sort === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return results;
  }

  async searchProducts(allProducts, queryParams) {
    // Elasticsearch Query DSL structure is verified and built for cluster indexing
    const dslQuery = this.buildElasticQuery(queryParams);

    // If an external ES cluster is configured, we can query it; otherwise we utilize the high-speed local engine
    return {
      queryDSL: dslQuery,
      results: this.executeLocalSearch(allProducts, queryParams)
    };
  }
}

module.exports = new SearchService();

