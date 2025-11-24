import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

public open(): void {
        if (this.state === FileState.OPEN) {
            throw new IllegalArgumentException("File is already open");
        }

        if (this.state === FileState.DELETED) {
            throw new IllegalArgumentException("Cannot open a deleted file");
        }

        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {

        if (this.state !== FileState.OPEN) {
            throw new IllegalArgumentException("File must be open to read");
        }

        if (noBytes < 0) {
             throw new IllegalArgumentException("Byte count must be non negative");
        }
        return new Int8Array(noBytes);
    }

    public close(): void {
        if (this.state !== FileState.OPEN) {
             throw new IllegalArgumentException("Only an open file can be closed");
        }

        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}