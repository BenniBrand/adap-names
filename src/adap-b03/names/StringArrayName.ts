import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super();
        if(delimiter) {
            this.delimiter = delimiter;
        }
        this.components = [...source];
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
        return this.unescapeComponents(this.components).join(delimiter);
    }

    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = this.escapeComponents([c])[0];
    }

    public insert(i: number, c: string): void {
        this.components.splice(i,0,this.escapeComponents([c])[0]);
    }

    public append(c: string): void {
        this.components.push(this.escapeComponents([c])[0]);
    }

    public remove(i: number): void {
        this.components.splice(i,1);
    }

}