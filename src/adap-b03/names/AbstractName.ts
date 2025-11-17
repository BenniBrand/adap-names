import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        throw new Error("needs implementation or deletion");
    }

    public toString(): string {
        return this.asDataString();
    }
    
    abstract asString(delimiter?: string): string;
    abstract asDataString(): string;

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    protected hashCode(str: string): number {
        var h: number = 0;
        for (var i = 0; i < str.length; i++) {
            h = 31 * h + str.charCodeAt(i);
            }
        return h & 0xFFFFFFFF
    }

    public getHashCode(): number {
        return this.hashCode(this.asDataString());
    }


    public isEqual(other: Name): boolean {
        return this.getHashCode() === other.getHashCode();
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): Name {
        let ret = this.clone();
        let noComponents:number = other.getNoComponents();
        for (let i = 0; i < noComponents; i++) {
            ret.append(other.getComponent(i));
        }
        return ret;
    }

}