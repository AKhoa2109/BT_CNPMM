import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();

const ES_NODE = process.env.ELASTIC_NODE || 'http://localhost:9200';
export const esClient = new Client({
  node: process.env.ELASTIC_NODE|| "http://localhost:9200", 
});

// Tên index
export const PRODUCT_INDEX = process.env.PRODUCT_INDEX || 'products';