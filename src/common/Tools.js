/**
 * Contains QoL to improve development process.
 */
class Tools {
    /**
     * Applies several styles to a <body> tag.
     */
    static useCleanBody() {
        document.body.setAttribute("style", `/* modified by whale-lib */
            padding: 0;
            margin: 0;
            
            width: 100vw;
            height: 100vh;

            overflow: hidden;
        `);
    }
    /**
     * Asynchronically evaluates javascript by path specified.
     * @param {*} path path to `.js` file to evaluate.
     */
    static eval(path) {
        fetch(path).then(res => {
            if (!res.ok) {
                return;
            }

            res.text().then(code => {
                eval(code);
            });
        });
    }

    /**
     * Reads file returning file content of specified type.
     * @param {*} path path to file.
     * @param {*} type File type. Use `FileType` class to resolve this.
     * @returns File content based on type specified.
     */
    static async readFile(path, type) {
        var data;

        const file = await fetch(path);

        if (type == FileType.Text) {
            data = await file.text();
        }

        if (type == FileType.Bytes) {
            data = await file.bytes();
        }

        if (type == FileType.Json) {
            data = await file.json();
        }

        return data;
    }
}