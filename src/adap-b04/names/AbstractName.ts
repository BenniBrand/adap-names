import { Exception, ExceptionConstructor} from "../common/Exception";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    protected assertPostCondition(first:any, second:any) {
        if (first !== second) throw new MethodFailedException("Postcondition failed");
    }

    protected assertNotNull(s: any, c: ExceptionConstructor) {
        if (s === null) throw new c("Cannot be null");
    }

    protected assertNotNullAsPrecondition(s: any) {
        this.assertNotNull(s, IllegalArgumentException);
    }

    protected assertClassInvariant() {
        this.assertDelimiterCorrect(this.delimiter, InvalidStateException);
    }

    protected assertDelimiterCorrect(delimiter: string, c: ExceptionConstructor) {
        if (delimiter == ESCAPE_CHARACTER) {
            throw new c("Delimiter can not be escape character")
        }
        if (delimiter.length > 1) {
            throw new c("Delimiter cant be longer than one character")
        }
    }

    protected assertDelimiterCorrectAsPrecondition(delimiter: string) {
        this.assertDelimiterCorrect(delimiter,IllegalArgumentException)
    }

    protected assertIndexCorrect(index: number, c: ExceptionConstructor) {
        if(index >= this.getNoComponents() || index < 0) {
            throw new c("Index out of Range");
        }
    }

    protected assertIndexCorrectAsPrecondition(index: number) {
        this.assertIndexCorrect(index, IllegalArgumentException);
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
        this.assertNotNullAsPrecondition(other);
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

    public concat(other: Name): void {
        this.assertNotNullAsPrecondition(other);
        let noComponents:number = other.getNoComponents();
        for (let i = 0; i < noComponents; i++) {
            this.append(other.getComponent(i));
        }
    }

}