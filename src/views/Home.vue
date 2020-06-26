<template>
  <nu-flow gap="2x">
    <nu-h1>Cube.js Playground</nu-h1>
    <nu-h2>Sellerscale products analytics</nu-h2>

    <nu-pane>
      <nu-btn :value="measure" toggle columns="1fr auto" width="min 10"
              @input="measure = $event.detail">
        <nu-value list placeholder="Measure"></nu-value>
        <nu-dropdownicon></nu-dropdownicon>
        <nu-popuplistbox text="nowrap">
          <nu-option value="count">Count</nu-option>
          <nu-option value="salesPrice">Sales price</nu-option>
          <nu-option value="refundCost">Refund cost</nu-option>
        </nu-popuplistbox>
      </nu-btn>
      <nu-el>by</nu-el>
      <nu-btn :value="dimension" toggle columns="1fr auto" width="min 10"
              @input="dimension = $event.detail">
        <nu-value list placeholder="Dimension"></nu-value>
        <nu-dropdownicon></nu-dropdownicon>
        <nu-popuplistbox text="nowrap">
          <nu-option value="category">Category</nu-option>
          <nu-option value="marketplace">Marketplace</nu-option>
          <nu-option value="sizeTier">Size tier</nu-option>
        </nu-popuplistbox>
      </nu-btn>
    </nu-pane>
    <apexchart
      width="100%" height="400" type="bar" :options="options"
      :series="series"></apexchart>
  </nu-flow>
</template>

<script>
import { query } from '../cube';
import extractDataSet from '../dataset';

const MARKETPLACE_URLS = {
  ATVPDKIKX0DER: 'www.amazon.com',
  A2Q3Y263D00KWC: 'www.amazon.com.br',
  A2EUQ1WTGCTBG2: 'www.amazon.ca',
  A1AM78C64UM0Y8: 'www.amazon.com.mx',
  A1PA6795UKMFR9: 'www.amazon.de',
  A1RKKUPIHCS9HS: 'www.amazon.es',
  A13V1IB3VIYZZH: 'www.amazon.fr',
  A1F83G8C2ARO7P: 'www.amazon.co.uk',
  A21TJRUUN4KGV: 'www.amazon.in',
  APJ6JRA9NG5V4: 'www.amazon.it',
  A33AVAJ2PDY3EV: 'www.amazon.com.tr',
  A39IBJ37TRP1C6: 'www.amazon.com.au',
  A1VC38T7YXB528: 'www.amazon.co.jp',
  AAHKV2X7AFYLW: 'www.amazon.cn',
  A2VIGQ35RCS4UG: 'amazon.ae',
  ARBP9OOSHTCHU: 'amazon.eg',
  A17E79C6D8DWNP: 'amazon.sa',
  A19VAU5U5O7RUS: 'amazon.sg',
};

const SIZE_TIERS = {
  small: 'Small standard-size',
  large: 'Large standard-size',
  smallOversize: 'Small oversize',
  mediumOversize: 'Medium oversize',
  largeOversize: 'Large oversize',
  specialOversize: 'Special oversize',
};

const FORMATTERS = {
  salesPrice(val) {
    return `$${val}`;
  },
  refundCost(val) {
    return `$${val}`;
  },
  sizeTier(val) {
    return SIZE_TIERS[val] || 'Not set';
  },
  marketplace(val) {
    return MARKETPLACE_URLS[val] || 'unknown';
  },
};

export default {
  name: 'Home',
  data() {
    return {
      options: {
        chart: {
          id: 'cubejs-demo',
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: true,
          dropShadow: {
            enabled: true,
            left: 0,
            top: 0,
            opacity: 0.5,
          },
          formatter(val) {
            return `$${val}`;
          },
        },
        xaxis: {
          categories: [],
        },
      },
      series: [],
      measure: 'count',
      dimension: 'marketplace',
    };
  },
  watch: {
    measure() {
      this.update();
    },
    dimension() {
      this.update();
    },
  },
  mounted() {
    this.update();
  },
  methods: {
    async update() {
      const { measure, dimension } = this;

      if (!measure || !dimension) return;

      const data = await query({
        measures: [
          `Products2.${measure}`,
        ],
        timeDimensions: [
          {
            dimension: 'Products2.created',
          },
        ],
        order: {
          [`Products2.${dimension}`]: 'asc',
        },
        dimensions: [
          `Products2.${dimension}`,
        ],
        filters: [
          {
            dimension: `Products2.${measure}`,
            operator: 'gt',
            values: [
              '0',
            ],
          },
        ],
      });

      const { series, categories } = extractDataSet(data.loadResponse);

      const formatter = FORMATTERS[this.measure] || ((val) => val);

      this.options = {
        ...this.options,
        xaxis: {
          categories: categories.map((cat) => this.prepareCategory(cat)),
        },
        dataLabels: {
          ...this.options.dataLabels,
          formatter,
        },
        tooltip: {
          y: { formatter },
        },
      };
      this.series = series;
    },
    prepareCategory(category) {
      const formatter = FORMATTERS[this.dimension];

      if (!formatter) return category;

      return formatter(category);
    },
  },
};
</script>
