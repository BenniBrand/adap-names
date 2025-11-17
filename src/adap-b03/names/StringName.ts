import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super();
        if(delimiter) {
            this.delimiter = delimiter;
        }
        this.name = source;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    private asArray(delimiter: string = this.delimiter): string[] {
        // RegEx Magic: ?< negative lookbehind, ! not| \\\\ -> \\ 
        // --> negative lookbehind not \\ = ?< ! \\ \\
        // Then just \. -> \\.
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
        return this.unescapeComponents(this.asArray(this.delimiter)).join(delimiter);
    }

    public asDataString(): string {
        return (this.asArray(this.delimiter)).join(DEFAULT_DELIMITER);
    }

    public getNoComponents(): number {
        return this.asArray().length;
    }

    public getComponent(x: number): string {
        return this.asArray()[x];
    }

    public setComponent(n: number, c: string): void {
        let tmp:string[] = this.asArray();
        tmp[n] = c;
        this.name = tmp.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        let tmp:string[] = this.asArray();
        tmp.splice(n,0,c);
        this.name = tmp.join(this.delimiter);
    }

    public append(c: string): void {
        let tmp:string[] = this.asArray();
        tmp.push(c);
        this.name = tmp.join(this.delimiter);
    }

    public remove(n: number): void {
        let tmp:string[] = this.asArray();
        tmp.splice(n,1);
        this.name = tmp.join(this.delimiter);
    }

}