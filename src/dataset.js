// const CONVERTERS = {
//   salesPrice(val) {
//     return `${val}`;
//   },
// };

export default function extractDataSet(response) {
  const { annotation, data } = response;
  const { measures, dimensions } = annotation;

  const series = [];

  Object.entries(measures)
    .forEach(([key, measure]) => {
      series.push({
        name: measure.shortTitle,
        data: data.map((entry) => parseInt(entry[key], 10)),
      });
    });

  const dimension = Object.entries(dimensions)[0];

  const categories = data.map((entry) => entry[dimension[0]] || 'Not set');

  return { series, categories };
}
