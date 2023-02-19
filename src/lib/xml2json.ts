// https://github.com/code4fukui/XML/blob/0288624272bbd7074a249878ad65db09cf5fdb4c/XML.js

import { DOMParser } from "@xmldom/xmldom";
import { TextPack } from "types";

const parseNode = (xmlNode: any, result: any) => {
  if (xmlNode.nodeName == null) {
    return;
  } else if (xmlNode.nodeName == "#text") {
    const v = xmlNode.nodeValue.trim();
    if (v) {
      result["#text"] = v;
    }
    return;
  } else if (xmlNode.childNodes == undefined) {
    result["#text"] = xmlNode.data;
    return;
  }
  const json: any = {};
  const existing = result[xmlNode.nodeName];
  if (existing) {
    if (!Array.isArray(existing)) {
      result[xmlNode.nodeName] = [existing, json];
    } else {
      result[xmlNode.nodeName].push(json);
    }
  } else {
    result[xmlNode.nodeName] = json;
  }
  if (xmlNode.attributes) {
    const len = xmlNode.attributes.length;
    for (let i = 0; i < len; i++) {
      const a = xmlNode.attributes[i];
      json[a.nodeName] = a.nodeValue;
    }
  }
  const len = xmlNode.childNodes.length;
  for (let i = 0; i < len; i++) {
    parseNode(xmlNode.childNodes[i], json);
  }
};

export const xml2json = (input: string) => {
  let output = {};
  const dom = new DOMParser().parseFromString(input);
  for (let i = 0; i < dom.childNodes.length; i++) {
    parseNode(dom.childNodes[i], output);
  }
  return output;
};

export const unwrapText = (text: TextPack) => {
  return text["#text"];
};
