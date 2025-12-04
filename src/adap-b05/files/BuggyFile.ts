import { File } from "./File";
import { Directory } from "./Directory";
import { InvalidStateException } from "../common/InvalidStateException";

export class BuggyFile extends File {

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    /**
     * Fault injection for homework
     * @returns base name, here always ""
     */
    protected doGetBaseName(): string {
        this.baseName = "";
        throw new InvalidStateException(`BuggyFile state is permanently corrupted.`);
        return super.doGetBaseName();
    }

}
