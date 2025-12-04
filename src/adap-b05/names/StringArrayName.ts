import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super();
        this.assertNotNullAsPrecondition(source);
        source.forEach(e => this.assertNotNullAsPrecondition(e))
        if(delimiter) {
            this.assertDelimiterCorrectAsPrecondition(delimiter);
            this.delimiter = delimiter;
        }
        this.components = [...source];
        this.assertClassInvariant();
    }

    protected assertClassInvariant() {
            super.assertClassInvariant();
            this.assertNotNull(this.components, InvalidStateException)
    }

    public clone(): Name {
        return new StringArrayName(this.components,this.delimiter);
    }

    private escapeComponents(components: string[]): string[] {
    return components.map(e => 
                e.replace(new RegExp(`\\${ESCAPE_CHARACTER}`, 'g'), ESCAPE_CHARACTER + ESCAPE_CHARACTER)

        )
    }

    private unescapeComponents(components: string[]): string[] {
    return components.map(e => 
                e.replace(new RegExp(`\\${ESCAPE_CHARACTER}`, 'g'), '')
        )
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertDelimiterCorrectAsPrecondition(delimiter);
        let ret = null;
        if (this.components.length > 0 && this.components[0] === "") {
            ret = delimiter + this.components.slice(1).join(delimiter);
        } else {
            ret = this.unescapeComponents(this.components).join(delimiter);
        }
        this.assertClassInvariant();
        return ret;
    }

    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIndexCorrectAsPrecondition(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertIndexCorrectAsPrecondition(i);
        this.assertNotNullAsPrecondition(c);
        this.components[i] = c;
        this.assertPostCondition(this.components[i],c);
    }

    public insert(i: number, c: string): void {
        this.assertIndexCorrectAsPrecondition(i);
        this.assertNotNullAsPrecondition(c);
        this.components.splice(i,0,c);
        this.assertPostCondition(this.components[i],c);
    }

    public append(c: string): void {
        this.assertNotNullAsPrecondition(c);
        this.components.push(c);
        this.assertPostCondition(this.components[this.getNoComponents()-1],c);
    }

    public remove(i: number): void {
        let n = this.getNoComponents();
        this.assertIndexCorrectAsPrecondition(i);
        this.components.splice(i,1);
        this.assertPostCondition(this.getNoComponents(),n-1);
    }

}