import merge from "lodash/merge";
import { clone } from "../utils/urltool";
import { jsonToGraphQLQuery } from "json-to-graphql-query";
export async function request(subgraphUrl, queryJson, key, params = {}) {
    let query = merge(clone(queryJson[key]), clone(params));
    query = jsonToGraphQLQuery({ query });
    const res = await fetch(subgraphUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });
    const { data } = await res.json();
    return data || {};
}
