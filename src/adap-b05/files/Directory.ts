import { Node } from "./Node";
import { ServiceFailureException } from "../common/ServiceFailureException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        try {
            const results = super.findNodes(bn); // Check myself first

            for (const child of this.childNodes) {
                    // Recursively search children
                    const childResults = child.findNodes(bn);
                    childResults.forEach(node => results.add(node));
                } 
    
            return results;
            }
        catch (error) {
                if (error instanceof ServiceFailureException) {
                    throw error; 
                }
                throw new ServiceFailureException(`Error while searching child}`, error as Error);
            }
    }

}