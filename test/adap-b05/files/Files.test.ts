import { describe, it, expect } from "vitest";

import { Exception } from "../../../src/adap-b05/common/Exception";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";

import { StringName } from "../../../src/adap-b05/names/StringName";

import { Node } from "../../../src/adap-b05/files/Node";
import { File } from "../../../src/adap-b05/files/File";
import { BuggyFile } from "../../../src/adap-b05/files/BuggyFile";
import { Directory } from "../../../src/adap-b05/files/Directory";
import { RootNode } from "../../../src/adap-b05/files/RootNode";

function createFileSystem(): RootNode {
    let rn: RootNode = new RootNode();

    let usr: Directory = new Directory("usr", rn);
    let bin: Directory = new Directory("bin", usr);
    let ls: File = new File("ls", bin);
    let code: File = new File("code", bin);

    let media: Directory = new Directory("media", rn);

    let home: Directory = new Directory("home", rn);
    let riehle: Directory = new Directory("riehle", home);
    let bashrc: File = new File(".bashrc", riehle);
    let wallpaper: File = new File("wallpaper.jpg", riehle);
    let projects: Directory = new Directory("projects", riehle);

    return rn;
}

describe("Basic naming test", () => {
    it("test name checking", () => {
        let fs: RootNode = createFileSystem();
        
        const results = fs.findNodes("ls");
        expect(results.size).toBeGreaterThan(0);
        
        const ls: Node = [...results][0];

        // Full path must be: /usr/bin/ls
        let res = new StringName("/usr/bin/ls", '/')
        expect(ls.getFullName().asString()).toBe(res.asString());
    });
});


function createBuggySetup(): RootNode {
    let rn: RootNode = new RootNode();

    let usr: Directory = new Directory("usr", rn);
    let bin: Directory = new Directory("bin", usr);
    let ls: File = new BuggyFile("ls", bin);
    let code: File = new BuggyFile("code", bin);

    let media: Directory = new Directory("media", rn);

    let home: Directory = new Directory("home", rn);
    let riehle: Directory = new Directory("riehle", home);
    let bashrc: File = new BuggyFile(".bashrc", riehle);
    let wallpaper: File = new BuggyFile("wallpaper.jpg", riehle);
    let projects: Directory = new Directory("projects", riehle);

    return rn;
}

describe("Buggy setup test", () => {
    it("test finding files throws ServiceFailureException wrapping InvalidStateException", () => {
        let threwException: boolean = false;

        try {
            let fs: RootNode = createBuggySetup();
            fs.findNodes("ls");   // Must fail due to BuggyFile
        } catch (er) {
            threwException = true;

            // Outer exception must be a ServiceFailureException
            const ex = er as Exception;
            expect(ex).toBeInstanceOf(ServiceFailureException);

            // It must contain the trigger
            expect(ex.hasTrigger()).toBe(true);

            const tx = ex.getTrigger();
            expect(tx).toBeInstanceOf(InvalidStateException);
        }

        // The error must have been thrown
        expect(threwException).toBe(true);
    });
});

describe("findNodes error escalation with partial results", () => {
    it("should escalate InvalidStateException even if some matches were found", () => {
        const root = new RootNode();
        const usr = new Directory("usr", root);

        const target = new File("x", usr);
        const bad = new BuggyFile("x", usr);

        expect(() => usr.findNodes("x")).toThrow(ServiceFailureException);
    });
});
