import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";

function makePairs(source: string, delimiter: string = ".") {
  return [
    new StringName(source, delimiter) as Name,
    new StringArrayName(source.split(delimiter), delimiter) as Name,
  ];
}

describe("Interchangeability tests: StringName <-> StringArrayName", () => {

  it("insert produces same result", () => {
    const [sn, sa] = makePairs("oss.fau.de");

    sn.insert(1, "cs");
    sa.insert(1, "cs");

    expect(sn.asString()).toBe(sa.asString());
    expect(sn.getNoComponents()).toBe(sa.getNoComponents());
  });

  it("append produces same result", () => {
    const [sn, sa] = makePairs("oss.cs.fau");

    sn.append("de");
    sa.append("de");

    expect(sn.asString()).toBe(sa.asString());
  });

  it("remove produces same result", () => {
    const [sn, sa] = makePairs("oss.cs.fau.de");

    sn.remove(0);
    sa.remove(0);

    expect(sn.asString()).toBe(sa.asString());
  });

  it("concat between implementations yields identical Names", () => {
    const nameA1: Name = new StringName("oss.cs");
    const nameA2: Name = new StringArrayName(["oss", "cs"]);

    const nameB1: Name = new StringName("fau.de");
    const nameB2: Name = new StringArrayName(["fau", "de"]);

    nameA1.concat(nameB1);
    nameA2.concat(nameB2);

    expect(nameA1.asString()).toBe(nameA2.asString());
    expect(nameA1.asDataString()).toBe(nameA2.asDataString());
  });

  it("hash codes match for equivalent names", () => {
    const [sn, sa] = makePairs("oss.cs.fau.de");

    expect(sn.getHashCode()).toBe(sa.getHashCode());
    expect(sn.isEqual(sa)).toBe(true);
  });

  it("different but equivalent escaping yields matching behavior", () => {
    const sn: Name = new StringName("oss\\.cs.fau.de", ".");
    const sa: Name = new StringArrayName(["oss\\.cs", "fau", "de"], ".");

    expect(sn.asString()).toBe(sa.asString());
    expect(sn.getNoComponents()).toBe(sa.getNoComponents());

    sn.insert(1, "peo\\ple");
    sa.insert(1, "peo\\ple");

    expect(sn.asDataString()).toBe(sa.asDataString());
    expect(sn.asString("#")).toBe(sa.asString("#"));
  });

  it("mixed concat: StringName + StringArrayName produces same result regardless of order", () => {
    const a1: Name = new StringName("a.b");
    const a2: Name = new StringArrayName(["a", "b"]);

    const b1: Name = new StringName("c.d");
    const b2: Name = new StringArrayName(["c", "d"]);

    a1.concat(b2);
    a2.concat(b1);

    expect(a1.asString()).toBe(a2.asString());
    expect(a1.asDataString()).toBe(a2.asDataString());
  });

  it("clone works identically between implementations", () => {
    const [sn, sa] = makePairs("x.y.z");

    const c1 = sn.clone() as Name;
    const c2 = sa.clone() as Name;

    sn.setComponent(0, "A");
    sa.setComponent(0, "A");

    expect(c1.asString()).toBe("x.y.z");
    expect(c2.asString()).toBe("x.y.z");

    expect(sn.asString()).toBe(sa.asString());
  });

});
