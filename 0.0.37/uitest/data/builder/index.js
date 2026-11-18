import products from './products.json' with { type: "json" };
import employees from './employees.json' with { type: "json" };
export { default as settings } from './settings.json' with { type: "json" };
export const datasets = [products, employees];
