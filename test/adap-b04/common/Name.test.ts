import { describe, it, expect } from 'vitest';
import { Name } from '../../../src/adap-b04/names/Name';
import { StringArrayName } from '../../../src/adap-b04/names/StringArrayName';
import { StringName } from '../../../src/adap-b04/names/StringName';
import { IllegalArgumentException } from '../../../src/adap-b04/common/IllegalArgumentException';
import { MethodFailedException } from '../../../src/adap-b04/common/MethodFailedException';

function makePairs(source: string, delimiter: string = "."): [Name, Name] {
    return [
        new StringName(source, delimiter) as Name,
        new StringArrayName(source.split(delimiter), delimiter) as Name,
    ];
}

describe('Name Contract Tests', () => {
    
    // ===== Constructor Contract Tests =====
    describe('Constructor Preconditions', () => {
        it('should throw IllegalArgumentException for multi-character delimiter', () => {
            expect(() => new StringArrayName(['a', 'b'], '..'))
                .toThrow(IllegalArgumentException);
            expect(() => new StringName('a.b', '..'))
                .toThrow(IllegalArgumentException);
        });

        it('should throw IllegalArgumentException when delimiter is escape character', () => {
            expect(() => new StringArrayName(['a', 'b'], '\\'))
                .toThrow(IllegalArgumentException);
            expect(() => new StringName('a.b', '\\'))
                .toThrow(IllegalArgumentException);
        });

        it('should throw IllegalArgumentException for null source in StringArrayName', () => {
            expect(() => new StringArrayName(null as any, '.'))
                .toThrow(IllegalArgumentException);
        });

        it('should throw IllegalArgumentException for null component in StringArrayName', () => {
            expect(() => new StringArrayName(['a', null as any, 'b'], '.'))
                .toThrow(IllegalArgumentException);
        });

        it('should throw IllegalArgumentException for null source in StringName', () => {
            expect(() => new StringName(null as any, '.'))
                .toThrow(IllegalArgumentException);
        });
    });

    // ===== getComponent Contract Tests =====
    describe('getComponent Preconditions', () => {
        it('should throw IllegalArgumentException for negative index', () => {
            const [sn, sa] = makePairs('a.b.c');
            expect(() => sn.getComponent(-1)).toThrow(IllegalArgumentException);
            expect(() => sa.getComponent(-1)).toThrow(IllegalArgumentException);
        });

        it('should throw IllegalArgumentException for index >= length', () => {
            const [sn, sa] = makePairs('a.b.c');
            expect(() => sn.getComponent(3)).toThrow(IllegalArgumentException);
            expect(() => sa.getComponent(3)).toThrow(IllegalArgumentException);
        });
    });

    describe('getComponent Postconditions', () => {
        it('should not change component count after getComponent', () => {
            const [sn, sa] = makePairs('a.b.c');
            const oldCountSn = sn.getNoComponents();
            const oldCountSa = sa.getNoComponents();
            sn.getComponent(1);
            sa.getComponent(1);
            expect(sn.getNoComponents()).toBe(oldCountSn);
            expect(sa.getNoComponents()).toBe(oldCountSa);
        });

        it('should return non-null component', () => {
            const [sn, sa] = makePairs('test');
            const componentSn = sn.getComponent(0);
            const componentSa = sa.getComponent(0);
            expect(componentSn).not.toBeNull();
            expect(componentSn).not.toBeUndefined();
            expect(componentSa).not.toBeNull();
            expect(componentSa).not.toBeUndefined();
        });
    });

    // ===== setComponent Contract Tests =====
    describe('setComponent Preconditions', () => {
        it('should throw IllegalArgumentException for negative index', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.setComponent(-1, 'x')).toThrow(IllegalArgumentException);
            expect(() => sa.setComponent(-1, 'x')).toThrow(IllegalArgumentException);
        });

        it('should throw IllegalArgumentException for index >= length', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.setComponent(2, 'x')).toThrow(IllegalArgumentException);
            expect(() => sa.setComponent(2, 'x')).toThrow(IllegalArgumentException);
        });

        it('should throw IllegalArgumentException for null component', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.setComponent(0, null as any)).toThrow(IllegalArgumentException);
            expect(() => sa.setComponent(0, null as any)).toThrow(IllegalArgumentException);
        });
    });

    describe('setComponent Postconditions', () => {
        it('should not change component count after setComponent', () => {
            const [sn, sa] = makePairs('a.b.c');
            const oldCountSn = sn.getNoComponents();
            const oldCountSa = sa.getNoComponents();
            sn.setComponent(1, 'new');
            sa.setComponent(1, 'new');
            expect(sn.getNoComponents()).toBe(oldCountSn);
            expect(sa.getNoComponents()).toBe(oldCountSa);
        });

        it('should set component correctly', () => {
            const [sn, sa] = makePairs('a.b.c');
            sn.setComponent(1, 'new');
            sa.setComponent(1, 'new');
            expect(sn.getComponent(1)).toBe('new');
            expect(sa.getComponent(1)).toBe('new');
        });
    });

    // ===== insert Contract Tests =====
    describe('insert Preconditions', () => {
        it('should throw IllegalArgumentException for negative index', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.insert(-1, 'x')).toThrow(IllegalArgumentException);
            expect(() => sa.insert(-1, 'x')).toThrow(IllegalArgumentException);
        });

        it('should throw IllegalArgumentException for index > length', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.insert(3, 'x')).toThrow(IllegalArgumentException);
            expect(() => sa.insert(3, 'x')).toThrow(IllegalArgumentException);
        });

        it('should throw IllegalArgumentException for null component', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.insert(0, null as any)).toThrow(IllegalArgumentException);
            expect(() => sa.insert(0, null as any)).toThrow(IllegalArgumentException);
        });

    });

    describe('insert Postconditions', () => {
        it('should increase component count by 1', () => {
            const [sn, sa] = makePairs('a.b.c');
            const oldCountSn = sn.getNoComponents();
            const oldCountSa = sa.getNoComponents();
            sn.insert(1, 'new');
            sa.insert(1, 'new');
            expect(sn.getNoComponents()).toBe(oldCountSn + 1);
            expect(sa.getNoComponents()).toBe(oldCountSa + 1);
        });

        it('should insert component at correct position', () => {
            const [sn, sa] = makePairs('a.b.c');
            sn.insert(1, 'new');
            sa.insert(1, 'new');
            expect(sn.getComponent(1)).toBe('new');
            expect(sa.getComponent(1)).toBe('new');
            expect(sn.getComponent(0)).toBe('a');
            expect(sa.getComponent(0)).toBe('a');
            expect(sn.getComponent(2)).toBe('b');
            expect(sa.getComponent(2)).toBe('b');
        });
    });

    // ===== append Contract Tests =====
    describe('append Preconditions', () => {
        it('should throw IllegalArgumentException for null component', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.append(null as any)).toThrow(IllegalArgumentException);
            expect(() => sa.append(null as any)).toThrow(IllegalArgumentException);
        });
    });

    describe('append Postconditions', () => {
        it('should increase component count by 1', () => {
            const [sn, sa] = makePairs('a.b');
            const oldCountSn = sn.getNoComponents();
            const oldCountSa = sa.getNoComponents();
            sn.append('c');
            sa.append('c');
            expect(sn.getNoComponents()).toBe(oldCountSn + 1);
            expect(sa.getNoComponents()).toBe(oldCountSa + 1);
        });

        it('should append component at end', () => {
            const [sn, sa] = makePairs('a.b');
            sn.append('c');
            sa.append('c');
            expect(sn.getComponent(sn.getNoComponents() - 1)).toBe('c');
            expect(sa.getComponent(sa.getNoComponents() - 1)).toBe('c');
        });
    });

    // ===== remove Contract Tests =====
    describe('remove Preconditions', () => {
        it('should throw IllegalArgumentException for negative index', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.remove(-1)).toThrow(IllegalArgumentException);
            expect(() => sa.remove(-1)).toThrow(IllegalArgumentException);
        });

        it('should throw IllegalArgumentException for index >= length', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.remove(2)).toThrow(IllegalArgumentException);
            expect(() => sa.remove(2)).toThrow(IllegalArgumentException);
        });
    });

    describe('remove Postconditions', () => {
        it('should decrease component count by 1', () => {
            const [sn, sa] = makePairs('a.b.c');
            const oldCountSn = sn.getNoComponents();
            const oldCountSa = sa.getNoComponents();
            sn.remove(1);
            sa.remove(1);
            expect(sn.getNoComponents()).toBe(oldCountSn - 1);
            expect(sa.getNoComponents()).toBe(oldCountSa - 1);
        });

        it('should remove correct component', () => {
            const [sn, sa] = makePairs('a.b.c');
            sn.remove(1);
            sa.remove(1);
            expect(sn.getComponent(0)).toBe('a');
            expect(sa.getComponent(0)).toBe('a');
            expect(sn.getComponent(1)).toBe('c');
            expect(sa.getComponent(1)).toBe('c');
        });
    });

    // ===== concat Contract Tests =====
    describe('concat Preconditions', () => {
        it('should throw IllegalArgumentException for null other', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.concat(null as any)).toThrow(IllegalArgumentException);
            expect(() => sa.concat(null as any)).toThrow(IllegalArgumentException);
        });
    });

    describe('concat Postconditions', () => {
        it('should increase component count by other count', () => {
            const sn1 = new StringName('a.b');
            const sa1 = new StringArrayName(['a', 'b']);
            const sn2 = new StringName('c.d.e');
            const sa2 = new StringArrayName(['c', 'd', 'e']);
            
            const oldCountSn = sn1.getNoComponents();
            const oldCountSa = sa1.getNoComponents();
            const otherCountSn = sn2.getNoComponents();
            const otherCountSa = sa2.getNoComponents();
            
            sn1.concat(sn2);
            sa1.concat(sa2);
            
            expect(sn1.getNoComponents()).toBe(oldCountSn + otherCountSn);
            expect(sa1.getNoComponents()).toBe(oldCountSa + otherCountSa);
        });

        it('should append all components from other', () => {
            const [sn1, sa1] = makePairs('a.b');
            const [sn2, sa2] = makePairs('c.d');
            sn1.concat(sn2);
            sa1.concat(sa2);
            expect(sn1.getComponent(2)).toBe('c');
            expect(sa1.getComponent(2)).toBe('c');
            expect(sn1.getComponent(3)).toBe('d');
            expect(sa1.getComponent(3)).toBe('d');
        });
    });

    // ===== clone Contract Tests =====
    describe('clone Postconditions', () => {
        it('should create equal but different object', () => {
            const [sn, sa] = makePairs('a.b.c');
            const cloneSn = sn.clone();
            const cloneSa = sa.clone();
            expect(sn.isEqual(cloneSn)).toBe(true);
            expect(sa.isEqual(cloneSa)).toBe(true);
            expect(cloneSn).not.toBe(sn);
            expect(cloneSa).not.toBe(sa);
        });

        it('should preserve all components', () => {
            const [sn, sa] = makePairs('a.b.c');
            const cloneSn = sn.clone();
            const cloneSa = sa.clone();
            expect(cloneSn.getNoComponents()).toBe(sn.getNoComponents());
            expect(cloneSa.getNoComponents()).toBe(sa.getNoComponents());
            for (let i = 0; i < sn.getNoComponents(); i++) {
                expect(cloneSn.getComponent(i)).toBe(sn.getComponent(i));
                expect(cloneSa.getComponent(i)).toBe(sa.getComponent(i));
            }
        });
    });

    // ===== isEqual Contract Tests =====
    describe('isEqual Preconditions', () => {
        it('should throw IllegalArgumentException for null other', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.isEqual(null as any)).toThrow(IllegalArgumentException);
            expect(() => sa.isEqual(null as any)).toThrow(IllegalArgumentException);
        });
    });

    // ===== isEmpty Contract Tests =====
    describe('isEmpty Consistency', () => {
        it('should return true when no components', () => {
            const sn = new StringName('');
            const sa = new StringArrayName([]);
            expect(sn.isEmpty()).toBe(true);
            expect(sa.isEmpty()).toBe(true);
            expect(sn.getNoComponents()).toBe(0);
            expect(sa.getNoComponents()).toBe(0);
        });

        it('should return false when has components', () => {
            const [sn, sa] = makePairs('a');
            expect(sn.isEmpty()).toBe(false);
            expect(sa.isEmpty()).toBe(false);
            expect(sn.getNoComponents()).toBeGreaterThan(0);
            expect(sa.getNoComponents()).toBeGreaterThan(0);
        });
    });

    // ===== asString Contract Tests =====
    describe('asString Preconditions', () => {
        it('should throw IllegalArgumentException for multi-character delimiter', () => {
            const [sn, sa] = makePairs('a.b');
            expect(() => sn.asString('..')).toThrow(IllegalArgumentException);
            expect(() => sa.asString('..')).toThrow(IllegalArgumentException);
        });
    });

    // ===== Class Invariants =====
    describe('Class Invariants', () => {
        it('should maintain single-character delimiter throughout operations', () => {
            const [sn, sa] = makePairs('a.b', '.');
            expect(sn.getDelimiterCharacter().length).toBe(1);
            expect(sa.getDelimiterCharacter().length).toBe(1);
            
            sn.append('c');
            sa.append('c');
            expect(sn.getDelimiterCharacter().length).toBe(1);
            expect(sa.getDelimiterCharacter().length).toBe(1);
            
            sn.setComponent(0, 'x');
            sa.setComponent(0, 'x');
            expect(sn.getDelimiterCharacter().length).toBe(1);
            expect(sa.getDelimiterCharacter().length).toBe(1);
        });

        it('should maintain delimiter not being escape character', () => {
            const [sn, sa] = makePairs('a.b', '.');
            expect(sn.getDelimiterCharacter()).not.toBe('\\');
            expect(sa.getDelimiterCharacter()).not.toBe('\\');
            
            sn.insert(1, 'x');
            sa.insert(1, 'x');
            expect(sn.getDelimiterCharacter()).not.toBe('\\');
            expect(sa.getDelimiterCharacter()).not.toBe('\\');
        });
    });
});

// ===== Interchangeability Tests from Previous Assignment =====
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