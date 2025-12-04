import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super();
        this.assertNotNullAsPrecondition(source);
        if(delimiter) {
            this.assertDelimiterCorrectAsPrecondition(delimiter);
            this.delimiter = delimiter;
        }
        if(source == "") {
            this.name = this.delimiter;
        } else {
            this.name = source;
        }
        this.assertClassInvariant();
    }

    protected assertClassInvariant() {
        super.assertClassInvariant();
        this.assertNotNull(this.name, InvalidStateException)
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    private asArray(delimiter: string = this.delimiter): string[] {
        // RegEx Magic: ?< negative lookbehind, ! not| \\\\ -> \\ 
        // --> negative lookbehind not \\ = ?< ! \\ \\
        // Then just \. -> \\.
        if(this.name == '') return [];
        if(this.name == this.delimiter) return [''];
        return this.name.split(new RegExp(`(?<!\\\\)\\${delimiter}`));
    }

    /**  @methodtype utility-method */
    private escapeComponents(components: string[]): string[] {
    return components.map(e => 
                e.replace(new RegExp(`\\${ESCAPE_CHARACTER}`, 'g'), ESCAPE_CHARACTER + ESCAPE_CHARACTER)

        )
    }

    /**  @methodtype utility-method */
    private unescapeComponents(components: string[]): string[] {
    return components.map(e => 
                e.replace(new RegExp(`\\${ESCAPE_CHARACTER}`, 'g'), '')
        )
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertDelimiterCorrectAsPrecondition(delimiter);

        const comps = this.unescapeComponents(this.asArray());

        // if first component is empty, we want a leading delimiter
        if (comps.length > 0 && comps[0] === "") {
            return delimiter + comps.slice(1).join(delimiter);
        }

        return comps.join(delimiter);
    }

    public asDataString(): string {
        return (this.asArray(this.delimiter)).join(DEFAULT_DELIMITER);
    }

    public getNoComponents(): number {
        return this.asArray().length;
    }

    public getComponent(x: number): string {
        this.assertIndexCorrectAsPrecondition(x);
        return this.asArray()[x];
    }

    public setComponent(n: number, c: string): void {
        this.assertNotNullAsPrecondition(c);
        this.assertIndexCorrectAsPrecondition(n);
        let tmp:string[] = this.asArray();
        tmp[n] = c;
        this.name = tmp.join(this.delimiter);
        this.assertPostCondition(this.getComponent(n),c);
    }

    public insert(n: number, c: string): void {
        this.assertNotNullAsPrecondition(c);
        this.assertIndexCorrectAsPrecondition(n);
        let tmp:string[] = this.asArray();
        tmp.splice(n,0,c);
        this.name = tmp.join(this.delimiter);
        this.assertPostCondition(this.getComponent(n),c);
    }

    public append(c: string): void {
        this.assertNotNullAsPrecondition(c);
        let tmp:string[] = this.asArray();
        tmp.push(c);
        this.name = tmp.join(this.delimiter);
        this.assertPostCondition(this.getComponent(this.getNoComponents()-1),c);
    }

    public remove(n: number): void {
        let i = this.getNoComponents();
        this.assertIndexCorrectAsPrecondition(n);
        let tmp:string[] = this.asArray();
        tmp.splice(n,1);
        this.name = tmp.join(this.delimiter);
        this.assertPostCondition(this.getNoComponents(),i-1);
    }

}