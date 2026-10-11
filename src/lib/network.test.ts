import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateSubnet } from "./network.ts";
test("calculates a common IPv4 subnet", () => { assert.deepEqual(calculateSubnet("192.168.1.42", 24), { ip:"192.168.1.42", cidr:24, network:"192.168.1.0", broadcast:"192.168.1.255", mask:"255.255.255.0", total:256, usable:254, first:"192.168.1.1", last:"192.168.1.254" }); });
test("handles /31 and /32 host conventions", () => { assert.equal(calculateSubnet("10.0.0.1",31).usable,2); assert.equal(calculateSubnet("10.0.0.1",32).usable,1); });
test("rejects invalid IP and prefix", () => { assert.throws(() => calculateSubnet("300.1.1.1",24)); assert.throws(() => calculateSubnet("10.0.0.1",33)); });
