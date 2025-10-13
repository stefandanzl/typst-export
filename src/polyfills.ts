//@ts-nocheck
// Polyfills for Node.js modules needed by citation-js in browser environment

// Buffer polyfill
import { Buffer } from "buffer";
global.Buffer = Buffer;

// Process polyfill
import process from "process";
global.process = process;

// Util polyfill
import util from "util";
global.util = util;

// Stream polyfill
import { Readable, Writable } from "stream";
global.Readable = Readable;
global.Writable = Writable;

// Events polyfill
import EventEmitter from "events";
global.EventEmitter = EventEmitter;
